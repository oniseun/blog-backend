const axios = require('axios')

module.exports = async (url, auth, method, data, params = {}, headers = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      params,
      headers,
      auth
    })
    return response
  } catch (response) {
    const replacer = (key, value) => {
      const replace = ['auth', 'Authorization']
      return replace.includes(key) ? '*************' : value
    }
    console.error(`Fetch Error: => ${method}:${url} => ${response.message || JSON.stringify(response, replacer) }`)
    const errResponse = response.message ? { error: response.message } : { error: JSON.stringify(response, replacer) }
    throw errResponse
  }
}