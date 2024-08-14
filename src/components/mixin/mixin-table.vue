<template>
  <div class="table-wrap">    
    <!-- 带有层级的header -->
    <div class="clearfix" v-if="props.tableConfig?.hasLevel && levelArr.length > 0">
      <a-button type="gray-ghost" class="pl-16 pr-16 mr-16" v-show="levelArr.length > 0" @click="goPrevLevel">返回上级</a-button>
      <div v-for="(level,index) of levelArr" class="display-inline-block line-h-32">
        <span v-show="index !== levelArr.length-1">
          <span class="font-weight font-15 text-info pointer" @click="goPrevLevel">{{ level[props.tableConfig?.levelRule.showTitle] }}</span>
          <i class="iconfont icon-jiantou text-gray-999 font-12 pl-6 pr-6"></i>
        </span>
        <span class="font-weight font-15" v-show="index >= levelArr.length-1">{{ level[props.tableConfig?.levelRule.showTitle] }}</span>
      </div>
    </div>

    <a-table
      :dataSource="dataSource.tableData"
      :columns="props.tableConfig?.isCustomThead ? customThead : setThead"
      :rowKey="props.tableConfig?.rowKeyIsIndex ? (record:any, index:number) => index + 1 : (record:any) => record[props.tableConfig?.selectedKey]"
      :row-selection="props.tableConfig?.hasSelection ? { fixed: true, selectedRowKeys: dataSource.selectedIdArr, onChange: handleOnChange, getCheckboxProps: (record: any)=>(props.tableConfig?.disabledSelectionRule ? {disabled: (props.tableConfig?.disabledSelectionRule.recordVal).includes(record[props.tableConfig?.disabledSelectionRule.recordKey])} : ()=>{}) } : null"
      size="small"
      :scroll="props.tableConfig?.scroll || {x: 1200}"
      :pagination="false"
      :customRow="(record:any) => {
        let className = ''
        props.tableConfig?.customRow?.map((_row:any) => {
          if (record[_row.rowKey] == _row.rowVal || (_row.valFromVariables && record[_row.rowKey] == props.variables?.[_row.variablesGetValKey])) {
            className =_row.className
          }
        })
        return {class: className}
      }"
      :rowExpandable="(record:any) => {return (record[props.tableConfig?.expandedRowRenderShowKey] && record[props.tableConfig?.expandedRowRenderShowKey].length) || props.tableConfig?.hasCustomerExpandedRowRender}"
      :showSorterTooltip="false"
      table-layout="fixed"
      :loading="props.tableConfig?.noLoading ? false : tableLoading"
      @change="tableOnChange"
    >
      <!-- 表格header -->
      <template #title>
        <!-- 主要header: 合计+操作按钮 -->
        <div class="clearfix table-title-wrap" v-if="!props.tableConfig?.isHideHeader">
          <div class="clearfix">
            <!-- 表头左边 -->
            <div class="table-title-left pull-left">
              <div class="display-inline-block" v-for="(ht, index) of props.tableConfig?.headTotals">
                <span v-if="ht.valueSource == 'variables'">
                  {{ht.name}}<span v-show="!ht.hideColon">：</span>
                  <span class="text-info pl-2 pr-2 font-weight break-word">{{props.variables?.[ht.key]}}</span>
                  {{ht.unit}}
                  <a-divider type="vertical" v-if="props.tableConfig?.headTotals.length > 1 && index != props.tableConfig?.headTotals.length - 1" />
                </span>
                <span v-else-if="ht.valueSource == 'fixedValue'">
                  {{ht.name}}<span v-show="!ht.hideColon">：</span>
                  <span class="text-info pl-2 pr-2 font-weight">{{ht.value}}</span>
                  {{ht.unit}}
                  <a-divider type="vertical" v-if="props.tableConfig?.headTotals.length > 1 && index != props.tableConfig?.headTotals.length - 1" />
                </span>
                <span v-else>
                  {{ht.name}}<span v-show="!ht.hideColon">：</span>
                  <span class="text-info pl-2 pr-2 font-weight">{{ht.value}}</span>
                  {{ht.unit}}
                  <a-divider type="vertical" v-if="props.tableConfig?.headTotals.length > 1 && index != props.tableConfig?.headTotals.length - 1" />
                </span>
              </div>
            </div>
            <!-- 表头右边 -->
            <div class="table-title-right pull-right">
              <!-- 列表头 固定显示在前面的3个按钮 -->
              <div class="display-inline-block" v-for="(btn, index) of setHeadButtons">
                <template v-if="props.tableConfig?.isShowAllHeadBtn ? true : (index <= 2 || (index <= 3 && setHeadButtons.length == 4))">
                  <Button
                    :type="btn.type || 'primary'"
                    @click="listenCall(btn)"
                    :disabled="(btn.isNeedSelectedRow && !(dataSource.selectedIdArr.length > 0)) || (btn.isNeedSearchFormVal && setSearchFormData[btn.searchFormKey] == null)"
                    class="ml-10"
                    :loading="btn.actionCode == 'export' ? exportLoading : false"
                  >{{btn.name}}</Button>
                </template>
                <!-- <Button
                  v-if="props.tableConfig?.isShowAllHeadBtn ? true : (index <= 2 || (index <= 3 && setHeadButtons.length == 4))"
                  :type="btn.type || 'primary'"
                  @click="listenCall(btn)"
                  :disabled="(btn.isNeedSelectedRow && !(dataSource.selectedIdArr.length > 0)) || (btn.isNeedSearchFormVal && setSearchFormData[btn.searchFormKey] == null)"
                  class="ml-10"
                >{{btn.name}}</Button> -->
              </div>
              <!-- 列表头 显示在更多里面的按钮 -->
              <div class="display-inline-block ml-10" v-if="!props.tableConfig?.isShowAllHeadBtn && setHeadButtons && setHeadButtons.length > 3  && setHeadButtons.length !== 4">
                <a-dropdown>
                  <ellipsis-outlined />
                  <template #overlay>
                    <a-menu>
                      <template v-for="(btn, index) of setHeadButtons" :key="index">
                        <a-menu-item v-if="index > 2">
                          <Button
                            type="link"
                            block
                            @click="listenCall(btn)"
                            :disabled="btn.isNeedSelectedRow && !(dataSource.selectedIdArr.length > 0)"
                          >{{btn.name}}</Button>
                        </a-menu-item>
                      </template>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <!-- 刷新图标 -->
              <template v-if="props.tableConfig?.isShowRefresh">
                <a-tooltip>
                  <template #title>刷新列表</template>
                  <RedoOutlined class="mixin-shuaxin" @click="queryTableData" />
                </a-tooltip>
              </template>
            </div>
          </div>
        </div>

        <!-- 次级header: 勾选后的数据汇总 -->
        <div class="clearfix table-subTitle-wrap" v-show="props.tableConfig?.selectedRowsTotals && dataSource.selectedIdArr.length > 0">
          <div class="display-inline-block" v-for="(srt, index) of props.tableConfig?.selectedRowsTotals">
            <template v-if="srt.fixedKey && srt.fixedKey == 'length'">
              {{srt.name}}
              <span class="text-info pl-2 pr-2 font-weight">{{dataSource.selectedIdArr.length}}</span>
              {{srt.unit}}
              <a-divider type="vertical" />
            </template>
            <template v-else>
              {{srt.name}}
              <span class="text-info pl-2 pr-2 font-weight">{{selectedRowsTotalsData[srt.key] || 0}}</span>
              {{srt.unit}}
              <a-divider type="vertical" v-if="props.tableConfig?.selectedRowsTotals.length > 1 && index != props.tableConfig?.selectedRowsTotals.length - 1" />
            </template>
          </div>
          <span class="pull-right pointer text-gray-999" @click="clearSelectedRows">取消全选</span>
        </div>
      </template>

      <!-- 表格body -->
      <template #bodyCell="{ column, record }">
        <!-- 有省略号的列 -->
        <template v-if="column.ellipsis">
          <a-tooltip placement="top" arrow-point-at-center>
            <template #title>{{record[column.dataIndex]}}</template>
            <span class="table-row-ellipsis-span">{{record[column.dataIndex]}}</span>
          </a-tooltip>
        </template>
        <!-- 有子集的操作 -->
        <template v-if="column.slot === 'level'">
          <a-tooltip>
            <template #title>{{record[column.dataIndex]}}</template>
            <span v-if="record[props.tableConfig?.levelRule.basisForKey]" class="max-w-100 ellipsis display-inline-block text-info text-tableRow-link" @click="handleGoSub(record)">{{record[column.dataIndex]}}</span>
            <span v-else class="max-w-100 ellipsis display-inline-block">{{record[column.dataIndex]}}</span>
          </a-tooltip>
        </template>
        <!-- 操作列 -->
        <template v-if="column.slot === 'action'">
          <!-- 列表行 固定显示在前面的2个按钮 -->
          <div class="display-inline-block" v-for="(btn, index) of setRowButtons">
            <Button
              v-if="(!btn.hasShowStandard || ((btn.hasShowStandard && ([btn.isShowRule?.['value']].indexOf(record[btn.isShowRule?.['key']]) != -1 || (btn.isNe && !([btn.isShowRule?.['value']].indexOf(record[btn.isShowRule?.['key']]) != -1)))))) && (index <= (1 + (props.tableConfig?.isShowFrontRowBtnNum||0)) || (index <= (2 + (props.tableConfig?.isShowFrontRowBtnNum||0)) && setRowButtons.length == 3))"
              type="link"
              size="small"
              @click="listenCall(btn, record)"
              :disabled="btn.hasDisabledStandard && ((btn.isDisabledRule.conditionSymbol == 'eq' && btn.isDisabledRule.value.indexOf(record[btn.isDisabledRule.key]) != -1) || (btn.isDisabledRule.conditionSymbol == 'ne' && btn.isDisabledRule.value.indexOf(record[btn.isDisabledRule.key]) == -1) || (btn.isDisabledRule.conditionSymbol == 'greater' && btn.isDisabledRule.value >= record[btn.isDisabledRule.key]))"
            >{{btn.name}}</Button>
          </div>
          <!-- 列表行 显示在更多里面的按钮 -->
          <div class="display-inline-block ml-10" v-if="setRowButtons && setRowButtons.length > 2 && setRowButtons.length !== 3 && setRowButtons.length - (props.tableConfig?.isShowFrontRowBtnNum||0) !== 2">
            <a-dropdown>
              <ellipsis-outlined />
              <template #overlay>
                <a-menu>
                  <template v-for="(btn, index) of setRowButtons" :key="index">
                    <a-menu-item v-if="(!btn.hasShowStandard || ((btn.hasShowStandard && ([btn.isShowRule?.['value']].indexOf(record[btn.isShowRule?.['key']]) != -1 || (btn.isNe && !([btn.isShowRule?.['value']].indexOf(record[btn.isShowRule?.['key']]) != -1)))))) && index > (1 + (props.tableConfig?.isShowFrontRowBtnNum||0))">
                      <Button
                        type="link"
                        block
                        @click="listenCall(btn, record)"
                        :disabled="btn.hasDisabledStandard && ((btn.isDisabledRule.conditionSymbol == 'eq' && btn.isDisabledRule.value.indexOf(record[btn.isDisabledRule.key]) != -1) || (btn.isDisabledRule.conditionSymbol == 'ne' && btn.isDisabledRule.value.indexOf(record[btn.isDisabledRule.key]) == -1) || (btn.isDisabledRule.conditionSymbol == 'greater' && btn.isDisabledRule.value >= record[btn.isDisabledRule.key]))"
                      >{{btn.name}}</Button>
                    </a-menu-item>
                  </template>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </template>

        <!-- 自定义操作列 -->
        <template  v-if="props.tableConfig?.hasCustomerAction && column.slot === 'customerAction'">
          <slot name="customerAction" :record="record"></slot>
        </template>
      </template>
      
      <!-- 展开部分 -->
      <template #expandedRowRender="{ record }" v-if="props.tableConfig?.hasExpandedRowRender">
        <component :is="expandedRowRenderComponent" :record="record" :dataKey="props.tableConfig?.expandedRowRenderShowKey" :columns="setExpandedThead" :expandedTableConfig="props.tableConfig?.expandedTableConfig" @listenActionCall="listenActionCall" />
      </template>

      <!-- 自定义展开部分 用于处理复杂的展开表格 -->
      <template #expandedRowRender="{ record }" v-if="props.tableConfig?.hasCustomerExpandedRowRender">
        <slot name="customerExpandedRowRender" :record="record"></slot>
      </template>
    </a-table>

    <a-pagination
      v-if="!props.tableConfig?.isHidePagination"
      v-model:current="dataSource.pageIndex"
      :total="dataSource.totalRows"
      :showSizeChanger="true"
      :pageSizeOptions="['10', '20', '50', '100', '200', '500', '1000']"
      :show-total="(total:any) => `总共 ${total} 条`"
      @change="handlePageChange">
      <template #itemRender="{ type, originalElement }">
        <component :is="originalElement"></component>
      </template>
      <template #buildOptionText="props">
        <span>{{ props.value }}条/页</span>
      </template>
    </a-pagination>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { message, Button, Modal, Tooltip } from "ant-design-vue";
