let cfg = require('./config.json')
let express = require('express');

let cors = require('cors')
const app = express();

const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');
app.use('/', express.static('dist/ng-cinema')); // host public folder
app.use('/admin', checkAdmin,  express.static('dist/ng-cinema')); // host public folder
app.use('/home', express.static('dist/ng-cinema'));
app.use('/overview', express.static('dist/ng-cinema'));
app.use('/contact', express.static('dist/ng-cinema'));
app.use('/login', express.static('dist/ng-cinema'));
//app.use(express.static('client')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *

const pool = require('./pool.js');

const session = require('express-session');
//dbConnection must be changed to use pg-gsessions
const pgSession = require('connect-pg-simple')(session);

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies




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
        res.status(400).send({ message: "Not OK" });

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
                return;
            }
        });
    pool.end;
});

app.post("/api/register", (request, res) => {

    console.log(request.body);
    let invalidPost = false;
    let firstname = request.body[0][1];
    let lastname = request.body[1][1];
    let email = request.body[2][1];
    let phone_number = request.body[3][1];
    let customer_password = request.body[4][1];

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

//inserting customer for testing db connection
app.post('/api/customers/newCustomer', (req, res) => {
    const user = req.body;
    const insertNewUser = `INSERT INTO customer(id,firstname,lastname,email,phone_number,customer_password,user_id) VALUES(${user.id},'${user.firstname}','${user.lastname}','${user.email}','${user.phone_number}','${user.customer_password}',${user.user_id})`;


    pool.query(insertNewUser, (err) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send('Customer inserted successfully!')
        }
    })
    pool.end;
});

// the express router inherits the properties of the application
// including the session, so this has to be defined after the session is added to the app object
const loginRoute = require('./login');
app.use("/api/login", loginRoute);

const userRoute = require('./user');
app.use("/api/user", userRoute);

const moviesRoute = require('./movies');
app.use("/api/movies", moviesRoute);

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:" + port);

module.exports = app;
