import http from '@/utils/http.js'

export default class ServiceApi {
  static getList (params:any) {
    return http({
      url: '/api/Customer/List',
      method: 'post',
      enctype: 'multipart/form-data',
      data: params
    })
  }
}