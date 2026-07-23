const R = require("ramda");

const QuizModel = require("../models/quiz.model");
const InfoModel = require("../models/info.model.js"); // Not the best practice to mix services, but will do for now

const generateLayout = require("crossword-layout-generator");
const KbChunkModel = require("../models/kb-chunk.model");
const { QUIZ_TYPE } = require("../utils/quiz.util");
const {
    generateQuiz,
    generateInfo,
    embedText,
} = require("./llm/openai.llm-adapter");
const { REALM_TYPE } = require("../utils/game.util");
const { getAnchor, getRandomAnchor } = require("../models/anchors.js");

const CONCURRENCY_LIMIT = 2;

async function getRandomAnchorEmbedding() {
    const anchor = getRandomAnchor();
    const queryEmbedding = await embedText(anchor.text);
    return { anchor, queryEmbedding };
}

async function getAnchorEmbedding(level, realm) {
    const anchor = R.isNil(level) ? getRandomAnchor() : getAnchor(level, realm);
    const queryEmbedding = await embedText(anchor.text);
    return { anchor, queryEmbedding };
}

async function retrieveRandomContext({
    type = "ABSTRACT", // can be single or array
    level,
    realm,
    count = 1,

    queryEmbedding = null,
    vectorIndex = "kb_chunks_vector_index",
    candidatePoolSize = 100,
}) {
    const typeMatch = Array.isArray(type) ? { type: { $in: type } } : { type };

    const shouldUseNormalRandomRetrieval =
        !queryEmbedding ||
        type === "TERM" ||
        (Array.isArray(type) && type.includes("TERM"));

    // Existing behavior: random MongoDB sample
    if (shouldUseNormalRandomRetrieval) {
        const pipeline = [{ $match: typeMatch }];

        if (!R.isNil(level)) {
            pipeline.push({ $match: { level } });
        }

        if (realm) {
            pipeline.push({ $match: { realm } });
        }

        pipeline.push({ $sample: { size: count } });

        return await KbChunkModel.aggregate(pipeline);
    }

    // Vector behavior: top relevant chunks, then random sample
    const filter = { ...typeMatch };

    if (!R.isNil(level)) {
        filter.level = level;
    }

    if (realm) {
        filter.realm = realm;
    }

    const pipeline = [
        {
            $vectorSearch: {
                index: vectorIndex,
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: Math.max(candidatePoolSize * 2, 100),
                limit: candidatePoolSize,
                filter,
            },
        },
        {
            $project: {
                level: 1,
                realm: 1,
                text: 1,
                sourceTitle: 1,
                type: 1,
                embeddingModel: 1,
                vectorScore: { $meta: "vectorSearchScore" },
            },
        },
        {
            $sample: { size: count },
        },
    ];
    return await KbChunkModel.aggregate(pipeline);

    // const pipeline = [{ $match: typeMatch }];

    // if (!R.isNil(level)) {
    //     pipeline.push({ $match: { level } });
    // }

    // if (realm) {
    //     pipeline.push({ $match: { realm } });
    // }

    // pipeline.push({ $sample: { size: count } });
    // const results = await KbChunkModel.aggregate(pipeline);
    // return results;
}

// Generators
async function generateCrossword({ level }) {
    const chunks = await retrieveRandomContext({
        type: "TERM",
        level,
        count: 1,
    });
    const wordList = await generateQuiz({
        type: QUIZ_TYPE.CROSS_WORDS,
        chunks,
    });
    const layout = generateLayout.generateLayout(wordList);
    return { content: layout, chunks };
}

async function generateMcq({ level, realm = REALM_TYPE.BOTH }) {
    const { queryEmbedding } = await getAnchorEmbedding(level, realm);
    const chunks = await retrieveRandomContext({
        type: ["ABSTRACT", "QUESTION"],
        level,
        realm,
        count: 1,
        queryEmbedding,
    });
    const quiz = await generateQuiz({
        type: QUIZ_TYPE.MCQ,
        chunks,
    });
    return { content: quiz, chunks };
}

