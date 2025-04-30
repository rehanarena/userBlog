"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//api config
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
//middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//api endpoint
app.get('/api', (req, res) => {
    res.send('Api Working');
});
app.listen(port, () => console.log('Server Started', port));
