const mysql = require('mysql')
const {MYSQL_CONF} = require('../config/db.js')

const connection = mysql.createConnection(MYSQL_CONF)

connection.connect()

function execute(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = {
  execute
}