<template>
  <a-modal
    :visible="isShowModal"
    title="自定义弹窗"    
    :closable="false"
  >
    <a-row>
      <a-col :span="24">ssssssssssssssssssss</a-col>
    </a-row>
    
    <template #footer>
      <a-button type="gray-ghost" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from "ant-design-vue";

let loading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);

// 打开弹窗
const handelShow = () => {
  loading.value = false;
  isShowModal.value = true;
};

// 点击取消
const handleCancel = () => {
  isShowModal.value = false;
};

// 点击确定
const handleOk = () => {
  loading.value = true;
  isShowModal.value = false;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

defineExpose({
  handelShow
});

</script>
