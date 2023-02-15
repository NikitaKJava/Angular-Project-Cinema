let priceList = require('./prices.json');
let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');

var format = require('pg-format');


router.get("/", (req, res) => {
    let query = {
        text: 'SELECT * from theater',
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        resultRows = response.rows;

        // no results
        if (resultRows.length < 1) {
            res.status(401).json({
                "message": "no results in theater table"
            });
            return;
        }

        // everything ok -- return results
        //let response = { imageIds: resultRows.map(item => item.id) }; // only return the ids
        res.status(200).json(resultRows);
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Theather get error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
    pool.end;
});

function checkForFutureShows(theater_id) {
    return new Promise((resolve, reject) => {
        var timeNow = Date.now();

        let query = {
            text: 'SELECT * from show WHERE theater_id = $1 AND display_timestamp > $2',
            values: [theater_id, timeNow]
        };
        pool.query(query).then((response) => {
            resultRows = response.rows;
            // no results
            if (resultRows.length < 1) {
                resolve(true);
            } else {
                reject(false);
                pool.end;
            }
        }).catch(error => {
            // error accessing db
            if (error) {
                console.log(error.stack);
                pool.end;
                reject(false);
            }
        });
    });
}

router.get("/:id", (req, res) => {

    let id = req.params.id;
    let query = {
        text: 'SELECT * from theater WHERE movie_id = $1',
        values: [id]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        resultRows = response.rows;

        // no results
        if (resultRows.length < 1) {
            res.status(401).json({
                "message": "no results in theater table"
            });
            return;
        }

        // everything ok -- return results
        //let response = { imageIds: resultRows.map(item => item.id) }; // only return the ids
        res.status(200).json(resultRows);
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Theather add error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
    pool.end;
});

function seatUpdate(seatList) {
    return new Promise(async(resolve, reject) => {
        let query;
        for (let i = 0; i < seatList.length; i++) {
            let seat = seatList[i];
            //console.log(seat);
            query = {
                text: 'SELECT * from seats WHERE threater_id = $1 AND seat_number = $2',
                values: [seat.theater_id, seat.seat_number]
            };

            await pool.query(query).then((response) => {
                resultRows = response.rows;

                if (resultRows.length < 1) {
                    // insert seat in table seat
                    query = {
                        text: 'INSERT INTO seats (seat_row, seat_type, threater_id, seat_number) VALUES ($1, $2, $3, $4)',
                        values: [seat.seat_row, seat.seat_type, seat.theater_id, seat.seat_number]
                    };

                    pool.query(query).then(() => {
                        //("Inserted seat into the table 'seats'");
                    }).catch(error => {
                        console.log(error.stack);
                        reject();
                    });
                } else {
                    // update seat in table seat
                    query = {
                        text: 'UPDATE seats SET seat_row = $1, seat_type = $2 WHERE threater_id = $3 AND seat_number = $4',
                        values: [seat.seat_row, seat.seat_type, seat.theater_id, seat.seat_number]
                    };

                    pool.query(query).then(() => {
                        //console.log("Updated seat in the table 'seats'");
                    }).catch(error => {
                        console.log(error.stack);
                        reject();
                    });
                }

            }).catch(error => {
                console.log(error.stack);
                reject();
            });

            if (i === seatList.length - 1) {
                resolve();
            }
        }

    });
}

router.put("/update/:id", checkAdmin, (req, res) => {

    let theater_id = req.params.id;
    //console.log(req.body);
    let number_of_seats = req.body.seat_columns * req.body.seat_rows;
    let seatList = [];
    let i = 1;
    let seatRow = 0;

    if (typeof req.body.deluxe === 'undefined' || req.body.deluxe === null) {
        req.body.deluxe = [];
    }
    if (typeof req.body.disabled === 'undefined' || req.body.disabled === null) {
        req.body.disabled = [];
    }
    console.log(req.body.disabled);
    console.log(req.body);
    while (i <= number_of_seats) {
        if (req.body.deluxe.includes(i) && req.body.disabled.includes(i)) {
            res.status(400).json({
                "message": "Theater update error occurred"
            });
        }
        i++;
    }


    let query = {
        text: 'UPDATE theater SET theater_name = $1, number_of_seats = $2, seat_rows = $3, seat_columns = $4, screentype = $5, soundtype = $6, disabled = $7, deluxe = $8 WHERE theater_id = $9',
        values: [req.body.theater_name,
            number_of_seats,
            req.body.seat_rows,
            req.body.seat_columns,
            req.body.screentype,
            req.body.soundtype,
            req.body.disabled,
            req.body.deluxe,
            theater_id
        ]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        i = 1;
        //var qvalues = [];
        while (i <= number_of_seats) {
            seatRow = Math.ceil(i / req.body.seat_columns);
            if (req.body.deluxe.includes(i)) {
                seatList.push({ "seat_row": seatRow, "seat_type": "deluxe", "theater_id": theater_id, "seat_number": i });
            } else if (req.body.disabled.includes(i)) {
                seatList.push({ "seat_row": seatRow, "seat_type": "disabled", "theater_id": theater_id, "seat_number": i });
            } else {
                seatList.push({ "seat_row": seatRow, "seat_type": "normal", "theater_id": theater_id, "seat_number": i });
            }
            //qvalues.push(new Array(seatList[i - 1].seat_row, seatList[i - 1].seat_type, seatList[i - 1].theater_id, seatList[i - 1].seat_number));
            i++;
        }
        //console.log(theater_id);
        //console.log(seatList);
        seatUpdate(seatList).then(() => {
            res.status(200).json({
                "message": "Theather update success"
            });
        }).catch(error => {
            res.status(400).json({
                "message": "Theather update error occurred"
            });
            console.log(error.stack);

        });

    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Theather update error occurred"
            });
            console.log(error.stack);
        }
    });
});

