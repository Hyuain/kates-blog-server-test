const handleUserRouter = (request, response) => {
  const method = request.method

  if (method === 'POST' && request.path === '/api/blog/login') {
    return {
      msg: '这是登录的接口'
    }
  }
}

module.exports = handleUserRouter