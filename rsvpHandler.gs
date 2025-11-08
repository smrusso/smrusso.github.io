/**
 * This in a Google Apps Script extension to process responses to the RSVP form.
 *
 * Use Script Properties to store configuration for better security and management.
 * @param {string} EVENT_TOKEN The secret token from your form's hidden 'event' field.
 * @param {string} EMAIL_ADDRESSES A comma-separated list of email addresses for notifications.
 * @param {string} EMAIL_SUBJECT Optional subject line for notification emails.
 * @param {object} NAMES_MAP JSON string mapping form field names to spreadsheet and email headers.
 * @param {string} SHEET_NAME The name of the sheet where responses are stored.
 */

const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const EMAIL_ADDRESSES = SCRIPT_PROPERTIES.getProperty('EMAIL_ADDRESSES');
const EMAIL_SUBJECT = SCRIPT_PROPERTIES.getProperty('EMAIL_SUBJECT');
const EVENT_TOKEN = SCRIPT_PROPERTIES.getProperty('EVENT_TOKEN');
const NAMES_MAP = JSON.parse(SCRIPT_PROPERTIES.getProperty('NAMES_MAP') || '{}');
const NAMES_MAP_REVERSE = Object.fromEntries(Object.entries(NAMES_MAP).map(([key, value]) => [value, key]));
const SHEET_NAME = SCRIPT_PROPERTIES.getProperty('SHEET_NAME');

/**
 * Sends a notification email with the RSVP details.
 * @param {object} formData The form data from the submission.
 * @param {array} headers The ordered list of headers to be used.
 */
function sendNotificationEmail(formData, headers) {
    if (! EMAIL_ADDRESSES) {
        return;
    }

    const htmlBody = headers.slice(1, -1).map(label => {  // First field is timestamp, last is comments
        const originalKey = NAMES_MAP_REVERSE[label] || label;
        const value = formData[originalKey] || '-';
        return `<h4 style="margin-bottom: 0">${label}</h4><div>${value}</div>`;
    }).join('');

    MailApp.sendEmail({
        to: EMAIL_ADDRESSES,
        subject: EMAIL_SUBJECT,
        htmlBody: htmlBody
    });
}

/**
 * Inserts form data into the spreadsheet.
 * @param {object} parameters The form data parameters.
 */
function recordData(parameters) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000); // Wait up to 30 seconds for other processes to finish.

    try {
        const doc = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = doc.getSheetByName(SHEET_NAME);
        if (!sheet) {
            sheet = doc.getSheets()[0];
        }
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const nextRow = sheet.getLastRow() + 1;

        const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Rome',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        const row = [dateFormatter.format(new Date())]; // Timestamp first

        for (let i = 1; i < headers.length; i++) {
            if (headers[i].length > 0) {
                const fieldName = NAMES_MAP_REVERSE[headers[i]] || headers[i];
                row.push(parameters[fieldName] || '');
            }
        }
        sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
        return headers;
    } finally {
        lock.releaseLock();
    }
}

/**
 * Main entry point for handling GET requests from the RSVP form.
 * @param {object} e The request to be handled.
 */
function doGet(e) {
    try {
        Logger.log(`Request received: ${JSON.stringify(e)}`);

        if (!EVENT_TOKEN) {
            throw new Error("EVENT_TOKEN script property is not defined.");
        }

        // Validate security token
        const queryParams = e.parameter;
        if (queryParams['event'] !== EVENT_TOKEN) {
            return ContentService.createTextOutput(JSON.stringify({
                result: 'error',
                header: 'Oh no!',
                message: 'Invia la risposta dal form sul sito.',
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Basic data validation
        if (!queryParams.name || !queryParams.response) {
            return ContentService.createTextOutput(JSON.stringify({
                result: 'error',
                header: 'Dati mancanti',
                message: 'Per favore, compila tutti i campi richiesti.',
            })).setMimeType(ContentService.MameType.JSON);
        }

        const headers = recordData(queryParams);
        sendNotificationEmail(queryParams, headers);

        return ContentService.createTextOutput(JSON.stringify({
            result: 'success',
            data: JSON.stringify(queryParams)
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log(`Error occurred: ${error.toString()}`);
        return ContentService.createTextOutput(JSON.stringify({
            result: 'error',
            header: 'Oh no!',
            message: 'Abbiamo avuto un problema, per favore riprova più tardi.',
        })).setMimeType(ContentService.MimeType.JSON);
    }
}
