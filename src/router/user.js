const {login} = require('../controller/user.js')
const {SuccessModel, ErrorModel} = require('../model/response-model.js')
const {set} = require('../db/redis.js')

const handleUserRouter = (request, response) => {
  const method = request.method

  if (method === 'POST' && request.path === '/api/user/login') {
    const {username, password} = request.body
    const result = login(username, password)
    return result.then(data => {
      if (data) {
        request.session.username = data.username
        request.session.nickname = data.nickname
        set(request.sessionId, request.session)
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
  }
}


module.exports = handleUserRouter