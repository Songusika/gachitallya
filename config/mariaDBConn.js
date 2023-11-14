import mariadb from "mysql2";
import dotenv from "dotenv";

dotenv.config()

export default mariadb.createConnection({
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dateStrings: "date",
});
