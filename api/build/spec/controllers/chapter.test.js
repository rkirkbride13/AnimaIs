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
const token_1 = __importDefault(require("../../models/token"));
const chapter_1 = __importDefault(require("../../models/chapter"));
describe("ChaptersController", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
        yield chapter_1.default.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
        yield chapter_1.default.deleteMany({});
    }));
    describe("CreateContent", () => {
        it("should create a new chapter and return status 200 with valid input", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Test",
                email: "test@email.com",
                password: "password",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            const mockResponse = {
                data: {
                    choices: [{ text: "This is the chapter content." }],
                },
            };
            jest.mock("openai", () => ({
                Configuration: jest.fn(),
                OpenAIApi: jest.fn(() => ({
                    createCompletion: jest.fn(() => Promise.resolve(mockResponse)),
                })),
            }));
            const res = yield (0, supertest_1.default)(app_1.app)
                .post("/chapters")
                .set("Authorization", `Bearer ${token}`)
                .send({
                user_id: "user123",
                animal: "Cat",
                age: "5",
                facts: "3",
            });
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({ message: "OK" });
            const chapters = yield chapter_1.default.find();
            expect(chapters).toHaveLength(1);
            expect(chapters[0].title).toBe("The Cat");
            expect(chapters[0].content).toEqual([mockResponse.data.choices[0].text]);
        }));
        it("should return status 400 with invalid input", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Test",
                email: "test@email.com",
                password: "password",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            const res = yield (0, supertest_1.default)(app_1.app)
                .post("/chapters")
                .send({ age: "5", facts: "3" })
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ message: "Missing input fields" });
            const chapters = yield chapter_1.default.find();
            expect(chapters).toHaveLength(0);
        }));
    });
    describe("FindByUser", () => {
        it("responds with a status code 200, and returns all users chapters", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Test",
                email: "test@email.com",
                password: "password",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            yield (0, supertest_1.default)(app_1.app)
                .post("/chapters")
                .set("Authorization", `Bearer ${token}`)
                .send({
                user_id: "user123",
                animal: "Cat",
                age: "5",
                facts: "3",
            });
            let res = yield (0, supertest_1.default)(app_1.app)
                .get("/chapters")
                .set("Authorization", `Bearer ${token}`)
                .send();
            expect(res.status).toEqual(200);
            expect(res.body.chapters[0].title).toEqual("The Cat");
        }));
        it("should return status 400 if token not found", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password1",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            yield (0, supertest_1.default)(app_1.app)
                .post("/acts")
                .set("Authorization", `Bearer ${token}`)
                .send({
                user_id: "user123",
                animal: "Cat",
                age: "5",
                facts: "3",
            });
            let response = yield (0, supertest_1.default)(app_1.app).get("/chapters").send();
            expect(response.status).toEqual(400);
        }));
    });
    describe("DeleteChapter", () => {
        it("responds with a status code 200 and deletes chapter", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password1",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            yield (0, supertest_1.default)(app_1.app)
                .post("/chapters")
                .set("Authorization", `Bearer ${token}`)
                .send({
                user_id: "user123",
                animal: "Cat",
                age: "5",
                facts: "3",
            });
            let chapters = yield chapter_1.default.find();
            expect(chapters.length).toEqual(1);
            const chapter_id = chapters[0]._id;
            let response_2 = yield (0, supertest_1.default)(app_1.app)
                .delete("/chapters")
                .set("Authorization", `Bearer ${token}`)
                .set({ chapter_id: chapter_id })
                .send();
            let updatedChapters = yield chapter_1.default.find();
            expect(response_2.statusCode).toEqual(200);
            expect(updatedChapters.length).toEqual(0);
        }));
        it("should return status 400 if token not found", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password1",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            yield (0, supertest_1.default)(app_1.app)
                .post("/acts")
                .set("Authorization", `Bearer ${token}`)
                .send({
                user_id: "user123",
                animal: "Cat",
                age: "5",
                facts: "3",
            });
            let response = yield (0, supertest_1.default)(app_1.app).delete("/chapters").send();
            expect(response.status).toEqual(400);
        }));
    });
    describe("UpdateChapter", () => {
        // it("responds with a status code 200 and updates chapter", async () => {
        //   let user = new User({
        //     name: "Robbie",
        //     email: "robbie@email.com",
        //     password: "password1",
        //   });
        //   await user.save();
        //   let token = await Token.jsonwebtoken(user.id);
        //   await request(app)
        //     .post("/chapters")
        //     .set("Authorization", `Bearer ${token}`)
        //     .send({
        //       user_id: "user123",
        //       title: "Chapter 1",
        //     });
        //   let chapters = await Chapter.find();
        //   expect(chapters.length).toEqual(1);
        //   const chapter_id = chapters[0]._id;
        //   const mockResponse = {
        //     data: {
        //       choices: [{ text: "It has been extended by calling patch" }],
        //     },
        //   };
        //   jest.mock("openai", () => ({
        //     Configuration: jest.fn(),
        //     OpenAIApi: jest.fn(() => ({
        //       createCompletion: jest.fn(() => Promise.resolve(mockResponse)),
        //     })),
        //   }));
        //   const res = await request(app)
        //     .patch("/chapters")
        //     .set("Authorization", `Bearer ${token}`)
        //     .set({ chapter_id: chapter_id })
        //     .send({
        //       user_id: "user123",
        //       content: "This is the chapter content.",
        //     });
        //   expect(res.status).toEqual(200);
        //   expect(res.body).toEqual({ message: "UPDATED" });
        //   let chaptersUpdated = await Chapter.find();
        //   expect(chaptersUpdated).toHaveLength(1);
        //   expect(chaptersUpdated[0].title).toBe("Chapter 1");
        //   expect(chaptersUpdated[0].content).toEqual(["This is the chapter content.", mockResponse.data.choices[0].text]);
        // });
        it("should return status 400 if token not found", () => __awaiter(void 0, void 0, void 0, function* () {
            let user = new user_1.default({
                name: "Robbie",
                email: "robbie@email.com",
                password: "password1",
            });
            yield user.save();
            let token = yield token_1.default.jsonwebtoken(user.id);
            yield (0, supertest_1.default)(app_1.app)
                .post("/acts")
                .set("Authorization", `Bearer ${token}`)
                .send({
                user_id: "user123",
                animal: "Cat",
                age: "5",
                facts: "3",
            });
            let response = yield (0, supertest_1.default)(app_1.app).patch("/chapters").send();
            expect(response.status).toEqual(400);
        }));
    });
});