import { EllipsisOutlined, RedoOutlined } from "@ant-design/icons-vue";
import { MixinCommon } from './mixin-common.js';
import http from '@/utils/http.js';
const VITE_CLIENT_CODE = import.meta.env.VITE_CLIENT_CODE;
const emit = defineEmits(["handleImport", "onPageFn", "emitOtherVals", "onWatchBtnFn", "setSearchFormEmpty", "setLevelInfo", "setPrevLevel"])
const baseUrl = import.meta.env.VITE_FILE_URL;
const route = useRoute()
const router = useRouter()
const { state } = useStore()
const props = defineProps({
  tableConfig: Object,
  optionListDown: {
    type: Object,
    default: () => ({}),
  },
  // variables: Object,
  variables: {
    type: Object,
    default: () => ({}),
  },
  // 计算后的表格样式值
  countTableVar: Object,
  // 自定义表头
  customThead: Array,
  // 部分自定义列表项
  partCustomColumns: Object,
})
let selectedRowsTotalsData = reactive({})

// 搜索表单
let setSearchFormData = reactive({} as any)
// 列表数据
let dataSource = reactive({
  tableData: [],
  totalRows: 0,
  pageIndex: 1,
  pageSize: 10,
  // 勾选的表格行数据
  selectedObjArr: [],
  selectedIdArr: [],
  // 是否第一次加载表格数据
  isFirstQueryTable: true,
  // 0升序/1降序
  sortBy: '',
  // 升降序字段
  orderBy: '',
})
let tableLoading = ref<boolean>(false);
let exportLoading = ref<boolean>(false);
// 当前点击的行数据
const parentRow:any = reactive<any>({})

