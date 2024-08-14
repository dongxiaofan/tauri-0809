<template>
  <div id="echarts_countEcharts" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, reactive, onMounted } from "vue";
import ServiceApi from '../service';

let amountDay = reactive([]) // 交易金额-30天
let recharge = reactive([]) // 充值金额-30天
let days = reactive([]) // 时间-30天
let amountCount = reactive([]) // 时间--30天 交易笔数
const name = '交易笔数'

//  获取交易金额和交易笔数(近30天)
const GetTrading30 = () => {
  ServiceApi.GetTrading30({}).then((res:any) => {
    if (res.success) {
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
  var myChart = echarts.init(document.getElementById('echarts_countEcharts'));
  var option = {
    tooltip : {
      trigger: 'axis',
      // axisPointer : {
      //   type : 'line'
      // },
      // formatter: '{b}: {c}笔'
    },
    legend: {
      top: '9%',
      right: '3%',
      icon: 'circle',
      data: name?[
        {
          name: name,
          // borderColor:'#02e1e4',
          textStyle: {
            color: '#8327A1'
          }
        },
      ]:null,
    },
    grid: {
      top: '20%',
      right: '4%',
      left: '9%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      color: '#671A7E',
      // data: timeData,
      data: days,
      axisPointer: {
        type: 'line'
      },
      axisLine: {
        lineStyle: {
          color: '#671A7E',
        }
      },
      axisLabel: {
        // margin: 8,
        // rotate: 10,
        color: '#671A7E',
        textStyle: {
          fontSize: 12,
          fontWeight: 100
        }
      },
      splitLine: {
        show: false
        // lineStyle: {
        //   color: '#272456'
        // }
      }
    }],
    yAxis: [{
      // type: "value",
      name: "单位:笔",
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
          color: '#671A7E',
        }
      },
      splitLine: {
        // show: false
        lineStyle: {
          color: 'rgba(255,255,255,.15)'
        }
      }
    }],
    series: [
      {
      name: name+'',
      type: 'line',
      symbol: 'circle',
      smooth: true,
      // data: userData,
      data: amountCount,
      // borderWidth: '6px',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(131,39,161,.8)' // 0% 处的颜色
        }, {
          offset: 0.7,
          color: 'rgba(131,39,161,.4)' // 0% 处的颜色
        }, {
          offset: 1,
          color: 'rgba(131,39,161,.05)' // 100% 处的颜色
        }], false)
      },
      itemStyle: {
        // color: '#fff',
        // borderWidth: 20,
        // shadowBlur: 10,
        // shadowColor: '#8327a1',
        // shadowOffsetX: 10,
        // shadowOffsetY: 10,
        normal: {
          color: '#671A7E',
          // borderWidth: 20
        }
      },
      
      lineStyle: {
        color: '#8327a1'
      }
    }]
  }
  myChart.setOption(option);
}

onMounted(() => {
  GetTrading30()
});
</script>