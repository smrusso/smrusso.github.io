# Wedding Website

A beautiful, feature-rich, and device-friendly static wedding website.

## Highlights

- **Responsive Design:** Fully responsive and works on all devices.
- **RSVP Functionality:** Guests can RSVP, and the data is directly uploaded to a Google Sheet.
- **Email Alerts:** Receive email alerts when someone RSVPs.
- **Secure:** Sensitive data like the Google Apps Script URL and wedding list details are encrypted and decrypted at runtime.
- **Cost-Free:** Can be hosted for free on services like GitHub Pages, with Google Sheets for RSVP alerts and data storage.

## Getting Started

### Prerequisites

-   [Node.js and npm](https://nodejs.org/en/)

### Setup and Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/smrusso/smrusso.github.io.git wedding-website
   ```
2. **Navigate to the project directory:**
   ```bash
   cd wedding-website
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Build the assets:**
   ```bash
   npm run build
   ```
   This command compiles Sass files to CSS and bundles/minifies JavaScript.
5. **Run the website locally:**
   Open the `dist/index.html` file in your web browser to view the built website.

## Deployment

This project is configured for continuous deployment to GitHub Pages. The workflow, located in `.github/workflows/deploy.yml`, automatically builds and deploys the website whenever changes are pushed to the `main` branch.

After a successful deployment, the website will be available at the URL configured in your repository's Pages settings (e.g., `https://<your-username>.github.io/<your-repo-name>/`).

## RSVP Functionality Setup

The RSVP form relies on a Google Apps Script to process and store submissions in a Google Sheet. This setup is **mandatory** for the RSVP feature to work.

### 1. Google Apps Script Deployment
1.  **Create a Google Sheet**: This sheet will store your RSVP responses.
2.  **Open the Script Editor**: In your new sheet, navigate to `Extensions > Apps Script`.
3.  **Add the Script Code**: Copy the entire content of `rsvpHandler.gs` from this repository and paste it into the script editor, replacing any existing code.
4.  **Configure the `EVENT_TOKEN`**:
    *   In the Apps Script editor, go to `Project Settings` (the gear icon ⚙️).
    *   Under `Script Properties`, click `Edit script properties`.
    *   Add a new property with the name `EVENT_TOKEN`.
    *   For the value, create a long, random, and secret string. This token acts as a password to prevent unauthorized submissions.
    *   In `index.html`, find the `<input type="hidden" name="event" value="...">` tag and set its `value` attribute to the encrypted `EVENT_TOKEN` ciphertext generated in the next section.
5.  **Deploy the Script**:
    *   Click the `Deploy` button and select `New deployment`.
    *   For `Select type`, choose `Web app`.
    *   In the `Configuration` settings:
        *   Give it a description (e.g., "Wedding RSVP Handler").
        *   Set `Execute as` to `Me`.
        *   Set `Who has access` to `Anyone`. **This is important for the form to work.**
    *   Click `Deploy`.
    *   Authorize the script's permissions when prompted.
    *   After deployment, copy the **Script ID** provided. You will need it for the next step.

### 2. Encrypting Secrets
To keep your Script ID and other sensitive data secure, they are encrypted and decrypted at runtime.

1.  **Open the Encryptor**: Open the `encrypt.html` file in your web browser.
2.  **Generate a Master Secret**: Click "Generate New Secret" to create a 16-byte secret key. **Save this key somewhere safe**, as it's required for decryption.
3.  **Enter Your Data**:
    *   Paste the **Script ID** you copied from the Google Apps Script deployment.
    *   Enter the secret **`EVENT_TOKEN`** you created in the script properties.
    *   Fill in any other sensitive data, like the IBAN for the wedding list.
4.  **Encrypt and Update**:
    *   Click "Encrypt".
    *   The tool will generate several ciphertexts and IVs.
    *   Carefully copy each generated value into the corresponding `div` element at the bottom of `index.html`. 
    *   Update the `value` of the hidden `event` input field with the encrypted `event` ciphertext.

### 3. Viewing the Website with Decrypted Data

To see encrypted content (like the wedding list) and to enable the RSVP form, you must provide the master secret key to the website at runtime. The secret is passed via a URL query parameter named `s`.

Append `?s=<your-secret-key>` to the URL when opening the website.

**Example (Local):**
`file:///path/to/your/project/dist/index.html?s=YOUR_16_BYTE_SECRET_KEY_HERE`

**Example (Deployed):**
`https://<your-username>.github.io/<your-repo-name>/?s=YOUR_16_BYTE_SECRET_KEY_HERE`

**For Guests:**
Typically, you would generate a QR code containing this full URL and print it on your wedding invitations. When a guest scans the QR code, their browser opens the website with the secret key already in the URL, automatically decrypting the content for them.

## Customization

The website can be customized by modifying the following files:

- `index.html`: To change content like names, dates, and venue information, and to update the encrypted secrets.
- `js/scripts.js`: To modify the RSVP form submission logic and other dynamic behaviors.
- `sass/styles.scss`: To change the color scheme and fonts by overriding the SASS variables at the top of the file.

### Customizing the RSVP Handler (Optional)
You can further customize the Apps Script by setting these optional script properties:

-   `EMAIL_ADDRESSES`: A comma-separated list of emails to receive a notification when a new RSVP is submitted.
-   `EMAIL_SUBJECT`: The subject line for the notification email.
-   `NAMES_MAP`: A JSON object to map the form field names to the column headers in your Google Sheet (e.g., `{"name": "Guest Name", "response": "Attending"}`).
-   `SHEET_NAME`: The name of the sheet where responses should be saved (e.g., "RSVPs"). If not set, it defaults to the first sheet in the spreadsheet.

## Credits

 - [Original website](https://github.com/rampatra/wedding-website) by [Ram Patra](https://github.com/rampatra)
 - [Santo Stefano Rotondo al Celio](https://commons.wikimedia.org/wiki/File:Santo_Stefano_Rotondo_al_Celio_1.jpg) courtesy of [Andrea Bertozzi](https://commons.wikimedia.org/wiki/User:Lo_Scaligero), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
 - [Rome Skyline](https://www.flickr.com/photos/22746515@N02/8012016319) courtesy of [Bert Kaufmann](https://www.flickr.com/photos/22746515@N02), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/deed.it)
