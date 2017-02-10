import mysql from 'mysql';

module.exports = app => {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password : "12345678",
        database: ""
    });

    return connection;
}
