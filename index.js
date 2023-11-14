import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import mariaDB from "./config/mariaDBConn.js";
import MainPageController from "./controller/MainPageController.js";
import MyPageController from "./controller/MyPageController.js";
import LoginController from "./controller/LoginController.js";
import Post from "./controller/PostController.js";
import Reservation from "./controller/ReservationController.js";
import SignUp from "./controller/SignUpController.js";
import DriverValidateController from "./controller/DriverValidateController.js";

const app = express();
const port = 80;
const __dirname = path.resolve();

mariaDB.connect();

app.set("view engine", "ejs");
app.set("views", "./ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser("secret"));
app.use(
    expressSession({
      httpOnly: true,
      secret: "secret key",
      resave: false,
      saveUninitialized: false,
    })
);

app.use(MainPageController)
app.use(MyPageController)
app.use(LoginController)
app.use(Post)
app.use(Reservation)
app.use(SignUp)
app.use(DriverValidateController)
app.use("/static", express.static(__dirname));


app.listen(port, () => {
  console.log("server start!");
});
