# AWS Lambda + SparkPost Contact Form Demo
This is a simple AWS Lambda function that will accept an email and message from a POST
request and then send an e-mail via SparkPost.

_Note: The SparkPost API key as well as the sender/recipient e-mail addresses are expected
to be stored in settings.js_

#### Example settings.js file
```javascript
var settings = function() {
    var self = this;

    self.SparkPostAPIKey = 'YOUR SPARKPOST API KEY';
    self.Sender          = 'no-reply@YOUR_DOMAIN.com';
    self.Recipient       = 'YOU@YOUR_DOMAIN.com';
};

module.exports = settings;

 ```