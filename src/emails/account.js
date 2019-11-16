const sgMail = require('@sendgrid/mail');
const sgApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sgApiKey);

const sendWelcomeEmail = (address, name) => {
  sgMail.send({
    to: address,
    from: 'august.nejudne@gmail.com',
    subject: 'Welcome to the task manager app!',
    text: `Hi, ${name}! Welcome to the task manager app!`,
  });
};

const sendCancelationEmail = (address, name) => {
  sgMail.send({
    to: address,
    from: 'august.nejudne@gmail.com',
    subject: `We are sorry to see you leave, ${name}.`,
    text: `Hi, ${name}! Is there anything we could have done to keep you on board? We would like to here feedback from you!`,
  });
};

module.exports = {sendWelcomeEmail, sendCancelationEmail};
