let priceList = require('./prices.json');
let cfg = require('./config.json')
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
    var timeNow = Date.now();
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
                return;
            }
        });
    pool.end;
});

router.get("/getall",(req, res) => { // add checkAdmin is temporary removed

    //SELECT * FROM movie
    //WHERE movie_id IN (SELECT movie_id FROM show WHERE time > 10)
    // const query = {
    //     text: `SELECT * from movies`
    // }
    var timeNow = Date.now();
    const query = {
        text: 'SELECT * FROM movies ORDER BY movie_ID DESC'
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
                return;
            }
        });
    pool.end;
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
    pool.query(query).then((err) => {
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
                return;
            }
        });
    pool.end;
});

router.delete("/:id",checkAdmin,(req,res)=>{
    let id = req.params.id;
    let query = {
        text: 'DELETE FROM seats WHERE threater_id = $1',
        values: [id]
}})

router.get("/ratings", (req, res) => {

    let id = req.params.id;
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

        })
        .catch(error => {
            // error accessing db
            if (error) {
                res.status(400).json({
                    "message": "rating table error occurred"
                });
                console.log(error.stack);
                return;
            }
        });
    pool.end;
});

module.exports = router;