// 有子级的情况下，保存层级相关的数组
let levelArr = reactive<any>([])
// 有子级的情况下，需要加在表格里获取列表数据的参数
let levelParam = reactive<any>({})

// 列表-表头
const setThead = computed(() => {
  if (props.tableConfig?.isUsableThead) {
    let columnList:any = props.tableConfig.tableColumns.filter((_i:any) => !_i.isHide);
    let columnList_key:any = columnList.map(_i => _i.dataIndex)
    let partCustomColumnsKey = props.tableConfig?.partCustomColumnsKey
    if (props.tableConfig?.hasPartCustomColumns) {
      props.tableConfig.tableColumns.map((columns:any, index:number) => {
        if (partCustomColumnsKey.indexOf(columns.dataIndex) > -1) {
          let partKey_index = columnList_key.indexOf(partCustomColumnsKey[partCustomColumnsKey.indexOf(columns.dataIndex)]);
          columnList[partKey_index] = props.partCustomColumns?.[columns.dataIndex]
        }
      })
    }
    return columnList
  } else {
    let isHideArr:any = []
    Object.keys(props.tableConfig?.tableColumns).forEach(key =>{
      if (props.tableConfig?.tableColumns[key].isHide) {
        isHideArr.push(key)
      }
    })
    let columnObj:any = {...props.tableConfig?.tableColumns}
    let partCustomColumnsKey = props.tableConfig?.partCustomColumnsKey
    if (props.tableConfig?.hasPartCustomColumns) {
      props.tableConfig?.thead.map((columnsKey:any, index:number) => {
        if (partCustomColumnsKey.indexOf(columnsKey) > -1) {
          columnObj[columnsKey] = props.partCustomColumns?.[columnsKey]
        }
      })
    }    
    let thead = props.tableConfig?.thead.filter((_i:any) => isHideArr.indexOf(_i) == -1)
    return MixinCommon.getTableColumns(thead, columnObj)
  }
})

