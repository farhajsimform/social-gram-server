"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const logEvents_1 = require("./middleware/logEvents");
const credentials_1 = require("./middleware/credentials");
const auth_1 = __importDefault(require("./routes/auth"));
const verifyJWT_1 = require("./middleware/verifyJWT");
const socket_1 = require("./socket/socket");
const errorHandler_1 = require("./middleware/errorHandler");
const post_1 = __importDefault(require("./routes/post"));
const path_1 = __importDefault(require("path"));
const socketio = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const server = http_1.default.createServer(app);
const io = socketio(server);
//scoket connection
(0, socket_1.SocketConnection)(io);
// Database connection
(0, config_1.connectDB)();
// custom middleware logger
app.use(logEvents_1.logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials_1.credentials);
// Cross Origin Resource Sharing
app.use((0, cors_1.default)(config_1.corsOptions));
//middleware for cookies
app.use((0, cookie_parser_1.default)());
// built-in middleware to handle urlencoded form data
app.use(express_1.default.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.send("Express + TypeScript Server");
});
app.use("/public", express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/auth', (0, auth_1.default)());
app.use(verifyJWT_1.verifyJWT);
app.use('/user-post', (0, post_1.default)(io));
app.use(errorHandler_1.errorHandler);
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
