const { getList } = require('../controller/blog.js')
const { SuccessModel, ErrorModel } = require('../model/response-model.js')

const handleBlogRouter = (request, response) => {
  const method = request.method

  if (method === 'GET' && request.path === '/api/blog/list') {
    const author = request.query.author || ''
    const keyword = request.query.keyword || ''
    const listData = getList(author, keyword)
    return new SuccessModel(listData)

  } else if (method === 'GET' && request.path === '/api/blog/detail') {
    return {
      msg: '这是获取博客详情的接口'
    }
  } else if (method === 'POST' && request.path === '/api/blog/new') {
    return {
      msg: '这是新建博客的接口'
    }
  } else if (method === 'POST' && request.path === '/api/blog/update') {
    return {
      msg: '这是更新博客的接口'
    }
  } else if (method === 'POST' && request.path === '/api/blog/delete') {
    return {
      msg: '这是删除博客的接口'
    }
  }
}

module.exports = handleBlogRouter