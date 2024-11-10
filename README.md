# Small URL

Small URL is a URL shortening service built with ReactJS, ExpressJS, and MongoDB. It allows users to shorten long URLs into custom short links, track visit data, and view analytics. This app supports Google OAuth for user authentication and is designed to handle URL redirection efficiently.

## Features

- **URL Shortening**: Shorten long URLs to a compact format.
- **Visit Tracking**: Track each visit, including IP address and device details.
- **User Authentication**: Log in with Google OAuth to manage your URLs.
- **Analytics**: See how many visits each shortened URL receives and device information of visitors.

## Tech Stack

- **Frontend**: ReactJS with React Router for smooth client-side routing.
- **Backend**: ExpressJS API server for URL shortening, redirection, and analytics.
- **Database**: MongoDB for storing URLs, users, and visit logs.

## Getting Started

### Prerequisites

- **MongoDB Instance**: Set up a MongoDB instance (recommended: MongoDB Atlas) and obtain a connection URI. MongoDB Atlas provides a free tier for personal projects.
- **Google OAuth Credentials**: Set up Google OAuth to enable user login. Follow the Google Developer Console instructions to obtain your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- **Vercel or Local Development**: Decide whether to run the app locally or deploy it on Vercel.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sathwikv2005/smallurl.git
   cd small-url
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root directory and add the following environment variables. This file should include your MongoDB connection URI and Google OAuth credentials:

   ```plaintext
   MONGODB_URI=<Your MongoDB connection URI>
   GOOGLE_CLIENT_ID=<Your Google OAuth client ID>
   GOOGLE_CLIENT_SECRET=<Your Google OAuth client secret>
   EXPRESS_SESSION_SECRET=<your-secret-key>
   ```

4. **Build and Serve the React App**: To build and serve the frontend:

   ```bash
   npm run build
   npm start
   ```

   The React app will be served at `http://localhost:9000` (or another port if configured).

## License

MIT
