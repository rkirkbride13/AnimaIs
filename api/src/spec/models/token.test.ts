import { verify } from "jsonwebtoken";
import Token from "../../models/token";

describe("Token", () => {
  it("returns a token containing the user_id", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(Date.UTC(2023, 2, 3, 11, 37, 0)));
    const user_id: string = "123abc";
    const token = Token.jsonwebtoken(user_id);
    const payload = verify(token, process.env.JWT_SECRET!);
    expect(payload).toEqual({ iat: 1677843420, user_id: "123abc" });
  });
});
