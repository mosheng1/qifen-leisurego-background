<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import * as echarts from 'echarts';
import { recentDataStore } from '@/stores'

const recentData = recentDataStore();
const chartDom = ref(null);
let myChart = null;

const initializeChart = () => {
  myChart = echarts.init(chartDom.value);
  const option = {
    color: new echarts.graphic.LinearGradient(
      0, 0, 1, 0, [{//只要修改前四个参数就ok
        offset: 0,
        color: '#FF7700'
      }, //柱图渐变色
      {
        offset: 1,
        color: '#FCC62A'
      }
    ]
    ),
    title: {
      text: '挂单类型Top10'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: recentData.ColumnChartDataName
    },
    series: [
      {
        // name: '2011',
        type: 'bar',
        data: recentData.ColumnChartDataNum
      },

    ]

  };
  myChart.setOption(option);

  myChart.setOption(option);
};

const resizeChart = () => {
  if (myChart) {
    myChart.resize();
  }
};

onMounted(() => {
  initializeChart();
  if (chartDom.value) {
    initializeChart();
  } else {
    setTimeout(() => {
      initializeChart();
    }, 0);
  }
  window.addEventListener('resize', resizeChart);
  watchEffect(() => {
    myChart.setOption({
      yAxis: {
        data: recentData.ColumnChartDataName
      },
      series: [
        {
          data: recentData.ColumnChartDataNum
        },
      ]
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  if (myChart) {
    myChart.dispose();
  }
});


</script>

<template>
  <div ref="chartDom" class="PieChart"></div>
</template>

<style scoped>
.PieChart {
  width: 100%;
  height: 100%;
  background-color: #fff;
  /* margin: 10px; */
  /* border-radius: 12px; */
  border-radius: 0 0 12px 0;

  padding: 15px;
  /* box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); */
}
</style>
