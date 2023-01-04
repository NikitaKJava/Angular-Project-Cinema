let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');

// login route creating a session on successful login
router.post('/', (req, res) => {

    // get login parameters
    const user = req.body.user;
    const pass = req.body.pass;

    // prepare query
    const query = {
        text: 'SELECT * FROM customers WHERE email = $1 AND customer_password = $2',
        values: [user, pass]
    }

    // issue query (returns promise)
    pool.query(query)
        .then(results => {

            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "login failed"
                });
                return;
            }

            // everything is ok
            resultUser = resultRows[0];

            req.session.isAuth = true;
            req.session.username = resultUser.login;
            res.status(200).json({
                "message": "login successful",
                login: resultUser.login
            });

        })
        .catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "error occurred"
                });
                console.log(error.stack);
                return;
            }
        });

});

router.get("/logout", checkAuth, (req, res) => {
    req.session.destroy();
    if (!req.session) {
        res.status(200).json({
            "message": "logout sucessful"
        });
    } else {
        res.status(401).json({
            "message": "logout failed"
        });
    }
});



module.exports = router;