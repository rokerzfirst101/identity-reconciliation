import mysql from 'mysql2';
import 'dotenv/config'

const connectionOptions: mysql.ConnectionOptions = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

const connection = mysql.createConnection(connectionOptions)

connection.connect((err) => {
    if (err) throw err
    console.info("Connected to MySQL server!")
})

export default connection