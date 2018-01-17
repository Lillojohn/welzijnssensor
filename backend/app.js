const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonparser = bodyParser.json();
const nodemailer = require('./nodemailer.js');

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

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'sql.hosted.hr.nl',
    user: '0893202',
    password: '09d9ef6f',
    database: '0893202'
});

connection.connect();

const zorgdag = function (clientId, res) {
    client = clientId;
    connection.query("SELECT * FROM zorgdag WHERE client=? AND day=1", client, function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const usersGet = function (res) {
    connection.query('SELECT * FROM zorgusers', function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const userGet = function (clientId, res) {
    client = clientId;
    connection.query("SELECT * FROM zorgusers WHERE client_id = ?", client,function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const userPost = function (req, res) {
    let address = req.body.address;
    let name = req.body.name;

    connection.query('INSERT INTO zorgusers (name, address) VALUES (?, ?)', [name, address], function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const meldingen = function (res) {
    connection.query('SELECT * FROM zorg_meldingen_persoon \n' +
        'INNER JOIN zorgmeldingen ON zorg_meldingen_persoon.melding_id=zorgmeldingen.melding_id\n' +
        'INNER JOIN zorgusers ON zorg_meldingen_persoon.client_id=zorgusers.client_id;', function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};


const userMeldingen = function (clientId, res) {
    client = clientId;
    connection.query('SELECT * FROM zorg_meldingen_persoon INNER JOIN zorgmeldingen ON zorg_meldingen_persoon.melding_id=zorgmeldingen.melding_id WHERE client_id = ?', client, function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const activeiten = function (clientId, res) {
    client = clientId;
    connection.query('SELECT * FROM zorg_persoon WHERE client_id = ?', client, function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const checkMeldingen = function(){
    const users = alleClientenMetZorgdagen();
    getGemiddeldeToilet(users);
    // check12UurGeenWatergebruikMelding(users);
    check24UurGeenWatergebruikMelding(users);
};

const getGemiddeldeToilet = function(users){
    users.map(x => {
        connection.query('SELECT AVG(Water) as Water\n' +
            'FROM\n' +
            '(\n' +
            'SELECT day, COUNT(water) as Water\n' +
            'FROM `zorgdag`\n' +
            'WHERE client=? AND water > 7 AND water < 9\n' +
            'GROUP BY day\n' +
            ') Mytable', x, function (error, results, fields) {
            checkToiletMelding(x, results[0].Water);
        });
    });
};

const checkToiletMelding = function(user, waterGemiddelde){
    userDay = [33] //Mag NIet harcoded zijn!!!
    // connection.query('SELECT * FROM `zorgdag` WHERE client=? GROUP BY day ORDER BY day DESC LIMIT 1', user, function (error, results, fields) {
        // results.map(x => userDay.push(x));
    // });

    connection.query('SELECT COUNT(water) as TotalWater FROM `zorgdag` WHERE client=? AND day=? AND water > 7 AND water < 9', [user, userDay] , function (error, results, fields) {
        if(results[0].TotalWater === 1 || results[0].TotalWater === 2){
            InsertMelding(2,user);
        }
        if(waterGemiddelde * 1.33 > results[0].TotalWater &&  waterGemiddelde * 1.66 < results[0].TotalWater){
            InsertMelding(1,user);
        }
        if(waterGemiddelde * 1.66 > results[0].TotalWater){
            InsertMelding(6,user);
        }
        if(results[0].TotalWater === 0){
            InsertMelding(7,user);
        }
    });
};



const check5DagenGeenDoucheMelding = function(){
    users.map(x => {
        userDay = [33] //Mag NIet harcoded zijn!!!
        connection.query('SELECT *\n' +
            'FROM ( SELECT *\n' +
            '      FROM `zorgdag` \n' +
            '      WHERE client=?\n' +
            '      AND day > ? - 5\n' +
            '      AND water > 35\n' +
            ') as t1\n' +
            '\n' +
            'GROUP BY day', [x, userDay], function (error, results, fields) {
            InsertMelding(4,x);
        });
    })
};

const check12UurGeenWatergebruikMelding = function(users){
    // users.map(x => {
    //     userDay = [33] //Mag NIet harcoded zijn!!!
    //     connection.query('SELECT * FROM `zorgdag` WHERE client=? GROUP BY day ORDER BY day DESC LIMIT 1', x, function (error, results, fields) {
    //         // results.map(x => userDay.push(x));
    //     });
    //
    //     connection.query('SELECT * FROM `zorgdag` WHERE client=? AND day=? AND time > `12:00`', [x, userDay] , function (error, results, fields) {
    //         console.log(results);
    //     });
    // })
};

const check24UurGeenWatergebruikMelding = function(user){
    users.map(x => {
        userDay = [33] //Mag NIet harcoded zijn!!!
        connection.query('SELECT * FROM `zorgdag` WHERE client=? GROUP BY day ORDER BY day DESC LIMIT 1', x, function (error, results, fields) {
            // results.map(x => userDay.push(x));
        })

        connection.query('SELECT SUM(water) as TotalWater FROM `zorgdag` WHERE client=? AND day=?', [x, userDay] , function (error, results, fields) {
            if(results[0].TotalWater === 0){
                InsertMelding(5,x);
            }
        });
    })
};

const InsertMelding = function(melding, user){
    connection.query('INSERT INTO zorg_meldingen_persoon (melding_id, client_id, date, time, status) VALUES (?, ?, CURDATE(), "11:00", 0)', [melding, user], function (error, results, fields) {

    });
};

const alleClientenMetZorgdagen = function(){
    users = [1,2,3,4]; //MAG NIET HARDCODED zijn!!!!
    connection.query('SELECT * FROM `zorgdag` GROUP BY Client', function (error, results, fields) {
        if (error) throw error;
        results.map(x => users.push(x.client));
    });
    return users;
};

const changeStatusMelding = function(id, res){
    connection.query('UPDATE zorg_meldingen_persoon SET status = 1 WHERE melding_persoon_id = ?', id, function (error, results, fields) {
        if (error) throw error;
        res.send({"status": 200, "error": null, "response": results});
    });
};

const changeInstellingen = function(req, res){
    client = req.body.id;
    wc = req.body.wc;
    douche = req.body.douche;


    if(
        Number.isInteger(wc) &&
        Number.isInteger(douche)
    ){
        connection.query('UPDATE zorg_persoon SET wc = ?, douche = ? WHERE client_id = ?',[wc, douche, client], function (error, results, fields) {
            if (error) throw error;
            res.send({"status": 200, "error": null, "response": results});
        });
    } else if (
        Number.isInteger(wc)
    ){
        connection.query('UPDATE zorg_persoon SET wc = ? WHERE client_id = ?',[wc, client], function (error, results, fields) {
            if (error) throw error;
            res.send({"status": 200, "error": null, "response": results});
        });

    } else if (
        Number.isInteger(douche)
    ){
        connection.query('UPDATE zorg_persoon SET douche = ? WHERE client_id = ?',[douche, client], function (error, results, fields) {
            if (error) throw error;
            res.send({"status": 200, "error": null, "response": results});
        });
    }
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
    nodemailer.SendMail();
});

app.get('/user/:id', function (req, res) {
    userGet(req.params.id ,res);
});

app.post('/user', jsonparser, function (req, res) {
    userPost(req, res);
});

app.get('/zorgdag/:id', function (req, res) {
    zorgdag(req.params.id, res);
});

app.get('/checkmeldingen', function (req, res) {
    checkMeldingen();
});

app.post('/changestatus/:id', function(req, res){
    // changeStatusMelding(req.params.id, res);
});

app.post('/changeinstellingen', jsonparser, function(req, res){
    changeInstellingen(req, res);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

