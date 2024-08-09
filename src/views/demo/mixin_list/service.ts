import http from '@/utils/http.js'

export default class ServiceApi {
  // 通过审核
  static Audit (params:any) {
    return http({
      url: '/api/VerifyKey/Audit',
      method: 'post',
      data: params
    })
  }

  // 获取详情
  static GetDetail (params:any) {
    return http({
      url: '/api/VerifyKey/GetDetail',
      method: 'post',
      data: params
    })
  }
}