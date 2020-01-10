const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog.js')
const {SuccessModel, ErrorModel} = require('../model/response-model.js')

// 登录验证函数

const loginCheck = request => {
  if(!request.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

const handleBlogRouter = (request, response) => {

  const method = request.method
  const id = request.query.id

  // 获取博客列表

  if (method === 'GET' && request.path === '/api/blog/list') {
    const author = request.query.author || ''
    const keyword = request.query.keyword || ''
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情

  if (method === 'GET' && request.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 新建博客

  if (method === 'POST' && request.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(request)
    if(loginCheckResult) {
      return loginCheckResult
    }

    request.body.author = request.session.username
    const result = newBlog(request.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新博客

  if (method === 'POST' && request.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(request)
    if(loginCheckResult) {
      return loginCheckResult
    }
    const result = updateBlog(id, request.body)
    return result.then(state => {
      return state ? new SuccessModel() : new ErrorModel('更新博客失败')
    })
  }

  // 删除博客

  if (method === 'POST' && request.path === '/api/blog/delete') {
    const loginCheckResult = loginCheck(request)
    if(loginCheckResult) {
      return loginCheckResult
    }
    const author = request.session.username
    const result = deleteBlog(id, author)
    return result.then(state => {
      return state ? new SuccessModel() : new ErrorModel('删除博客失败')
    })
  }
}

module.exports = handleBlogRouter