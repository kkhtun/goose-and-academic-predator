require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ValidationError } = require("joi");

const { CustomError } = require("./utils/CustomError");
const { router } = require("./routes");
const { connectDB } = require("./db");
const { Server } = require("socket.io");
const http = require("http");
const {
    registerSocketControllers,
} = require("./controllers/socket.controller");
const { agenda } = require("./services/job.service");

const app = express();

// Creating http server from express for socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // adjust later for security
    },
});

io.on("connection", (socket) => {
    console.log("[Socket Event] User connected:", socket.id);

    registerSocketControllers(io, socket);

    socket.on("disconnect", () => {
        console.log("[Socket Event] User disconnected:", socket.id);
    });
});

// Middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.send({ message: "Welcome to Goose and Academic Predator" });
});

app.use("/api", router);

// Error Handling
app.use((error, req, res, next) => {
    if (error instanceof ValidationError) {
        return res.status(422).send({
            code: 422,
            message: error.details[0].message,
        });
    }

    // Caught errors
    if (error instanceof CustomError) {
        return res.status(400).send({
            code: 400,
            message: error.message,
        });
    } else {
        // Uncaught Errors
        console.group("[ServerError]: ", error.message);
        console.error("[STACK]: ", error.stack);

        return res.status(500).send({
            code: 500,
            message: "Internal Server Error",
        });
    }
});

app.use((req, res, next) =>
    res.status(404).send({
        code: 404,
        message: "Resource Not Found",
    })
);

const PORT = process.env.PORT || 3000;
(async function main() {
    await connectDB();
    await agenda.start();
    server.listen(PORT, () => {
        console.log(`[Express] Server running on port ${PORT}`);
    });
})();
