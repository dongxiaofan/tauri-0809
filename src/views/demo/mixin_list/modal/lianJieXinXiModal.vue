<template>
  <a-modal
    :visible="isShowModal"
    title="链接信息"
    width="520px"   
    :mask-closable="true"
    :closable="true"
    @cancel="handleCancel"
  >
    <div class="mb-16"><CheckCircleOutlined class="text-success font-24 mr-10 pull-left line-h-32" /><span class="font-14 line-h-32">生成以下连接信息：</span></div>
    <p><span class="font-weight">接口请求地址：</span> <span class="text-gray-666">{{ parentRow.apiUrl }}</span></p>
    <p><span class="font-weight">公司：</span> <span class="text-gray-666">{{ parentRow.clientName }}</span></p>
    <p><span class="font-weight">userkey：</span> <span class="text-gray-666">{{ parentRow.userkey }}</span></p>
    <p><span class="font-weight">secret：</span> <span class="text-gray-666">{{ parentRow.secret }}</span></p>
    <p><span class="font-weight">(任务同步时)customerCode：</span> <span class="text-gray-666">{{ parentRow.customerCode }}</span></p>
    <template #footer>
      <a-button type="gray-ghost" @click="handleCancel">关闭</a-button>
      <a-button type="default" class="copy-btn" :data-clipboard-text="copyTxt">复制信息</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, h } from 'vue';
import { message } from "ant-design-vue";
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import Clipboard from 'clipboard';
const emits = defineEmits(['submitOk']);
let loading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);
let parentRow = reactive<any>({});
let copyTxt = ref<any>(null);

// 打开弹窗
const handleShow = (sourceData:any) => {
  console.log('打开弹窗 sourceData: ', sourceData)
  parentRow = sourceData;
  loading.value = false;
  isShowModal.value = true;
  copyTxt.value = `接口请求地址：${parentRow.apiUrl}，公司：${parentRow.clientName}，userkey：${parentRow.userkey}，secret：${parentRow.secret}，(任务同步时)customerCode：${parentRow.customerCode}`;
};

// 点击取消
const handleCancel = () => {
  isShowModal.value = false;
};

// 复制信息
// const handleCopy = () => {
//   const txt = `接口请求地址：${parentRow.apiUrl}，公司：${parentRow.clientName}，userkey：${parentRow.userkey}，secret：${parentRow.secret}，(任务同步时)customerCode：${parentRow.customerCode}`
//   navigator.clipboard.writeText(txt);
//   message.success('复制成功！');
// }

// 复制信息
const clipboard = new Clipboard('.copy-btn');
clipboard.on('success', (e) => {
  console.log('已成功复制到剪贴板！', e.text);  
  e.clearSelection(); // 清除选定内容
});

onMounted(() => {
});

defineExpose({
  handleShow
});

</script>
