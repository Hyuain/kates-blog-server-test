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
    const listData = getList(author, keyword)
    return new SuccessModel(listData)
  }
  if (method === 'GET' && request.path === '/api/blog/detail') {
    const data = getDetail(id)
    return new SuccessModel(data)

  }
  if (method === 'POST' && request.path === '/api/blog/new') {
    const data = newBlog(request.body)
    return new SuccessModel(data)
  }
  if (method === 'POST' && request.path === '/api/blog/update') {
    const result = updateBlog(id, request.body)
    if(result){
      return new SuccessModel()
    } else {
      return new ErrorModel('更新博客失败')
    }
  }
  if (method === 'POST' && request.path === '/api/blog/delete') {
    const result = deleteBlog(id)
    if(result){
      return new SuccessModel()
    } else {
      return new ErrorModel('删除博客失败')
    }
  }
}

module.exports = handleBlogRouter