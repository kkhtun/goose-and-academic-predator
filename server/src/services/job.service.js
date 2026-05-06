const { Agenda } = require("agenda");

const agenda = new Agenda({
    db: {
        address: process.env.MONGO_URI,
        collection: "jobs",
    },
    processEvery: "30 seconds",
    maxConcurrency: 1,
});

agenda.define(
    "refill-quizzes",
    { concurrency: 1, lockLifetime: 5 * 60 * 1000 },
    async (job) => {
        // const { level } = job.attrs.data;
        console.log("[Starting Job refill-quizzes] ...");

        // Do your threshold check here
        // If refill is not needed, just return
        // If refill is needed, call OpenAI and save quizzes
        // Can only use models? [to prevent circular dependency]
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
    console.log("[Queued Job refill-quizzes]...");
}

module.exports = { agenda, triggerRefillQuizzes };
