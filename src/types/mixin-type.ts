// 批量导入弹窗对象约束
export interface MixinImportType {
  actionUrl: string,
  templateDownLoadUrl: string,
  actionBodyParams: object
}

// 搜索表单配置对象约束
export interface MixinFormItemType {
  type: string,
  label: string,
  bind: string, // 绑定字段
  optionListName?: string, // 下拉数据名称（根据此名称，去optionListDown查找对应的下拉数组）
  optionListSource?: string, // 下拉数据来源：数据字典
  optionTransform?: object, // 下拉数据转换
  selectData?: object, // 下拉数据配置：url/method
  hasMustParam?: boolean, // 是否含有必传参数
  hasDefaultParam?: boolean, // 是否含有默认传参
  defaultParamsData?: object, // 默认传参对象
  hasDefaultVal?: boolean, // 是否含有默认值
  defaultVal?: string, // 默认值
  resetIsClearDefaultVal?: boolean, // 重置时是否清除默认值
}