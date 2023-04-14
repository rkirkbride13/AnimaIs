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
const app_1 = require("../../app");
const supertest_1 = __importDefault(require("supertest"));
require("../mongodb_helper");
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
describe("/users", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
    }));
    describe("POST", () => {
        it("gives response code 200 and creates a user with correct credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(app_1.app).post("/users").send({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password",
            });
            expect(response.statusCode).toBe(200);
            let users = yield user_1.default.find();
            let newUser = users[users.length - 1];
            expect(newUser.email).toEqual("robbie@email.com");
        }));
        it("encrypts the password", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(app_1.app).post("/users").send({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password",
            });
            expect(response.statusCode).toBe(200);
            let users = yield user_1.default.find();
            let newUser = users[users.length - 1];
            bcrypt_1.default
                .compare("password", newUser.password)
                .then((res) => expect(res).toBe(true));
        }));
        it("gives response code 400 and does NOT create user when name missing", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(app_1.app)
                .post("/users")
                .send({ email: "robbie@email.com", password: "password1" });
            expect(response.statusCode).toBe(400);
            let users = yield user_1.default.find();
            expect(users.length).toEqual(0);
        }));
        it("gives response code 400 and does NOT create user when email missing", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(app_1.app)
                .post("/users")
                .send({ name: "Robbie", password: "password1" });
            expect(response.statusCode).toBe(400);
            let users = yield user_1.default.find();
            expect(users.length).toEqual(0);
        }));
        it("gives response code 400 and does NOT create user when password missing", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(app_1.app)
                .post("/users")
                .send({ name: "Robbie", email: "robbie@email.com" });
            expect(response.statusCode).toBe(400);
            let users = yield user_1.default.find();
            expect(users.length).toEqual(0);
        }));
        it("gives response code 400 and does NOT create user when email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(app_1.app)
                .post("/users")
                .send({
                name: "Robbie",
                email: "robbieemail.com",
                password: "password1",
            });
            expect(response.statusCode).toBe(400);
            let users = yield user_1.default.find();
            expect(users.length).toEqual(0);
        }));
        it("gives response code 400 and does NOT create user when email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_1.default.create({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password1",
            });
            let response = yield (0, supertest_1.default)(app_1.app)
                .post("/users")
                .send({
                name: "Robbie New",
                email: "robbie@email.com",
                password: "password100",
            });
            expect(response.statusCode).toBe(400);
            let users = yield user_1.default.find();
            expect(users.length).toEqual(1);
        }));
    });
});
