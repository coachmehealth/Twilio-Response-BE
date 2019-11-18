const express = require('express');
require('dotenv').config();
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment-timezone');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const requestOptions = {
    headers: { accept: 'application/json' },
    Authorization: process.env.SERVER_SECRET
};

// sets cron server to check the scheduledMessages table through the
// /twilioRoute/getAllScheduledMessages endpoint.
// pulls data every minute.
cron.schedule(`*/1 * * * *`, function() {
    console.log('-----------------');
    console.log('A minute in cron land as passed!!!!');
    axios
        .get(
            `${process.env.BACKEND_URL}/twilioRoute/getAllScheduledMessages`,
            requestOptions
        )
        .then(results => {
            // Loops through all of the records in the scheduledMessages table.
            for (let i = 0; i < results.data.data.length; i++) {
                // Logic that tells the scheduler whether the message should be sent monthly
                // or weekly. Empty month string means that the message should be sent weekly.
                if (
                    results.data.data[i].month === '' &&
                    results.data.data[i].dom === ''
                ) {
                    // converts the values from the scheduledMessages table to Tuesday,6:06pm
                    // so that we can use moment to check if the message should be sent.
                    if (
                        `${results.data.data[i].weekday},${
                            results.data.data[i].hour
                        }:${results.data.data[i].min}${results.data.data[
                            i
                        ].ampm.toLowerCase()}` ===
                        moment()
                            .tz('America/Los_Angeles')
                            .format('dddd,h:mma')
                    ) {
                        // reformats the number in the airtable from (509) 760-9090 to
                        // 5097609090
                        const cleanedNumber = results.data.data[
                            i
                        ].userPhone.replace(
                            /(\d{3})(\d{3})(\d{4})/,
                            '($1) $2-$3'
                        );
                        client.messages
                            .create({
                                body: results.data.data[i].msg,
                                from: `${process.env.TWILIO_NUMBER}`,
                                to: `+1${cleanedNumber}`
                            })
                            .then(message =>
                                console.log(`message sent ${message.sid}.`)
                            )
                            .catch(err => console.log(error, err));
                    } else {
                        console.log(
                            'no messages scheduled at this time for daily'
                        );
                    }
                } else if (results.data.data[i].month === '') {
                    // Monthly messages logic.
                    if (
                        `${results.data.data[i].dom} ${
                            results.data.data[i].hour
                        }:${results.data.data[i].min}${results.data.data[
                            i
                        ].ampm.toLowerCase()}` ===
                        `${moment().format('DD')} ${moment().format('h:mma')}`
                    ) {
                        const cleanedNumber = results.data.data[
                            i
                        ].userPhone.replace(
                            /(\d{3})(\d{3})(\d{4})/,
                            '($1) $2-$3'
                        );
                        client.messages
                            .create({
                                body: results.data.data[i].msg,
                                from: `${process.env.TWILIO_NUMBER}`,
                                to: `+1${cleanedNumber}`
                            })
                            .then(message =>
                                console.log(`message sent ${message.sid}.`)
                            )
                            .catch(err => console.log(error, err));
                    } else {
                        console.log(
                            'no messages scheduled at this time for monthly'
                        );
                    }
                } else {
                    // logic for the messages that are scheduled to be sent monthly.
                    // converts the values from the scheduledMessages table into
                    // 11 13, 2019 4:05 PM so that we can use moment to check whether the
                    // message should be sent.
                    if (
                        `${results.data.data[i].month} ${
                            results.data.data[i].dom
                        }, ${results.data.data[i].year} ${
                            results.data.data[i].hour
                        }:${results.data.data[i].min} ${results.data.data[
                            i
                        ].ampm.toUpperCase()}` === moment().format('lll')
                    ) {
                        // reformats the number in the airtable from (509) 760-9090 to
                        // 5097609090
                        const cleanedNumber = results.data.data[
                            i
                        ].userPhone.replace(
                            /(\d{3})(\d{3})(\d{4})/,
                            '($1) $2-$3'
                        );
                        client.messages
                            .create({
                                body: results.data.data[i].msg,
                                from: `${process.env.TWILIO_NUMBER}`,
                                to: `+1${cleanedNumber}`
                            })
                            .then(message =>
                                console.log(`message sent ${message.sid}.`)
                            )
                            .catch(err => console.log(error, err));
                    } else {
                        console.log(
                            'no messages scheduled at this time for yearly'
                        );
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    // console.log('moment date of the month test', moment().format('DD'));
});

app.use(helmet());
app.use(express.json());
app.use(cors());

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    // twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Wake me up!!!' });
});

http.createServer(app).listen(process.env.PORT, () => {
    console.log('Express server listening on port 1337');
});

setInterval(function() {
    axios
        .get(`${process.env.CRON_URL}`)
        .then(results => {
            console.log('set Interval is working', results.data);
        })
        .catch(err => {
            console.log('set interval get request did not work', err);
        });
}, 100000);
