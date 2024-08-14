import http from '@/utils/http.js'

export default class AccountApi {
  static login (params:any) {
    return http({
      url: '/api/account/login',
      method: 'post',
      enctype: 'multipart/form-data',
      data: params
    })
  }
}