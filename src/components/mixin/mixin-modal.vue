<template>
  <a-modal
    :visible="isShowModal"
    :title="formConfig?.formTitle"
    :width="formConfig?.modalWidth || 800"
    :mask-closable="false"
    :closable="false"
    class-name="vertical-center-modal custom-modal" 
    ok-text="确认" cancel-text="取消"
    destroyOnClose
  >
    <MixinForm
      ref="MixinFormRef"
      :initFormConfig="formConfig"
      :parentRow="parentRow"
      :selectedObjArr="selectedObjArr"
    >
    </MixinForm>
    
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import http from '@/utils/http.js'
import { message } from "ant-design-vue";
import MixinForm from './mixin-form.vue'
import dayjs from 'dayjs'
const emits = defineEmits(['submitOk']) 
const props = defineProps({
  initFormConfig: Object,
})

let loading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);
let parentRow = ref<any>({});
let formConfig = reactive<any>({...props.initFormConfig})
let selectedObjArr = ref<any>([])
let setOptionListDown = reactive<any[]>({}) // 下拉列表


const MixinFormRef = ref()
// 打开弹窗
const handleShow = (sourceData:any) => {
  parentRow = sourceData instanceof Array ? null : sourceData
  selectedObjArr = sourceData instanceof Array ? sourceData : null
  console.log('x-parentRow： ', parentRow)
  console.log('x-selectedObjArr： ', selectedObjArr)
  console.log('打开弹窗 ', MixinFormRef)
  
  loading.value = false;
  isShowModal.value = true;

  if (props.initFormConfig?.editFormGetValOnRow && parentRow) {
    getModelOnRow(parentRow)
  } else if (props.initFormConfig?.editFormGetValOnRequest && parentRow) {
    getModel(parentRow)
  }
  setTimeout(() => {
    // initFom()
    MixinFormRef.value.loadAllSelectOps()
  });
};

// const initFom = () => {
//   let formData = {}
//   formConfig?.formItem.map((item:any) => {
//     if (item.hasDefaultVal) {
//       if (item.type == 'dateInterval') {
//         formData[item.bind1] = item.defaultVal1
//         formData[item.bind2] = item.defaultVal2
//       } else {
//         formData[item.bind] = item.defaultVal
//       }
//     } else if (item.getInitValFromParentRow && parentRow) { // 好像没什么用
//       formData[item.bind] = parentRow[item.getValKey]
//     } else {
//       formData[item.bind] = item.getType == 'boolean' ? false : null
//     }
//   })
//   MixinFormRef.value.resetFn()
// }

// 关闭弹窗
const handleCancel = () => {
  console.log('点击取消')
  isShowModal.value = false
  // MixinFormRef.value.resetFn()
  
  formConfig?.formItem.map((item:any, index:number) => {
    // 去掉部分下拉列表的数据
    if (item.type == 'select' && item.optionListSource != 'local' && item.hasMustParam) {
      setOptionListDown[item.optionListName] = null
    }

    // 需要隐藏的
    if (item.initIsHide) {
      item.isHide = true
    }
  })
}

// // 点击取消
// const handleCancel = () => {
//   isShowModal.value = false;
// };

// 编辑时获取详情-从接口
const getModel = (row:any) => {
  console.log('row: ', row)
  parentRow = row;
  let paramObj = {}
  formConfig?.getModelConfig.getModelParams.map((paramConfig:any) => {
    if (paramConfig.valueSource == 'row') {
      paramConfig.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = row[_dt.sourceCode]
      })
    }
  })
  console.log('%c getModel 参数paramObj:', 'color:red', paramObj)

  http({
    url: formConfig?.getModelConfig.url,
    method: formConfig?.getModelConfig.method,
    enctype: 'multipart/form-data',
    params: formConfig?.getModelConfig.method == 'get' ? paramObj || null : null,
    data: formConfig?.getModelConfig.method == 'post' ? paramObj || null : null,
  })
  .then((resp:any) => {
    if (resp.status === 200 && resp.success) {
      setTimeout(() => {
        MixinFormRef.value.getFormValOnRow(resp.data)
      });
    } else {
      message.error(resp.message || '')
    }
  })
}

// 编辑时获取详情-从行数据
const getModelOnRow = (row:any) => {
  console.log('编辑时获取详情-从行数据 ', MixinFormRef)
  setTimeout(() => {
    MixinFormRef.value.getFormValOnRow(row)
  });
}

// 点击确定
const handleOk = () => {
  let testMergeParams:any = MixinFormRef.value.dataSettle()
  console.log('点击确定', testMergeParams)
  MixinFormRef.value.formRef.validate().then(() => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 2000);
    http({
      url: formConfig?.actionConfig.url,
      method: formConfig?.actionConfig.method,
      params: formConfig?.actionConfig.method == 'get' ? testMergeParams || null : null,
      data: formConfig?.actionConfig.method == 'post' ? testMergeParams || null : null,
    }).then((resp:any) => {
      console.log('handleOk: ', resp)
      if (resp.success) {
        isShowModal.value = false;
        message.success(resp.message || '操作成功')
      } else {
        message.error(resp.message || 'no')
      }
      emits('submitOk')
    })
  }).catch((error:any) => {
    console.log('error', error);
  })
  
};

defineExpose({
  handleShow,
  getModelOnRow,
  formConfig
});

</script>
