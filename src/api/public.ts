import http from '@/utils/http.js'

export default class PublicApi {
  static getEnum (data:any) {
    return http({
      url: '/api/Enum/Enum?groupName=' + data.groupName,
      method: 'get',
      enctype: 'multipart/form-data',
      data: data
    })
  }

  // 获取下拉
  static GetDictionaryTypeItem_typeCode (params:any) {
    return http({
      url: '/api/DictionaryTypeItem/GetDictionaryTypeItem_typeCode',
      method: 'post',
      enctype: 'multipart/form-data',
      data: params
    })
  }

  // 获取园区列表
  static GetSysUserPayRegionDropList (params:any) {
    return http({
      url: '/api/PayRegion/GetSysUserPayRegionDropList',
      method: 'post',
      enctype: 'multipart/form-data',
      data: params
    })
  }

  // 获取省市区
  static GetProvince (params?:any) {
    return http({
      url: '/api/Region/GetRegionTree',
      method: 'post',
      data: params
    })
  }

  // 获取所有客户
  static GetClient_Name (params:any) {
    return http({
      url: '/api/Client/GetClient_Name',
      method: 'post',
      data: params
    })
  }

  // 获取适应税目
  static GetDDL (params:any) {
    return http({
      url: '/api/TaxName/GetDDL',
      method: 'get',
      data: params
    })
  }

  // 上传文件/图片
  static UploadFile (params:any) {
    return http({
      url: '/api/Client/UploadFile',
      method: 'post',
      data: params
    })
  }

  // 上传文件/图片
  static async Invoice_UploadFile (params:any) {
    return http('/api/Invoice/UploadFile', {
      method: 'post',
      data: params
    })
  }

  // 所有销售负责人
  static GetStaffListAll (params:any) {
    return http({
      url: '/api/Staff/GetStaffListAll',
      method: 'post',
      data: params
    })
  }

  // 获取渠道商列表
  static GetDistributorsListAll (params:any) {
    return http({
      url: '/api/Distributors/GetDistributorsListAll',
      method: 'get',
      data: params
    })
  }

  // 公告-查询是否显示
  static GetUserBulletin (params:any) {
    return http({
      url: '/api/Bulletin/GetUserBulletin',
      method: 'post',
      data: params
    })
  }

  // 公告-根据ID获取信息
  static GetBulletin (params:any) {
    return http({
      url: '/api/Bulletin/GetBulletin',
      method: 'post',
      data: params
    })
  }

  // 公告-不再弹出
  static SaveBulletinDetail (params:any) {
    return http({
      url: '/api/Bulletin/SaveBulletinDetail',
      method: 'post',
      data: params
    })
  }

  // 发票开票号码检索
  static GetInvoiceNoSearch(params: any) {
    return http({
      url: '/api/InvoiceExtend/GetInvoiceNoSearch',
      method: 'post',
      data: params,
    });
  }

  // 获取网商银行信息
  static GetMyBank(params: any) {
    return http({
      url: '/api/Client/GetMyBank',
      method: 'post',
      data: params,
    });
  }
}