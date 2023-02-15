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
        text: 'SELECT * from show',
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        resultRows = response.rows;

        // no results
        if (resultRows.length < 1) {
            res.status(401).json({
                "message": "no results in show table"
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
                "message": "show get error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
    pool.end;
});

router.get("/getshowid/:id", (req, res) => {

    let id = req.params.id;
    let query = {
        text: 'SELECT * from show WHERE show_id = $1',
        values: [id]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        resultRows = response.rows;

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
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Show get error occurred"
            });
            console.log(error.stack);
        }
    });
});

router.get("/getcurrentbymovie/:id", (req, res) => {

    let id = req.params.id;
    var timeNow = Date.now();
    var timeUpper = new Date(timeNow + 7 * 24 * 60 * 60 * 1000);
    let query = {
        text: 'SELECT * from show WHERE movie_id = $1 AND display_timestamp > $2 AND display_timestamp < $3 ORDER BY display_timestamp ASC',
        values: [id, timeNow, timeUpper.getTime()]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        resultRows = response.rows;

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
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Show get error occurred"
            });
            console.log(error.stack);
        }
    });
});


router.get("/getbymovie/:id", (req, res) => {

    let id = req.params.id;
    let query = {
        text: 'SELECT * from show WHERE movie_id = $1',
        values: [id]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        resultRows = response.rows;

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
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Show get error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
    pool.end;
});


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


function deleteShows(show_id) {
    return new Promise((resolve, reject) => {
        let query = {
            text: 'SELECT * from show WHERE show_id = $1',
            values: [show_id]
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

router.delete("/:id", (req, res) => {

    let id = req.params.id;

    // issue query (returns promise)
    deleteShows(id).then((response) => {
        res.status(200).json(resultRows);
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Could not delete Show"
            });
            console.log(error.stack);
            pool.end;
        }
    });
    pool.end;
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
    if (seatLocal.seat_row <= (theaterLocal.seat_rows / 2)) {
        localPrice = localPrice + priceList.goodPos;
    }
    if (seatLocal.seat_type === "deluxe") {
        localPrice = localPrice + priceList.deluxe;
    }
    if (seatLocal.seat_type === "disabled") {
        localPrice = localPrice + priceList.disabled;
    }
    return localPrice;
}

function getShowInfo(show_id) {
    return new Promise(async(resolve, reject) => {
        let showData = {};
        try {
            await pool.query(
                'SELECT * FROM show WHERE show_id = $1', [show_id]
            ).then(showResult => {
                if (showResult.rows.length > 0)
                    showData.show = showResult.rows[0];
                else
                    throw showResult.rows;
            });

            await pool.query(
                'SELECT * FROM movies WHERE movie_id = $1', [showData.show.movie_id]
            ).then(movieResult => {
                if (movieResult.rows.length > 0)
                    showData.movie = movieResult.rows[0];
                else
                    throw movieResult.rows;
            });

            await pool.query(
                'SELECT * FROM theater WHERE theater_id = $1', [showData.show.theater_id]
            ).then(theaterResult => {
                if (theaterResult.rows.length > 0)
                    showData.theater = theaterResult.rows[0];
                else
                    throw theaterResult.rows;
            });
            resolve(showData);
        } catch (error) {
            console.log(error);
            reject();
        }
    });
}


router.get("/:id/seats", (req, res) => {

    let id = req.params.id;
    let seats;
    let reply = {};

    getShowInfo(id).then(
        showData => {
            let query = {
                text: 'SELECT * FROM seats JOIN show ON seats.threater_id = show.theater_id WHERE show_id = $1 AND seats.threater_id = show.theater_id;',
                values: [id]
            };
            // issue query (returns promise)
            pool.query(query).then((response) => {
                resultRows = response.rows;
                // no results
                if (resultRows.length < 1) {
                    res.status(400).json({
                        "message": "no results"
                    });
                    return;
                }
                reply.seat_columns = showData.theater.seat_columns;
                reply.seat_rows = showData.theater.seat_rows;
                seats = resultRows;

                query = {
                    text: 'SELECT * from tickets WHERE show_id = $1',
                    values: [id]
                };

                // issue query (returns promise)
                pool.query(query).then((response) => {
                    resultRows = response.rows;
                    reply.normal = [];
                    reply.deluxe = [];
                    reply.disabled = [];
                    reply.inactive = [];

                    for (let i = 0; i < resultRows.length; i++) {
                        reply.inactive.push(resultRows[i].seat_number);
                    }
                    for (let i = 0; i < seats.length; i++) {
                        if (!reply.inactive.includes(seats[i].seat_number)) {
                            if (seats[i].seat_type === "normal") {
                                reply.normal.push([seats[i].seat_number, calcPrice(showData.show, showData.theater, showData.movie, seats[i])]);
                            } else if (seats[i].seat_type === "deluxe") {
                                reply.deluxe.push([seats[i].seat_number, calcPrice(showData.show, showData.theater, showData.movie, seats[i])]);
                            } else if (seats[i].seat_type === "disabled") {
                                reply.disabled.push([seats[i].seat_number, calcPrice(showData.show, showData.theater, showData.movie, seats[i])]);
                            }
                        }
                    }
                    res.status(200).json(reply);
                }).catch(error => {
                    // error accessing db
                    if (error) {
                        res.status(400).json({
                            "message": "Show get error occurred"
                        });
                        console.log(error.stack);
                        pool.end;
                    }
                });
            }).catch(error => {
                // error accessing db
                if (error) {
                    res.status(400).json({
                        "message": "Show get error occurred"
                    });
                    console.log(error.stack);
                }
            });
        }
    ).catch(
        error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "Show get error occurred"
                });
                console.log(error.stack);
            }
        }
    );
});

