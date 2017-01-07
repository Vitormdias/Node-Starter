import mysql from 'mysql';

function createDbConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password : "12345678",
        database: ""
    });
}

module.exports = app => {
    return createDbConnection;
}
