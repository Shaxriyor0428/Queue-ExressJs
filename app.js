import express from "express";
import config from "config";
import mainIndexRouter from "./routes/index.routes.js";

const PORT = config.get("port");
const app = express();

app.use(express.json());
app.use("/api", mainIndexRouter);
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();

// o'rnatish kerak bo'lgan packagelar
// npm i express bcryptjs crypto config otp-generator pg uuid nodemailer node-device-detector jsonwebtoken
