import express from "express";
import mariaDB from "../config/mariaDBConn.js";
const router = express.Router();

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect("/main");
        return;
    }
    res.render("loginPage.ejs");
});

router.post('/login', (req, res) => {
    let {email, password} = req.body;

    let queryStatement = "Select ID, PASSWORD, NICKNAME From user where ID=?";
    let queryParams = [email];

    mariaDB.query(queryStatement, queryParams, (err, rows) => {
        if (!err) {
            let userInfo = rows[0];

            if (!userInfo) {
                res.render("noUserPage.ejs");
            } else if (userInfo["PASSWORD"] != password) {
                res.render("wrongPasswordPage.ejs");
            } else {
                req.session.user = email;
                res.redirect("/main");
            }
        }
    });
});

export default router
