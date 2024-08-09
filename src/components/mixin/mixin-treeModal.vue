<!-- 放在搜索表单的树选择器 -->
<template>
  <a-modal
    :visible="isShowModal"
    :width="actionItem && actionItem.treeModalWidth || 480"
    :title="actionItem && actionItem.treeModalTitle || '请选择'"
    class-name="vertical-center-modal"
    :mask-closable="false"
    :closable="false"
  >
    <a-row>
      <a-col :span="4" class="text-right line-h-32">请选择：</a-col>
      <a-col :span="20">      
        <!-- <a-tree-select
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'scroll' }"
          :placeholder="actionItem.placeholder"
          tree-checkable
          allow-clear
          labelInValue
          multiple
          tree-default-expand-all
          :tree-data="treeData"
          tree-node-filter-prop="label"
          :field-names="actionItem?.fieldNames"
          :max-tag-count="5"
          :max-tag-text-length="5"
          @change="treeOnChange"
        ></a-tree-select> -->
        <div class="tree-cont">
          <a-tree
            checkable
            v-model:expandedKeys="expandedKeys"
            v-model:checkedKeys="checkedKeys"
            :tree-data="treeData"
            :field-names="actionItem.fieldNames"
            @check="treeOnChange"
          ></a-tree>
        </div>
      </a-col>
    </a-row>
    
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emits = defineEmits(['selectedTreeOk'])  

let loading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);
let actionItem = ref<any>();
let treeData = ref<any>([]);
let treeIsChange = ref<boolean>(false); // 树结构是否有点击过
const checkedNodes = ref<string[]>();
const expandedKeys = ref<string[]>();
const checkedKeys = ref<string[]>();

// 打开弹窗
const handleShow = (item:any, optionList:any, defaultVal:any) => {
  actionItem = item
  treeData = optionList
  console.log('defaultVal: ', defaultVal)
  expandedKeys.value = defaultVal
  checkedKeys.value = defaultVal
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
  emits('selectedTreeOk', actionItem,checkedNodes.value)
};

// 树选择改变
const treeOnChange = (checkedKeys:any, event:any) => {
  treeIsChange.value = true
  checkedNodes.value = event.checkedNodes
}

defineExpose({
  handleShow
});

</script>

<style lang="less">
.tree-cont{
  max-height: 400px;
  overflow-y: scroll;
}
</style>