function checkTheather(theater_id, movie) {

    return new Promise((resolve, reject) => {
        let query = {
            text: 'SELECT * from theater WHERE theater_id = $1',
            values: [theater_id]
        };
        pool.query(query).then((response) => {
            resultRows = response.rows;
            // no results
            if (resultRows.length < 1) {
                pool.end;
                reject(false);
            }
            if (!((response.rows[0].screentype === "2D,3D" && movie.screentype === "3D") || movie.screentype === "2D")) {
                pool.end;
                reject(false);
            }
            if (!((response.rows[0].soundtype === "Dolby Surround, ATMOS" && movie.soundtype === "Dolby Atmos") || movie.soundtype === "Dolby Surround")) {
                pool.end;
                reject(false);
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

function checkMovie(movie) {

    return new Promise((resolve, reject) => {

        let query = {
            text: 'SELECT * from movies WHERE movie_id = $1',
            values: [movie]
        };
        pool.query(query).then((response) => {
            resultRows = response.rows;
            // no results
            if (resultRows.length < 1) {
                pool.end;
                reject(false);
            }
            resolve(response.rows[0]);
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

router.put("/update/:show_id", checkAdmin, (req, res) => {
    let show_id = req.params.show_id;
    checkMovie(req.body.movie_id).then(movie => {
        checkTheather(req.body.theater_id, movie).then(() => {
            let timeStart = new Date();
            timeStart.setTime(req.body.display_timestamp);
            let timeLower = new Date();
            timeStart.setTime(req.body.display_timestamp);

            let timeEnd = new Date();
            timeEnd.setTime(timeStart);

            let movie_duration = 0;

            let query = {
                text: 'SELECT * FROM movies WHERE movie_id = $1',
                values: [req.body.movie_id]
            };
            pool.query(query).then((response) => {
                movie_duration = response.rows[0].movie_duration;
                timeEnd.setMinutes(timeEnd.getMinutes() + movie_duration + 10);
                timeLower.setMinutes(timeEnd.getMinutes() - movie_duration - 10);
                query = {
                    text: 'SELECT * FROM show WHERE theater_id = $1 AND display_timestamp >= $2 AND display_timestamp < $3 AND show_id != $4',
                    values: [req.body.theater_id, timeLower.getTime(), timeEnd.getTime(), show_id]
                };
                pool.query(query).then((response) => {
                    resultRows = response.rows;
                    // no results
                    if (resultRows.length > 0) {
                        res.status(401).json({
                            "message": "time overlap"
                        });
                        pool.end;
                        return;
                    } else {
                        query = {
                            text: 'UPDATE show SET movie_id=$1, theater_id=$2, display_timestamp=$3, display_time=$4, date_of_display=$5 WHERE show_id=$6',
                            values: [
                                req.body.movie_id,
                                req.body.theater_id,
                                timeStart.getTime(),
                                timeStart.getHours() + ":" + timeStart.getMinutes() + ":" + timeStart.getSeconds(),
                                timeStart.getFullYear() + "-" + timeStart.getMonth() + "-" + timeStart.getDay(),
                                show_id
                            ]
                        };
                        pool.query(query).then((response) => {
                            res.status(200).json({
                                "message": "Show updated"
                            });
                        }).catch(error => {
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
                }).catch(error => {
                    // error accessing db
                    if (error) {
                        res.status(400).json({
                            "message": "show add error occurred"
                        });
                        console.log(error.stack);
                        pool.end;
                        return;
                    }
                });
            }).catch(error => {
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
        }).catch(() => {
            res.status(400).json({ "message": "theather does not exist, or not compatible" });
        });
    }).catch(() => {
        res.status(400).json({ "message": "movie does not exist" });
    });
});

router.post("/add", checkAdmin, (req, res) => {
    checkMovie(req.body.movie_id).then(movie => {
        checkTheather(req.body.theater_id, movie).then(() => {
            let timeStart = new Date();
            timeStart.setTime(req.body.display_timestamp);
            let timeLower = new Date();
            timeStart.setTime(req.body.display_timestamp);

            let timeEnd = new Date();
            timeEnd.setTime(timeStart);

            let movie_duration = 0;

            let query = {
                text: 'SELECT * FROM movies WHERE movie_id = $1',
                values: [req.body.movie_id]
            };
            pool.query(query).then((response) => {
                movie_duration = response.rows[0].movie_duration;
                timeEnd.setMinutes(timeEnd.getMinutes() + movie_duration + 10);
                timeLower.setMinutes(timeStart.getMinutes() - movie_duration - 10);
                query = {
                    text: 'SELECT * FROM show WHERE theater_id = $1 AND display_timestamp > $2 AND display_timestamp < $3',
                    values: [req.body.theater_id, timeLower.getTime(), timeEnd.getTime()]
                };
                console.log(timeStart);
                console.log(timeEnd);
                pool.query(query).then((response) => {
                    resultRows = response.rows;
                    console.log(query);
                    console.log(response.rows);
                    // no results
                    if (resultRows.length > 0) {
                        res.status(401).json({
                            "message": "time overlap"
                        });
                        pool.end;
                        return;
                    } else {
                        query = {
                            text: 'INSERT INTO show(movie_id,theater_id,display_timestamp,display_time,date_of_display)  VALUES($1,$2,$3,$4,$5)',
                            values: [
                                req.body.movie_id,
                                req.body.theater_id,
                                timeStart.getTime(),
                                timeStart.getHours() + ":" + timeStart.getMinutes() + ":" + timeStart.getSeconds(),
                                timeStart.getFullYear() + "-" + timeStart.getMonth() + "-" + timeStart.getDay()
                            ]
                        };
                        pool.query(query).then((response) => {
                            res.status(200).json({
                                "message": "Show added"
                            });
                        }).catch(error => {
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
                }).catch(error => {
                    // error accessing db
                    if (error) {
                        res.status(400).json({
                            "message": "show add error occurred"
                        });
                        console.log(error.stack);
                        pool.end;
                        return;
                    }
                });
            }).catch(error => {
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
        }).catch(() => {
            res.status(400).json({ "message": "theather does not exist, or not compatible" });
        });
    }).catch(() => {
        res.status(400).json({ "message": "movie does not exist" });
    });
});

module.exports = router;