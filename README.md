# coastaledgedelivery.cfd-

## Backend database connection

The backend sends database queries through the DBMS Gateway using the local
`diamond-sql` client. It does not create a direct MySQL connection.

1. Register this app's `SITE_ID` and MySQL connection settings in the DBMS
   Gateway, then generate a full API key for the project.
2. Copy `backend/.env.example` to `backend/.env.local` and set `SITE_ID`, the
   full `API_KEY`, and `DBMS_URL`. `.env.local` is ignored by Git and takes
   precedence over `.env`, so Gateway keys stay out of tracked files.
3. Start the backend from `backend/` with `npm start`.
4. Check `GET /health`; it calls the gateway status endpoint and returns
   `503` if the gateway cannot be reached.

The gateway client requires Node.js 18 or newer. The consuming app's environment
does not need MySQL host, port, database, user, or password variables.
