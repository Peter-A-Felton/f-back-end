const mongoose = require('mongoose');

// mongoDB definition
const mongoDB = 'mongodb+srv://myMongoDB:myMongoDB2@cluster0.dcrdr.mongodb.net/BooksDatabase?retryWrites=true&w=majority';

// Connect to mongoDB
mongoose
    .connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('DB Connected!');
    })
    .catch(error => {
        console.log('Connection Error: ${err.message}');
    });

const db = mongoose.connection;

// Bind the console to errors, to show them on console
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

module.exports = db;