async function generateTrueFalse({ level, realm = REALM_TYPE.BOTH }) {
    const { queryEmbedding } = await getAnchorEmbedding(level, realm);
    const chunks = await retrieveRandomContext({
        type: ["ABSTRACT", "QUESTION"],
        level,
        realm,
        count: 1,
        queryEmbedding,
    });
    const quiz = await generateQuiz({
        type: QUIZ_TYPE.TRUE_FALSE,
        chunks,
    });
    return { content: quiz, chunks };
}

const QUIZ_GENERATORS = {
    [QUIZ_TYPE.CROSS_WORDS]: generateCrossword,
    [QUIZ_TYPE.MCQ]: generateMcq,
    [QUIZ_TYPE.TRUE_FALSE]: generateTrueFalse,
};

async function generateSummarizedInfo({ level, realm = REALM_TYPE.BOTH }) {
    const { queryEmbedding } = await getAnchorEmbedding(level, realm);
    const chunks = await retrieveRandomContext({
        type: ["ABSTRACT", "QUESTION"],
        realm,
        level,
        // level: Math.min(level, 1),
        count: 1,
        queryEmbedding,
    });
    const res = await generateInfo({ chunk: chunks[0] });
    return { content: res.takeaway || "", chunks };
}

// These two functions fetch pre-generated quiz and info respectively from database
// We use a mix of NEW vs USED quizzes and infos
const NEW_VS_USED_RATIO = 1; // For now, we will just use NEW quizzes when possible
async function getQuiz({ type, level, realm }) {
    const basePipeline = [];
    const status = Math.random() < NEW_VS_USED_RATIO ? "NEW" : "USED";

    if (!R.isNil(level)) {
        basePipeline.push({ $match: { level } });
    }

    // If there is no type, then will get a random quiz
    if (type) {
        basePipeline.push({ $match: { type } });
    }

    // We populate chunks also for reference
    const populateChunksPipeline = [
        {
            $lookup: {
                from: "kb_chunks",
                localField: "chunks",
                foreignField: "_id",
                as: "chunks",
            },
        },
    ];

    // First try with preferred status
    if (status) {
        const preferredPipeline = [
            ...basePipeline,
            { $match: { status } },
            { $sample: { size: 1 } },
            ...populateChunksPipeline,
        ];

        const preferredQuiz = await QuizModel.aggregate(preferredPipeline);
        if (preferredQuiz.length > 0) return preferredQuiz[0];
    }

    // Fallback: query without status restriction
    const fallbackPipeline = [
        ...basePipeline,
        { $sample: { size: 1 } },
        ...populateChunksPipeline,
    ];
    const randomQuiz = await QuizModel.aggregate(fallbackPipeline);
    return randomQuiz.length > 0 ? randomQuiz[0] : {};
}

async function getInfo({ level }) {
    const basePipeline = [];
    if (!R.isNil(level)) {
        basePipeline.push({ $match: { level } });
    }
    // First try with preferred status
    const status = Math.random() < NEW_VS_USED_RATIO ? "NEW" : "USED";

    // We populate chunks also for reference
    const populateChunksPipeline = [
        {
            $lookup: {
                from: "kb_chunks",
                localField: "chunks",
                foreignField: "_id",
                as: "chunks",
            },
        },
    ];

    if (status) {
        const preferredPipeline = [
            ...basePipeline,
            { $match: { status } },
            { $sample: { size: 1 } },
            ...populateChunksPipeline,
        ];

        const preferredInfo = await InfoModel.aggregate(preferredPipeline);
        if (preferredInfo.length > 0) return preferredInfo[0];
    }

    // Fallback: query without status restriction
    const fallbackPipeline = [
        ...basePipeline,
        { $sample: { size: 1 } },
        ...populateChunksPipeline,
    ];
    const randomInfo = await InfoModel.aggregate(fallbackPipeline);
    return randomInfo.length > 0 ? randomInfo[0] : {};
}

// These mark the quiz or info as used
async function markQuizUsed({ quizId }) {
    return await QuizModel.findOneAndUpdate(
        { _id: quizId },
        { $set: { status: "USED" } },
        { new: true }
    );
}
async function markInfoUsed({ infoId }) {
    return await InfoModel.findOneAndUpdate(
        { _id: infoId },
        { $set: { status: "USED" } },
        { new: true }
    );
}

