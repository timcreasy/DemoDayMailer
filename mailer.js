const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const credentials = require('./config').credentials;

// var transporter = nodemailer.createTransport(smtpTransport({
//     host: 'mail.timcreasy.com',
//     // port: 587,
//     auth: {
//         user: 'tim@timcreasy.com',
//         pass: '00MMWQ16OD'
//     },
// }));

var transporter = nodemailer.createTransport(
    smtpTransport(credentials)
);

// send mail
transporter.sendMail({
    from: 'tim@timcreasy.com',
    to: 'timcreasy@me.com',
    subject: 'hello world!',
    text: 'Sent from NODE'
}, function(error, response) {
   if (error) {
        console.log(error);
   } else {
        console.log('Message sent');
   }
});