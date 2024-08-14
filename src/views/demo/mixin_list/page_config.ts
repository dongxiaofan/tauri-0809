import dayjs from 'dayjs'
import { h } from 'vue';
import {Tooltip} from "ant-design-vue";
const listThead = [
  {
    title: '客户名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '客户简称',
    dataIndex: 'simpleName',
  },
  {
    title: '合作类型',
    dataIndex: 'type',

  },
  {
    title: '绑定手机号',
    dataIndex: 'hrContactPhone',
  },
  {
    title: '操作',
    width: 180,
    align: 'center',
    dataIndex: 'action',
    slot: 'action',
    fixed: 'right'
  }
]

// 表格配置
export const tableConfig = {
  noSearchForm: false,
  isHideHeader: false,
  isCustomThead: false,
  isUsableThead: true,
  hasSelection: false,
  isKeepPageIndex: false,
  tableColumns: listThead,
  scroll: {x: 1000},
  query: {
    url: '/api/Customer/List',
    method: 'post',
    params: [
      { valueSource: 'default', dataTransform: [] }
    ],
  },
  selectedKey: 'id',
  headTotals: [{name: '合计', key: 'totalRows', unit: '条', value: 0}],
  headButtons: [],
  rowButtons: [
    {
      name: '审核',
      type: 'primary',
      fn: 'handleShenHe',
      hasAuthCode: false,
      authCode: 'sys_openAPI_audit',
      actionCode: 'modal',
      actionParams: [{
        valueSource: 'row',
        dataTransform: [{targetCode: 'parameter.id', sourceCode: 'id'}]
      }],
      hasDisabledStandard: true,
      isDisabledRule: {conditionSymbol:'eq', key: 'status', value: [1]}
    },
    {
      name: '详情',
      type: 'primary',
      fn: 'handleDetail',
      hasAuthCode: false,
      authCode: 'sys_openAPI_detail',
      actionCode: 'modal',
      actionParams: [{
        valueSource: 'row',
        dataTransform: [{targetCode: 'parameter.id', sourceCode: 'id'}]
      }],
      isNoRuleBtn: true,
    },
  ],
  headMoreButtonsClass: 'w180',
  rowMoreButtonsClass: 'w150',
}

// 搜索表单配置
export const searchFormConfig = {
  isSearchForm: true,
  lableWidth: 90,
  hasTreeSelectItem: false,
  formItem: [
    { type: 'input', label: '客户名称	',  bind: 'clientName' },
  ],
  rules: {},
  optionListDown: {},
  mapRule: [],
  hasIgnoreData: true,
  ignoreArr: []
}
