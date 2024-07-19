<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import * as echarts from 'echarts';
import { recentDataStore } from '@/stores'


const recentData = recentDataStore();
const chartDom = ref(null);
let myChart = null;

const initializeChart = () => {
    myChart = echarts.init(chartDom.value);
    const option = {
        title: {
            text: '近日成交数折线图'
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
        },
        legend: {
            data: ['新增职业人', '新增挂单数', '新增成交数', '新增用户']
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    type: 'jpeg',//	设置图片格式 png或者'jpeg
                    name: '成交统计图',
                    backgroundColor: '#FFF',
                    excludeComponents: ['toolbox'],
                    show: true,
                    title: '导出数据',
                }
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: recentData.newDate
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '新增职业人',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: recentData.newProfession
            },
            {
                name: '新增用户',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: recentData.newUser
            },
            {
                name: '新增成交数',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: recentData.newDeal
            },
            {
                name: '新增挂单数',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: recentData.newOrder
            },



        ]
    };
    myChart.setOption(option);
    // console.log(recentData.newDate);
    // console.log(recentData.newOrder);
    // console.log(recentData.newDeal);
    // console.log(recentData.newUser);
    // console.log(recentData.newProfession);
};

const resizeChart = () => {
    if (myChart) {
        myChart.resize();
    }
};

onMounted(() => {
    if (chartDom.value) {
        initializeChart();
    }
    window.addEventListener('resize', resizeChart);
    //监听数据变化，然后更新图表
    watchEffect(() => {
        myChart.setOption({
            xAxis: [
                {
                    data: recentData.newDate
                }
            ],
            series: [
                {
                    name: '新增职业人',
                    data: recentData.newProfession
                },
                {
                    name: '新增用户',
                    data: recentData.newUser
                },
                {
                    name: '新增成交数',
                    data: recentData.newDeal
                },
                {
                    name: '新增挂单数',
                    data: recentData.newOrder
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
    <!-- <div v-if="recentData.columnChart" class="LineChart" ></div> -->
    <div ref="chartDom" class="LineChart"></div>

</template>

<style scoped>
.LineChart {
    width: 100%;
    height: 100% !important;
    background-color: #fff;
    padding: 15px;
    border-radius: 0 0 0 12px;
}
</style>