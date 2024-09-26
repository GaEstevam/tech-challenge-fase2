"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Esquema do User
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobilePhone: { type: String },
    external_Id: { type: String },
    creation_Date: { type: Date, default: Date.now },
    last_Login: { type: Date },
    is_Active: { type: Boolean, default: true },
    role: { type: String, enum: ['professor', 'aluno'], required: true } // Campo obrigatório para role
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
