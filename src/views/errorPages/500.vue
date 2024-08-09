<template>
  <a-result status="500" title="500" sub-title="对不起，服务器内部错误.">
    <template #extra>
      <back-btn-group />
    </template>
  </a-result>
</template>

<script lang="ts" setup>
import BackBtnGroup from './components/back-btn-group.vue';
</script>
