import axios from './../axios/axios-config'
// 图片验证码
export function verification (res) {
  console.log(res,"phonephone")
  return axios({
    url: '/api/v1/get/img/verification?phone='+ res.phone,
    method: 'GET',
    responseType:'blob'
  })
};
// 手机验证码
export function verificationCode (data) {
  return axios({
    url: '/api/v1/get/verification_code',
    method: 'post',
    data
  })
};
// 申请入驻
export function inspectVerificationCode (data) {
  return axios({
    url: '/api/v1/inspect/verification_code',
    method: 'post',
    data
  })
};
// 获取品牌信息
export function brandCategory () {
  return axios({
    url: '/api/v1/get/brand_and_category',
    method: 'GET',
  })
}
// 生成入驻信息
export function sellerInfo (data) {
  return axios({
    url: '/api/v1/generate/seller_info',
    method: 'post',
    data
  })
}
//获取七牛token
export function getQiNiuTokenForQuickEntrance (data) {
    return axios({
      url: '/api/v1/get/qiniu/token',
      method: 'POST',
      data,
    })
}