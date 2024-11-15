// let priceList = require('./prices.json');
// let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');

router.get("/", (req, res) => {

    //SELECT * FROM movie
    //WHERE movie_id IN (SELECT movie_id FROM show WHERE time > 10)
    // const query = {
    //     text: `SELECT * from movies`
    // }
  const timeNow = Date.now();
  const query = {
        text: 'SELECT * FROM movies WHERE movie_id IN (SELECT movie_id FROM show WHERE display_timestamp > $1)',
        values: [timeNow]
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "no results in movies table"
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
                    "message": "movies table error occurred"
                });
                console.log(error.stack);

            }
        });
    pool.end;
});

router.get("/getall", checkAdmin, (req, res) => { // add checkAdmin is temporary removed

    const query = {
        text: 'SELECT * FROM movies ORDER BY movie_id DESC'
    }
    console.log(query);
    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(400).json({
                    "message": "no results in movies table"
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
                    "NodeJS": "movies table error occurred"
                });
                console.log(error.stack);

            }
        });
    pool.end;
});

router.get("/haswatched/:id", checkAuth, (req, res) => {
    var timeNow = Date.now();
    let watched = false;
    let id = req.params.id;
    const query = {
        text: 'SELECT * FROM tickets JOIN show ON tickets.show_id = show.show_id WHERE tickets.customer_id = $1 AND show.movie_id = $2 AND show.display_timestamp < $3',
        values: [req.session.customerID, id, timeNow]
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(400).json(watched);
                return;
            }
            // everything ok -- return results
            watched = true;
            res.status(200).json(watched);
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

router.post("/rating/add", checkAuth, (req, res) => {

    const query = {
        text: 'INSERT INTO ratings(customer_id, movie_id, review, star) VALUES ($1, $2, $3, $4)',
        values: [
            req.session.customerID,
            req.body.movie_id,
            req.body.review,
            req.body.star
        ]
    }

    // issue query (returns promise)
    pool.query(query).then(() => {
        pool.end;
        res.status(200).json({
            "message": "Rating added"
        });
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Rating add error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
});

router.post("/add", checkAdmin, (req, res) => {

    console.log(req.body);
    const query = {
        text: 'INSERT INTO movies(movie_name, movie_duration, production_date, description, "titleImage", director, major_actor, pegi, screentype, soundtype, actors, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        values: [req.body.movie_name,
            req.body.movie_duration,
            req.body.production_date,
            req.body.description,
            req.body.titleImage,
            req.body.director,
            req.body.major_actor,
            req.body.pegi,
            req.body.screentype,
            req.body.soundtype,
            req.body.actors,
            req.body.status
        ]
    }

    // issue query (returns promise)
    pool.query(query).then(() => {
        pool.end;
        res.status(200).json({
            "message": "Movie added"
        });
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Movie add error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
});

router.put("/update/:movie_id", checkAdmin, (req, res) => {
    let movie_id = req.params.movie_id;

    console.log(req.body);
    let query = {
        text: 'UPDATE movies SET movie_name = $1, movie_duration = $2, production_date = $3, description = $4, "titleImage" = $5, director = $6, major_actor = $7, pegi = $8, screentype = $9, soundtype = $10, actors = $11, status = $12 WHERE movie_id = $13',
        values: [req.body.movie_name,
            req.body.movie_duration,
            req.body.production_date,
            req.body.description,
            req.body.titleImage,
            req.body.director,
            req.body.major_actor,
            req.body.pegi,
            req.body.screentype,
            req.body.soundtype,
            req.body.actors,
            req.body.status,
            movie_id
        ]
    }

    // issue query (returns promise)
    pool.query(query).then(() => {
        pool.end;
        res.status(200).json({
            "message": "Movie updated"
        });
    }).catch(error => {
        // error accessing db
        if (error) {
            res.status(400).json({
                "message": "Movie update error occurred"
            });
            console.log(error.stack);
            pool.end;
        }
    });
});

router.get("/:id/ratings", (req, res) => {

    let id = req.params.id;
    const query = {
        text: `SELECT * from ratings WHERE movie_id = $1`,
        values: [id]
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "no results in rating table"
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
                    "message": "rating table error occurred"
                });
                console.log(error.stack);

            }
        });
    pool.end;
});

router.delete("/:id", checkAdmin, (req, res) => {
    let id = req.params.id;
    checkForFutureShows(id).then(() => {
        console.log(id);
        deleteRatings(id).then(() => {
            deleteOlderShows(id).then(() => {
                let query = {
                        text: 'DELETE FROM movies WHERE movie_id = $1',
                        values: [id]
                    }
                    // issue query (returns promise)
                pool.query(query).then(() => {
                    res.status(200).json({
                        "message": "Movie deleted"
                    });
                }).catch(error => {
                    // error accessing db
                    if (error) {
                        res.status(400).json({
                            "message": "Movie delete error occurred"
                        });
                        console.log(error.stack);
                        pool.end;
                    }
                });
            }).catch(() => {
                res.status(400).json({ "message": "show delete error" });
            });
        }).catch(() => {
            res.status(400).json({ "message": "ratings delete error" });
        });
    }).catch(() => {
        res.status(400).json({ "message": "there are future shows scheudled" });
    });
    pool.end;
});

router.get("/ratings", (req, res) => {

    // let id = req.params.id;
    const query = {
        text: `SELECT * from ratings`
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
        resultRows = results.rows;

        // no results
        if (resultRows.length < 1) {
            res.status(401).json({
                "message": "no results in rating table"
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
                "message": "rating table error occurred"
            });
            console.log(error.stack);

        }
    });
    pool.end;
});