// 展开子列表-表头
const setExpandedThead = computed(() => {
  if (props.tableConfig?.isUsableThead) {
    let columnList:any = [...props.tableConfig.expandedTableColumns]
    let partCustomColumnsKey = props.tableConfig?.partCustomColumnsKey
    if (props.tableConfig?.hasPartCustomColumns) {
      props.tableConfig.expandedTableColumns.map((columns:any, index:number) => {
        if (partCustomColumnsKey.indexOf(columns.dataIndex) > -1) {
          columnList[index] = props.partCustomColumns?.[columns.dataIndex]
        }
      })
    }
    return columnList
  } else {
    let columnObj:any = {...props.tableConfig?.expandedTableColumns}
    let partCustomColumnsKey = props.tableConfig?.partCustomColumnsKey
    if (props.tableConfig?.hasPartCustomColumns) {
      props.tableConfig?.expandedThead.map((columnsKey:any, index:number) => {
        if (partCustomColumnsKey.indexOf(columnsKey) > -1) {
          columnObj[columnsKey] = props.partCustomColumns?.[columnsKey]
        }
      })
    }
    return MixinCommon.getTableColumns(props.tableConfig?.expandedThead, columnObj)
  }
})

// 列表勾选参数(:row-selection="rowSelection")
// const rowSelection = ref({
//   selectedRowKeys: dataSource.selectedIdArr,
//   onChange: (selectedRowKeys: any, selectedRows: any) => {
//     handleOnChange(selectedRowKeys, selectedRows);
//   },
//   getCheckboxProps: (record: any) => (
//     props.tableConfig?.disabledSelectionRule 
//     ? {disabled: (props.tableConfig?.disabledSelectionRule.recordVal).includes(record[props.tableConfig?.disabledSelectionRule.recordKey])}
//     : ()=>{})
// })

// 权限码数组
const actionArr = computed(() => {return state.user.actionAccess})
// 列表-表头按钮
const setHeadButtons = computed(() => {
  let headButtons = []
  if (props.tableConfig?.headButtons && props.tableConfig?.headButtons.length) {
    for(var i = 0; i < props.tableConfig?.headButtons.length; i++) {
      let item = props.tableConfig?.headButtons[i]
      if (item.hasShowStandard) {
        if (item.isShowRule.ruleSource == 'variables' && item.isShowRule.value.indexOf(props.variables?.[item.isShowRule.key]) > -1) {
          headButtons.push(item)
        } else if (item.isShowRule.ruleSource == 'env' && item.isShowRule.value.indexOf(VITE_CLIENT_CODE) > -1) {
          headButtons.push(item)
        }
      } else if ((item.hasAuthCode && actionArr.value?.indexOf(item.authCode) !== -1) || !item.hasAuthCode) {
        headButtons.push(item)
      }
    }
  }
  // console.log('headButtons: ', headButtons)
  return headButtons
})
// 列表-表行按钮
const setRowButtons = computed(() => {
  let rowButtons = []
  if (props.tableConfig?.rowButtons && props.tableConfig?.rowButtons.length) {
    for(var i = 0; i < props.tableConfig?.rowButtons.length; i++) {
      let item = props.tableConfig?.rowButtons[i]
      if ((item.hasAuthCode && actionArr.value?.indexOf(item.authCode) !== -1) || !item.hasAuthCode) {
        rowButtons.push(item)
      }
    }
  }
  // console.log('rowButtons: ', rowButtons)
  return rowButtons
})

// 按钮监听
const listenCall = (btnConfig:any, row?:any) => {
  let actionCode = btnConfig.actionCode
  // 数据来源：如果是批量操作，则取已勾选的数据，否则使用行数据
  let sourceData = btnConfig.isBatchAction ? dataSource.selectedObjArr : row
  // console.log('🦆 mixin-table 按钮监听 btnConfig: ', btnConfig, ' sourceData: ', sourceData)
  if (actionCode === 'create') { // 新建
    onPageFn(btnConfig, null)
  } else if (actionCode === 'edit') { // 编辑
    onPageFn(btnConfig, sourceData)
  } else if (actionCode === 'confirm') { // 确认是否操作
    handleConfirm(btnConfig, sourceData)
  } else if (actionCode === 'export') { // 导出
    handleExport(btnConfig, sourceData)
  } else if (actionCode === 'import') { // 导入
    handleImport(btnConfig, sourceData)
  } else if (actionCode === 'goToPage') { // 去往其他页面
    goToPage(btnConfig, sourceData)
  } else {
    onPageFn(btnConfig, sourceData)
  }
}

