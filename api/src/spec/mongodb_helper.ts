import mongoose from "mongoose";

interface MongooseConnectOptions extends mongoose.ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

beforeAll(function (done: any) {
  mongoose.connect("mongodb://0.0.0.0/AnimaIs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongooseConnectOptions);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", function () {
    done();
  });
});

afterAll(function () {
  mongoose.connection.close();
});
