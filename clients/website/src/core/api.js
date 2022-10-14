const srv = 'https://api.js13kgames.com/'

export default {
  get (u, headers) {
    return fetch(srv + u, {headers})
  },

  post (u, body, headers) {
    return fetch(srv + u, {
      method: 'post',
      body,
      headers
    })
  },

  delete (u) {
    return fetch(srv + u, {
      method: 'delete'
    })
  }
}