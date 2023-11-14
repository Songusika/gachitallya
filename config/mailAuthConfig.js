import dotenv from "dotenv";

dotenv.config()

export default {
  email: process.env.EMAIL_SENDER,
  password: process.env.EMAIL_PASSWORD,
};
