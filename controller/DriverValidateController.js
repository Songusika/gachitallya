import express from "express"
import mariaDB from "../config/mariaDBConn.js";
import DriverLicense from "../dto/license.js";
import checkLicense from "../service/SafeDrivingValidation.js";
const router = express.Router()

router.post("/api/driverLicenseValidate", (req, res) => {
    let targetUser = req.body;
    let userId = req.session.user;
    let makePrettyBirthDay = (uglyBirthDay) => {
        let birthDayList = uglyBirthDay.substr(2).split("-");
        return birthDayList.join("");
    };

    let findUser = "Select NAME, BIRTHDAY from user where ID=?";
    let findUserParms = [userId];

    mariaDB.query(findUser, findUserParms, (err, rows) => {
        if (!err) {
            let userName = rows[0]["NAME"];
            let birthday = makePrettyBirthDay(rows[0]["BIRTHDAY"]);

            let newLicneseInfo = new DriverLicense(
                // targetUser.name,
                userName,
                // targetUser.birthday,
                birthday,
                targetUser.licenseNumber,
                targetUser.serialNum
            );
            checkLicense(newLicneseInfo).then((checkResult) => {
                let result = JSON.parse(JSON.stringify(checkResult)).isSuccess;

                if (result == true) {
                    let query =
                        "UPDATE user SET USER_TYPE = 1 WHERE user.USER_TYPE=0 AND user.ID =?;";
                    let queryParams = [userId];
                    mariaDB.query(query, queryParams);
                    res.render("carOwnerMyPage.ejs");
                } else if (result == false) {
                    res.render("fall.ejs");
                } else {
                    res.json(JSON.stringify(checkResult));
                }
            });
        }
    });
});

export default router
