const {loginCheck} = require('../controller/user.js')
const {SuccessModel, ErrorModel} = require('../model/response-model.js')

const handleUserRouter = (request, response) => {
  const method = request.method

  if (method === 'POST' && request.path === '/api/user/login') {
    const {username, password} = request.body
    const result = loginCheck(username, password)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('登录失败')
    }
  }
}

module.exports = handleUserRouter