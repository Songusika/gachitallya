import express from "express"
const router = express.Router()

router.get("/", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
      return;
    }
    let queryStatement =
      "SELECT a.id, a.title, a.departures, a.arrivals, a.depaturesTime, a.deadline, a.contents, a.writingTime, a.deadline, a.maximumCrew, a.currentCrew, b.NICKNAME FROM boardplan AS a, user AS b WHERE a.userID = b.ID;";
  
    mariaDB.query(queryStatement, (err, rows) => {
      if (!err) {
        let postInfo = rows;
        console.log(err);
        let userTypeQuery = "Select USER_TYPE from user Where ID=?";
        let userTypeParam = [req.session.user];
  
        mariaDB.query(userTypeQuery, userTypeParam, (err, rows) => {
          if (!err) {
            if (rows[0]["USER_TYPE"] == 1) {
              res.render("mainCarOwner.ejs", { postInfo });
              return;
            }
            res.render("mainPage.ejs", { postInfo });
          }
        });
      }
    });
});

export default router
