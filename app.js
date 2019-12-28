const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

const serverHandel = (request, response) => {
  response.setHeader('Content-Type', 'application/json')

  const url = request.url
  request.path = url.split('?')[0]

  request.query = querystring.parse(url.split('?')[1])

  const blogData = handleBlogRouter(request, response)
  if (blogData) {
    response.end(
      JSON.stringify(blogData)
    )
    return
  }

  const userData = handleUserRouter(request, response)
  if (userData) {
    response.end(
      JSON.stringify(userData)
    )
    return
  }
  response.writeHead(404, {'Content-Type': 'text/plain'})
  response.write('404 Not Found\n')
  response.end()
}

module.exports = serverHandel