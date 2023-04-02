const AnimaIsAPIURL = "https://AnimaIsapi.onrender.com";

export default function serverlURL() {
  return process.env.NODE_ENV === "production" ? AnimaIsAPIURL : "";
}
