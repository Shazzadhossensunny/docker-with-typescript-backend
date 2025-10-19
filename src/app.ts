/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from "express";
import {LogsRoutes} from "./app/src/modules/Logs/logs.routs";
import {errorlogger} from "./app/src/shared/logger";

const app: Application = express();
//app.use(express.static(path,join(__dirname, "../public"))

//parsers
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(
      `
      <html>
      <head>
        <title>Docker Logs Viewer</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Welcome to the Docker Logs Viewer Page!</h1>
        <p>Go to <a href="/logs/errors">Error Logs</a> or <a href="/logs/successes">Success Logs</a>.</p>
      </body>
    </html>
      `
  );
});

//throwing an error
app.get("/error", (req:Request, res:Response) => {
  throw new Error("This is a forced error");
});

//Logger Routes
app.use("/logs", LogsRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error(err);
    errorlogger.error(err);

    res.status(500).send(`
    <html>
      <head>
        <title>Error</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Something went wrong</h1>
        <p>${err.message}</p>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
});

// Not Found handler
app.use((req: Request, res: Response) => {
    res.status(404).send(`
    <html>
      <head>
        <title>Page Not Found</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
});

export default app;
