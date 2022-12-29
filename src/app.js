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
const pgSession = require('connect-pg-simple')(session);



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
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false
}));


app.get('/customers', (req, res) => {
    client.query(`SELECT * FROM customer`, (err, result) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send(result.rows)
        }

        client.end();
    })
})

// read
app.get('/getShows', (request, response) => {
    client.query(`SELECT * FROM shows`, (err, result) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send(result.rows)
        }

        client.end();
    })
})

function addUser(firstname, lastname, email, phone_number, customer_password) {

    const insertNewUser = `INSERT INTO customer(id,firstname,lastname,email,phone_number,customer_password,user_id) VALUES(${0},'${firstname}','${lastname}','${email}','${phone_number}','${customer_password}',${0})`;
    console.log(insertNewUser);
}

// inserting customer
app.post('/register', (request, res) => {
    console.log("recived");
    console.log(request.body);
    res.status(200).send("OK");
    addUser(request.body[0][1], request.body[1][1], request.body[2][1], request.body[3][1], request.body[4][1]);

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