# Twilio-Response-BE

#### 1️⃣ Backend deployed at

heroku.com <br>
https://coach-me-backend.herokuapp.com/

---

### Backend framework

-   Node.js, Express, http, and cronjob gives us the flexibility and functionality needed to create a fully functional custom server that is tasked with intercepting incoming sms messages from coachme patients as well as dispatch scheduled messages from the https://coach-me-backend.herokuapp.com/ backend.
-   We are going to use http with express to create a listening server that can intercept incoming sms messages and a cron function that can pull data from the coachme backend endpoint /twilioRoute/getAllScheduledMessages every minute and send an sms messages according to their send time stamps.

## 2️⃣ Endpoints

| Method | Endpoint | Access Control | Description                         |
| ------ | -------- | -------------- | ----------------------------------- |
| POST   | `/sms`   |                | Intercepts all inbound sms messages |

POST `/sms` helper endpoint for the coachme backend:<br>

_Description_

Intercepts all inbound sms messages. Needed to circumvent twilio dashboard error where the message is received and is entered into the message history twilio function but is not handled in a way that the framework prefers. If disabled all inbound messages will still be received by the application and saved in message history.

## 2️⃣ CronJob function

_Description_

-   Pulls scheduled messages data from the /twilioRoute/getAllScheduledMessages endpoint every minute using node-cron (for timed execution of the function) and axios (for the url request to the coachme backend).
-   Messages are dispatched according to two possible formats:

_Example_: response (weekly)

```javascript
{
    "patientId": "recmLlbDsUaCMUFhf",
    "msg": "hello good morning!",
    "min": "09",
    "hour": "2",
    "ampm": "pm",
    "weekday": "Tuesday",
    "dom": "",
    "month": "",
    "year": "2019"
}
```

_Example_: response (monthly)

```javascript
{
    "patientId": "recmLlbDsUaCMUFhf",
    "msg": "hello good morning!",
    "min": "09",
    "hour": "2",
    "ampm": "pm",
    "weekday": "",
    "dom": "12",
    "month": "Nov",
    "year": "2019"
}
```

-   A message is scheduled to be sent monthly if the month field has a valid month abbreviation and a valid dom (day of the month) integer. While messages are scheduled to be sent weekly if the month field is left empty and the weekday field has a valid day string (example Monday, Tuesday, etc.). It's important to note that both weekly and monthly formats require min (minutes), hour, and ampm (before/after noon) have to be filled in with valid information for the scheduler to work as intended.
-   Message dispatch logic for weekly includes an if statement with an equality operator that checks whether the time information in the weekday, hour, min, and ampm fields are equal to the current pacific time as defined by the moment() function. moment() has been set to display time as `Tuesday,6:06pm`.
-   Message dispatch logic for monthly includes an if statement with an equality operator that checks whether the time information in the month, dom, year, hour, min, and ampm fields are equal to the current pacific time as defined by the moment() function. moment() has been set to display time as `11 13, 2019 4:05 PM`.
-   Intended inputs for min, hour, and ampm fields are `00 - 60`, `1 - 12`, and `am - pm` respectively.

_Bugs_

-   Currently the messages that are scheduled weekly are set to repeat while messages that are scheduled monthly only are dispatched once. Will need to create a new column in the scheduledMessages table that will say whether a message has been sent or should be sent. Will need to find a better way to dispatch scheduled messages.

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

-   PORT
-   JWT_SECRET (jsonwebtoken secret )
-   ACCOUNT_SID (Twilio account special id)
-   AUTH_TOKEN (Twilio account authentication token)
-   TWILIO_NUMBER (Twilio sender number)
-   SERVER_SECRET (Secret string. Used to authenticate /twilioRoute/getAllScheduledMessages get requests)

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Check first to see if your issue has already been reported.
-   Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
-   Create a live example of the problem.
-   Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.
-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
-   Ensure that your code conforms to our existing code conventions and test coverage.
-   Include the relevant issue number, if applicable.
-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](🚫link to your frontend readme here) for details on the fronend of our project.
🚫 Add DS iOS and/or Andriod links here if applicable.
