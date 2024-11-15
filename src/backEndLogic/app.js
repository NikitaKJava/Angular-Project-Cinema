// let cfg = require('./config.json')
const express = require('express');
const app = express();

const cors = require('cors')

const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');
app.use('/', express.static('dist/ng-cinema')); // host public folder
app.use('/admin', checkAdmin,  express.static('dist/ng-cinema')); // host public folder
app.use('/home', express.static('dist/ng-cinema'));
app.use('/overview', express.static('dist/ng-cinema'));
app.use('/contact', express.static('dist/ng-cinema'));
app.use('/login', express.static('dist/ng-cinema'));
app.use('/registration', express.static('dist/ng-cinema'));

//app.use(express.static('client')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *

const pool = require('./pool.js');

const session = require('express-session');
//dbConnection must be changed to use pg-gsessions
const pgSession = require('connect-pg-simple')(session);

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies


app.get('/api/test/', function(req, res){
  res.send("Hello from the 'test' URL");
});


const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'sessions',
        createTableIfMissing: true
    }),
    secret: "secretforcinema",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: oneDay, // 1 day
        sameSite: false
    }
}));

app.get('/api/session', (req, res) => {
    console.log(req.session.id);
    if (req.session.isAuth) {
        console.log(req.session);
        res.status(200).send({ message: "OK" });
    } else
        res.status(400).send({ message: "Session not OK" });

});

app.get('/api/admin', (req, res) => {
    console.log(req.session.id);
    console.log("req.session");
    if (req.session.isadmin) {
        console.log(req.session);
        res.status(200).send({ message: "OK" });
    } else
        res.status(400).send({ message: "Admin not OK" });

});

app.get("/api/logout", checkAuth, (req, res) => {
    req.session.destroy();
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

app.get("/api/customers", checkAdmin, (req, res) => {
    //app.get("/customers", (req, res) => {

    const query = {
        text: `SELECT * from customer`
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "no results"
                });
                return;
            }

            // everything ok -- return results
            //let response = { imageIds: resultRows.map(item => item.id) }; // only return the ids
            res.status(200).json(resultRows);

        })
        .catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "error occurred"
                });
                console.log(error.stack);

            }
        });
    pool.end;
});

app.post("/api/register", (request, res) => {

    console.log(request.body);
    let invalidPost = false;
    let firstname = request.body.firstname;
    let lastname = request.body.lastname;
    let email = request.body.email;
    let phone_number = request.body.phone_number;
    let customer_password = request.body.customer_password;

    const query = {
            text: `SELECT * FROM customer WHERE email=$1`,
            values: [email]
        }
        // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results - good
            if (resultRows.length < 1) {
                const insertNewUser = `INSERT INTO customer(firstname,lastname,email,phone_number,customer_password,isAdmin) VALUES('${firstname}','${lastname}','${email}','${phone_number}','${customer_password}',${false})`;

                pool.query(insertNewUser, (err) => {
                    console.log(err);
                    if (err) {
                        res.status(500).send(err.message)
                    } else {
                        console.log(insertNewUser);
                        res.status(200).json({
                            "message": "OK"
                        });
                    }
                });
                pool.end;
                return;
            }
            // everything ok -- return results
            //let response = { imageIds: resultRows.map(item => item.id) }; // only return the ids
            res.status(400).json({
                "message": "email already exists"
            });

        })
        .catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "error occurred"
                });
                console.log(error.stack);
            }
        });
    pool.end;
});

// the express router inherits the properties of the application
// including the session, so this has to be defined after the session is added to the app object
const loginRoute = require('./login');
app.use("/api/login", loginRoute);

const ticketingRoute = require('./ticketing');
app.use("/api/ticketing", ticketingRoute);

const moviesRoute = require('./movies');
app.use("/api/movies", moviesRoute);

const theatreRoute = require('./theatre');
app.use("/api/theatre", theatreRoute);

const showRoute = require('./show');
app.use("/api/show", showRoute);

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:" + port);

module.exports = app;
