import http from '@/utils/http.js'

export default class ServiceApi {
  // 获取消息列表
  static GetDataList (params:any) {
    return http({
      url: '/api/Affiche/GetDataList',
      method: 'post',
      data: params
    })
  }

  // 交易金额统计
  static GetTradingAmount (params:any) {
    return http({
      url: '/api/ClientScreen/GetTradingAmount',
      method: 'get',
      data: params
    })
  }

  // 业务数据
  static GetBusinessData (params:any) {
    return http({
      url: '/api/ClientScreen/GetBusinessData',
      method: 'get',
      data: params
    })
  }

  // 财务数据
  static GetFinancialData (params:any) {
    return http({
      url: '/api/ClientScreen/GetFinancialData',
      method: 'get',
      data: params
    })
  }

  // 交易金额/笔数(进30天)
  static GetTrading30 (params:any) {
    return http({
      url: '/api/ClientScreen/GetTrading30',
      method: 'get',
      data: params
    })
  }
  // 公告
  static GetLogger (params:any) {
    return http({
      url: '/api/WorkBench/GetLogger',
      method: 'post',
      data: params
    })
  }
  // 合同预警列表接口
  static GetContractWarningList (params:any) {
    return http({
      url: '/api/Client/GetContractWarningList',
      method: 'post',
      data: params
    })
  }

  // 合同预警列表接口
  static GetContractWarningExport (params:any) {
    return http({
      url: '/api/Client/GetContractWarningExport',
      method: 'post',
      data: params
    })
  }
}