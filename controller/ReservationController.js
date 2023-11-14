import express from "express";
import mariaDB from "../config/mariaDBConn.js";
import send from "../js/sendMsg.js";

const router = express.Router();

router.post("/reservation", (req, res) => {
    let reservationQuery =
        "INSERT INTO passengertable (boardID, userID) VALUES (?, ?);";
    let reservationQueryParams = [Number(req.body.id), req.session.user];

    mariaDB.query(reservationQuery, reservationQueryParams);

    let getOwnerPhoneNumberQuery =
        "SELECT a.PHONE_NUMBER FROM user AS a, boardplan AS b WHERE b.id = ? and b.userID = a.ID";
    let getOwnerPhoneNumberQueryParams = [req.body.id];

    let getMyPhoneNumbr = "Select NICKNAME, PHONE_NUMBER From user where ID=?";
    let getMyPhoneNumbrParams = [req.session.user];

    mariaDB.query(
        getOwnerPhoneNumberQuery,
        getOwnerPhoneNumberQueryParams,
        (err, rows) => {
            let ownerPhone = rows[0]["PHONE_NUMBER"];

            mariaDB.query(getMyPhoneNumbr, getMyPhoneNumbrParams, (err, rows) => {
                let myPhone = rows[0]["PHONE_NUMBER"];

                send(ownerPhone, "같이탈랴?\n새로운 예약자!\n상호간의 예절을 잘 지켜주세요!" + rows[0]["NICKNAME"]);
                send(myPhone, "같이탈랴?\n예약 성공!\n시간 약속을 잘 지켜주세요!");
            });
        }
    );
    let updatePostCurrentUser =
        "UPDATE boardplan SET currentCrew=currentCrew+1 WHERE id=?";
    let updatePostCurrentUserParams = [req.body.id];

    mariaDB.query(updatePostCurrentUser, updatePostCurrentUserParams);

    res.redirect("/main");
});

export default router;
