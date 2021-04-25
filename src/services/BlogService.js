


const pjson = require('../../package.json')
const config = require('../config/config')
const PostsResponse = require('../models/PostsResponse')
const Post = require('../models/Post')
const PingResponse = require('../models/PingResponse')
const cacheService =  require('./CacheService')
const httpService = require('./HttpService')
const LOG_PREFIX = 'BlogService: '
const collection = 'posts' // postscollection


module.exports.getHeath = () => {
  const { name, description, version } = pjson;
  return { name, description, version, env: config.app.env, stats: cacheService.getStats(), keys: cacheService.keys()}
} 

module.exports.ping = () => {
 return new PingResponse((true))
} 

module.exports.getPosts = async ( query ) => {

  const { tags : tag, sortBy = "id", direction = "asc"} = query

  const cacheKey = `${collection}_${tag}`;
  let posts = []

  if (cacheService.has(cacheKey)) {
    console.log(`${LOG_PREFIX} fetching ${cacheKey} from cache`)
    posts =  cacheService.get(cacheKey)
  } else {
    console.log(`${LOG_PREFIX} ${cacheKey} not found in cache, fetching posts from server`)
    try {

      const remoteFetch = await httpService(config.app.blogEndpoint, {}, 'GET', null, { tag })
      if (remoteFetch.data && remoteFetch.data.posts && remoteFetch.data.posts.length > 0) {
        posts = remoteFetch.data.posts
        cacheService.set(`${cacheKey}`, posts)
        console.info(`${LOG_PREFIX} successfully cached ${posts.length} ${cacheKey} results`)
      }

    } catch (e) {
      console.error(`${LOG_PREFIX} error fetching ${cacheKey} from remote server `)
    }
  }

  return posts.length === 0 ? new PostsResponse([]) : new PostsResponse(posts.sort((x, y) => {
      const [sortX, sortY] = [String(x[sortBy]), String(y[sortBy])]
      return direction === 'desc' ? sortY.localeCompare(sortX) : sortX.localeCompare(sortY)
  }).map(postDetail => new Post(postDetail)))
   
}