// 自定义操作列-按钮监听
const listenActionCall = (btnConfig:object, record:any) => {
  // console.log('🦆 mixin-table 自定义操作列-按钮监听 listenActionCall: ', btnConfig, ', ', record)
  onPageFn(btnConfig, record)
}

// 列表查询
const searchFn = (searchFormData?:any) => {
  dataSource.pageIndex = props.tableConfig?.isKeepPageIndex ? dataSource.pageIndex : 1;
  setSearchFormData = searchFormData
  queryTableData()
}

// 获取列表
const queryTableData = () => {
  tableLoading.value = true;
  dataSource.selectedIdArr = [];
  dataSource.selectedObjArr = [];
  let paramObj:any = {
    pageIndex: dataSource.pageIndex,
    pageSize: dataSource.pageSize,
  }
  if (props.tableConfig?.hasSorter) {
    paramObj.orderBy = dataSource.orderBy
    paramObj.sortBy = dataSource.sortBy
  }
  if (props.tableConfig?.query.params) {
    let routeQuery = route.query
    props.tableConfig.query.params.map((qp:any) => {
      if (qp.valueSource == 'row' && parentRow) {
        qp.dataTransform.map((_dt:any) => {
          paramObj[_dt.targetCode] = parentRow[_dt.sourceCode]
        })
      } else if (qp.valueSource == 'route') {
        qp.dataTransform.map((_dt:any) => {
          paramObj[_dt.targetCode] = routeQuery[_dt.sourceCode]
        })
      } else if (qp.valueSource == 'default') {
        qp.dataTransform.map((_dt:any) => {
          paramObj[_dt.targetCode] = _dt.sendVal
        })
      } else if (qp.valueSource == 'defaultVal') {
        qp.dataTransform.map((_dt:any) => {
          paramObj[_dt.targetCode] = _dt.targetVal
        })
      } else if (qp.valueSource == 'variables') {
        qp.dataTransform.map((_dt:any) => {
          paramObj[_dt.targetCode] = props.variables?.[_dt.getKey]
        })
      }
    })
  }
  // 发送参数
  let sendArguments = {
    ...paramObj,
    ...setSearchFormData,
    ...levelParam
  }
  // 表格有下级菜单，并且下级菜单已取值
  if (props.tableConfig?.levelPageSetNullRule && props.tableConfig?.levelPageSetNullRule.length) {
    let levelVal = sendArguments[props.tableConfig?.levelRule.sendKey];
    let searchTitle = sendArguments[props.tableConfig?.levelRule.showTitle];
    let lastLevel = levelArr[levelArr.length - 1];
    let lastLevelTitle = lastLevel?.[props.tableConfig?.levelRule.showTitle];
    let showTitleInSearch = setSearchFormData[props.tableConfig?.levelRule.showTitle];
    console.log('xxxxxxxxxxxxxx levelVal: ', levelVal)
    console.log('xxxxxxxxxxxxxx searchTitle: ', searchTitle)
    console.log('xxxxxxxxxxxxxx lastLevelTitle: ', lastLevelTitle)
    console.log('xxxxxxxxxxxxxx showTitleInSearch: ', showTitleInSearch)
    if (levelVal && lastLevelTitle.indexOf(searchTitle) > -1) {
      let getValkey = props.tableConfig?.levelRule.sendKey;
      let setNullKey = props.tableConfig?.levelPageSetNullRule[0];
      emit('setSearchFormEmpty', {[getValkey]: levelVal, [setNullKey]: null})
    }
  }
  http({
    url: props.tableConfig?.query.url,
    method: props.tableConfig?.query.method,
    enctype: 'multipart/form-data',
    params: props.tableConfig?.query.method == 'get' ? sendArguments || null : null,
    data: props.tableConfig?.query.method == 'post' ? sendArguments || null : null,
  }).then((resp:any) => {
    console.log('🐟queryTableData: ', resp)
    tableLoading.value = false;
    if (resp.success) {
      // if (props.tableConfig?.rowKeyIsIndex) {
      //   resp.data.map((_row:any, _index:number) => {
      //     _row.serialNumber = _index + 1
      //   })
      // }
      dataSource.tableData = resp.data;      
      dataSource.totalRows = resp.totalRows;
      tableData(resp)
    } else {
      message.error(resp.message || '错误')
    }
  })
}

