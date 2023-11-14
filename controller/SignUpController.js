import express from "express"
import mariaDB from "../config/mariaDBConn.js";
import ejs from "ejs";
import mailConfig from "../config/mailAuthConfig.js";
import nodemailer from "nodemailer";

const router = express.Router()

const transporter = nodemailer.createTransport({
    service: "Naver",
    host: "smtp.naver.com",
    port: 587,
    secure: false,
    auth: {
        user: mailConfig["email"],
        pass: mailConfig["password"],
    },
});

const authInfo = {};

router.get("/signup", (req, res) => {
    res.render("signupPage.ejs");
});

router.get("/signup/userinfo", (req, res) => {
    if (!req.session.authEmail) {
        res.redirect("/signup");
        return;
    }
    res.render("signupInfoPage.ejs");
});

router.post("/signup", (req, res) => {
    let parms = req.body;
    let queryStatement =
        "INSERT INTO `gachitallya`.`user` (`ID`, `PASSWORD`, `NICKNAME`, `GENGER`, `BIRTHDAY`, `PHONE_NUMBER`) VALUES (?, ?, ?, ?, ?, ?);";
    let queryParams = [
        req.session.authEmail + "@kunsan.ac.kr",
        parms.PASSWORD,
        parms.NICKNAME,
        parms.GENDER,
        parms.BIRTHDAY,
        parms.PHONE_NUMBER,
    ];
    mariaDB.query(queryStatement, queryParams);
    res.redirect("/login");
});

router.post("/signup/validateMail", async (req, res) => {
    let authNum = createAuthNumber();
    let emailTemplete;

    ejs.renderFile(
        __dirname + "/ejs/authMailForm.ejs",
        { authCode: authNum },
        function (err, data) {
            if (err) {
                console.log(err);
            }
            emailTemplete = data;
        }
    );

    let mailOptions = {
        from: mailConfig["email"],
        to: req.body.id + "@kunsan.ac.kr",
        subject: "[같이 탈랴] 회원가입을 위한 인증번호.",
        html: emailTemplete,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        res.json({ ok: 1 });
    });

    authInfo[req.body.id] = authNum;
});

const createAuthNumber = () => {
    return Math.random().toString().substr(2, 6);
}

router.post("/signup/checkAuth", (req, res) => {
    if (authInfo[req.body.id] == req.body.authNum) {
        req.session.authEmail = req.body.id;
        res.json("/signup/userinfo");
    } else {
        res.json("loginFail");
    }
});

export default router
