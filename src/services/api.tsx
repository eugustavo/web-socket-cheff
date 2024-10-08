import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
  const apiKey = localStorage.getItem('@clippcardapiodigital:apiKey')

  if (apiKey) {
    config.headers['api-key'] = apiKey
    config.headers['Access-Control-Allow-Origin'] = '*'
  }

  return config
})
