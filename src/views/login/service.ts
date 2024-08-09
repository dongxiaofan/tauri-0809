import http from '@/utils/http.js'

export default class ServiceApi {
  static getRSA (params:any) {
    return http({
      url: '/api/UserBack/GetRSA',
      method: 'get',
      enctype: 'multipart/form-data',
      params: params
    })
  }
}