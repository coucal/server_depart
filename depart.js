// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/depart'); // connect to our database

var Record = require('./app/models/canton');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 80; // set our port
var ip = "94.23.176.119"

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'API Resultat Départementales 2015'
    });
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/canton/')


// get all the bears (accessed at GET http://localhost:8080/api/bears)
.get(function(req, res) {
    Record.find(function(err, records) {
        if (err)
            res.send(err);
        res.json(records);
    });
});
// on routes that end in /bears/:bear_id
// ----------------------------------------------------

router.route('/cantons/:coddpt')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
.get(function(req, res, next) {
    Record.aggregate([{
        $match: {
            coddpt: Number(req.params.coddpt)
        }
    }, {
        $group: {
            _id: {
                libcan: "$libcan",
                codcan: "$codcan"
            }
        }
    }, {
        $project: {
            libelle: "$_id.libcan",
            code: "$_id.codcan",
            _id: 0
        }
    }], function(err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
});

router.route('/resultats/:tour/:coddpt/:canton_id')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)

.get(function(req, res) {
    Record.aggregate([{
            $match: {
                codcan: Number(req.params.canton_id),
                numtour: Number(req.params.tour),
                coddpt: Number(req.params.coddpt)
            }
        }, {
            $group: {
                _id: {
                    lib: "$liblisext",
                    part: "$codnua"
                },
                totalV: {
                    $sum: "$nbrvoix"
                },
                totalE: {
                    $sum: "$nbrexp"
                }
            }
        }, {
            $project: {
                liblisext: "$_id.lib",
                codnua: "$_id.part",
                nbrvoix: "$totalV",
                pourcent: {
                    $divide: ["$totalV", "$totalE"]
                },
                _id: 0
            }
        }],
        function(err, result) {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
});

router.route('/candidats/:tour/:coddpt/:canton_id')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)

.get(function(req, res) {
    Record.aggregate([{
            $match: {
                codcan: Number(req.params.canton_id),
                numtour: Number(req.params.tour),
                coddpt: Number(req.params.coddpt)
            }
        }, {
            $lookup: {
                from: "partis",
                localField: "codnua",
                foreignField: "codpol",
                as: "detpol"
            }
        }, {
            $group: {
                _id: {
                    lib: "$liblisext",
                    part: "$codnua",
                    detpol: "$detpol"
                }
            }
        }, {
            $project: {
                liblisext: "$_id.lib",
                codnua: "$_id.part",
                libpol: "$_id.detpol.libpol",
                _id: 0
            }
        }],
        function(err, result) {
            if (err) {
                res.send(err);
            }
            // lookup renvoie un tableau à uns seul élément :-)
            for (var i = 0; i < result.length; i++) {
                result[i].libpol = result[i].libpol[0];
            }
            res.json(result);
        });
});
router.route('/resultat/:tour/:coddpt/:codsubcom/:codburvot')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)

.get(function(req, res) {
    Record.aggregate([{
            $match: {
                codsubcom: Number(req.params.codsubcom),
                codburvot: Number(req.params.codburvot),
                numtour: Number(req.params.tour),
                coddpt: Number(req.params.coddpt)
            }
        }, {
            $group: {
                _id: {
                    lib: "$liblisext",
                    part: "$codnua"
                },
                totalV: {
                    $sum: "$nbrvoix"
                },
                totalE: {
                    $sum: "$nbrexp"
                }
            }
        }, {
            $project: {
                liblisext: "$_id.lib",
                codnua: "$_id.part",
                nbrvoix: "$totalV",
                pourcent: {
                    $divide: ["$totalV", "$totalE"]
                },
                _id: 0
            }
        }],
        function(err, result) {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
});


router.route('/burvot/:coddpt/:codcan')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)

.get(function(req, res) {
    Record.aggregate([{
            $match: {
                codcan: Number(req.params.canton_id),
                numtour: 1,
                coddpt: Number(req.params.coddpt),
                codcan: Number(req.params.codcan)
            }
        }, {
            $group: {
                _id: {
                    cod: "$codburvot",
                    com: "$libsubcom",
                    coc: "$codsubcom"
                }
            }
        }, {
            $project: {
                codburvot: "$_id.cod",
                libcom: "$_id.com",
                codcom: "$_id.coc",
                _id: 0
            }
        }

    ], function(err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
});

router.route('/burvot/:tour/:coddpt/:codcan')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)

.get(function(req, res) {
    Record.aggregate([{
            $match: {
                codcan: Number(req.params.canton_id),
                numtour: Number(req.params.tour),
                coddpt: Number(req.params.coddpt),
                codcan: Number(req.params.codcan)
            }
        }, {
            $group: {
                _id: "$codburvot",
            }
        }, {
            $project: {
                codburvot: "$_id",
                _id: 0
            }
        }

    ], function(err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/depart', router);

// START THE SERVER
// =============================================================================
app.listen(port, ip);
console.log('depart started on ' + ip + ":" + port);
