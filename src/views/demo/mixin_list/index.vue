<template>
  <MixinForm
    ref="mixinFormRef"
    :initFormConfig="searchFormConfig"
    @submitOk="searchFn"
  >
  </MixinForm>

  <MixinTable
    ref="mixinTableRef"
    :tableConfig="tableConfig"
    :optionListDown="{}"
    @onPageFn="onPageFn"
  ></MixinTable>

  <!--连接信息弹窗 -->
  <LianJieXinXiModal ref="lianJieXinXiModalRef" @submitOk="searchFn" />
  <!--详情弹窗 -->
  <DetailModal ref="detailModalRef" @submitOk="searchFn" />
</template>

<script lang="ts">
export default { name: 'mixin_list' } // 系统设置/客户API对接
</script>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { Modal, message } from "ant-design-vue";
import { tableConfig, searchFormConfig, } from './page_config';
import LianJieXinXiModal from './modal/lianJieXinXiModal.vue';
import DetailModal from './modal/detailModal.vue';
import ServiceApi from "./service";

let parentRow = reactive<any>({})
let selectedObjArr = reactive<any>([])

// 搜索
const mixinTableRef = ref()
const mixinFormRef = ref()
const searchFn = (formData?:any) => {
  let serachData = formData ? formData : mixinFormRef.value.formData
  mixinTableRef.value.searchFn(serachData)
}

// 在父页面操作的方法
const onPageFn = (btnConfig:any, sourceData:any) => {
  parentRow = sourceData instanceof Array ? null : sourceData
  selectedObjArr = sourceData instanceof Array ? sourceData : null
  if (btnConfig?.fn == 'handleShenHe') {
    handleShenHe(sourceData)
  } else if (btnConfig?.fn == 'handleDetail') {
    handleDetail(sourceData)
  }
}

// 详情弹窗
const detailModalRef = ref()
const handleDetail = (record:any) => {
  detailModalRef.value.handleShow(record);
}

// 审核弹窗
const handleShenHe = (record:any) => {
  Modal.confirm({
    title: `确认通过“${record?.clientName}”的对接申请吗？通过审核后将生成连接信息。`,
    onOk: () => {
      ServiceApi.Audit({id: record.id}).then((resp:any) => {
        if (resp.returnStatus) {
          message.success(resp.message || '操作成功')
          searchFn()
          setTimeout(() => {
            handleLianJieXinXi(resp.data) 
          });
        } else {
          message.error(resp.message || '操作失败')
        }
      })
    },
    okText: '审核通过',
    cancelText: '取消'
  })  
}

// 连接信息弹窗
const lianJieXinXiModalRef = ref()
const handleLianJieXinXi = (data:any) => {
  lianJieXinXiModalRef.value.handleShow(data);
}

// 组件挂载前
onBeforeMount(() => {
});

// 组件挂载完成
onMounted(() => {
});

// 组件卸载之前
onBeforeUnmount(() => {
});

// 组件卸载完成
onUnmounted(() => {
});
</script>