const Joi = require('joi')
const enums = require('../../config/enums')
module.exports = {
    
    "query": Joi.object({
        tags: Joi.string().required().error(new Error(enums.TAG_REQUIRED)),
        sortBy: Joi.string().valid(...enums.SORTBY_FIELDS).error(new Error(enums.INVALID_SORTBY)),
        direction: Joi.string().valid(...enums.DIRECTION_FIELDS).error(new Error(enums.INVALID_DIRECTION)),
    })

}

