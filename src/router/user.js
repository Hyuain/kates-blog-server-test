const {login} = require('../controller/user.js')
const {SuccessModel, ErrorModel} = require('../model/response-model.js')

const getCookieExpires = () => {
  const ddt = new Date()
  ddt.setTime(ddt.getTime() + (24 * 60 * 60 * 1000))
  console.log(ddt.toGMTString())
  return ddt.toGMTString()
}

const handleUserRouter = (request, response) => {
  const method = request.method

  if (method === 'GET' && request.path === '/api/user/login') {
    // const {username, password} = request.body
    const {username, password} = request.query
    const result = login(username, password)
    return result.then(data => {
      if (data) {
        response.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
  }

  if (method === 'GET' && request.path === '/api/user/login-test') {
    return request.cookie.username ? Promise.resolve(new SuccessModel({username: request.cookie.username})) : Promise.resolve(new ErrorModel())
  }
}


module.exports = handleUserRouter