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

  request.cookie = {}
  const cookieStr = request.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    request.cookie[key] = arr[1].trim()
  })

  getPostData(request).then(postData => {
      request.body = postData
      const blogResult = handleBlogRouter(request, response)
      if (blogResult) {
        blogResult.then(blogData => {
          response.end(
            JSON.stringify(blogData)
          )
        })
        return
      }

      const userResult = handleUserRouter(request, response)
      if (userResult) {
        userResult.then(userData => {
          response.end(
            JSON.stringify(userData)
          )
        })
        return
      }

      response.writeHead(404, {'Content-Type': 'text/plain'})
      response.write('404 Not Found\n')
      response.end()
    }
  )
}

module.exports = serverHandel