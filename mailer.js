const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const credentials = require('./config').credentials;
const fs = require('fs');

const transporter = nodemailer.createTransport(
    smtpTransport(credentials)
);

fs.readFile('./maillist.json', 'utf8', (err, data) => {

  if (err) throw err;
  const students = JSON.parse(data);

  students.forEach(student => {

    const name = student.name.split(" ")[0];
    const registrationLink = 'http://localhost:3000/register/' + student.beacon;
    const message = `Hello ${name}!  Please register your beacon by visiting the following link and creating an account.  Your link is: ${registrationLink}`

    transporter.sendMail({
      from: 'tim@timcreasy.com',
      to: student.email,
      subject: 'Please register your beacon!',
      text: message
    }, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Message sent to ${student.name}`);
      }
      });

  })

});





