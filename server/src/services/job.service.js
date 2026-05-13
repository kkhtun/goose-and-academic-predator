const { Agenda } = require("agenda");
const {
    getQuizCounts,
    getInfoCounts,
    seedBatchQuizzes,
    addBatchInfo,
} = require("./quiz.service");

const agenda = new Agenda({
    db: {
        address: process.env.MONGO_URI,
        collection: "jobs",
    },
    processEvery: "10 seconds",
    maxConcurrency: 1,
});

agenda.on("start", (job) => {
    console.log("[Agenda job started]", job.attrs.name);
});

agenda.on("success", (job) => {
    console.log("[Agenda job success]", job.attrs.name);
});

agenda.on("fail", (err, job) => {
    console.error("[Agenda job failed]", job?.attrs?.name, err);
});

agenda.define(
    "refill-quizzes",
    { concurrency: 1, lockLifetime: 5 * 60 * 1000 },
    async (job) => {
        // Do your threshold check here
        const quizCounts = await getQuizCounts();
        const infoCounts = await getInfoCounts();
        console.log("[Processing Job refill-quizzes]");
        console.log(quizCounts);
        console.log(infoCounts);

        const THRESHOLD_FOR_EACH_LEVEL = 10;
        const shouldRefillQuizzes = [0, 1, 2].some(
            (level) => quizCounts[level]?.NEW < THRESHOLD_FOR_EACH_LEVEL
        );
        const shouldRefillInfo = [0, 1, 2].some(
            (level) => infoCounts[level]?.NEW < THRESHOLD_FOR_EACH_LEVEL
        );

        // await seedBatchQuizzes({});
        // await addBatchInfo({});

        // if (shouldRefillQuizzes) {
        //     await seedBatchQuizzes({});
        // }

        // if (shouldRefillInfo) {
        //     await addBatchInfo({});
        // }
    }
);

async function triggerRefillQuizzes({}) {
    await agenda
        .create("refill-quizzes", {})
        .unique({
            name: "refill-quizzes",
        })
        .schedule(new Date())
        .save();
    console.log("[Queued Job refill-quizzes]");
}

module.exports = { agenda, triggerRefillQuizzes };
