const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const prompt = require('prompt');
const fs = require('fs');

prompt.message = "";
prompt.start();

const properties = {
  properties: {
    emailListPath: {
      description: 'Enter name of email list file (in same directory)',
      message: 'File not found, try again!',
      conform(input) {
        const filePath = __dirname + '/' + input;
        try
        {
          return fs.statSync(filePath).isFile();
        }
        catch (err) 
        {
          return false;
        }
      }
    },
    messagePath: {
      description: 'Enter path to message format',
      message: 'File not found, try again!',
      conform(input) {
        const filePath = __dirname + '/' + input;
        try
        {
          return fs.statSync(filePath).isFile();
        }
        catch (err) 
        {
          return false;
        }
      }
    },
    fromName: {
      description: 'Senders name',
    },
    fromAddress: {
      description: 'Enter address to send email',
      pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/,
      message: 'Email is not valid, try again!'
    },
    password: {
      description: 'Enter email password',
      hidden: true
    },
    outgoingServer: {
      description: 'Enter email SMTP server'
    }
  }
}


prompt.get(properties, (err, result) => {

  const senderEmail = result.fromAddress;
  const senderName = result.fromName;
  const escapedEmail = result.fromAddress.replace('@', '%40');
  const password = result.password;
  const server = result.outgoingServer;

  const transporter = nodemailer.createTransport(
    smtpTransport(`smtps://${escapedEmail}:${password}@${server}`)
  );

  fs.readFile(`./${result.messagePath}`, 'utf8', (err, msg) => {

    if (err) throw err;

    fs.readFile(`./${result.emailListPath}`, 'utf8', (err, data) => {

      if (err) throw err;
      const students = JSON.parse(data);

      students.forEach(student => {

        const name = student.name.split(" ")[0];
        const registrationLink = 'https://demodaydashboard.herokuapp.com/register/' + student.beacon;
        const message = msg.replace('NAME', name).replace('REGISTRATIONLINK', registrationLink);
        const sender = `"${senderName}" <${senderEmail}>`

        transporter.sendMail({
          from: sender,
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

      });

    });

  });

});