// Seed functions to add quizzes (communicate with LLM)
async function getQuizCounts() {
    const result = await QuizModel.aggregate([
        {
            $group: {
                _id: {
                    level: "$level",
                    status: "$status",
                },
                count: { $sum: 1 },
            },
        },
    ]);
    const output = {
        0: { NEW: 0, USED: 0 },
        1: { NEW: 0, USED: 0 },
        2: { NEW: 0, USED: 0 },
    };

    for (const row of result) {
        const { level, status } = row._id;
        output[level][status] = row.count;
    }
    return output;
}

async function getInfoCounts() {
    const result = await InfoModel.aggregate([
        {
            $group: {
                _id: {
                    level: "$level",
                    status: "$status", // No level awareness in info
                },
                count: { $sum: 1 },
            },
        },
    ]);
    const output = {
        0: { NEW: 0, USED: 0 },
        1: { NEW: 0, USED: 0 },
        2: { NEW: 0, USED: 0 },
    };

    for (const row of result) {
        const { level, status } = row._id;
        output[level][status] = row.count;
    }
    return output;
}

async function seedMcq({ level, realm, count }) {
    const results = [];
    for (let i = 0; i < count; i += CONCURRENCY_LIMIT) {
        const batchSize = Math.min(CONCURRENCY_LIMIT, count - i);
        const batch = Array.from({ length: batchSize }, async () => {
            try {
                const { content, chunks } = await generateMcq({ level, realm });
                return {
                    type: QUIZ_TYPE.MCQ,
                    content,
                    level,
                    realm,
                    chunks: R.map(R.prop("_id"))(chunks),
                };
            } catch (err) {
                console.error("Error generating MCQ:", err.message);
                return null;
            }
        });

        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }
    return results;
}

async function seedCrossword({ level, realm, count }) {
    // No realm in CW for now
    const results = [];
    for (let i = 0; i < count; i += CONCURRENCY_LIMIT) {
        const batchSize = Math.min(CONCURRENCY_LIMIT, count - i);
        const batch = Array.from({ length: batchSize }, async () => {
            try {
                const { content, chunks } = await generateCrossword({ level });
                return {
                    type: QUIZ_TYPE.CROSS_WORDS,
                    content,
                    level,
                    chunks: R.map(R.prop("_id"))(chunks),
                };
            } catch (err) {
                console.error("Error generating CW:", err.message);
                return null;
            }
        });

        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }
    return results;
}

async function seedTrueFalse({ level, realm, count }) {
    const results = [];
    for (let i = 0; i < count; i += CONCURRENCY_LIMIT) {
        const batchSize = Math.min(CONCURRENCY_LIMIT, count - i);
        const batch = Array.from({ length: batchSize }, async () => {
            try {
                const { content, chunks } = await generateTrueFalse({
                    level,
                    realm,
                });
                return {
                    type: QUIZ_TYPE.TRUE_FALSE,
                    content,
                    level,
                    realm,
                    chunks: R.map(R.prop("_id"))(chunks),
                };
            } catch (err) {
                console.error("Error generating TF:", err.message);
                return null;
            }
        });

        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }
    return results;
}

async function seedInfo({ level, realm, count }) {
    const results = [];
    for (let i = 0; i < count; i += CONCURRENCY_LIMIT) {
        const batchSize = Math.min(CONCURRENCY_LIMIT, count - i);
        const batch = Array.from({ length: batchSize }, async () => {
            try {
                const { content, chunks } = await generateSummarizedInfo({
                    level,
                    realm,
                });
                return {
                    content,
                    level,
                    realm,
                    chunks: R.map(R.prop("_id"))(chunks),
                };
            } catch (err) {
                console.error(`Error generating info level ${level}:`);
                return null;
            }
        });

        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }
    return results;
}

