import axios from 'axios'
import Vue from 'vue';
import store from '@/store'
import route from "@/router"
import NProgress from 'nprogress' // progress bar
const token = localStorage.getItem("token");
import { Message } from 'element-ui';
const api = axios.create()
// api.defaults.baseURL = 'http://api.com'
// api.defaults.timeout = 5000
// api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// api.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

// 请求拦截
api.interceptors.request.use(function (config) {
  NProgress.start()

  // if (token && !axios.defaults.headers.common['token']) {
  //   config.headers.token = token;
  // }

  return config
}, function (error) {
 

  return Promise.reject(error)
})

// 添加响应拦截器
api.interceptors.response.use(function (response) {
  // Toast.clear();
 
  // 对响应数据做点什么
  // 加到时器主要是为了 展示Loading效果 项目中应去除
  
  // if(response.data.flag !== 0){
  //   return Toast(response.data.message)
  // }
  NProgress.done()
  if(response.status && response.status == 200){
    if(response.data && response.data.flag == 0){
      return Promise.resolve(response.data.results)
    }else if(response.data && response.data.flag == 100){
      route.push('/login')
      Message.error(response.data.message)
    }
    else{
      Message.error(response.data.message)
    }
  }else{
    Message.error(response.statusText || '服务器错误')
  }
  
}, function (error) {
  NProgress.done()
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})
export default api
