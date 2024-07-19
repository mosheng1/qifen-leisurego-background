import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLineData, getColumnData } from '@/api/recent_data.js'
import { useTimeStore } from './time.js'
import { ElMessage ,ElNotification } from 'element-plus'

export const recentDataStore = defineStore('recentData', () => {
    const timeStore = useTimeStore()
    const formData = ref({
        begin: 0,
        end: 0
    })
    const data = ref([])
    const lineChartData = ref([])// 线形图数据
    const ColumnChartData = ref([])// 柱形图数据;
    const newOrder = ref()// 新增单数
    const newDeal = ref()// 新增成交量
    const newUser = ref()// 新增用户
    const newProfession = ref()// 新增职业
    const newDate = ref()// 日期
    const lineLoading = ref(false)
    const columnLoading = ref(false)
    const ColumnChartDataName = ref([])// 饼状图名称
    const ColumnChartDataNum = ref([])// 饼状图数据
    const timePeriods = ref(async (index) => {// 时间段选择器
        const fetchDataAndUpdateCharts = async (beginDaysAgo, endDaysAgo) => {// 获取数据
            formData.value.begin = timeStore.getDaysAgo(beginDaysAgo);// 获取开始日期
            formData.value.end = timeStore.getCurrentDate(endDaysAgo);// 获取结束日期
            console.log(formData.value);
            // lineLoading.value = true;
            // const line = await getLineData(formData.value);// 获取线形图数据
            // lineLoading.value = false;
            // lineChartData.value = line.data.data;// 线形图数据
            // columnLoading.value = true;
            // const column = await getColumnData(formData.value);// 获取柱形图数据
            // columnLoading.value = false;
            // ColumnChartData.value = column.data.data;// 柱形图数据

            // 设置两个加载状态为 true
            lineLoading.value = true;
            columnLoading.value = true;

            // 同时发起两个请求
            const requests = [
                getLineData(formData.value).then(response => {// 获取线形图数据
                    lineChartData.value = response.data.data;
                    lineLoading.value = false;
                }).catch(error => {
                    console.error("获取线形图数据失败:", error);
                    lineLoading.value = true;
                }),
                getColumnData(formData.value).then(response => {// 获取柱形图数据
                    ColumnChartData.value = response.data.data;
                    columnLoading.value = false;
                }).catch(error => {
                    console.error("获取柱形图数据失败:", error);
                    columnLoading.value = true;
                })
            ];

            // 等待所有请求完成，但不必等所有请求都成功
            await Promise.allSettled(requests);

        }

        switch (index) {
            case 0: // 近30日
                await fetchDataAndUpdateCharts(29, 0);
                ElNotification({
                    message: '已为您显示近30日数据',
                    type: 'success',
                })
                break;
            case 1: // 近7日
                await fetchDataAndUpdateCharts(6, 0);
                ElNotification({
                    message: '已为您显示近7日数据',
                    type: 'success',
                })
                break;
            case 2: // 昨日
                await fetchDataAndUpdateCharts(1, 1);
                ElNotification({
                    message: '已为您显示昨日数据',
                    type: 'success',
                })
                break;
            default:
                ElMessage({
                    message: '未知错误',
                    type: 'error',
                })
                break;
        }

        newOrder.value = lineChartData.value.newOrder.split(',').map(Number);
        newDeal.value = lineChartData.value.newDeal.split(',').map(Number);
        newUser.value = lineChartData.value.newUser.split(',').map(Number);
        newProfession.value = lineChartData.value.newProfession.split(',').map(Number);
        newDate.value = lineChartData.value.date.split(',').map(date => `${date}`);
        newOrder.value.length == 1 ? newOrder.value = [`${newOrder.value}` / 2, `${newOrder.value}`] : newOrder.value = newOrder.value;
        newDeal.value.length == 1 ? newDeal.value = [`${newDeal.value}` / 5, `${newDeal.value}`] : newDeal.value = newDeal.value;
        newUser.value.length == 1 ? newUser.value = [`${newUser.value}` / 2, `${newUser.value}`] : newUser.value = newUser.value;
        newProfession.value.length == 1 ? newProfession.value = [`${newProfession.value}` / 1, `${newProfession.value}`] : newProfession.value = newProfession.value;
        newDate.value.length == 1 ? newDate.value = ['00:00', '24:00'] : newDate.value = newDate.value;
        ColumnChartDataName.value = (ColumnChartData.value.name.split(','))
        ColumnChartDataNum.value = (ColumnChartData.value.numList.split(',').map(Number))
        // console.log(JSON.stringify(ColumnChartDataName.value));
        // console.log(JSON.stringify(ColumnChartDataNum.value));
    })

    return {
        timePeriods,
        lineChartData,
        newOrder,
        newDeal,
        newUser,
        newProfession,
        newDate,
        lineLoading,
        columnLoading,
        ColumnChartDataName,
        ColumnChartDataNum,
    }
})