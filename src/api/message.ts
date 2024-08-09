import http from '@/utils/http.js'

export default class MessageApi {
  // 消息提醒 未读条数
  static GetDataListTotal (params:any) {
    return http({
      url: '/api/SystemMessage/GetDataListTotal',
      method: 'post',
      data: params
    })
  }

  // 消息提醒 
  static TipGetDataList (params:any) {
    return http({
      url: '/api/SystemMessage/GetDataList',
      method: 'post',
      data: params
    })
  }
  
  // 标记已读
  static UpStates (params:any) {
    return http({
      url: '/api/SystemMessage/UpStates',
      method: 'post',
      data: params
    })
  }
}