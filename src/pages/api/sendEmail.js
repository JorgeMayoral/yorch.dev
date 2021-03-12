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

  console.log('Peticion recivida'); // TODO: DELETE

  if (req.method === 'POST') {
    const { contactName: name, email, subject, text } = req.body;
    const message = `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\nMensaje:\n${text}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Transporter creado'); // TODO: DELETE

    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: 'mayoralalvarezj@gmail.com',
        subject: subject,
        text: message,
      },
      (err, info) => {
        console.log(info);
        if (err) {
          console.log(err);
          code = 503;
          responseMessage =
            'El mensaje no se pudo enviar 🙁, intentalo de nuevo más tarde.';
        }
      },
    );
    res.status(code).json({ message: responseMessage, code });
  } else {
    res.status(400).json({ message: 'ERROR: wrong method' });
  }
}