// These function will add in batch new info and quizzes (relies on above functions)
async function seedBatchQuizzes({ countPerRealmLevel: count = 2 }) {
    const all = [];

    all.push(await seedMcq({ level: 0, realm: REALM_TYPE.BOTH, count }));
    all.push(await seedMcq({ level: 1, realm: REALM_TYPE.BOTH, count }));
    all.push(await seedMcq({ level: 2, realm: REALM_TYPE.HEAVEN, count }));
    all.push(await seedMcq({ level: 2, realm: REALM_TYPE.HELL, count }));

    // all.push(await seedCrossword({ level: 0, count }));
    all.push(await seedCrossword({ level: 1, count }));
    all.push(await seedCrossword({ level: 2, count }));

    all.push(await seedTrueFalse({ level: 0, realm: REALM_TYPE.BOTH, count }));
    all.push(await seedTrueFalse({ level: 1, realm: REALM_TYPE.BOTH, count }));
    all.push(
        await seedTrueFalse({ level: 2, realm: REALM_TYPE.HEAVEN, count })
    );
    all.push(await seedTrueFalse({ level: 2, realm: REALM_TYPE.HELL, count }));

    // Level 2 Fake Email challenges
    const fakeEmails = [
        {
            level: 2,
            realm: REALM_TYPE.BOTH,
            type: QUIZ_TYPE.FAKE_EMAIL,
            status: "NEW",
            content: {
                subject: "Urgent: Direct Invitation to Publish Manuscript - 24 Hours Acceptance!",
                sender: "editor@academic-scam-journal-online.org",
                recipient: "Dear Esteemed Scholar",
                body: "We are amazed by your recent research achievements. We invite you to submit your manuscript for our upcoming issue. We offer guaranteed peer review completion in 24 hours and publication within 48 hours for a small processing fee of $300 (Western Union). Reply immediately with your manuscript attached.",
                isFake: true,
                explanation: "Red flags: Guaranteed publication within 24-48 hours, non-academic domain name, request for payment via Western Union, aggressive urgent tone, lack of actual peer review."
            }
        },
        {
            level: 2,
            realm: REALM_TYPE.BOTH,
            type: QUIZ_TYPE.FAKE_EMAIL,
            status: "NEW",
            content: {
                subject: "Reviewer Invitation: Manuscript #JAE-2026-0841",
                sender: "eic@journal-of-academic-ethics.org",
                recipient: "Dear Dr. Researcher",
                body: "Given your expertise in scholarly publishing ethics, we invite you to review manuscript #JAE-2026-0841 titled 'Evaluating Transparency in Open Access Monographs'. Standard review timeline is 3 weeks. Please click the link to accept or decline.",
                isFake: false,
                explanation: "This email is legitimate: Specific manuscript title, reasonable review timeframe (3 weeks), official journal domain, no solicitation of money or guaranteed fast publishing."
            }
        },
        {
            level: 2,
            realm: REALM_TYPE.BOTH,
            type: QUIZ_TYPE.FAKE_EMAIL,
            status: "NEW",
            content: {
                subject: "Keynote Speaker Invitation & Fast-Track Paper Publication",
                sender: "conference-chair@international-mega-summit-2026.net",
                recipient: "Dear Distinguished Professor",
                body: "Greetings! You have been selected as an Honorary Keynote Speaker for the 15th Global Multidisciplinary Science Conference in Hawaii next month. Registration fee of $1200 covers publication in Scopus-indexed (pending) journal. No full paper peer review required.",
                isFake: true,
                explanation: "Red flags: Unsolicited keynote invitation, fake index claims ('Scopus-indexed pending'), high registration fee without full paper peer review."
            }
        }
    ];
    all.push(fakeEmails);

    const flattened = all.flat();

    await QuizModel.insertMany(flattened);
    console.log(`Inserted ${flattened.length} quizzes`);
}

async function addBatchInfo({ countPerRealmLevel: count = 2 }) {
    const all = [];

    all.push(await seedInfo({ level: 0, realm: REALM_TYPE.BOTH, count }));
    all.push(await seedInfo({ level: 1, realm: REALM_TYPE.BOTH, count }));
    all.push(await seedInfo({ level: 2, realm: REALM_TYPE.HEAVEN, count }));
    all.push(await seedInfo({ level: 2, realm: REALM_TYPE.HELL, count }));

    const flattened = all.flat();
    await InfoModel.insertMany(flattened);
    console.log(`Inserted ${flattened.length} info`);
}

module.exports = {
    retrieveRandomContext,
    generateCrossword,
    generateMcq,
    generateTrueFalse,
    getQuizCounts,
    getInfoCounts,
    getQuiz,
    getInfo,
    markQuizUsed,
    markInfoUsed,
    seedBatchQuizzes,
    addBatchInfo,
    generateSummarizedInfo,
};
