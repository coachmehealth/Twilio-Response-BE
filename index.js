
const express = require('express');
require('dotenv').config();
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(process.env.PORT, () => {
  console.log('Express server listening on port 1337');
});
