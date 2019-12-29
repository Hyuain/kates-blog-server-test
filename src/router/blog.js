const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog.js')
const {SuccessModel, ErrorModel} = require('../model/response-model.js')

const handleBlogRouter = (request, response) => {


  const method = request.method
  const id = request.query.id

  if (method === 'GET' && request.path === '/api/blog/list') {
    const author = request.query.author || ''
    const keyword = request.query.keyword || ''
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }
  if (method === 'GET' && request.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }
  if (method === 'POST' && request.path === '/api/blog/new') {
    const author = 'zs' // 假数据
    request.body.author = author
    const result = newBlog(request.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }
  if (method === 'POST' && request.path === '/api/blog/update') {
    const result = updateBlog(id, request.body)
    return result.then(state => {
      return state ? new SuccessModel() : new ErrorModel('更新博客失败')
    })
  }
  if (method === 'POST' && request.path === '/api/blog/delete') {
    const author = 'lz2' // 假数据
    const result = deleteBlog(id, author)
    return result.then(state => {
      return state ? new SuccessModel() : new ErrorModel('删除博客失败')
    })
  }
}

module.exports = handleBlogRouter