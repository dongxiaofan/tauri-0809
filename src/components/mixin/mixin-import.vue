<template>
  <a-modal :visible="isShowMixinImportModal" :title="title" :closable="false">
    <a-row>
      <a-col :span="5" class="text-gray text-right line-h-32"><span class="text-error pr-5">*</span>导入文件：</a-col>
      <a-col :span="18" class="mb-10">
        <a-button type="gray-ghost" :href="baseUrl + importConfig?.templateDownLoadUrl" target="_blank" class="mr-10">模板下载</a-button>
        <a-upload :accept="importConfig?.accept || '.doc, .docx, .xls, .xlsx'" :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove" :headers="headers" :max-count="importConfig.maxCount">
          <a-button type="default" :disabled="fileList.length == importConfig.maxCount ? true : false">选择文件</a-button>
        </a-upload>
        <div class="text-gray-999 pt-10 font-12">仅支持上传10M以内的{{importConfig?.accept || '.doc, .docx, .xls, .xlsx'}}文件</div>
      </a-col>
    </a-row>

    <a-row v-if="errorData.isError">
      <a-col :span="5" class="text-gray text-right line-h-32">错误文件：</a-col>
      <a-col :span="18" class="mb-10">
        <a-button type="error-ghost" @click="downLoadErrorFile">下载错误文件</a-button>
        
      </a-col>
    </a-row>
    
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="fileList?.length == 0" @click="handleUpload">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { message } from "ant-design-vue";
import Cookies from 'js-cookie'
import http from '@/utils/http.js'
import { MixinImportType } from '@/types/mixin-type'
import type { UploadProps } from 'ant-design-vue';
const emits = defineEmits(['submitOk']) 
const baseUrl = import.meta.env.VITE_FILE_URL;
const headers = {'Authorization': 'Bearer ' + Cookies.get('token')}
const fileList = ref<UploadProps['fileList']>([]);
const uploading = ref<boolean>(false);

let importConfig = reactive({
  actionUrl: '',
  templateDownLoadUrl: '',
  actionBodyParams: {},
  accept: [],
  maxCount: 1,
})
let loading = ref<boolean>(false);
let isShowMixinImportModal = ref<boolean>(false);
let title = ref<string>('批量导入');
let errorData = reactive({
  isError: false,
  downLoadUrl: '',
})

// 打开弹窗
const handleShow = (p_title:string, p_importConfig:MixinImportType) => {
  console.log('xxxxxxxxxxxxxxx p_importConfig: ', p_importConfig)
  title.value = p_title
  importConfig = p_importConfig
  loading.value = false;
  errorData.isError = false;
  errorData.downLoadUrl = '';
  fileList.value = [];
  isShowMixinImportModal.value = true;
};

// 点击取消
const handleCancel = () => {
  isShowMixinImportModal.value = false;
};

// 文件移除
const handleRemove: UploadProps['onRemove'] = file => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

// 文件提交前
const beforeUpload: UploadProps['beforeUpload'] = file => {
  errorData.isError = false
  errorData.downLoadUrl = ''
  fileList.value = [file];
  return false;
};

// 点击确定
const handleUpload = () => {
  const formData = new FormData();
  fileList.value.forEach((file: UploadProps['fileList'][number]) => {
    formData.append('files[]', file as any);
  });
  uploading.value = true;

  http(importConfig.actionUrl, {
    method: 'post',
    data: {files: fileList.value[0]},
  }).then((resp:any) => {
    if (resp.success) {
      message.success(resp.message || '操作成功！');
      isShowMixinImportModal.value = false;
    } else {
      if (resp.data) {
        message.error('请下载错误数据');
        errorData.isError = true
        errorData.downLoadUrl = resp.data
      } else {
        message.error(resp.message || '操作失败！');
      }
    }
    emits('submitOk')
  })
  .catch(() => {
    uploading.value = false;
    message.warning('upload failed.');
  });
};

// 错误数据下载
const downLoadErrorFile = () => {
  console.log('下载链接：', baseUrl + errorData.downLoadUrl)
  window.open(baseUrl+errorData.downLoadUrl, '_blank')
}

defineExpose({
  handleShow
});
</script>
