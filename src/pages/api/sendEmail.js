const nodemailer = require('nodemailer');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  let code = 200;
  let responseMessage = 'El mensaje ha sido enviado 😄';

  try {
    if (req.method === 'POST') {
      const { contactName: name, email, subject, text } = req.body;
      const message = `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\nMensaje:\n${text}`;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'mayoralalvarezj@gmail.com',
        subject: subject,
        text: message,
      });
      console.log(info);
      res.status(code).json({ message: responseMessage, code });
    } else {
      res.status(400).json({ message: 'ERROR: wrong method' });
    }
  } catch (error) {
    console.error(error);
  }
}