router.get("/item/:id", (req, res) => {

    let id = req.params.id;
    const query = {
        text: 'SELECT * FROM movies WHERE movie_id = $1',
        values: [id]
    }

    // issue query (returns promise)
    pool.query(query).then(results => {
            resultRows = results.rows;

            // no results
            if (resultRows.length < 1) {
                res.status(401).json({
                    "message": "no results in movies table"
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
                    "message": "movies table error occurred"
                });
                console.log(error.stack);

            }
        });
    pool.end;
});

// function hasWatchedMovie(movie_id, user) {
//     return new Promise((resolve, reject) => {
//         let query = {
//             text: 'SELECT * from ticket WHERE movie_id = $1',
//             values: [movie_id]
//         };
//         console.log(query);
//         pool.query(query).then((response) => {
//             pool.end;
//             console.log(response);
//             resolve(movie_id);
//         }).catch(error => {
//             // error accessing db
//             console.log(error);
//             pool.end;
//             reject(false);
//         });
//     });
// }

function deleteRatings(movie_id) {
    return new Promise((resolve, reject) => {
        let query = {
            text: 'DELETE from ratings WHERE movie_id = $1',
            values: [movie_id]
        };
        console.log(query);
        pool.query(query).then((response) => {
            pool.end;
            console.log(response);
            resolve(movie_id);
        }).catch(error => {
            // error accessing db
            console.log(error);
            pool.end;
            reject(false);
        });
    });
}

function deleteShow(show_id) {
    return new Promise((resolve, reject) => {
        let query = {
            text: 'DELETE from show WHERE show_id = $1',
            values: [show_id]
        };
        pool.query(query).then(() => {
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

function deleteOlderShows(movie_id) {
    return new Promise((resolve, reject) => {
        var timeNow = Date.now();

        let query = {
            text: 'SELECT * from show WHERE movie_id = $1 AND display_timestamp < $2',
            values: [movie_id, timeNow]
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

function deleteShowsTickets(show_id) {
    return new Promise((resolve, reject) => {

        let query = {
            text: 'DELETE from tickets WHERE show_id = $1',
            values: [show_id]
        };
        pool.query(query).then(() => {
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

function checkForFutureShows(movie_id) {
    return new Promise((resolve, reject) => {
        var timeNow = Date.now();

        let query = {
            text: 'SELECT * from show WHERE movie_id = $1 AND display_timestamp > $2',
            values: [movie_id, timeNow]
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

module.exports = router;
