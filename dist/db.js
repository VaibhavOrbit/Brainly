"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
mongoose_1.default.connect("mongodb://127.0.0.1:27017/Brainly");
const ObjectId = mongoose_2.Schema.Types.ObjectId;
exports.UserSchema = new mongoose_2.Schema({
    username: String,
    password: String,
    email: String
});
const ContentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    tag: [{ type: mongoose_1.default.Types.ObjectId, ref: "Tag" }],
    userId: { type: ObjectId, ref: "User", required: true }
});
exports.UserModel = (0, mongoose_2.model)("User", exports.UserSchema);
exports.ContentModel = (0, mongoose_2.model)("content", ContentSchema);
