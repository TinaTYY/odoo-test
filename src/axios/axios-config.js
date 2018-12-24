import axios from 'axios'
import VueCookies from 'vue-cookies'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  
  config.headers['XODOOERCODE'] = VueCookies.get('access_token');
  return config;
}, function (error) {
  // 对请求错误
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据
  return response;
}, function (error) {
  if(error.response.status == 400){
    // alert('您的权限不足,请联系管理员！');
    console.log('错误提示信息', error.response.status)
  }
  // 对响应错误
  return Promise.reject(error);
});

export default axios
