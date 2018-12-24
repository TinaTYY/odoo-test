import axios from './axios-config'

// 登录接口
let login = function () {
  return axios({
    url: '/api/v1/sysadmin/login',
    method: 'POST',
  })
}
