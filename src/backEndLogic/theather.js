let priceList = require('./prices.json');
let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js')
const checkAuth = require('./check_auth');
const checkAdmin = require('./check_admin');

var format = require('pg-format');

router.post("/add", (req, res) => {

    console.log(req.body);
    let number_of_seats = req.body.columns * req.body.rows;
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
        text: 'INSERT INTO theater(theater_name, number_of_seats, seat_rows, seat_columns, screentype, soundtype) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [req.body.name,
            number_of_seats,
            req.body.rows,
            req.body.columns,
            req.body.screetype,
            req.body.soundtype,
        ]
    };

    // issue query (returns promise)
    pool.query(query).then((response) => {
        pool.end;
        //SELECT MAX(theater_id) FROM theater;
        // i = 1;
        // while (i <= number_of_seats) {
        //     seatRow = Math.ceil(i / req.body.columns);
        //     if (req.body.deluxe.includes(i)) {
        //         seatList.push({ "seat_row": seatRow, "seat_type": "deluxe", "threater_id": 1, "seat_number": i });
        //     } else if (req.body.disabled.includes(i)) {
        //         seatList.push({ "seat_row": seatRow, "seat_type": "disabled", "threater_id": 1, "seat_number": i });
        //     } else {
        //         seatList.push({ "seat_row": seatRow, "seat_type": "normal", "threater_id": 1, "seat_number": i });
        //     }
        //     i++;
        // }
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
                seatRow = Math.ceil(i / req.body.columns);
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
                pool.end;
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
                    pool.end;
                }
            });

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
});

module.exports = router;