const tableData = (respData:any) => {
  let routeQuery = route.query
  if (props.tableConfig?.headTotals) {
    // 表头的合计取值
    props.tableConfig?.headTotals.map((totalItem:any) => {
      if (totalItem.valueSource == 'row' && parentRow) { // 从父页面带过来的行数据里面取相应的合计值
        totalItem.value = parentRow[totalItem.key]
      } else if (totalItem.valueSource == 'route') {
        totalItem.value = routeQuery[totalItem.key]
      } else if (totalItem.valueSource == 'otherDataInRes') { // 接口返回的其他地方（非data里面）
        if (totalItem.isSimpleArr) {
          totalItem.value = totalItem.isDeepData ? (respData.data[totalItem.dataCode])[totalItem.getValIndex] : (respData[totalItem.dataCode])[totalItem.getValIndex]
        } else {
          totalItem.value = (respData[totalItem.dataCode])[totalItem.key]
        }
      } else if (totalItem.valueSource == 'fixedValue') {
        totalItem.value = totalItem.value
      } else { // 从当前返回的数据里面取相应的合计值
        totalItem.value = respData[totalItem.key]
      }
    })
  }

  // 表格其他值，以供父页面使用
  if (props.tableConfig?.emitOtherVals) {
    let emitObj:any = {} as any;
    props.tableConfig?.emitOtherVals.map((eoItem:any) => {
      emitObj[eoItem.targetCode] = respData[eoItem.sourceCode]
    })
    emit('emitOtherVals', emitObj)
  }

  // 数据转换
  if (props.tableConfig?.hasDataConversion) {
    let newArr:any;
    setTimeout(() => {
      props.tableConfig?.dataConversionRules.map((c_rule:any) => {
        newArr = respData.data.map((item:any) => {
          if (c_rule.valueSource == 'searchForm_optionList' && props.optionListDown) { // 从搜索表单里的下拉数据合集里面匹配相应的数据进行转换
            c_rule.dataTransform.map((_dt:any) => {
              if (props.optionListDown[_dt.optionListName]?.length) {
                let obj = props.optionListDown[_dt.optionListName].find((opt:any) => {                  
                  return opt.value == +item[_dt.sourceCode]
                })
                if (obj && item[_dt.sourceCode] != null) {
                  item[_dt.targetCode] = obj.label
                } else {
                  item[_dt.targetCode] = '-'
                }
              }              
            })
          } else if (c_rule.valueSource == 'row_joining_date') { // 从当前行数据里面进行日期合并
            c_rule.dataTransform.map((_dt:any) => {
              let joiningDate = ''
              _dt.sourceCode.map((name:string, index:number) => {
                joiningDate += index == 0 ? item[name] : '-' + item[name]
              })
              item[_dt.targetCode] = joiningDate
            })
          } else if (c_rule.valueSource == 'parentRow') { // 从父页面带过来的行数据里面取值
            c_rule.dataTransform.map((_dt:any) => {
              item[_dt.targetCode] = parentRow[_dt.sourceCode]
            })
          } else if (c_rule.valueSource == 'route') { // 从URL取值
            c_rule.dataTransform.map((_dt:any) => {
              item[_dt.targetCode] = routeQuery[_dt.sourceCode]
            })
          }
          return item
        })
      })
      dataSource.tableData = newArr
    }, 100);
  }
}

// 表格-选择改变(selectedRowKeys, selectedRows)
const handleOnChange = (selectedRowKeys: [], selectedRows: []) => {
  console.log('表格-选择改变: ', selectedRowKeys, ', selectedRows: ', selectedRows)
  dataSource.selectedIdArr = selectedRowKeys;
  dataSource.selectedObjArr = selectedRows;
  
  if (props.tableConfig?.selectedRowsTotals?.length) {
    props.tableConfig?.selectedRowsTotals.map((_srt:any) => {
      let num = 0
      selectedRows.map((_r:any) => {
        num += _r[_srt.key]
      })
      selectedRowsTotalsData[_srt.key] = num.toFixed(_srt.fixed || 2)
    })
  }
};

// 表格点击升降序
const tableOnChange = (pagination:any, filters:any, sorter:any) => {
  dataSource.orderBy = sorter.field
  if (sorter.order == 'ascend') {
    dataSource.sortBy = '0'
  } else if (sorter.order == 'descend') {
    dataSource.sortBy = '1'
  } else {
    dataSource.orderBy = '';
    dataSource.sortBy = ''
  }
  queryTableData()
}

// 表格展开监听
const handleOnExpand = (expanded: boolean, record: {}) => {
  // console.log('expanded: ', expanded, ', record: ', record)
}

// 表格清空所有选择
const clearSelectedRows = () => {
  dataSource.selectedIdArr = []
  dataSource.selectedObjArr = []
}

// 表格-分页改变(selectedRowKeys, selectedRows)
const handlePageChange = (page:number, pageSize:number) => {
  dataSource.pageIndex = page
  dataSource.pageSize = pageSize
  queryTableData()
};

