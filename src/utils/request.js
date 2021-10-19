import axios from "axios"

export function request(config) {
  const instance = axios.create({
    // baseURL:'http://localhost:5005',
    // baseURL:'http://localhost:3000',
    baseURL:'https://netease-music-api.fe-mm.com',
    timeout:5000
  })
  //得在这里设置
  instance.interceptors.request.use(config => {
    //config.headers.Authorization = sessionStorage.getItem('token')
    return config
  })
  return instance(config)
}
