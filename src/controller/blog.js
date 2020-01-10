const xss = require('xss')
const {execute,escape} = require('../db/mysql.js')

const getList = (author, keyword) => {
  let sql = `select id, title, content, createtime, author from blogs where 1=1 `
  if (author) {
    author = escape(author)
    sql += `and author=${author} `
  }
  if (keyword) {
    keyword = escape(keyword)
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  return execute(sql)
}

const getDetail = (id) => {
  id = escape(id)
  const sql = `select id, title, content, createtime, author from blogs where id=${id};`
  return execute(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  const title = escape(xss(blogData.title))
  const content = escape(xss(blogData.content))
  const createTime = Date.now()
  const author = escape(xss(blogData.author))
  const sql = `
    insert into blogs (title, content, createtime, author)
    values (${title}, ${content}, '${createTime}', ${author});
  `
  return execute(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  id = escape(id)
  const title = escape(blogData.title)
  const content = escape(blogData.content)
  const sql = `
    update blogs set title=${title}, content=${content} where id=${id};
  `
  return execute(sql).then(updateData => {
    return updateData.affectedRows > 0
  })
}

const deleteBlog = (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  return execute(sql).then(deleteData => {
    return deleteData.affectedRows > 0
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}