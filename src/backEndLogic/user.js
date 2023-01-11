let cfg = require('./config.json');
let priceList = require('./prices.json');
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');
const app = express();

app.get("/tickets", checkAuth, (req, res) => {
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

app.get("/tickets/:id", checkAuth, (req, res) => {
    //app.get("/customers", (req, res) => {

    let id = req.params.id;

    var resultRows;
    var query = {
        text: 'SELECT * FROM tickets WHERE ticket_id = $1',
        values: [id]
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

app.post("/buyTicket", checkAuth, (req, res) => {
    //app.get("/customers", (req, res) => {
    //expected ticketlist =
    // [{
    //     "show_id": 28,
    //     "seat_number": 10
    // }, {
    //     "show_id": 28,
    //     "seat_number": 11
    // }, {
    //     "id": 89,
    //     "seat_number": 12
    // }]
    let query;
    let resultRows;
    let alreadyBooked;
    let bookList;
    let ticketList;



    for (let i = 0; i < req.body.length; i++) {
        //check if tickets already exist
        query = {
            text: 'SELECT * FROM tickets WHERE show_id = $1 AND seat_number = $2',
            values: [req[i].show_id, req[i].seat_number]
        };
        pool.query(query).then(results => {

                resultRows = results.rows;

                // no results
                if (resultRows.length < 1) {
                    if (bookList.includes(req[i]) !== true)
                        bookList.push();
                } else {
                    alreadyBooked.push(req[i]);
                }
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
    }

    if (alreadyBooked.length > 0) {
        //there are tickets already existing
        res.status(400).json(alreadyBooked);
    } else {
        //for every ticket calc price
        for (let i = 0; i < bookList.length; i++) {

            let showLocal = null;
            let theaterLocal = null;
            let movieLocal = null;
            let seatLocal = null;
            let price = priceList.baseprice;

            query = {
                    text: 'SELECT * FROM show WHERE show_id = $1',
                    values: [bookList[i].show_id]
                }
                // get show
            pool.query(query).then(results => {
                    if (results.rows.length > 0) {
                        showLocal = results.rows[0];
                        query = {
                                text: 'SELECT * FROM movies WHERE movie_id = $1',
                                values: [showLocal.movie_id]
                            }
                            //get movie
                        pool.query(query).then(results => {
                                if (results.rows.length > 0) {
                                    movieLocal = results.rows[0];
                                }
                            })
                            .catch(error => {
                                // error accessing db
                                if (error) {
                                    res.status(400).json({
                                        "message": "show table error occurred"
                                    });
                                    console.log(error.stack);
                                    pool.end;
                                    return;
                                }
                            });
                        pool.end;
                        query = {
                                text: 'SELECT * FROM theater WHERE theater_id = $1',
                                values: [showLocal.theater_id]
                            }
                            //get theathere
                        pool.query(query).then(results => {
                                if (results.rows.length > 0) {
                                    theaterLocal = results.rows[0];
                                }
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
                        query = {
                                text: 'SELECT * FROM seats WHERE seat_number = $1 AND threater_id = $2',
                                values: [bookList[i].seat_number, showLocal.theater_id]
                            }
                            //get seat
                        pool.query(query).then(results => {
                                if (results.rows.length > 0) {
                                    seatLocal = results.rows[0];
                                }
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
                    }
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
            if (showLocal !== null && theaterLocal !== null && movieLocal !== null && seatLocal !== null) {
                price = calcPrice(showLocal, theaterLocal, movieLocal, seatLocal);
                ticketList.push({ "price": price, "seat_number": bookList[i].seat_number, "customer_id": req.session.customerID, "show_id": bookList[i].show_id });

            } else {
                console.log(showLocal);
                console.log(theaterLocal);
                console.log(movieLocal);
                console.log(seatLocal);
                res.status(400).json({
                    "message": "error occurred"
                });
            }
        }

        for (let j = 0; j < ticketList.length; j++) {
            query = {
                    text: 'INSERT INTO tickets(price, seat_number, customer_id, show_id) VALUES ($1, $1, $1, $1)', // for 4 Values Nikita
                    values: [ticketList[j].price, ticketList[j].seat_number, ticketList[j].customer_id, ticketList[j].show_id]
                }
                //add ticket
            pool.query(query).catch(error => {
                // error accessing db
                if (error) {
                    res.status(400).json({
                        "message": "error occurred"
                    });
                    console.log(error.stack);
                    pool.end;
                }
            });
            pool.end;

        }
        res.status(200).json({
            "message": "Tickets added"
        });
    }
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
        localPrice = localPrice + priceList.Dolby_Souround;
    }
    if (seatLocal.seat_row >= (theaterLocal.seat_rows / 2)) {
        localPrice = localPrice + priceList.goodPos;
    }
    return localPrice;
}

module.exports = router;
