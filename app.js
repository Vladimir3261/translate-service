'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const port = process.env.HTTP_PORT || 5000;

// Routes
const api = require('./routes/api');

// Application instance
const app = express();

// Settings
app.use(bodyParser.json()); // JSON parse body as default
app.use(bodyParser.urlencoded({extended: false}));

// Router
app.use('/api', api);

// Catch 404 error
app.use((req, res, next) => {
    let error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Final error handler
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({error: true, code: err.status, data: false, message: err.message});
});

// RUN server
http.createServer(app).listen(port, () => {
    console.log(`API server started on port: ${port}`)
}).on('error', e => {
    console.log(`HTTP server error: ${e.message}`);
});