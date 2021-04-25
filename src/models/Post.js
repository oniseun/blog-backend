module.exports = class Post {
 
    constructor(details) {
        const { id, author, authorId, likes, popularity, reads, tags } = details
        this.id = id
        this.author = author
        this.authorId = authorId
        this.likes = likes
        this.popularity = popularity
        this.reads = reads
        this.tags = tags
    }
} 