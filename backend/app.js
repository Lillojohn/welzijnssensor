var express = require('express');
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'sql.hosted.hr.nl',
    user: '0893202',
    password: '09d9ef6f',
    database: '0893202'
});

connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

var zorgdag = function (clientId, res) {
    client = clientId;
    connection.query("SELECT * FROM zorgdag WHERE client =  ?", client,function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
};

var usersGet = function (res) {
    connection.query('SELECT * FROM zorgusers', function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

var userGet = function (clientId, res) {
    client = clientId;
    connection.query("SELECT * FROM zorgusers WHERE client_id = ?", client,function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

var userPost = function (res) {
    connection.query('INSERT INTO zorgusers (name, address, postalcode, phonenumber) VALUES (?,?,?,?)', ['a','b','c','d'], function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

var meldingen = function (res) {
    connection.query('SELECT * FROM zorg_meldingen_persoon INNER JOIN zorgmeldingen ON zorg_meldingen_persoon.melding_id=zorgmeldingen.melding_id;', function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};


var userMeldingen = function (clientId, res) {
    client = clientId;
    connection.query('SELECT * FROM zorg_meldingen_persoon INNER JOIN zorgmeldingen ON zorg_meldingen_persoon.melding_id=zorgmeldingen.melding_id WHERE client_id = ?', client, function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

var activeiten = function (clientId, res) {
    client = clientId;
    connection.query('SELECT * FROM zorg_persoon WHERE client_id = ?', client, function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

app.get('/activeiten/:id', function (req, res) {
    activeiten(req.params.id, res);
});

app.get('/meldingen', function (req, res) {
    meldingen(res);
});

app.get('/meldingen/:id', function (req, res) {
    userMeldingen(req.params.id, res);
});

app.get('/users', function (req, res) {
    usersGet(res);
});

app.get('/user/:id', function (req, res) {
    userGet(req.params.id ,res);
});

app.post('/user', function (req, res) {
    userPost();
});

app.get('/zorgdag/:id', function (req, res) {
    zorgdag(req.params.id, res);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

