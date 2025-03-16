# VidVault

VidVault is a web application that allows users to upload media files through a Lightning Web Component (https://lwc.dev) front end. File uploads are handled by an Express API and stored in a local PostgreSQL database. Sensitive configuration values (such as database credentials) are managed through environment variables.

## More Details


**File Upload:**
    
Upload Base64-encoded media files using a secure LWC file input.

**Express API:**

A custom API endpoint (/upload) is implemented with Express to handle file submissions and interact with the database.

**PostgreSQL Integration:**

Uploaded files (binary data in a bytea column) and related metadata (e.g. file name, file type) are stored in PostgreSQL.

**LWR & LWC Integration:**

The application uses LWR to serve the Lightning Web Components along with standard assets. The project leverages Lightning Base Components from npm for UI consistency.

    
## Environment Configuration:


Sensitive data such as database credentials are managed via a local .env file (which is gitignored) using the dotenv package.

**LWR and LWC Setup**

The LWR configuration is defined in lwr.config.json, specifying module directories and routes. For example, the default route ("/") serves the LWC application whose root component is specified in the config.

The front end is developed using Lightning Web Components. Components are built using modules from both your local src/modules directory and from the lightning-base-components npm package. This setup allows rapid development with standardized UI elements, leveraging LWC’s performance and scalability.

**Express API**

Endpoint:

The /upload endpoint accepts POST requests containing JSON data with file details (file name, file type, and Base64–encoded file data).
    
CORS:

The Express server uses the cors middleware to allow cross-origin requests for local development.

JSON Parsing:

The server is configured with express.json({ limit: "50mb" }) to handle large payloads. (For very large files, a streaming upload with different middleware might be considered.)

**Notes**

### This application is for personal use.
    
The project uses LWR to serve and route LWC components, which simplifies deployment and development.

All sensitive data (like database credentials) are managed securely via environment variables and are excluded from version control.
