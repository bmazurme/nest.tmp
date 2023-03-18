import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const sendMail = (
  userEmail: string,
  token: string,
  login: string,
  type: number,
) => {
  const email = userEmail;
  const confirmationCode = token;

  const options: SMTPTransport.Options = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const mail = nodemailer.createTransport(options);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Please confirm your account',
    html: `
      <h2>Hello ${login}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=${process.env.HOST}/api/auth/confirm/${confirmationCode}> Click here </a>`,
  };

  const mailOptionsReset = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Please confirm your account',
    html: `
      <h2>Hello ${login}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=${process.env.HOST}/password/new/${confirmationCode}> Click here </a>`,
  };

  const message = type === 1 ? mailOptions : mailOptionsReset;

  mail.sendMail(message, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(0);
    }
    // eslint-disable-next-line no-useless-return
    return;
  });
};

export default sendMail;
