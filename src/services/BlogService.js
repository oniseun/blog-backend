


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

  const { tags , sortBy = "id", direction = "asc"} = query

  const cacheKey = `${collection}_${tags}`;
  let posts = []

  if (cacheService.has(cacheKey)) {
    console.log(`${LOG_PREFIX} fetching ${cacheKey} from cache`)
    posts =  cacheService.get(cacheKey)
  } else {
    console.log(`${LOG_PREFIX} ${cacheKey} not found in cache, fetching posts from server`)

    try {
      const promiseArr = tags.split(',').map( async tag => await httpService(config.app.blogEndpoint, {}, 'GET', null, { tag }))
      const remoteFetch = await Promise.all(promiseArr)
      const uniqueIds = {}
      const uniquePosts = remoteFetch.reduce((_posts, tagPosts) => {
        if(tagPosts.data && tagPosts.data.posts && tagPosts.data.posts.length > 0) {
          _posts.push(...tagPosts.data.posts)
        }
        return _posts
      } , []).reduce((uniquePosts, _post) => {
        if (uniqueIds[_post["id"]] === undefined) {
          uniqueIds[_post["id"]] = 1
          uniquePosts.push(_post)
        }
        return uniquePosts
      }, [])

      if (uniquePosts.length > 0) {
        posts = uniquePosts.sort((x, y) => direction === 'desc' ? +y[sortBy] - +x[sortBy]: +x[sortBy] - +y[sortBy])
        cacheService.set(`${cacheKey}`, posts)
        console.info(`${LOG_PREFIX} successfully cached ${posts.length} ${cacheKey} results`)
      }

    } catch (e) {
      console.error(`${LOG_PREFIX} error fetching ${cacheKey} from remote server `, e)
    }
  }

  return posts.length === 0 ? new PostsResponse([]) : new PostsResponse(posts.map(postDetail => new Post(postDetail)))
   
}