<template>
  <div class="mixin-form">
    <a-form
      ref="formRef"
      :model="formData"
      name="basic"
      class="ant-row"
      labelAlign="right"
      :label-col="{ style: { width: '110px' } }"
      autocomplete="off"
      @finish="searchFn"
      @finishFailed="onFinishFailed"
    >
      <div class="ant-col ant-col-6">
        <a-form-item label="客户名称：" name="clientName">
          <a-input v-model:value="formData.clientName" />
        </a-form-item>
      </div>
      <div class="ant-col ant-col-6">
        <a-form-item label="社会信用代码：" name="payTaxesCode">
          <a-input v-model:value="formData.payTaxesCode" />
        </a-form-item>
      </div>
      <a-button type="primary" html-type="submit" class="ml-10">查询</a-button>
      <a-button type="default" @click="resetFn" class="ml-10">重置</a-button>
    </a-form>
  </div>

  <div class="table-wrap">
    <a-table
      :dataSource="dataSource.tableData"
      :columns="listThead"
      rowKey="id"
      :row-selection="{ selectedRowKeys: dataSource.selectedIdArr, onChange: handleOnChange }"
      size="small"
      :pagination="false"
      :scroll="{x: 1200}"
      :loading="tableLoading"
    >
      <!-- 表格header -->
      <template #title>
        <div class="clearfix table-title-wrap">
          <!-- 表头左边 -->
          <div class="table-title-left pull-left">
            <div class="display-inline-block">
              <span>合计：<span class="text-info pl-2 pr-2 font-weight"> {{dataSource.totalRows}} </span>条</span>
            </div>
          </div>
          <!-- 表头右边 -->
          <div class="table-title-right pull-right">
            <a-button>导出</a-button>
          </div>
        </div>
      </template>
    </a-table>

    <a-pagination
      v-model:current="dataSource.current"
      :total="dataSource.totalRows"
      :showSizeChanger="true"
      :pageSizeOptions="['10', '20', '50', '100', '200', '500', '1000']"
      :show-total="(total:any) => `总共 ${total} 条`"
      show-quick-jumper
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

<script lang="ts">
export default { name: 'list' }
</script>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import ServiceApi from './service';
import { listThead } from './columns.js';

const formRef = ref();
const formData = reactive<any>({
  clientName: '',
  payTaxesCode: ''
})

// 列表数据
let dataSource = reactive({
  tableData: [],
  totalRows: 0,
  current: 1,
  pagesize: 10,
  // 勾选的表格行数据
  selectedObjArr: [],
  selectedIdArr: [],
  // 是否第一次加载表格数据
  isFirstQueryTable: true
})
let tableLoading = ref<boolean>(true);

// 查询
const searchFn = (values?: any) => {
  dataSource.current = 1
  queryTableData()
};

// 重置
const resetFn = () => {
  formRef.value.resetFields()
  dataSource.current = 1
  queryTableData()
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// 获取列表
const queryTableData = () => {
  let params = {
    ...formData,
    current: dataSource.current,
    pagesize: dataSource.pagesize,
  }
  ServiceApi.getList(params).then((resp:any) => {
    tableLoading.value = false;
    if (resp.returnStatus) {
      dataSource.tableData = resp.data
      dataSource.totalRows = resp.total
    } else {
      message.error('no')
    }
  })
}

// 表格-选择改变(selectedRowKeys, selectedRows)
const handleOnChange = (selectedRowKeys: [], selectedRows: []) => {
  dataSource.selectedIdArr = selectedRowKeys;
  dataSource.selectedObjArr = selectedRows;
  console.log('表格-选择改变: ', selectedRowKeys)
};

// 表格-分页改变(selectedRowKeys, selectedRows)
const handlePageChange = (page:number, pageSize:number) => {
  dataSource.current = page
  dataSource.pagesize = pageSize
  console.log('page: ', page, ', pageSize: ', pageSize)
  queryTableData()
};

// 组件挂载前
onBeforeMount(() => {
});

// 组件挂载完成
onMounted(() => {
  queryTableData()
});

// 组件卸载之前
onBeforeUnmount(() => {
});

// 组件卸载完成
onUnmounted(() => {
});
</script>

<style lang="less" scoped>
.table-wrap{
  padding: 10px;
  background-color: #fff;
}
.table-title-wrap{
  margin-bottom: 10px;
}
.mixin-table-menu-item{
  padding: 0px;
}
</style>