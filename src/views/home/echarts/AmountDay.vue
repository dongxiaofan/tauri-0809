<template>
  <div id="echarts_amountDay" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { reactive, onMounted } from "vue";
import ServiceApi from '../service';

let amountDay = reactive([]) // 交易金额-30天
let recharge = reactive([]) // 充值金额-30天
let days = reactive([]) // 时间-30天
let amountCount = reactive([]) // 时间--30天 交易笔数

//  获取交易金额和交易笔数(近30天)
const GetTrading30 = () => {
  ServiceApi.GetTrading30({}).then((res:any) => {
    if (res.returnStatus) {
      let arr_day:any = [],
          arr_amount:any = [],
          arr_recharge:any = [],
          arr_count:any = []
      res.data.forEach((item:any) => {
        arr_day.push(item.TradingMonth + '-' + item.TradingDay)
        arr_amount.push((item.tradingPrice/10000).toFixed(2))
        arr_recharge.push((item.dealFund/10000).toFixed(2))
        arr_count.push(item.tradingCount)
      })
      days = arr_day
      amountDay = arr_amount
      recharge = arr_recharge
      amountCount = arr_count
      init()
    }
  })
}

const init = () => {
  var myChart = echarts.init(document.getElementById('echarts_amountDay'));
  var option = {
    tooltip : {
      trigger: 'axis',
    },
    color: ['#f9b87c','#02e1e4'],
    legend: {
      top: '9%',
      right: '3%',
      icon: 'circle',
      data: [{
        name: '充值金额',
        textStyle: {
          color: '#02e1e4'
        }
      },{
        name: '交易金额',
        textStyle: {
          color: '#f9b87c'
        }
      }],
    },
    grid: {
      top: '17%',
      right: '3%',
      left: '5%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      color: '#59588D',
      data: days,
      axisPointer: {
        type: 'line'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(11,175,229,1)'
        }
      },
      axisLabel: {
        color: '#671A7E',
        textStyle: {
          fontSize: 12,
          fontWeight: 100
        }
      },
      splitLine: {
        show: false
      }
    }],
    yAxis: [{
      name: "单位:万元",
      nameTextStyle: {
        color: '#0bafe5',
        fontStyle: 12
      },
      axisLabel: {
        formatter: '{value}',
        color: '#671A7E',
      },
      axisLine: {
        // show: false,
        lineStyle: {
          color: '#0bafe5'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(11,175,229,.15)'
        }
      }
    }],
    series: [{
      name: '交易金额',
      type: 'line',
      symbol: 'circle',
      symbolSize: 5,
      smooth: false,
      data: amountDay,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(0,242,241,.8)' // 0% 处的颜色
        }, {
          offset: 0.7,
          color: 'rgba(0,242,241,.4)' // 0% 处的颜色
        }, {
          offset: 1,
          color: 'rgba(0,242,241,.05)' // 100% 处的颜色
        }], false)
      },
      lineStyle: {
        normal: {
          color: '#f9b87c'
        }
      }
    },{
      name: '充值金额',
      type: 'line',
      symbol: 'circle',
      symbolSize: 5,
      smooth: false,
      data: recharge,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(2,225,1228,.8)' // 0% 处的颜色
        }, {
          offset: 0.7,
          color: 'rgba(2,225,1228,.4)' // 0% 处的颜色
        }, {
          offset: 1,
          color: 'rgba(2,225,1228,.05)' // 100% 处的颜色
        }], false)
      },
      lineStyle: {
        normal: {
          color: '#02e1e4'
        }
      }
    }]
  }
  myChart.setOption(option);
}

onMounted(() => {
  GetTrading30()
});
</script>