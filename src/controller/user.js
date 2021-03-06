const {execute, escape} = require('../db/mysql.js')
const {genPassword} = require('../utils/cryp.js')

const loginCheck = (username, password) => {

  password = genPassword(password)

  username = escape(username)
  password = escape(password)

  const sql = `
    select username, nickname from users where username=${username} and password=${password};
  `
  return execute(sql).then(rows => {
    return rows[0]
  })
}

module.exports = {
  login: loginCheck
}