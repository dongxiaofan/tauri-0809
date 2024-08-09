<template>
  <a-modal
    :visible="isShowModal"
    title="合同预警列表"
    width="80%"   
    :mask-closable="true"
    :closable="true"
    @cancel="handleCancel"
    class="fullscreen_modal"
  >
    <MixinTable
      ref="mixinTableRef"
      :tableConfig="tableConfig"
      :optionListDown="{}"
    ></MixinTable>
    <template #footer>
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { searchFormConfig, tableConfig } from '../page_config';
const emits = defineEmits(['submitOk'])

const baseUrl = import.meta.env.VITE_FILE_URL;
let loading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);
const mixinTableRef = ref()
let parentRowParams = reactive<any>({} as any)

// 打开弹窗
const handleShow = () => {
  loading.value = false;
  isShowModal.value = true;
  setTimeout(() => {
    searchFn() 
  });
};

// 点击取消
const handleCancel = () => {
  isShowModal.value = false;
};

// 搜索
const searchFn = (formData?:any) => {
  mixinTableRef.value.searchFn({...parentRowParams, ...formData})
}


onMounted(() => {
});

defineExpose({
  handleShow
});

</script>
