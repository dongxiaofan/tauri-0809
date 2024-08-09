import dayjs from 'dayjs';

export const listThead = [
  {
    title: '客户名称',
    dataIndex: 'clientName',
    ellipsis: true,
    width: 200
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'payTaxesCode',
    width: 200
  },
  {
    title: '企业上级',
    dataIndex: 'superiorName',
    width: 200
  },
  {
    title: '账号类型',
    dataIndex: 'accountTypeName',
    width: 96
  },
  {
    title: '开票归属',
    dataIndex: 'invoiceBelongingName',
    width: 96
  },
  {
    title: '所属行业',
    dataIndex: 'industryName',
    width: 96
  },
  {
    title: '业务类型',
    dataIndex: 'clientBusinessName',
    width: 96
  },
  {
    title: '所属园区',
    dataIndex: 'regionName',
    ellipsis: true,
    width: 200
  },
  {
    title: '成立时间',
    dataIndex: 'businessDate',
    customRender: ({text, record}) => {
      return text ? dayjs(text).format('YYYY-MM-DD') : ''
    },
    width: 96
  },
  {
    title: '销售负责人',
    dataIndex: 'salesName',
    width: 200
  },
  {
    title: '业务负责人',
    dataIndex: 'businessNames',
    width: 200
  },
  {
    title: '发布订单数量(个)',
    dataIndex: 'projectCount',
    width: 160
  },
  {
    title: '新建人',
    dataIndex: 'createUserName',
    width: 96
  }
]