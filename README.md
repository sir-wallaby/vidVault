# VidVault

VidVault is a web application that allows users to upload media files through a Lightning Web Component (https://lwc.dev) front end. File uploads are handled by an Express API and stored in a local PostgreSQL database. Sensitive configuration values (such as database credentials) are managed through environment variables.

## More Details

**File Upload**: Upload Base64-encoded media files via LWC.
**Express API**: Custom API endpoint (/upload) handles file submissions.
**PostgreSQL Integration**: Stores file metadata and content.
**Environment Configuration**: Uses dotenv to load sensitive data from a local .env file.