const getList = (author, keyword) => {
  return [
    {
      id: 1,
      title: 'title A',
      content: 'Content A',
      createTime: 1577506256260,
      author: 'zs'
    },
    {
      id: 2,
      title: 'title B',
      content: 'Content B',
      createTime: 1577506256882,
      author: 'lz'
    }
  ]
}

const getDetail = (id) => {
  return {
      id: 1,
      title: 'title A',
      content: 'Content A',
      createTime: 1577506256260,
      author: 'zs'
  }
}

const newBlog = (blogData = {}) => {
  return {
    id: 3
  }
}

const updateBlog = (id, blogData = {}) => {
  return true
}

const deleteBlog = (id) => {
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}