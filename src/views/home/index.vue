<template>
  <div class="home-wrap">
    <div class="ant-row">
      <div class="ant-col ant-col-18 home-left">
        <div class="home-block">
          <div class="home-title">系统交易概览</div>
          <div class="ant-row mt-10 mb-30">
            <div class="ant-col ant-col-12">
              <div class="xtjy-cont jyje">
                <div class="xtjy-txt-1">总交易金额</div>
                <div class="xtjy-txt-2">{{allAmount}}</div>
                <div class="xtjy-txt-3">今日交易金额：{{todayAmount}}</div>
              </div>
            </div>
            <div class="ant-col ant-col-12">
              <div class="xtjy-cont bishu">
                <div class="xtjy-txt-1">累计交易笔数</div>
                <div class="xtjy-txt-2">{{allCount}}</div>
                <div class="xtjy-txt-3">今日交易笔数：{{todayCount}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="home-block">
          <div class="home-title">业务数据</div>
          <div class="ywsj-cont">
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_kehu.png" alt="">
                <span class="item-txt">客户数</span>
              </span>
              <div class="item-num">{{businessData.clientTotalCount?businessData.clientTotalCount:0}}个</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_user.png" alt="">
                <span class="item-txt">用户数</span>
              </span>
              <div class="item-num">{{businessData.peopleTotalCount?businessData.peopleTotalCount:0}}人</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_order.png" alt="">
                <span class="item-txt">订单数</span>
              </span>
              <div class="item-num">{{businessData.orderCount?businessData.orderCount:0}}笔</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_kaipiao.png" alt="">
                <span class="item-txt">未申请开票</span>
              </span>
              <div class="item-num">{{businessData.invoiceNoCount?businessData.invoiceNoCount:0}}笔</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_pro.png" alt="">
                <span class="item-txt">合同到期预警</span>
              </span>
              <div class="item-num">{{businessData.contractWarningCount?businessData.contractWarningCount:0}}条</div>
            </div>
          </div>
        </div>

        <div class="home-block">
          <div class="home-title">财务数据</div>
          <div class="ywsj-cont">
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_zhangdan.png" alt="">
                <span class="item-txt">未结算账单</span>
              </span>
              <div class="item-num">{{financialData.generateNoCount?financialData.generateNoCount:0}}条</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_user.png" alt="">
                <span class="item-txt">当月超10万</span>
              </span>
              <div class="item-num">{{financialData.excessPeopleCount?financialData.excessPeopleCount:0}}人</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_kaipiao.png" alt="">
                <span class="item-txt">未开发票</span>
              </span>
              <div class="item-num">{{financialData.invoiceNoCount?financialData.invoiceNoCount:0}}张</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_jinge.png" alt="">
                <span class="item-txt">成交金额</span>
              </span>
              <div class="item-num">{{financialData.allAmount?financialData.allAmount:0}}万元</div>
            </div>
            <div class="ywsj-item">
              <span class="item-round">
                <img class="item-img" src="@/assets/images/home/home_icon_yue.png" alt="">
                <span class="item-txt">客户余额</span>
              </span>
              <div class="item-num">{{financialData.walletAmount?financialData.walletAmount:0}}万元</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ant-col ant-col-6 home-right">
        <div class="home-block home-block-xtxx">
          <div class="home-title">
            <span>系统消息</span>
          </div>
          <div class="xtxx-cont">
            <ul>
              <li class="xtxx-item" v-for="item of msgList">
                <p class="item-txt1 ellipsis">{{ item.operateByName }}</p>
                <p class="item-txt2 ellipsis">{{ item.title }}</p>
                <p class="item-txt2">{{ item.operateOn }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 合同预警弹窗 -->
  <!-- <HeTongYuJingModal ref="heTongYuJingModalRef" /> -->
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import AmountDay from './echarts/AmountDay.vue';
import CountEcharts from './echarts/CountEcharts.vue';
// import HeTongYuJingModal from './modal/heTongYuJingModal.vue';
import ServiceApi from './service';
const route = useRoute()
const router = useRouter()
console.log('route.query： ', route.query)

let msgList = ref([] as any[]) // 系统消息列表
let allAmount = ref<number>(0.00) // 累计交易金额
let allCount = ref<number>(0) // 累计交易笔数
let todayAmount = ref<number>(0) // 今日交易金额
let todayCount = ref<number>(0) // 今日交易笔数
let businessData = reactive({
  clientTotalCount: 0,
  peopleTotalCount: 0,
  orderCount: 0,
  invoiceNoCount: 0,
  contractWarningCount: 0,
})
let financialData = reactive({
  allAmount: 0,
  excessPeopleCount: 0,
  generateNoCount: 0,
  invoiceNoCount: 0,
  walletAmount: 0
})

let contractShow = ref<boolean>(false) // 合同到期预警
// let userType = reactive([1,2]) // 1-业务; 2-财务

// 获取当前用户的权限
// const handleUserType = () => {
//   const loginInfo:any = JSON.parse(localStorage.getItem('loginInfo') || '')
//   const menuList = loginInfo.menuList
  
//   if (loginInfo.userName === 'admin') {
//     userType = [1, 2]
//   } else {
//     let type = menuList.find((item:any) => {
//       return item.menuID === 3
//     })
//     if (type) userType = [1]
//     else userType = [2]
//   }
// }

// 获取系统消息列表
const getBulletinList = () => {
  ServiceApi.GetLogger({pageIndex:1,pageSize:10}).then((res:any) => {
    if(res.success){
      msgList.value = res.data
      console.log('获取系统消息列表: ', msgList)
    }
  })
}

// 获取交易金额
const GetTradingAmount = () => {
  ServiceApi.GetTradingAmount({}).then((res:any) => {
    allAmount.value = res.data.allAmount
    allCount.value = res.data.allCount
    todayAmount.value = res.data.todayAmount
    todayCount.value = res.data.todayCount
  })
}

// 业务数据
const GetBusinessData = () => {
  ServiceApi.GetBusinessData({}).then((res:any) => {
    console.log('业务数据 res: ', res)
      businessData.clientTotalCount = res.data.clientTotalCount
      businessData.peopleTotalCount = res.data.peopleTotalCount
      businessData.orderCount = res.data.orderCount
      businessData.invoiceNoCount = res.data.invoiceNoCount
      businessData.contractWarningCount = res.data.contractWarningCount
  })
}

// 财务数据
const GetFinancialData = () => {
  ServiceApi.GetFinancialData({}).then((res:any) => {
    console.log('财务数据 res: ', res)
    financialData.allAmount = Number((res.data.allAmount/10000).toFixed(2)),
    financialData.excessPeopleCount = res.data.excessPeopleCount,
    financialData.generateNoCount = res.data.generateNoCount,
    financialData.invoiceNoCount = res.data.invoiceNoCount,
    financialData.walletAmount = Number((res.data.walletAmount/10000).toFixed(2))
  })
}

// 去往系统公告页面
const gotoSystemNotice = () => {
  router.push({
    path: '/systemNotice',
    name: 'systemNotice',
  })
}

// 去其他页面
const gotoPage = (name:string, paramObj?:any) => {
  router.push({
    path: '/' + name,
    name: name,
    query: paramObj
  })
}

// 合同预警弹窗
const heTongYuJingModalRef = ref()
const handleHeTongYuJing = () => {
  heTongYuJingModalRef.value.handleShow();
}

onMounted(() => {
  // GetTradingAmount()
  getBulletinList()
  // GetBusinessData()
  // GetFinancialData()
});
</script>

<style lang="less">
@import "./index.less";
</style>