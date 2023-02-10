let priceList = require('./prices.json');
let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');

var format = require('pg-format');

router.get("/tickets", checkAuth, (req, res) => {
    //app.get("/customers", (req, res) => {

    var resultRows;
    var query = {
        text: 'SELECT * FROM tickets WHERE customer_id = $1',
        values: [req.session.customerID]
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "no tickets"
                });
                pool.end;
                return;
            }

            // everything ok -- return results
            //let response = { imageIds: resultRows.map(item => item.id) };
            let tickets = { ticket: resultRows.map(item) };
            pool.end;
            res.status(200).json(tickets);

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

router.get("/tickets/:id", checkAuth, (req, res) => {
    //app.get("/customers", (req, res) => {

    let id = req.params.id;

    var resultRows;
    var query = {
        text: 'SELECT * FROM tickets WHERE ticket_id = $1 AND customer_id = $2',
        values: [
            id,
            req.session.customerID
        ]
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "no tickets"
                });
                pool.end;
                return;
            }

            // everything ok -- return results
            //let response = { imageIds: resultRows.map(item => item.id) };
            pool.end;
            res.status(200).json(resultRows[0]);

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

async function checkIfSeatsAreFree(input) {
    console.log("check seats");
    let alreadyBooked = [];
    let bookList = [];
    for (let i = 0; i < input.length; i++) {
        let ticket = input[i];
        let query = {
            text: 'SELECT * FROM tickets WHERE show_id = $1 AND seat_number = $2',
            values: [ticket.show_id, ticket.seat_number]
        };
        try {
            let results = await pool.query(query);
            let resultRows = results.rows;
            if (resultRows.length < 1) {
                bookList.push(ticket);
            } else {
                alreadyBooked.push(ticket);
            }
        } catch (error) {
            console.log(error.stack);
            return Promise.reject(error);
        }
    }
    if (alreadyBooked.length > 0) {
        return Promise.reject(alreadyBooked);
    } else {
        return Promise.resolve(bookList);
    }
}

router.post("/buyTicket", checkAuth, (req, res) => {
    let ticketList = [];

    checkIfSeatsAreFree(req.body).then(async bookList => {
        console.log(bookList);
        for (let i = 0; i < bookList.length; i++) {
            let showLocal = null;
            let theaterLocal = null;
            let movieLocal = null;
            let seatLocal = null;
            let price = priceList.baseprice;
            console.log("check seats");
            try {
                await pool.query(
                    'SELECT * FROM show WHERE show_id = $1', [bookList[i].show_id]
                ).then(showResult => {
                    if (showResult.rows.length > 0)
                        showLocal = showResult.rows[0];
                    else
                        throw showResult.rows;
                });


                await pool.query(
                    'SELECT * FROM movies WHERE movie_id = $1', [showLocal.movie_id]
                ).then(movieResult => {
                    if (movieResult.rows.length > 0)
                        movieLocal = movieResult.rows[0];
                    else
                        throw movieResult.rows;
                });

                await pool.query(
                    'SELECT * FROM theater WHERE theater_id = $1', [showLocal.theater_id]
                ).then(theaterResult => {
                    if (theaterResult.rows.length > 0)
                        theaterLocal = theaterResult.rows[0];
                    else
                        throw theaterResult.rows;
                });



                await pool.query(
                    'SELECT * FROM seats WHERE seat_number = $1 AND threater_id = $2', [bookList[i].seat_number, showLocal.theater_id]
                ).then(seatResult => {
                    if (seatResult.rows.length > 0)
                        seatLocal = seatResult.rows[0];
                    else
                        throw seatResult.rows;
                });


            } catch (error) {
                console.log(error);
                res.status(400).json({
                    message: "Error occurred",
                });
                return;
            }

            if (showLocal !== null && theaterLocal !== null && movieLocal !== null && seatLocal !== null) {
                price = calcPrice(showLocal, theaterLocal, movieLocal, seatLocal);
                ticketList.push(new Array(price, bookList[i].seat_number, req.session.customerID, bookList[i].show_id, seatLocal.seat_id));
            } else {
                console.log(showLocal);
                console.log(theaterLocal);
                console.log(movieLocal);
                console.log(seatLocal);
                res.status(400).json({
                    message: "Error occurred",
                });
                return;
            }
        }
        let multiquery = format('INSERT INTO tickets(price, seat_number, customer_id, show_id, seat_id) VALUES %L', ticketList);
        pool.query(multiquery).then(results => {
            res.status(200).json({
                "message": "Tickets added"
            });
        }).catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "could not add"
                });
                console.log(error.stack);
                pool.end;
            }
        });
    }).catch(alreadyBooked => {
        res.status(400).json({
            "message": "could not add",
            "tickets": alreadyBooked
        });
        pool.end;
    });
});


function calcPrice(showLocal, theaterLocal, movieLocal, seatLocal) {
    let localPrice = priceList.baseprice;
    let d = new Date();
    d.setTime(showLocal.display_timestamp);
    //increase price past 18 o'clock
    if (d.getHours > 18) {
        localPrice = localPrice + priceList.showAfter6pm;
    }
    if (movieLocal.screentype === "3D") {
        localPrice = localPrice + priceList.threeD;
    }
    if (movieLocal.soundtype === "ATMOS") {
        localPrice = localPrice + priceList.Dolby_Atmos;
    }
    if (movieLocal.soundtype === "Dolby Surround") {
        localPrice = localPrice + priceList.Dolby_Surround;
    }
    if (seatLocal.seat_row >= (theaterLocal.seat_rows / 2)) {
        localPrice = localPrice + priceList.goodPos;
    }
    return localPrice;
}

module.exports = router;