router.post("/add", checkAdmin, (req, res) => {

    if (typeof req.body.deluxe === 'undefined' || req.body.deluxe === null) {
        req.body.deluxe = [];
    }
    if (typeof req.body.disabled === 'undefined' || req.body.disabled === null) {
        req.body.disabled = [];
    }
    console.log(req.body.disabled);
    console.log(req.body);
    let number_of_seats = req.body.seat_columns * req.body.seat_rows;
    let seatList = [];
    let i = 1;
    let seatRow = 0;
    let threater_id = 0;

    while (i <= number_of_seats) {
        if (req.body.deluxe.includes(i) && req.body.disabled.includes(i)) {
            res.status(400).json({
                "message": "Theather add error occurred"
            });
        }
        i++;
    }

    let query = {
        text: 'INSERT INTO theater(theater_name, number_of_seats, seat_rows, seat_columns, screentype, soundtypem, disabled, deluxe ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [req.body.theater_name,
            number_of_seats,
            req.body.seat_rows,
            req.body.seat_columns,
            req.body.screentype,
            req.body.soundtype,
            req.body.disabled,
            req.body.deluxe,
        ]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        query = {
            text: 'SELECT MAX(theater_id) FROM theater',
        };
        pool.query(query).then((response) => {
            threater_id = response.rows[0].max;
            i = 1;

            // let multiquery = {
            //     text: 'INSRT INTO seats(Eseat_row, seat_type, threater_id, seat_number) VALUES',
            // };
            var qvalues = [];
            while (i <= number_of_seats) {
                seatRow = Math.ceil(i / req.body.seat_columns);
                if (req.body.deluxe.includes(i)) {
                    seatList.push({ "seat_row": seatRow, "seat_type": "deluxe", "threater_id": threater_id, "seat_number": i });
                } else if (req.body.disabled.includes(i)) {
                    seatList.push({ "seat_row": seatRow, "seat_type": "disabled", "threater_id": threater_id, "seat_number": i });
                } else {
                    seatList.push({ "seat_row": seatRow, "seat_type": "normal", "threater_id": threater_id, "seat_number": i });
                }
                qvalues.push(new Array(seatList[i - 1].seat_row, seatList[i - 1].seat_type,
                    seatList[i - 1].threater_id, seatList[i - 1].seat_number));
                i++;
            }
            let multiquery = format('INSERT INTO seats(seat_row, seat_type, threater_id, seat_number) VALUES %L', qvalues);

            console.log(multiquery.text);
            pool.query(multiquery).then((response) => {
                console.log(seatList[0]);
                res.status(200).json({
                    "message": "Theather added"
                });
            }).catch(error => {
                // error accessing db
                if (error) {
                    res.status(400).json({
                        "message": "Theather add error occurred"
                    });
                    console.log(error.stack);
                }
            });

        }).catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "Theather add error occurred"
                });
                console.log(error.stack);
            }
        });
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Theather add error occurred"
            });
            console.log(error.stack);
        }
    });
});

