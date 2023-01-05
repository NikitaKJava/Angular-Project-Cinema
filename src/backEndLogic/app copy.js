const express = require('express')
const app = express();
const PORT = 3000;
const client = require('./dbConnection.js')
const cors = require('cors');
const oneDay = 1000 * 60 * 60 * 24;

app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *
app.use(express.json())

// this is necessary to implement session-based authentication 
const session = require('express-session');
// this is necessary to allow session data to be stored in the PostgreSQL database
//const pgSession = require('connect-pg-simple')(session);

const checkAuth = require('./check_auth');

// it is also necessary to set the proper content type (application/json) in the request (e.g. in postman or RESTer)
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(PORT, () => {
    console.log('App running at the port ' + PORT);
})

// this is necessary to provide authentication to access the routes
// app.use(session({
//     store: new pgSession({
//         client: client,
//         tableName: 'sessions',
//         createTableIfMissing: true
//     }),
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: oneDay, // 1 hour
//         //sameSite: true
//     }
// }));

app.get('/customers', (req, res) => {
    client.query(`SELECT * FROM customer`).then((err, result) => {
        if (err) {
            res.status(400).send(err.message)
        } else {
            res.status(200).send(result.rows)
        }
        console.log("Email already exists");
        client.end();
    })
})


// inserting customer
app.post('/register', (request, res) => {
    console.log(request.body);
    res.status(200).send("OK");
    //addUser(request.body[0][1], request.body[1][1], request.body[2][1], request.body[3][1], request.body[4][1]);
    let firstname = request.body[0][1];
    let lastname = request.body[1][1];
    let email = request.body[2][1];
    let phone_number = request.body[3][1];
    let customer_password = request.body[4][1]

    var sql = 'SELECT email FROM customer WHERE email = \'' + email + '\'';
    client.query(sql).then((err, result) => {
        if (err) {
            console.log(err.message);
            //res.status(500).send(err.message);
        } else {
            if (result.rowCount > 0) {
                //res.status(500).send("Email already exists");
                console.log("Email already exists");
            } else {
                const insertNewUser = `INSERT INTO customer(id,firstname,lastname,email,phone_number,customer_password,user_id) VALUES(${0},'${firstname}','${lastname}','${email}','${phone_number}','${customer_password}',${0})`;
                console.log(insertNewUser);
                //res.status(200).send("OK");
            }
        }
        client.end();
    });
})



//inserting customer for testing db connection
app.post('/customers/newCustomer', (req, res) => {
    const user = req.body;
    const insertNewUser = `INSERT INTO customer(id,firstname,lastname,email,phone_number,customer_password,user_id) VALUES(${user.id},'${user.firstname}','${user.lastname}','${user.email}','${user.phone_number}','${user.customer_password}',${user.user_id})`;


    client.query(insertNewUser, (err) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send('Customer inserted successfully!')
        }
    })
    client.end;
})