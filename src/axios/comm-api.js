import axios from '@/axios/axios-config'

// 退出登录接口
export function quitLogin () {
    return axios({
      url: '/api/v1/sysadmin/logout',
      method: 'POST'
    })
}

// 用户详情接口
export function userAdminDeta () {
    return axios({
      url: '/api/v1/sysadmin/detail',
      method: 'GET'
    })
}

// 登录接口
export function login () {
    return axios({
      url: '/api/v1/sysadmin/login',
      method: 'POST',
    })
}