router.delete("/:id", checkAdmin, (req, res) => {
    let id = req.params.id;
    checkForFutureShows(id).then(() => {
        deleteOlderShows(id).then(() => {
            deleteTheatherAndSeats(id).then(() => {
                res.status(200).json({
                    "message": "Theather deleted"
                });
            }).catch(() => {
                res.status(400).json({
                    "message": "Theather delete error occurred"
                });
            });
        }).catch(() => {
            res.status(400).json({ "message": "delete older shows failed" });
        });
    }).catch(() => {
        res.status(400).json({ "message": "there are future shows scheudled" });
    });
    pool.end;
});

function deleteTheatherAndSeats(theater_id) {
    return new Promise((resolve, reject) => {
        let query = {
            text: 'DELETE FROM seats WHERE threater_id = $1',
            values: [theater_id]
        };

        // issue query (returns promise)
        pool.query(query).then((response) => {

            query = {
                text: 'DELETE FROM theater WHERE theater_id = $1',
                values: [theater_id]
            };
            // issue query (returns promise)
            pool.query(query).then((response) => {
                resolve(true);
                // res.status(200).json({
                //     "message": "Theather deleted"
                // });
            }).catch(error => {
                if (error) {
                    // res.status(400).json({
                    //     "message": "Theather delete error occurred"
                    // });
                    console.log(error.stack);
                    pool.end;
                    reject(false);
                }
            });
        }).catch(error => {
            if (error) {
                // res.status(400).json({
                //     "message": "Seats delete error occurred"
                // });
                console.log(error.stack);
                pool.end;
                reject(false);
            }
        });
    });
}

function deleteOlderShows(theater_id) {
    return new Promise((resolve, reject) => {
        var timeNow = Date.now();

        let query = {
            text: 'SELECT * from show WHERE theater_id = $1 AND display_timestamp < $2',
            values: [theater_id, timeNow]
        };
        pool.query(query).then((response) => {
            resultRows = response.rows;
            let show_id;
            // no results
            for (let i = 0; i < resultRows.length; i++) {
                show_id = resultRows[i].show_id;
                deleteShowsTickets(show_id).then((show_id) => {
                    deleteShow(show_id).catch(() => {
                        reject(false);
                        pool.end;
                    });
                }).catch(() => {
                    reject(false);
                    pool.end;
                });
            }
            resolve(true);
        }).catch(error => {
            // error accessing db
            if (error) {
                console.log(error.stack);
                pool.end;
                reject(false);
            }
        });
    });
}

function deleteShow(show_id) {
    return new Promise((resolve, reject) => {
        let query = {
            text: 'DELETE from show WHERE show_id = $1',
            values: [show_id]
        };
        pool.query(query).then((response) => {
            pool.end;
            resolve(show_id);
        }).catch(error => {
            // error accessing db
            if (error) {
                console.log(error.stack);
                pool.end;
                reject(false);
            }
        });
    });
}

function deleteShowsTickets(show_id) {
    return new Promise((resolve, reject) => {

        let query = {
            text: 'DELETE from tickets WHERE show_id = $1',
            values: [show_id]
        };
        pool.query(query).then((response) => {
            pool.end;
            resolve(show_id);
        }).catch(error => {
            // error accessing db
            if (error) {
                console.log(error.stack);
                pool.end;
                reject(false);
            }
        });
    });
}


module.exports = router;