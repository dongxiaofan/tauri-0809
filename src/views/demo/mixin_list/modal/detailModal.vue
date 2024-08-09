<template>
  <a-modal
    :visible="isShowModal"
    title="详情"
    width="750px"   
    :mask-closable="true"
    :closable="true"
    @cancel="handleCancel"
    class="fullscreen_modal"
  >
    <div class="xq-title">连接信息</div>
    <div class="xq-cont">
      <p>申请时间：{{ detailInfo.createDate }}</p>
      <p>绑定手机号：{{ detailInfo.phone }}</p>
      <p>IP白名单：</p>
      <div class="ip-box mb-10" v-show="ipList && ipList.length > 0">
        <p v-for="item of ipList">{{ item.ip }}</p>
      </div>
      <p>对接提供信息：</p>
      <div class="ip-box mb-24">
        <p>接口请求地址：<span class="text-gray-666">{{ detailInfo.apiUrl }}</span></p>
        <p>公司：<span class="text-gray-666">{{ detailInfo.clientName }}</span></p>
        <p>userkey：<span class="text-gray-666">{{ detailInfo.userkey }}</span></p>
        <p>secret：<span class="text-gray-666">{{ detailInfo.secret }}</span></p>
        <p>(任务同步时)customerCode：<span class="text-gray-666">{{ detailInfo.customerCode }}</span></p>
      </div>
    </div>

    <div class="xq-title">验收报告</div>
    <div class="xq-cont">
      <p>提交时间：{{ detailInfo.acceptanceFileModel?.createDate }}</p>
      <p>查看文件：<a className=' a-underline text-info' @click="downLoadFile(detailInfo.acceptanceFileModel.originalName, detailInfo.acceptanceFileModel.url)">{{detailInfo.acceptanceFileModel?detailInfo.acceptanceFileModel.originalName:''}}</a></p>
    </div>

    <template #footer>
      <a-button type="gray-ghost" @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, h } from 'vue';
import ServiceApi from '../service';
const baseUrl = import.meta.env.VITE_FILE_URL;
const emits = defineEmits(['submitOk']);
let loading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);
let parentRow = reactive<any>({});
let detailInfo = reactive<any>({});
let ipList = ref<any>([]);

// 打开弹窗
const handleShow = (sourceData:any) => {
  console.log('打开弹窗 sourceData: ', sourceData)
  parentRow = sourceData;
  loading.value = false;
  isShowModal.value = true;
  GetDetail()
};

// 点击取消
const handleCancel = () => {
  isShowModal.value = false;
};

// 点击确定
const handleOk = () => {
  emits('submitOk')
  handleCancel()
}

// 获取详情信息
const GetDetail = () => {
  ServiceApi.GetDetail({id: parentRow.id}).then(resp => {
    if (resp.returnStatus) {
      detailInfo = resp.data;
      ipList.value = resp.data.ipList;
    } else {
    }
  })
}

const downLoadFile = (name:string, url:string) => {
  const link = document.createElement('a');
  link.target = '_blank';
  link.download = name;
  link.href = baseUrl + url;
  link.click();
}

onMounted(() => {
});

defineExpose({
  handleShow
});

</script>

<style lang="less" scoped>
.xq-title{
  line-height: 32px;
  position: relative;
  padding-left: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  &:before{
    width: 3px;
    height: 12px;
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    background: @primary-color;
  }
}
.xq-cont{
  line-height: 32px;
  padding-left: 14px;
  p{
    margin: 0;
  }
  .ip-box{
    border: solid 1px @border-color-base;
    p{
      margin: 0;
      padding: 6px 24px;
      border-bottom: 1px solid #f0f0f0;
      &:last-child{
        border-bottom: none;
      }
    }
  }
}
</style>
