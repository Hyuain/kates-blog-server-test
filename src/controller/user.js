const {execute} = require('../db/mysql.js')

const loginCheck = (username, password) => {
  const sql = `
    select username, nickname from users where username='${username}' and password='${password}';
  `
  return execute(sql).then(rows => {
    return rows[0]
  })
}

module.exports = {
  login: loginCheck
}