import { ref }   from 'vue'
import { defineStore } from 'pinia'
export const auditingDataStore = defineStore('auditingData', () => {
    // 用户信息
    const user = ref([
        {
            id: 1,// 编号
            Account: 'admin',// 账号
            name: '花开富贵',// 姓名
            age: 20,// 年龄
            address: '北京市',// 地址
            creationDate: '2021-01-01',// 日期
            status: '未审核'// 状态
        }, {
            id: 2,
            Account: 'admin2',
            name: '花开富贵2',
            age: 20,
            address: '北京市2',
            creationDate: '2021-01-12',
            status: '未审核'
        },
        {
            id: 3,
            Account: 'admin3',
            name: '花开富贵3',
            age: 20,
            address: '北京市3',
            creationDate: '2021-01-15',
            status: '未审核'
        }
    ])
    // 发布信息
    const publish = ref([
        {
            id: 1,
            title: '发布1',
            content: '内容1',
            creationDate: '2021-01-01',
            status: '未审核',
            dataImages: [
                "https://picsum.photos/200/300?1",
                "https://picsum.photos/200/300?2",
                "https://picsum.photos/200/300?3",
                "https://picsum.photos/200/300?4",
                "https://picsum.photos/200/300?5",
                "https://picsum.photos/200/300?6",
                "https://picsum.photos/200/300?7",
                "https://picsum.photos/200/300?8",
                "https://picsum.photos/200/300?9",
            ]
        },
        {
            id: 2,
            title: '发布2',
            content: '内容2',
            creationDate: '2021-01-01',
            status: '未审核',
            dataImages: [
                "https://picsum.photos/200/300?10",
                "https://picsum.photos/200/300?11",
                "https://picsum.photos/200/300?12",
                "https://picsum.photos/200/300?13",
                "https://picsum.photos/200/300?14",
                "https://picsum.photos/200/300?15",
                "https://picsum.photos/200/300?16",
                "https://picsum.photos/200/300?17",
                "https://picsum.photos/200/300?18",
            ]
        }
    ])
    return{
        user,
        publish
    }
})