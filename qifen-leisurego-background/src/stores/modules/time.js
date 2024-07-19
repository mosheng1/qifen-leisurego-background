import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns';

export const useTimeStore = defineStore(
    'qifen-time',
    () => {
        // 创建一个响应式的时间属性
        const currentTime = ref(new Date());
        // 格式化当前时间
        const formattedTime = computed(() => {
            return format(currentTime.value, `yyyy-MM-dd HH:mm:ss`);
        });
        // 使用 computed 创建一个计算属性来判断当前是早、中、晚
        const timeOfDay = computed(() => {
            const hours = currentTime.value.getHours();
            if (hours < 12) {
                return '早上好';
            } else if (hours < 18) {
                return '下午好';
            } else {
                return '晚上好';
            }
        });
        const getDaysAgo = (d) => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();
            const daysAgo = d;
            const date = new Date(year, month, day-1 - daysAgo);
            return format(date, 'yyyy-MM-dd');
        }
        const getCurrentDate = (d) => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();
            const daysAgo = d;
            const date = new Date(year, month, day-1 - daysAgo);
            return format(date, 'yyyy-MM-dd');
        }

        // 使用 onMounted 生命周期钩子初始化时间，并使用 setInterval 定时更新时间
        onMounted(() => {
            const updateCurrentTime = () => {
                currentTime.value = new Date();
            };
            updateCurrentTime(); // 初始化时间
            setInterval(updateCurrentTime, 1000); // 每秒更新一次时间
        });


        return {
            currentTime,
            timeOfDay,
            formattedTime,
            getDaysAgo,
            getCurrentDate
        }
    }

)