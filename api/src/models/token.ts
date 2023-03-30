import { sign } from "jsonwebtoken";
import { config } from "dotenv";
config({ path: ".env" });
const secret: string = process.env.JWT_SECRET!;

class Token {
  static jsonwebtoken(user_id: string) {
    return sign(
      { user_id: user_id, iat: Math.floor(Date.now() / 1000) },
      secret
    );
  }
}

export default Token;
