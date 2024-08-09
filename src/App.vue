<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
// import { useRoute } from 'vue-router';
// const route = useRoute()
</script>

<style scoped>
.ant-spin-nested-loading {/*遮罩高度100%*/
  height: 100%;
}
:deep(.ant-spin-container) {/*遮罩容器高度100%*/
  height: 100%;
}
</style>
