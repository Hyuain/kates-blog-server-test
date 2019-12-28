const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

const getPostData = (request) => {
  return new Promise((resolve, reject) => {
    if (request.method !== 'POST') {
      resolve({})
      return
    }
    if (request.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    request.on('data', chunk => {
      postData += chunk.toString()
    })
    request.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
}

const serverHandel = (request, response) => {
  response.setHeader('Content-Type', 'application/json')

  const url = request.url
  request.path = url.split('?')[0]

  request.query = querystring.parse(url.split('?')[1])

  getPostData(request).then(postData => {
    request.body = postData
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
  })


}

module.exports = serverHandel