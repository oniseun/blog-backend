
const blogService = require('../services/BlogService')
const { StatusCodes } = require('http-status-codes')

module.exports.getHealth =  (req, res) => {

  return res.status(StatusCodes.OK).json(blogService.getHeath())

}

module.exports.ping =  (req, res) => {

  return res.status(StatusCodes.OK).json(blogService.ping())

}

module.exports.getPosts = async (req, res) => {

  const { query } = req

  const response = await blogService.getPosts(query)
  
  const resCode = response.posts.length === 0 ? StatusCodes.NO_CONTENT : StatusCodes.OK

  return res.status(resCode).json(response)
}