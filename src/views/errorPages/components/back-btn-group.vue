<template>
  <a-button type="primary" @click="goHome">返回首页</a-button>
  <a-button type="primary" ghost @click="goBack">返回上一页({{ second }}s)</a-button>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 返回首页
const goHome = () => {
  router.replace('home')
}

// 定时器
let timer: any;
const second = ref(5);
const countdown = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    if (second.value === 0) goBack()
    else second.value--
  }, 1000)
}

onMounted(() => {
  countdown()
})

onUnmounted(() => {
  clearInterval(timer);
});
</script>