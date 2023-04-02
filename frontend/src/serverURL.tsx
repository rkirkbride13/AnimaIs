const frontleftAPIURL = "https://frontleftapi.onrender.com";

export default function serverlURL() {
  return process.env.NODE_ENV === "production" ? frontleftAPIURL : "";
}
