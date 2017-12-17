'use strict';
const nodemailer = require('nodemailer');
var exports = module.exports = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

const mailOptions = {
    from: '', // sender address
    to: 'j.emanuels@outlook.com', // list of receivers
    subject: 'Melding', // Subject line
    html: '<p>Er is een melding!</p>'// plain text body
};

exports.SendMail = function(){
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err);
        else
            console.log(info);
    });
};

