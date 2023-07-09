import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: "localhost",
    port: 2021,
    user: "root",
    password: "password",
    database: "bitespeed_test"
})

connection.connect((err) => {
    if (err) throw err
    console.info("Connected to MySQL server!")
})

export default connection