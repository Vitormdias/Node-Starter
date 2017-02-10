import mysql from 'mysql';

module.exports = app => {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password : "12345678",
        database: ""
    });

    connection.connect(function(err) {
        if (err)
            throw err
        console.log('You are now connected...')
    });

    return connection;
}
