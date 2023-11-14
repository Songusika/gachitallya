import express from "express";
import mariaDB from "../config/mariaDBConn.js";
import reservationMsg from "../js/reservationSendMsg.js";

const router = express.Router();

router.get("/posts", (req, res) => {
    res.render("postsPage.ejs");
});

router.get("/post/:id", (req, res) => {
    let postId = req.params.id;

    let queryStatement =
        "SELECT a.id, a.title, a.departures, a.arrivals, a.depaturesTime, a.deadline, a.contents, a.writingTime, a.deadline, a.currentCrew, a.maximumCrew, b.NICKNAME FROM boardplan AS a, user AS b WHERE a.id=? and a.userID = b.ID;";
    let queryParams = [postId];

    mariaDB.query(queryStatement, queryParams, (err, rows) => {
        if (!err) {
            let postInfo = rows[0];

            if (!postInfo) {
                res.render("noUserPage.ejs");
            } else {
                res.render("postsPage.ejs", { postInfo });
            }
        }
    });
});

router.get("/makePost", (req, res) => {
    res.render("makePostPage.ejs");
});

router.post("/makePost", (req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    let queryStatement =
        "INSERT INTO `gachitallya`.`boardplan`"+
        "(`userID`, `title`, `departures`, `arrivals`,"+
        " `depaturesTime`, `writingTime`, `deadline`, `contents`,"+
        "`maximumCrew`)"+" VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)";

    let params = req.body;

    let queryParams = [
        req.session.user,
        params.title,
        params.departures,
        params.arrivals,
        params.depaturesTime,
        params.contents,
        params.maximumCrew,
    ];

    mariaDB.query(queryStatement, queryParams);

    let getMyPhoneNumberQuery = "Select PHONE_NUMBER From user Where ID=?";
    let getMyPhoneNumberQueryParams = [req.session.user];

    let getReservationTime =
        "SELECT DATE_SUB(depaturesTime, INTERVAL 20 MINUTE)"+
        " as m20, DATE_SUB(depaturesTime, INTERVAL 5 MINUTE)"+
        "as m05 FROM boardplan WHERE userID=? and title=?;";
    let getReservationTimeParams = [req.session.user, params.title];

    mariaDB.query(
        getMyPhoneNumberQuery,
        getMyPhoneNumberQueryParams,
        (err, rows) => {
            let myPhone = rows[0]["PHONE_NUMBER"];

            mariaDB.query(
                getReservationTime,
                getReservationTimeParams,
                (err, rows) => {
                    let m20 = rows[0]["m20"].substring(0, 16);
                    let m05 = rows[0]["m05"].substring(0, 16);
                    reservationMsg(
                        myPhone,
                        "같이 탈랴 탑승까지 20분 남았어요~\n미리미리 준비하는 센스~ 잊지 않으셨죠?",
                        m20
                    );
                    reservationMsg(
                        myPhone,
                        " 같이 탈랴 탑승까지 5분 남았어요~\n서로 불편하지 않게 매너 있는 운행이 되길 바랄게요!",
                        m05
                    );
                }
            );
        }
    );

    res.redirect("/main");
});

export default router
