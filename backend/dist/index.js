"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, mongodb_1.default)();
//api config
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
dotenv_1.default.config();
//middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://user-blog-three.vercel.app"],
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS']
}));
//api endpoint
app.get("/api", (req, res) => {
    res.send("Api Working");
});
const uploadDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
//Routes
app.use("/api/auth", authRoute_1.default);
app.use("/api/user", userRoute_1.default);
app.listen(port, () => console.log("Server Started", port));
