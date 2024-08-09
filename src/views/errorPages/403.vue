<template>
  <a-result status="403" title="403" sub-title="对不起，您没有权限访问此页面.">
    <template #extra>
      <back-btn-group />
    </template>
  </a-result>
</template>

<script lang="ts" setup>
import BackBtnGroup from './components/back-btn-group.vue';
</script>
