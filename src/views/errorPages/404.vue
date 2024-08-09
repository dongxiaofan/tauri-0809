<template>
  <a-result status="404" title="404" sub-title="对不起，您访问的页面不存在.">
    <template #extra>
      <back-btn-group />
    </template>
  </a-result>
</template>

<script lang="ts" setup>
import BackBtnGroup from './components/back-btn-group.vue';
</script>
