<script setup>
import { ref, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'
import { DocumentAdd, Finished, Iphone, User } from '@element-plus/icons-vue'
import { useUserStore, useTimeStore, useWeatherStore, recentDataStore } from '@/stores'
import { getAgencyData, getAgencyCount } from '@/api/index.js'
import LineChart from '@/views/homePage/components/LineChart.vue'
import ColumnChar from './components/ColumnChar.vue'
import WeatherIcon from './components/WeatherIcon.vue'
import axios from 'axios'


const userStore = useUserStore()
const timeStore = useTimeStore()
const weatherStore = useWeatherStore()
const recentData = recentDataStore()

const totalOrder = ref(0)// 挂单数
const totalDeal = ref(0)// 交易量
const totalUser = ref(0)// 总用户
const totalProfession = ref(0)// 总职业户

const totalOrderValue = useTransition(totalOrder, { duration: 1000 })
const totalDealValue = useTransition(totalDeal, { duration: 1000 })
const totalUserValue = useTransition(totalUser, { duration: 1000 })
const totalProfessionValue = useTransition(totalProfession, { duration: 1000 })

//获取总数据
async function getData() {
    const getTotalData = await getAgencyCount()
    // console.log(getTotalData.data.data);
    totalOrder.value = getTotalData.data.data.totalOrder
    totalDeal.value = getTotalData.data.data.totalDeal
    totalUser.value = getTotalData.data.data.totalUser
    totalProfession.value = getTotalData.data.data.totalProfession
}
getData()
const beReviewed = ref(0)// 待审核
const reviewed = ref(0)// 已审核
const violations = ref(0)// 违规数
//获取待审核数据
async function pending() {
    const pendingData = await getAgencyData()
    // console.log(pendingData.data.data);
    beReviewed.value = pendingData.data.data.beReviewed
    reviewed.value = pendingData.data.data.reviewed
    violations.value = pendingData.data.data.violations
}
pending()
recentData.timePeriods(1)
const sindex = ref(1);
const data_range = (e, index) => {
    // 获取 e.target 的父元素
    const parent = e.target.parentElement;
    // 遍历父元素的子元素
    Array.from(parent.getElementsByClassName('select_button_item')).forEach(item => {
        item.style.backgroundColor = '#f1f1f1';// 清除背景颜色
        item.classList.remove('active'); // 移除激活样式
    });
    // 设置当前目标的背景颜色
    e.target.style.backgroundColor = '#FFC100';
    e.target.classList.add('active'); // 添加激活样式
    //如果点击的是active标记的按钮，不做任何操作
    if (sindex.value == index) {
        // console.log('已经是active');
        return;
    }
    sindex.value = index;// 保存当前选择的index
    recentData.timePeriods(index)
}
// window.addEventListener("wheel", function (event) {
//     // 禁用Ctrl+滚轮的放缩行为
//     if (event.ctrlKey === true || event.metaKey) {
//         event.preventDefault();
//     }
// }, { passive: false });

// 监听浏览器大小变化
const componentKey = ref(1)
let resizeTimeout;
window.addEventListener("resize", () => {  
    // 清除上一个定时器，如果存在的话  
    clearTimeout(resizeTimeout);  
  
    // 设置一个新的定时器，在稍微延迟后执行操作  
    resizeTimeout = setTimeout(() => {  
        console.log("变化停止了");  
        componentKey.value = (componentKey.value + 1) % 11; // 使用模运算来保持值在1到10之间  
    }, 300); // 这里的200毫秒是一个示例值，你可以根据需要进行调整  
});
 
</script>

<template>
    <div class="grid-container" >
        <!-- <iframe :src="detailedWeather" frameborder="0" style="width: 100%; height: 100%;"></iframe> -->
        <div class="row-1">
            <div class="title-left">
                <div>
                    <el-image class="avatar" :src="userStore.user.image"></el-image>
                </div>
                <div>
                    <el-text class="title-left-text1"
                        style="font-size: 26px !important; color: #000;font-weight: bold">{{ timeStore.timeOfDay + ',' +
                        (userStore.user.sex != 9 ? userStore.user.name.slice(0, 1) :
                            userStore.user.name) + '' + ((userStore.user.sex === 1) ? '先生' : (userStore.user.sex === 0) ?
                                '女士' :
                                '') }},今天又是充满活力的一天!</el-text>
                </div>
                <div>
                    <el-text class="title-left-text2"
                        style="font-size: 18px !important; color: #fff;border-bottom: 1px solid #ebeaea;border-radius: 6px;">
                        <div class="weather-icon">
                            <WeatherIcon :weather="weatherStore.weather.text" style="width: 35px; height: 35px;">
                            </WeatherIcon>
                            <b style="font-size: 26px;color: #fff;margin-left: 5px;">{{ weatherStore.weather.temp + '°'
                                }}</b>
                            <b style="font-size: 10px;color: #fff;text-align: center;writing-mode: vertical-lr;">{{
                        weatherStore.city.replace(/市$/,
                            '') }}</b>

                        </div>
                        <el-tooltip effect="dark" content="点击查看详细天气"><a :href="weatherStore.detailedWeather"
                                target="blank" style="color: #6e6e6e; font-size: 14px;font-family: 幼圆;"><span>{{ '现在'
                        + weatherStore.weather.text + ',' }}{{ weatherStore.gentleReminder
                                    }}</span></a></el-tooltip>
                    </el-text>
                </div>
            </div>
            <div class="title-center">
                <p>待审核</p>
                <p>已审核</p>
                <p>违规数</p>
                <p>{{ beReviewed }}</p>
                <p>{{ reviewed + '/' + beReviewed }}</p>
                <p>
                    <RouterLink to="/violation" style="color: red;">{{ violations }}</RouterLink>
                </p>
            </div>
            <!-- 标题栏右侧 -->
            <div class="title-right">
                <div class="calendar">
                    <!-- 日历 -->
                    <el-popover placement="right" :width="400" trigger="click">
                        <template #reference>
                            <el-calendar v-model="timeStore.currentDate">
                                <template #dateCell="{ date }">
                                </template>
                            </el-calendar>
                        </template>
                        <el-calendar v-model="timeStore.currentDate"
                            style="border: 2px solid #FFC100;border-radius: 6px;margin: 0;padding: 0;">
                            <template #dateCell="{ date }">
                            </template>
                        </el-calendar>
                    </el-popover>
                </div>
            </div>
        </div>

        <!-- 数据总记 -->
        <div class="row-2">
            <!-- 总挂单数 -->
            <div class="grid-item">
                <div class="grid-item-statistic">
                    <el-statistic class="statistic" title="总单数" :value="totalOrderValue"
                        value-style="font-size: 36px !important; color: #ffffff" />
                    <div class="grid-item-statistic-icon">
                        <el-icon>
                            <DocumentAdd />
                        </el-icon>
                    </div>
                </div>
            </div>
            <!-- 总成交量 -->
            <div class="grid-item">
                <div class="grid-item-statistic">
                    <el-statistic class="statistic" title="总成交量" :value="totalDealValue"
                        value-style="font-size: 36px !important; color: #ffffff" />
                    <div class="grid-item-statistic-icon">
                        <el-icon>
                            <Finished />
                        </el-icon>
                    </div>
                </div>
            </div>
            <!-- 总用户数 -->
            <div class="grid-item">
                <div class="grid-item-statistic">
                    <el-statistic class="statistic" title="总用户" :value="totalUserValue"
                        value-style="font-size: 36px !important; color: #ffffff" />
                    <div class="grid-item-statistic-icon">
                        <el-icon>
                            <Iphone />
                        </el-icon>
                    </div>
                </div>
            </div>
            <!-- 总职业户数 -->
            <div class="grid-item">
                <div class="grid-item-statistic">
                    <el-statistic class="statistic" title="总职业户" :value="totalProfessionValue"
                        value-style="font-size: 36px !important; color: #ffffff" />
                    <div class="grid-item-statistic-icon">
                        <el-icon>
                            <User />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <!-- 时段选择按钮 -->
        <div class="select_button">
            <!-- 左边按钮 -->
            <div class="s-left">
                <div class="s-left-bg">
                    <el-button class="select_button_item" type="primary" @click="data_range($event, 0)">近30日</el-button>
                    <el-button class="select_button_item active" type="primary"
                        @click="data_range($event, 1)">近7日</el-button>
                    <el-button class="select_button_item" type="primary" @click="data_range($event, 2)">昨日</el-button>
                </div>
            </div>
            <!-- 右边时间 -->
            <div class="s-right">
                <el-icon style="margin-right: 10px;">
                    <svg t="1717575813030" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="7155" width="200" height="200">
                        <path
                            d="M874.179108 149.919291C777.456788 53.255031 648.909794 0 512.10296 0 375.343491 0 246.779689 53.255031 150.097095 149.929986 53.379358 246.635499 0.118216 375.225275 0.118216 512.003079c-0.024446 136.793083 53.195443 265.353829 149.900956 362.11893 96.670371 96.613839 225.246396 149.878037 361.98753 149.878037 136.806834 0 265.42564-53.297812 362.172407-149.978879C1073.767443 674.41297 1073.798001 349.603883 874.179108 149.919291L874.179108 149.919291 874.179108 149.919291zM826.994433 826.827324c-84.130878 84.118655-195.994709 130.492014-314.986203 130.492014-118.90746 0-230.743788-46.350441-314.819662-130.392701C113.111166 742.833957 66.820314 630.993045 66.838649 512.003079c0-118.97316 46.313771-230.826295 130.420203-314.899113 84.094208-84.074346 195.893867-130.372838 314.844108-130.372838 118.954825 0 230.77893 46.296964 314.891473 130.378949C1000.583984 370.74241 1000.583984 653.25458 826.994433 826.827324L826.994433 826.827324 826.994433 826.827324zM733.350836 637.475934l-176.979966-102.351112L556.37087 256.000011c0-23.557196-19.111001-42.666669-42.674308-42.666669-23.544973 0-42.655973 19.109473-42.655973 42.666669l0 298.669736c0 15.826011 19.671741 29.095841 32.467921 36.437411 3.538621 5.329323 13.268303 10.15291 19.199619 13.564716l176.000581 106.673547c20.388327 11.769431 42.495544 4.774694 54.271086-15.619744 11.775542-20.40055 0.811316-46.469617-19.630487-58.245159l0 0L733.349308 637.475934zM733.350836 637.475934"
                            fill="#373737" p-id="7156"></path>
                    </svg>
                </el-icon>
                <el-text style="font-size: 24px !important; color: #373737;">{{
                        timeStore.formattedTime }}</el-text>
            </div>
        </div>
        <div class="row-3" >
            <div class="grid-item grid-item-second-row-1" v-loading="recentData.lineLoading"
                element-loading-text="加载中...">
                <!-- 折线图 -->
                <LineChart :key="componentKey" ref="lineChart" style="width: 100%; height: 100%;"></LineChart>
            </div>
            <div class="grid-item grid-item-second-row-2" v-loading="recentData.columnLoading"
                element-loading-text="加载中...">
                <!-- 柱状图 -->
                <ColumnChar :key="componentKey" style="width: 100%; height: 100%;"></ColumnChar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" >
* {
    text-decoration: none;
}

.row-2 .grid-item:nth-child(1) {
    .grid-item-statistic {
        background: linear-gradient(-45deg, #d10d8c 0%, #e94fa6 100%);
    }
}

.row-2 .grid-item:nth-child(2) {
    .grid-item-statistic {
        background: linear-gradient(-45deg, #7b12ec 0%, #b749eb 100%);
    }
}

.row-2 .grid-item:nth-child(3) {
    .grid-item-statistic {
        background: linear-gradient(-45deg, #0e61dc 0%, #3e90ec 100%);
    }
}

.row-2 .grid-item:nth-child(4) {
    .grid-item-statistic {
        background: linear-gradient(-45deg, #dc5908 0%, #ed9441 100%);
    }
}

.grid-item-statistic {
    height: 90% !important;
    width: 95% !important;
    border-radius: 12px !important;
    // background-color: #ffffff;
    position: relative !important;
    $margin: 10px;
    color: #ffffff;

    .statistic {
        .el-statistic__head {
            padding: $margin;
            font-size: 16px !important;
            color: #ffffff;
        }

        .el-statistic__content * {
            position: absolute;
            right: $margin;
            bottom: $margin;
            color: #ffffff;
        }
    }

    .grid-item-statistic-icon {
        position: absolute !important;
        bottom: $margin !important;
        left: $margin !important;
    }
}

.grid-container {
    width: 100%;
    height: 100% !important;
    font-size: 26px;
    background-color: #ebebeb;
    display: grid;
    grid-gap: 10px;
    //规定每行占用多少空间
    grid-template-rows: minmax(150px, auto) minmax(120px, auto) 35px 1fr;

    .grid-item {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.row-1 {
    background-color: #ffffff;
    box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.1);
    border-radius: 12px;
    display: grid;
    grid-template-columns: minmax(350px, 8fr) 20% 300px;
    grid-gap: 0px;
    overflow: hidden;

    .title-left {
        background-color: #ffffff;
        display: grid;
        grid-template-columns: 150px 88%;
        grid-template-rows: repeat(2, 1fr);
        gap: 0px;
        padding-right: 20%;

        div:nth-child(1) {
            grid-row: 1/3;
            display: flex;
            justify-content: center;
            align-items: center;

            .avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin: 0px 10px;
            }
        }

        div:nth-child(2) {
            display: flex;
            flex-direction: column;
            /* 垂直方向排列子元素 */
            justify-content: flex-end;
            /* 使子元素在父容器内底部对齐 */
            align-items: flex-end;
            position: relative;

            .title-left-text1 {
                position: absolute;
                left: 0;
            }
        }

        div:nth-child(3) .title-left-text2 {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .weather-icon {
                font-size: 12px;
                width: 110px !important;
                height: 100% !important;
                // background-color: #0e61dc;
                display: flex;
                justify-content: center;
                align-items: center;
                //渐变色
                background: linear-gradient(-45deg, #3583f9 0%, #8cbcf3 100%);
                border-radius: 6px;
                margin-right: 10px;
                padding: 5px;
            }

            a {
                height: 40px;

                span {
                    transition: background-size 1300ms;
                    line-height: 20px;
                    background: linear-gradient(to right, #95d5f3, #b9e9f6) no-repeat right bottom;
                    background-size: 0 2px;
                    border-radius: 10%;
                }
            }

            a:hover span {
                background-position-x: left;
                background-size: 100% 2px;
            }
        }

    }


    .title-right::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
        background-color: #ffffff;
    }

    .title-right::-webkit-scrollbar {
        width: 3px;
        background-color: rgb(251, 171, 0);
    }

    .title-right::-webkit-scrollbar-thumb {
        background-image: -webkit-linear-gradient(90deg, #bebdbb 0%, #5f5e5e 100%);
    }

    .title-center {
        // background-color: #e06d6d;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        font-size: 16px;
        text-align: center;

        p:nth-child(1),
        p:nth-child(2),
        p:nth-child(3) {
            padding-top: 50px;
            color: #605f5f;
        }

        p:nth-child(4),
        p:nth-child(5),
        p:nth-child(6) {
            font-size: 23px;
            font-weight: bold;
        }
    }

    .title-right {
        // background-color: #f16060;
        overflow: auto;
        // border-radius: 12px;

        // border-left:5px solid #8b8a8a;
        // outline: 1px solid #fab107;


        thead th {
            // margin: 0 !important;
            padding: 0px 0 !important;
        }

        tbody td .el-calendar-day {
            height: 25px !important;
        }

        .el-calendar>* {
            margin: 0 !important;
            padding: 0 !important;
        }
    }

}

// 日历样式
.el-calendar {
    --el-calendar-border: none !important;
    background-color: #ffffff !important;

    .current {
        border-radius: 10%;
        overflow: hidden;
    }

    .el-calendar-day {
        display: flex;
        justify-content: center;
        align-items: center;

    }

    tbody td .el-calendar-day {
        height: 50px !important;
    }
}

.el-popper.is-light.el-popover {
    background-color: #ffffff !important;
    padding: 5px !important;
}

.calendar {
    width: 100%;
    height: 100%;
    // background: linear-gradient(-45deg, #efc704 0%, #f8c954 100%);
    font-size: 12px;
    text-align: center;
    // border: 1px solid #969696;
}

.el-calendar__header {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 16px;
    border-bottom: 1px solid #363535;
}

.el-calendar {
    background: none;
    --el-calendar-selected-bg-color: rgba(255, 193, 0, 0.3);

    .el-calendar__body {
        margin: 0 !important;
        padding: 0 !important;
        padding-bottom: 10px !important;
    }

    .el-button {}

    .el-button:active,
    .el-button:hover {
        background-color: rgba(255, 193, 0, 0.3);
        color: #FFC100;
        border: 1px solid #FFC100;
    }

    .el-calendar-table td.is-today {
        font-weight: bold;
        color: #FFC100;
    }
}

.select_button {
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    display: grid;
    grid-template-columns: 8fr 300px;
    padding-left: 10px;
    background-color: #ffffff;
    border-radius: 12px 12px 0 0;
    // margin-bottom: 0;
    overflow: hidden;
    margin-bottom: -10px;

    .s-left,
    .s-right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .s-left {
        .s-left-bg {
            background-color: #f1f1f1;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;

            .select_button_item.active {
                background-color: #FFC100;
            }

            .select_button_item {
                margin: 0;
                background-color: #f1f1f1;
                border: none;
                color: #434242;
                border-radius: 6px;

                // background: linear-gradient(-45deg, #0e61dc 0%, #3e90ec 100%);
                span {
                    //鼠标穿透
                    pointer-events: none !important;
                }
            }

            .select_button_item:hover {
                background-color: rgba($color: #FFC100, $alpha: 0.5) !important;
            }
        }

    }

    .s-right {
        border: none;
        border-bottom: 2px solid #FFC100;
        padding-left: 40px;
        background-size: cover;
        margin-right: 0px;
    }

}

.row-2 {
    display: grid;
    //规定每列占用多少空间
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
    background-color: #fff;
    // box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.1);
    // border-radius: 12px;
    border-radius: 12px;
}

.row-3 {
    display: grid;
    // grid-gap: 10px;
    grid-template-columns: 7fr 5fr;

    .grid-item {
        position: relative;
    }
}

/* scss循环赋予每个块不同的颜色 */
$colors: red, orange, yellow, green, blue, indigo, violet; // 定义颜色列表  

@for $i from 1 through 6 {
    .row-3 .grid-item:nth-child(#{$i}) {
        //background-color: nth($colors, $i);
    }

    ;
}
</style>@/api/recentData@/api/recent_data