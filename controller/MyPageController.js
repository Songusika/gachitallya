import express from "express";
import mariaDB from "../config/mariaDBConn.js";
const router = express.Router();

router.get("/mypage", (req, res) => {
    let query = "Select USER_TYPE From user Where ID=?";
    let queryParams = [req.session.user];

    mariaDB.query(query, queryParams, (err, rows) => {
        if (!err) {
            if (rows[0]["USER_TYPE"] == 0) {
                res.render("myPage.ejs");
                return;
            }
            res.render("carOwnerMyPage.ejs");
        }
    });
});

router.get("/mypage/license", (req, res) => {
    res.render("licensePage.ejs");
});

export default router
