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
describe("/tokens", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
        yield (0, supertest_1.default)(app_1.app).post("/users").send({
            name: "Robbie",
            email: "robbie@email.com",
            password: "password1",
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
    }));
    it("returns a token when credentials are valid", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.app)
            .post("/tokens")
            .send({ email: "robbie@email.com", password: "password1" });
        expect(response.body.message).toEqual("OK");
        expect(response.status).toEqual(200);
        expect(response.body.token).not.toEqual(undefined);
    }));
    it("does NOT return a token when password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.app)
            .post("/tokens")
            .send({ email: "robbie@email.com", password: "1password" });
        expect(response.status).toEqual(401);
        expect(response.body.token).toEqual(undefined);
        expect(response.body.message).toEqual("auth error - passwords do not match");
    }));
    it("does NOT return a token when email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.app)
            .post("/tokens")
            .send({ email: "eibbor@email.com", password: "password1" });
        expect(response.status).toEqual(401);
        expect(response.body.token).toEqual(undefined);
        expect(response.body.message).toEqual("auth error - user does not exist");
    }));
});
