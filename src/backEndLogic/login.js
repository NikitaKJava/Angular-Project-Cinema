let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');


// login route creating a session on successful login this is the base route of /login
router.post('/', (request, res) => {
    console.log(request.session.id);
    console.log(request.body);
    console.log("login");
    // get login parameters
    let user;
    let pass;
    if (request.body.length > 1) {
        let invalidPost = false;
        if (request.body[0][0] !== 'username') {
            invalidPost = true;
        }
        if (request.body[1][0] !== 'psw') {
            invalidPost = true;
        }
        // no results
        if (invalidPost) {
            res.status(401).json({
                "message": "login failed"
            });
            pool.end;
            return;
        } else {
            user = request.body[0][1];
            pass = request.body[1][1];
        }
    } else {
        user = request.body.username;
        pass = request.body.password;
    }


    // prepare query
    const query = {
        text: 'SELECT * FROM customer WHERE email = $1 AND customer_password = $2',
        values: [user, pass]
    }

    // issue query (returns promise)
    pool.query(query)
        .then(results => {

            let resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "login failed"
                });
                pool.end;
                return;
            }

            // everything is ok
            let resultUser = resultRows[0];
            request.session.username = resultUser.email;
            request.session.isadmin = resultUser.isadmin;
            request.session.isAuth = true;
            request.session.customerID = resultUser.id;
            request.session.name = resultUser.lastname + " " + resultUser.firstname;
            res.send(request.session.sessionID);
            // res.status(200).json({
            //     "message": "login successful",
            //     login: resultUser.email
            // });

        })
        .catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "error occurred"
                });
                console.log(error.stack);
                pool.end;
                return;
            }
        });
    pool.end;

});

router.get("/logout", checkAuth, (req, res) => {
    req.session.destroy();
    console.log("session destroy");
    if (!req.session) {
        res.status(200).json({
            "message": "logout successful"
        });
    } else {
        res.status(401).json({
            "message": "logout failed"
        });
    }
});



module.exports = router;