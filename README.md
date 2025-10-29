# Wedding Website

A beautiful, feature-rich, and device-friendly static wedding website.

## Highlights

-   **Responsive Design:** Fully responsive and works on all devices.
-   **RSVP Functionality:** Guests can RSVP, and the data is directly uploaded to a Google Sheet.
-   **Email Alerts:** Receive email alerts when someone RSVPs.
-   **Embedded Video:** Features a YouTube video of the city.
-   **Cost-Free:** Can be hosted for free on services like GitHub Pages, with Google Sheets for RSVP data storage.

## Getting Started

### Prerequisites

-   [Node.js and npm](https://nodejs.org/en/)

### Setup and Execution

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/smrusso/smrusso.github.io.git wedding-website
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd wedding-website
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Build the assets:**
    ```bash
    npm run build
    ```
    This command compiles Sass files to CSS and bundles/minifies JavaScript.
5.  **Run the website:**
    Open the `dist/index.html` file in your web browser to view the website.

## Customization

The website can be customized by modifying the following files:

-   `index.html`: To change content like names, dates, and venue information.
-   `sass/styles.scss`: To change the color scheme and fonts by overriding the SASS variables at the top of the file.
-   `js/scripts.js`: To modify the RSVP form submission logic and other dynamic behaviors.

The RSVP functionality requires setting up a Google Apps Script to handle form submissions to a Google Sheet. Instructions for this can be found in the project's documentation.
