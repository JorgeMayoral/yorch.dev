import axios from 'axios';

export default async function handler(req, res) {
  let code = 200;
  let responseMessage = 'El mensaje ha sido enviado 😄';

  try {
    if (req.method === 'POST') {
      const { contactName, email, subject, text } = req.body;
      const contactData = {
        contactName,
        contactEmail: email,
        subject,
        body: text,
      };
      const url = 'http://139.162.208.98:5001/bot/message';
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(url, contactData, config);

      const result = response.data;

      if (result.success) {
        res.status(code).json({ message: responseMessage, code });
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } else {
      res.status(400).json({ message: 'ERROR: wrong method' });
    }
  } catch (error) {
    console.error(error);
  }
}
