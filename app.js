const querystring = require('querystring')
const {get, set} = require('./src/db/redis.js')
const {access} = require('./src/utils/log.js')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

// 获取数据

// const SESSION_DATA ={}

const getCookieExpires = () => {
  const ddt = new Date()
  ddt.setTime(ddt.getTime() + (24 * 60 * 60 * 1000))
  return ddt.toGMTString()
}

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
  // 记录 access log

  access(`${request.method} -- ${request.url} -- ${request.headers['user-agent']} -- ${Date.now()}`)

  response.setHeader('Content-Type', 'application/json')

  // 解析 request 数据

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

  // 设置 session

  request.sessionId = request.cookie.sessionId
  let needSetCookie = false

  if (!request.sessionId) {
    needSetCookie = true
    request.sessionId = `${Date.now()}_${Math.random()}`
    set(request.sessionId, {})
  }

  get(request.sessionId).then(sessionData => {
    if (sessionData === null) {
      set(request.sessionId, {})
      request.session = {}
    } else {
      request.session = sessionData
    }

    // 处理路由

    return getPostData(request)
  })
    .then(postData => {
      request.body = postData
      const blogResult = handleBlogRouter(request, response)
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            response.setHeader('Set-Cookie', `sessionId=${request.sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
          response.end(
            JSON.stringify(blogData)
          )
        })
        return
      }

      const userResult = handleUserRouter(request, response)
      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            response.setHeader('Set-Cookie', `sessionId=${request.sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
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