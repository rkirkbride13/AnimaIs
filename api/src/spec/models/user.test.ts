import User, { IUser } from "../../models/user";
import "../mongodb_helper";

describe("User", () => {
  let user: IUser;
  beforeEach(async () => {
    await User.deleteMany();
    user = await User.create({
      name: "Robbie",
      email: "robbie@email.com",
      password: "password1",
    });
  });

  it("has a name, email and password", () => {
    expect(user.name).toEqual("Robbie");
    expect(user.email).toEqual("robbie@email.com");
    expect(user.password).toEqual("password1");
  });

  it("users are saved to the database and can be accessed", async () => {
    const users = await User.find();
    expect(users.length).toEqual(1);
    expect(users[0].name).toEqual("Robbie");
  });

  it("cannot create a user with an existing email address", async () => {
    let dupilcate: IUser = new User({
      name: "Robbie New",
      email: "robbie@email.com",
      password: "password2",
    });

    dupilcate
      .save()
      .then(() => fail("No error raised when saving the file"))
      .catch((error) => {});
      
    const users = await User.find();
    expect(users.length).toEqual(1);
  });
});