// 导出
const handleExport = (btnConfig:any, sourceData:any) => {
  exportLoading.value = true;
  // console.log('导出 setSearchFormData: ', setSearchFormData, ', sourceData: ', sourceData)
  let defaultParamsData = btnConfig.hasDefaultParam ? btnConfig.defaultParamsData : null
  
  let paramObj = {
    ...defaultParamsData
  }
  btnConfig.actionParams && btnConfig.actionParams.map((pc:any) => {
    if (pc.valueSource == 'ids') {
      paramObj[pc.sendKey || 'ids'] = pc.sendType == 'array' ? dataSource.selectedIdArr : dataSource.selectedIdArr.join(',')
    } else if (pc.valueSource == 'row') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.sendType == 'array' ? [sourceData[_dt.sourceCode]] : sourceData[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'selectedRowsArr') {
      console.log('xxxxxxxxxxxxxxxxxxx sourceData: ', sourceData)
      pc.dataTransform.map((_dt:any) => {
        let dsi_values = sourceData.map((dsi:any) => {return dsi[_dt.sourceCode]})
        paramObj[_dt.targetCode] = pc.sendType == 'array' ? dsi_values : dsi_values.join(',')
      })
    } else if (pc.valueSource == 'default') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.sendVal
      })
    } else if (pc.valueSource == 'defaultVal') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.targetVal
      })
    } else if (pc.valueSource == 'route') {
      let routeQuery = route.query
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = routeQuery[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'form') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = setSearchFormData && setSearchFormData[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'form_all') {
      paramObj = {
        ...paramObj,
        ...setSearchFormData
      }
    } else if (pc.valueSource == 'variables') {
      pc.dataTransform.map((_dt:any) => {
        if (_dt.hasReplaceRule && _dt.checkTargetKey == 'ids' ) {
          paramObj[_dt.targetCode] = dataSource.selectedObjArr && dataSource.selectedObjArr.length ? (pc.sendType == 'array' ? dataSource.selectedIdArr : dataSource.selectedIdArr.join(',')) : props.variables?.[_dt.getKey]
        } else {
          paramObj[_dt.targetCode] = props.variables?.[_dt.getKey]
        }
      })
    }
  })
  console.log('%c paramObj: ', 'color:green', paramObj)
  http({
    url: btnConfig.actionConfig.url,
    method: btnConfig.actionConfig.method,
    enctype: 'multipart/form-data',
    params: btnConfig.actionConfig.method == 'get' ? paramObj || null : null,
    data: btnConfig.actionConfig.method == 'post' ? paramObj || null : null,
    responseType: btnConfig.fileType == 'blob' ? 'blob' : null
  })
  .then((resp:any) => {
    console.log('返回resp: ', resp)
    exportLoading.value = false;
    if (btnConfig.fileType == 'blob') {
      let fileName = btnConfig.fileName + '.xls'
      let blob = new Blob([resp.data], { type: 'application/octet-stream' })
      if ('download' in document.createElement('a')) {
        let objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = fileName
        link.href = objectUrl
        link.click()
      }
    } else if (resp.success) {
      let backUrl = btnConfig.backUrlSource == 'data' ? resp.data : resp.message
      console.log('返回链接: ', baseUrl+backUrl)
      window.open(baseUrl+backUrl, '_blank')
      message.success('导出成功！')
    } else {
      message.error(resp.message)
    }
  })
}

// 导入
const handleImport = (btnConfig:any, sourceData:any) => {
  console.log('导入 sourceData: ', sourceData)
  emit('handleImport', btnConfig, sourceData)
}

// 去其他页面
const goToPage = (btnConfig:any, row:any) => {
  console.log('去其他页面 btnConfig: ', btnConfig, ', row: ', row)
  let paramObj:any = {} as any;
  btnConfig?.actionParams?.map((pc:any) => {
    if (pc.valueSource == 'row') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = row[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'form') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = setSearchFormData && setSearchFormData[_dt.sourceCode] || null
      })
    } else if (pc.valueSource == 'route') {
      let routeQuery = route.query
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = routeQuery[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'default') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.sendVal
      })
    } else if (pc.valueSource == 'defaultVal') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.targetVal
      })
    } else if (pc.valueSource == 'variables') {
      pc.dataTransform.map((_dt:any) => {
        if (_dt.hasReplaceRule && _dt.checkTargetKey == 'ids' ) {
          paramObj[_dt.targetCode] = dataSource.selectedObjArr && dataSource.selectedObjArr.length ? (pc.sendType == 'array' ? dataSource.selectedIdArr : dataSource.selectedIdArr.join(',')) : props.variables?.[_dt.getKey]
        } else {
          paramObj[_dt.targetCode] = props.variables?.[_dt.getKey]
        }
      })
    }
  })
  console.log('%c 去其他页面时的参数paramObj:', 'color:red', paramObj)
  router.push({
    path: '/' + btnConfig.path,
    name: btnConfig.path,
    query: paramObj
  })
}

// 是否操作前询问
const handleConfirm = (btnConfig:any, sourceData:any) => {
  console.log('是否操作前询问 sourceData: ', sourceData)
  Modal.confirm({
    title: btnConfig.confirmConfig.title,
    content: btnConfig.confirmConfig.content,
    onOk: () => {
      immediatelyFn(btnConfig, sourceData)
    },
    okText: '确认',
    cancelText: '取消'
  })
}

