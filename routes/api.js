const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/users", function (req, res, next) {
    const filters = req.query
    let sqlquery = "SELECT id,username FROM users"

    db.query(sqlquery, (err, result) => {
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            const output = result.filter(user => {
                let isValid = true;
                for (key in filters) {
                    isValid = isValid && (user[key]).includes(filters[key]);
                }
                return isValid;
            });
            res.send(output);
        }
    })
})




module.exports = router