"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.hashPassword = exports.comparePassword = exports.updateUser = exports.deleteUserById = exports.loginFunc = exports.saveUser = void 0;
const user_1 = __importDefault(require("../database/models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saveUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = data;
    const hashedPwd = bcrypt_1.default.hashSync(password, 10);
    const insertUser = yield user_1.default.create({
        name: name,
        email: email,
        password: hashedPwd,
    });
    return insertUser;
});
exports.saveUser = saveUser;
const loginFunc = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = userData;
    try {
        const existUser = yield user_1.default.findOne({ where: { email } });
        return existUser;
    }
    catch (error) {
        throw new Error('Unable to log in, may be user not found');
    }
});
exports.loginFunc = loginFunc;
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(userId);
    if (!user) {
        throw new Error("user not found");
    }
    yield user.destroy();
});
exports.deleteUserById = deleteUserById;
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user.save();
        return user;
    }
    catch (error) {
        throw new Error('Error updating user');
    }
});
exports.updateUser = updateUser;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashedPassword);
});
exports.comparePassword = comparePassword;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hashSync(password, 10);
});
exports.hashPassword = hashPassword;
const updateUserPassword = (user, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    user.password = hashedPassword;
    yield user.save();
    return user;
});
exports.updateUserPassword = updateUserPassword;
