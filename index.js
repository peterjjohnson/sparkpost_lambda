// 'settings' contains things we want to keep out of source control
// i.e. API keys and e-mail addresses
var Settings  = require('settings');

// We're using SparkPost to handling sending the e-mail
var SparkPost = require('sparkpost');

var config = new Settings();
var sparky = new SparkPost(config.SparkPostAPIKey);

/**
 * Validate the POST data and return any errors.
 * Both fields are required so we'll make sure they're both filled in.
 *
 * @param event - HTTP event object
 *
 * @returns {Array}
 */
function validateData(event) {
    var error = [];

    if (!event.email) {
        error.push('Missing email');
    }
    
    // It could also be worth validating the e-mail address in here

    if (!event.message) {
        error.push('Missing message');
    }

    return error;
}

/**
 * This handler function takes data posted from an HTML contact form
 * and sends an e-mail using the SparkPost API
 *
 * @param event   - HTTP event object (POST, in this case). The POST data must contain an 'email' and 'message'
 * @param context - Lambda context object
 */
exports.handler = function(event, context) {

    // Validate the POST data
    var error = validateData(event);

    // If we have validation errors respond with an error message
    if (error.length) {
        var response = 'Validation Error:';
        for (var i in error) {
            response += "\n" + error[i];
        }
        context.fail(response);
    }

    sparky.transmissions.send({
        transmissionBody: {
            content: {
                from:    config.Sender,
                subject: 'Contact Form Submission',
                html:    '<html><p><strong>Contact From:</strong> ' + decodeURIComponent(event.email) + '</p><p><strong>Message:</strong><br>'
                         + decodeURIComponent(event.message) + '</p></html>'
            },
            recipients: [
                { address: config.Recipient }
            ]
        }
    }, function(err, result) {
        // Set the response body
        if (err) {
            context.fail('Unable to send e-mail');
        } else {
            context.succeed('E-mail sent');
        }
    });
};