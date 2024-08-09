<template>
  <h3>use map</h3>
  <a-button @click="handelShow">map</a-button>
  <TMap ref="mapModalRef" @mapConfrim='mapConfrim' :mapId="'map-demo'"></TMap>
  <div v-show="formData.workSpace">
    <p>详细地址：{{ formData.workSpace }}</p>
    <p>经纬度：{{ formData.latiTude }}, {{ formData.longiTude }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import TMap from '_c/map/TMap.vue';
import { reactive, ref } from 'vue';

let formData = reactive<any>({
  workSpace: '',
  latiTude: 0,
  longiTude: 0,
  location: []
})
// let location = reactive<any>([])

// 显示地图
const mapModalRef = ref()
const handelShow = () => {
  mapModalRef.value.showMoadl({
    address: formData.workSpace,
    location: formData.location
  })
}

// 地图选择确定
const mapConfrim = (workSpace, location) =>{
  console.log('地图选择确定 mapConfrim', workSpace, location)
  formData.workSpace = workSpace
  formData.latiTude = location[0].toString()
  formData.longiTude = location[1].toString()
  formData.location = location
}
</script>