// 立即执行的方法
const immediatelyFn = (btnConfig:any, sourceData:any) => {
  let defaultParamsData = btnConfig.hasDefaultParam ? btnConfig.defaultParamsData : null
  let paramObj = {...defaultParamsData}
  btnConfig.actionParams && btnConfig.actionParams.map((pc:any) => {
    if (pc.valueSource == 'ids') {
      paramObj[pc.sendKey || 'ids'] = pc.sendType == 'array' ? dataSource.selectedIdArr : dataSource.selectedIdArr.join(',')
    } else if (pc.valueSource == 'row') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = (_dt.isArray || _dt.sendType== 'array') ? [sourceData[_dt.sourceCode]] : sourceData[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'selectedRowsArr') {
      pc.dataTransform.map((_dt:any) => {
        let dsi_values = sourceData.map((dsi:any) => {return dsi[_dt.sourceCode]})
        paramObj[_dt.targetCode] = pc.sendType == 'array' ? dsi_values : dsi_values.join(',')
      })
    } else if (pc.valueSource == 'form') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = setSearchFormData && setSearchFormData[_dt.sourceCode] || null
      })
    }  else if (pc.valueSource == 'form_all') {
      paramObj = {...paramObj, ...setSearchFormData}
    } else if (pc.valueSource == 'route') {
      let routeQuery = route.query
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = routeQuery[_dt.sourceCode]
      })
    } else if (pc.valueSource == 'default') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.sendVal
      })
    } else if (pc.valueSource == 'defaultVal') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.targetVal
      })
    } else if (pc.valueSource == 'variables') {
      pc.dataTransform.map((_dt:any) => {
        if (_dt.hasReplaceRule && _dt.checkTargetKey == 'ids' ) {
          paramObj[_dt.targetCode] = dataSource.selectedObjArr && dataSource.selectedObjArr.length ? (pc.sendType == 'array' ? dataSource.selectedIdArr : dataSource.selectedIdArr.join(',')) : props.variables?.[_dt.getKey]
        } else {
          paramObj[_dt.targetCode] = props.variables?.[_dt.getKey]
        }
      })
    }
  })
  console.log('%c 立即执行的方法 参数paramObj:', 'color:red', paramObj)

  http({
    url: btnConfig.actionConfig.url,
    method: btnConfig.actionConfig.method,
    enctype: 'multipart/form-data',
    // params: ['get','delete'].includes(btnConfig.actionConfig.method) ? paramObj || null : null,
    params: (btnConfig.actionConfig.method == 'get' || (btnConfig.actionConfig.method == 'delete' && !btnConfig.actionConfig.dataInBody)) ? paramObj || null : null,
    data: (btnConfig.actionConfig.method == 'post' || (btnConfig.actionConfig.method == 'delete' && btnConfig.actionConfig.dataInBody)) ? paramObj || null : null,
  })
  .then((resp:any) => {
    console.log('resp: ', resp)
    if (resp.success) {
      message.success(resp.message ? resp.message : '操作成功')
    } else {
      message.error(resp.message)
    }
    queryTableData();
    if (btnConfig.isEmitWatch) {
      emit('onWatchBtnFn')
    }
  })
}

// 在父页面操作的方法
const onPageFn = (btnConfig:any, sourceData:any) => {
  emit('onPageFn', btnConfig, sourceData)
}

// 表格展开内容的组件
let expandedRowRenderComponent = reactive<any>(null)
const loadExpandedRowRenderComponent = async () => {
  let modules = import.meta.glob('./mixin-expandedRowRenderComponent.vue')
  modules[`./mixin-expandedRowRenderComponent.vue`]().then((resp:any) => {
    expandedRowRenderComponent = resp.default
  })
}

// 点击查看下级数据
const handleGoSub = (record: any) => {
  dataSource.pageIndex = 1
  const levelRule = props.tableConfig?.levelRule
  levelArr.push(record)
  levelParam[levelRule.sendKey] = record[levelRule.getValKey]
  queryTableData()
  emit('setLevelInfo', {[levelRule.sendKey]: record[levelRule.getValKey]})
}

// 返回上一级
const goPrevLevel = () => {
  dataSource.pageIndex = 1
  const levelRule = props.tableConfig?.levelRule  
  levelArr.pop()
  if (levelArr.length > 0) {
    let lastLevelObj = levelArr[levelArr.length-1]
    levelParam[levelRule.sendKey] = lastLevelObj[levelRule.getValKey]
  } else {
    levelParam[levelRule.sendKey] = null
  }
  queryTableData();
  emit('setPrevLevel', levelArr)
}

// 组件挂载前
onBeforeMount(() => {
});

// 组件挂载完成
onMounted(() => {
  if (props.tableConfig?.noSearchForm && !props.tableConfig?.initNoQuery) {
    console.log(`%c 没有搜索表单的时候获取列表`, 'background:#00bfff')
    queryTableData()
  }

  // 有展开列表
  if (props.tableConfig?.hasExpandedRowRender) {
    loadExpandedRowRenderComponent()
  }
});

// 组件卸载之前
onBeforeUnmount(() => {
});

// 组件卸载完成
onUnmounted(() => {
});

defineExpose({
  searchFn,
  handleOnChange,
  dataSource,
});
</script>

<style lang="less" scoped>
.table-wrap{
  padding: 10px;
  background-color: #fff;
}
.table-title-wrap{
  margin-bottom: 10px;
  .ant-divider-vertical{
    border-left-color: @border-color-base;
  }
}
.table-subTitle-wrap{
  margin-bottom: 10px;
  padding: 10px 16px;
  background-color: @table-sub-title-background-color;
  border: solid 1px @table-sub-title-border-color;
  .ant-divider-vertical{
    border-left-color: @border-color-base;
  }
}
.table-title-left{
  line-height: 22px;
  padding: 5px 0;
}
.mixin-table-menu-item{
  padding: 0px;
}
.mixin-shuaxin{
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  color: @text-color-secondary;
  cursor: pointer;
  font-size: 18px;
  &:hover{
    color: @primary-color
  }
}
</style>