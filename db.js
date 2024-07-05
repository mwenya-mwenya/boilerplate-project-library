let mongoose = require('mongoose');
require('dotenv').config();

const server = process.env.DB_SERVER; // REPLACE WITH YOUR DB SERVER
const database = process.env.DB_NAME; // REPLACE WITH YOUR DB NAME

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose
            .connect(server+database)
            .then(() => {
                console.log('Database connection successful');
                
            })
            .catch((err) => {
                console.log(err)
                console.error('Database connection error');
            });
    }
}

module.exports = new Database();