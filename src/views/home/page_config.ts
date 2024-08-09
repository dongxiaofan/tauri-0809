import dayjs from 'dayjs';
import { h } from 'vue';
import {Tooltip} from "ant-design-vue";

const listThead = [
  {
    title: '客户名称',
    dataIndex: 'clientName',
    ellipsis: true,
    width: 160,
  },
  {
    title: '业务类型',
    dataIndex: 'clientBusinessName',
    width: 160,
  },
  {
    title: '销售负责人',
    dataIndex: 'businessNames',
    width: 160
  },
  {
    title: '业务负责人',
    dataIndex: 'salesManName',
    width: 160
  },
  {
    title: '签约起始日',
    dataIndex: 'termStartDate',
    width: 160
  },
  {
    title: '签约到期日',
    dataIndex: 'termEndDate',
    width: 160
  },
]

// 表格配置
export const tableConfig = {
  noSearchForm: true,
  initiNoQuery: true,
  isHideHeader: false,
  isCustomThead: false,
  isUsableThead: true,
  hasSelection: false,
  isKeepPageIndex: false,
  tableColumns: listThead,
  query: {
    url: '/api/Client/GetContractWarningList',
    method: 'post',
    params: [],
  },
  selectedKey: 'clientId',
  headTotals: [
    {name: '场景合计', key: 'total', unit: '个', value: 0},
  ],
  headButtons: [
    {
      name: '导出',
      type: 'default',
      fn: 'handleExport',
      hasAuthCode: false,
      authCode: '',
      isBatchAction: true,
      actionCode: 'export',
      actionConfig: {url: '/api/Client/GetContractWarningExport', method: 'post'},
      backUrlSource: 'data',
      actionParams: [{ valueSource: 'form_all' }],
    },
  ],
  rowButtons: []
}