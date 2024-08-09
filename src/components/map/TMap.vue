<template>
  <a-drawer :visible="modalShow" title="选择具体地址" placement="bottom" :height="600" :closable="false" :mask-closable="true" :styles='styles'>
    <a-auto-complete v-model:value='mapData.address' placeholder="请输入地址" :options="mapData.options" @search='onSearch' @select='onSelect' style="width: 100%;">
      <template #option="value">
        <span style="font-weight: bold">{{ `${value.title}（${value.address}）` }}</span>
      </template>
    </a-auto-complete>
    <div class="map-wrap mt-10 h500" v-if='modalShow' :id="props.mapId"></div>
    <div class="drawer-footer map-footer">
      <a-button style="margin-right: 8px" @click="modalShow = false">取消</a-button>
      <a-button type="primary"  @click="mapConfrim">确定</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import {jsonp} from 'vue-jsonp';
import { debounce } from '@/utils/debounce.js'
const emits = defineEmits(["mapConfrim"])
const props = defineProps({
  mapId: String
})
const TMap_key = 'ULRBZ-ASDL6-KD4S5-MMCVU-IKPCH-AHBKO'
const modalShow = ref<boolean>(false)
let notSearch = reactive<Boolean>(false)
let marker = reactive<any>(null)
let map = reactive<any>(null)
const styles = { height: 'calc(100% - 55px)', overflow: 'auto', paddingBottom: '53px', position: 'static' }
let mapData = reactive({
  mapId: '',
  location: [28.192407, 112.978813],
  address: '长沙IFS（湖南省长沙市芙蓉区解放西路188号）',
  options: []
});
const TMap = (window as any).TMap;
console.log('TMap： ', TMap)

// 弹窗显示
const showMoadl = (data) => {
  notSearchFn()
  if(data.address) {
    mapData.address = data.address
    mapData.location = data.location
  }else{
    mapData.address = '长沙IFS（湖南省长沙市芙蓉区解放西路188号）'
    mapData.location = [28.192407, 112.978813]
  }
  modalShow.value = true
  setTimeout(() => {
    initMap()
  });
}

// 初始化地图
const initMap = (zoom = 15) => {
  console.log('mapData: ', mapData)
  let center = new TMap.LatLng(mapData.location[0], mapData.location[1]);
  map = new TMap.Map(document.getElementById(props.mapId), {
    center: center
  });
  (map as any).on('click',clickHandler); // 绑定点击地图获取地理位置的事件
  marker = new TMap.MultiMarker({
    id: 'marker-layer',
    map: map,
    zoom: zoom
  });
  markerLayer(); // 标记地图
}

// 地图点击事件
const clickHandler = (event) => {
  console.log('event: ', event)
  jsonp(`https://apis.map.qq.com/ws/geocoder/v1/?output=jsonp&key=${TMap_key}&location=${event.latLng.getLat()},${event.latLng.getLng()}`).then(resp => {
    if (resp.status == 0) {
      notSearchFn()
      mapData.location = [event.latLng.getLat(), event.latLng.getLng()]
      mapData.address = resp.result.address + ' ' + `（${resp.result.formatted_addresses.rough}）`
      console.log('点击的坐标是 : ', mapData.location, ', 详细地址是: ', mapData.address)
      if(marker){
        marker.setMap(null)
      }
      marker = new TMap.MultiMarker({
        position: new TMap.LatLng(event.latLng.getLat(), event.latLng.getLng()),
        map: map
      });
      markerLayer(); // 标记地图
    } else {
      message.warning(resp.message)
    }
  })
};

//标记地图 
const markerLayer = () =>{
  marker = new TMap.MultiMarker({
    map: map,  //指定地图容器
    styles: {
      'myStyle': new TMap.MarkerStyle({ 
        'width': 25,
        'height': 35,
        'background': 'pink',
        'anchor': { x: 16, y: 32 }  
      }) 
    },
    //点标记数据数组
    geometries: [
      {
        'id': '1',
        'styleId': 'myStyle',
        'position': new TMap.LatLng(mapData.location[0], mapData.location[1]),
      },
    ]
  });
};

// 地图点击确定
const mapConfrim = () => {
  console.log('mapConfrim')
  if(mapData.address == ''){
    message.warning({
      content: '您还未选择地址',
      duration: 3
    })
    return
  }
  emits('mapConfrim',mapData.address,mapData.location)
  modalShow.value = false
}

// 地图搜索事件
const mapSearch = (searchStr) => {
  console.log(searchStr,'searchStr---',notSearch,'notSearch')
  if(notSearch){
    return
  }
  let keyword = searchStr.split(' ')[0]
  jsonp(
    `https://apis.map.qq.com/ws/place/v1/suggestion?output=jsonp&key=${TMap_key}&keyword=${keyword}`
  ).then(resp => {
    if (resp.status == 0) {
      console.log('地图搜索事件: ', resp)
      let option = resp.data.map((item) => {
        return {
          ...item,
          value: `${item.title}（${item.address}）`
        }
      })
      mapData.options = option
      if(mapData.options.length == 0){
        notSearchFn()
        message.warning({
          content: '未搜索到相关位置',
          duration: 3
        })
        mapData.address = ''
      }
      console.log('地图搜索事件: ', option)
      markerLayer();
    } else {
      message.warning(resp.message)
    }
  })
}

// 选择搜索的内容
const onSelect = (val: string, option: any) => {
  console.log('val: ', val, ', option: ', option)
  if (val) {
    mapData.address = option.value
    mapData.location = [option.location.lat, option.location.lng]
    console.log('mapData: ', mapData)
    map.destroy()
    initMap()
  }
}

const notSearchFn = () => {
  // 当赋值时，避免触发查询,存在点击获取的地名，无法用查询接口查到对应地址
  notSearch = true
  setTimeout(() => {
    notSearch = false
  }, 800);
}

// 搜索
const onSearch = (val) => {
  map_addressFn(val)
}
const map_addressFn = debounce(function (searchStr) {
  mapSearch(searchStr)
}, 500)

defineExpose({
  showMoadl
});
</script>

<style lang="less">
.drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.h500{
  height: 500px;
}
.map-footer{
  z-index: 1001;
}
</style>
