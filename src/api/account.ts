import http from '@/utils/http.js'

export default class AccountApi {
  static login (params:any) {
    return http({
      url: '/api/UserBack/Login',
      method: 'post',
      enctype: 'multipart/form-data',
      data: params
    })
  }

  static UpUserPwd (params:any) {
    return http({
      url: '/api/UserBack/UpUserPwd',
      method: 'post',
      data: params
    })
  }
}