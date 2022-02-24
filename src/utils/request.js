import axios from "axios"

export function request(config) {
  const instance = axios.create({
    // baseURL:'http://localhost:5005',
    // baseURL:'http://localhost:3000',
    // baseURL:'https://netease-music-api.fe-mm.com',
    //20220224更新：新的api链接
    baseURL:'https://netease-cloud-music-api-chi-navy.vercel.app',
    timeout:5000
  })
  //得在这里设置
  instance.interceptors.request.use(config => {
    //config.headers.Authorization = sessionStorage.getItem('token')
    return config
  })
  return instance(config)
}
