import http from '@/utils/http.js'

export default class ServiceApi {
  // 校验是否可以使用
  static GetUserStatus () {
    return http({
      url: '/api/UserBack/GetUserStatus',
      method: 'post',
      data: {},
    })
  }
}