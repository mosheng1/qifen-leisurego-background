<script setup>
import pagecontainer from '@/components/PageContainer.vue';
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue';
import { getSearch, editUserStatus, editArticleStatus } from '@/api/query.js'

const search = ref('')
const selectValue = ref('')
const select = [
    {
        value: '1',
        label: '用户',
    },
    {
        value: '2',
        label: '文章',
    },
    {
        value: '3',
        label: '订单',
    },
]
const loading = ref(true)
const tableData = ref([''])
const retableData = ref({
    type: '',// 1 用户 2 文章 3 订单
    id: '',// 用户id 文章id 订单id
    userId: '',// 用户id
    status: '',// 0 正常 1 冻结
    
})
const articleSubmit = ref({
    articleId: '',// 文章id
    type: '',// 文章类型
    operate: '',// 操作
    desc: '',// 备注
})
onMounted(() => {
    selectValue.value = select[0].value
})

const handleQuery = async () => {
    loading.value = true
    retableData.value.type = selectValue.value
    retableData.value.id = search.value
    const { data } = await getSearch(retableData.value)
    console.log(data.data);
    userStatus.value = data.data[0].status

    if (data.data[0] !== null) {
        tableData.value = data.data
        if (selectValue.value == 1) {
            tableData.value[0].labels = JSON.parse(tableData.value[0].labels);
        } else if (selectValue.value == 2) {
            tableData.value[0].images = tableData.value[0].images.split(',').map(url => url.trim())
            tableData.value[0].labels = tableData.value[0].labels.split(',').map(url => url.trim())
        }
        console.log(tableData.value);
        loading.value = false
    }


}
const dialogFormVisible = ref(false)
const userStatus = ref(0)
const articleStatus1 = ref(0)
const articleStatus2 = ref(0)

// 编辑
const handleEdit = async () => {
    if (selectValue.value == 1) {
        retableData.value.userId = tableData.value[0].id
        retableData.value.status = userStatus.value
        console.log(retableData.value, userStatus.value);
        await editUserStatus(retableData.value)
        // 关闭弹窗
        dialogFormVisible.value = false
        // 刷新页面
        handleQuery()
    } else if (selectValue.value == 2) {
        articleSubmit.value.articleId = tableData.value[0].id
        articleSubmit.value.type = articleStatus1.value
        articleSubmit.value.operate = articleStatus2.value
        console.log(articleSubmit.value);
        await editArticleStatus(articleSubmit.value)
        // 关闭弹窗
        dialogFormVisible.value = false
        // 刷新页面
        handleQuery()
    }

}

</script>

<template>
    <div class="container">
        <pagecontainer title="信息查询">
            <el-input @keyup.enter.native="handleQuery" v-model="search" style="max-width: 600px"
                placeholder="请输入ID进行查询" class="input-with-select">
                <template #prepend>
                    <el-select @change="handleQuery" v-model="selectValue" placeholder="类型" style="width: 100px">
                        <el-option v-for="item in select" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </template>
                <template #append>
                    <el-button @click="handleQuery" :icon="Search" />
                </template>
            </el-input>

            <el-empty v-if="loading" description="未查询到相关信息" />
            <el-descriptions v-if="selectValue == 1 && loading == false" border :column="1" title="用户信息" >
                <template #extra>
                    <el-button type="primary" @click="dialogFormVisible = true">编辑账号状态</el-button>
                </template>
                <el-descriptions-item label-class-name="label-class" label="头像">
                    <el-avatar :size="100" :src="tableData[0].image == null ? '' : tableData[0].image" />
                </el-descriptions-item>
                <el-descriptions-item label="ID">{{ tableData[0].id == null ? '无' : tableData[0].id
                    }}</el-descriptions-item>
                <el-descriptions-item label="名称">{{ tableData[0].name == null ? '无' : tableData[0].name
                    }}</el-descriptions-item>
                <!-- <el-descriptions-item label="密码">{{ tableData[0].password == null ? '无' : tableData[0].password
                    }}</el-descriptions-item> -->
                <el-descriptions-item label="手机号">{{ tableData[0].phone == null ? '无' : tableData[0].phone
                    }}</el-descriptions-item>
                <el-descriptions-item label="微信号">{{ tableData[0].wxAccount == null ? '无' : tableData[0].wxAccount
                    }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ tableData[0].email == null ? '无' : tableData[0].email
                    }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ tableData[0].sex == null ? '无' : tableData[0].sex == 0 ? '男' : '女'
                    }}</el-descriptions-item>
                <el-descriptions-item label="标签">
                    <el-tag style="margin: auto 5px; padding: 5px;" v-if="tableData[0].labels !== null" type="primary"
                        v-for="(item, index) in tableData[0].labels" :key="index">{{ item.name + ':' + item.num
                        }}</el-tag>
                    <el-tag v-else type="primary">无</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否实名认证">{{ tableData[0].isCertification == null ? '无' :
                tableData[0].isCertification ==
                    0 ? '未认证' : '已认证' }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                    <el-tag style="margin: auto 5px; padding: 5px;" v-if="tableData[0].status !== null"
                        :type="tableData[0].status == 0 ? 'success' : 'warning'">{{ tableData[0].status == null ? '无' :
                tableData[0].status == 0 ? '正常'
                    : '冻结'
                        }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="用户类型">{{ tableData[0].flag == null ? '无' : tableData[0].flag == 0 ? '普通用户'
                : '职业用户'
                    }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ tableData[0].createTime == null ? '无' : tableData[0].createTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="登录时间">{{ tableData[0].loginTime == null ? '无' : tableData[0].loginTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="粉丝数">{{ tableData[0].fans == null ? '无' : tableData[0].fans
                    }}</el-descriptions-item>
                <el-descriptions-item label="关注数">{{ tableData[0].concern == null ? '无' : tableData[0].concern
                    }}</el-descriptions-item>
                <el-descriptions-item label="简介">{{ tableData[0].desc == null ? '无' : tableData[0].desc
                    }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions v-if="selectValue == 2 && loading == false" border :column="1" title="文章信息">
                <template #extra>
                    <el-button type="primary" @click="dialogFormVisible = true">编辑文章状态</el-button>
                </template>
                <el-descriptions-item label-class-name="label-class" label="ID">{{ tableData[0].id == null ? '无' : tableData[0].id
                    }}</el-descriptions-item>
                <el-descriptions-item label="标题">{{ tableData[0].title == null ? '无' : tableData[0].title
                    }}</el-descriptions-item>
                <el-descriptions-item label="发布者ID">{{ tableData[0].userId == null ? '无' : tableData[0].userId
                    }}</el-descriptions-item>
                <el-descriptions-item label="分类ID">{{ tableData[0].channelId == null ? '无' : tableData[0].channelId
                    }}</el-descriptions-item>
                <el-descriptions-item label="分类名称">{{ tableData[0].channelName == null ? '无' : tableData[0].channelName
                    }}</el-descriptions-item>
                <el-descriptions-item label="价格">{{ tableData[0].price == null ? '无' : tableData[0].price
                    }}/{{ tableData[0].timeType == null ? '无' : tableData[0].timeType == 1 ?
                '月' : tableData[0].timeType == 2 ? '天' :
                    tableData[0].timeType == 3 ? '时' : '次'
                    }}</el-descriptions-item>
                <el-descriptions-item label="是否包工具">{{ tableData[0].isTools == null ? '无' : tableData[0].isTools == 1 ?
                '包工具' : tableData[0].isTools == 2 ? '不包工具' : '无需工具'
                    }}</el-descriptions-item>

                <el-descriptions-item label="标签">
                    <el-tag style="margin: auto 5px; padding: 5px;" v-if="tableData[0].labels !== null" type="primary"
                        v-for="(item, index) in tableData[0].labels" :key="index">{{ item }}</el-tag>
                    <el-tag v-else type="primary">无</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="收藏数">{{ tableData[0].collection == null ? '无' : tableData[0].collection
                    }}</el-descriptions-item>
                <el-descriptions-item label="评论数">{{ tableData[0].comment == null ? '无' : tableData[0].comment
                    }}</el-descriptions-item>
                <el-descriptions-item label="浏览量">{{ tableData[0].views == null ? '无' : tableData[0].views
                    }}</el-descriptions-item>
                <el-descriptions-item label="服务地址">{{ tableData[0].ipAddress == null ? '无' : tableData[0].ipAddress
                    }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ tableData[0].createTime == null ? '无' : tableData[0].createTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ tableData[0].publishTime == null ? '无' : tableData[0].publishTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="审核状态">{{ tableData[0].status == null ? '无' : tableData[0].status == 0 ? '已审核'
                : '未审核'
                    }}</el-descriptions-item>
                <el-descriptions-item label="是否下架">{{ tableData[0].isDown == null ? '无' : tableData[0].isDown == 0 ? '否'
                : '是'
                    }}</el-descriptions-item>
                    <el-descriptions-item label="是否删除">{{ tableData[0].isDelete == null ? '无' : tableData[0].isDelete == 0 ? '否'
                : '是'
                    }}</el-descriptions-item> 
                <el-descriptions-item label="图片">
                    <el-image style="width: 100px; height: 100px; margin: 5px;" v-for="(item, index) in tableData[0].images"
                        :key="index" :src="item" fit="cover" />
                </el-descriptions-item>
            </el-descriptions>
            <el-descriptions v-if="selectValue == 3 && loading == false" border :column="1" title="订单信息">
                <el-descriptions-item label-class-name="label-class" label="ID">{{ tableData[0].id == null ? '无' : tableData[0].id
                    }}</el-descriptions-item>
                <el-descriptions-item label="订单号">{{ tableData[0].number == null ? '无' : tableData[0].number
                    }}</el-descriptions-item>
                <el-descriptions-item label="状态">{{ tableData[0].status == null ? '无' : tableData[0].status == 1 ? '待支付'
                : tableData[0].status == 2 ? '已付款' : tableData[0].status == 3 ? '已完成' : tableData[0].status == 4 ?
                    '已取消' : '已退款'
                    }}</el-descriptions-item>
                <el-descriptions-item label="发布用户ID">{{ tableData[0].userId == null ? '无' : tableData[0].userId
                    }}</el-descriptions-item>
                <el-descriptions-item label="下单文章ID">{{ tableData[0].articleId == null ? '无' : tableData[0].articleId
                    }}</el-descriptions-item>
                <el-descriptions-item label="下单用户ID">{{ tableData[0].submitUserId == null ? '无' :
                tableData[0].submitUserId
                    }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ tableData[0].orderTime == null ? '无' : tableData[0].orderTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="支付时间">{{ tableData[0].checkoutTime == null ? '无' :
                tableData[0].checkoutTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="支付方式">{{ tableData[0].payType == null ? '无' : tableData[0].payType == 1 ?
                '微信' : '支付宝'
                    }}</el-descriptions-item>
                <el-descriptions-item label="价格">{{ tableData[0].price == null ? '无' : tableData[0].price
                    }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ tableData[0].phone == null ? '无' : tableData[0].phone
                    }}</el-descriptions-item>
                <el-descriptions-item label="订单号">{{ tableData[0].number == null ? '无' : tableData[0].number
                    }}</el-descriptions-item>
                <el-descriptions-item label="取消原因">{{ tableData[0].cancelReason == null ? '无' :
                tableData[0].cancelReason
                    }}</el-descriptions-item>
                <el-descriptions-item label="取消时间">{{ tableData[0].cancelTime == null ? '无' : tableData[0].cancelTime
                    }}</el-descriptions-item>
                <el-descriptions-item label="成交时间">{{ tableData[0].deliveryTime == null ? '无' :
                tableData[0].deliveryTime
                    }}</el-descriptions-item>
            </el-descriptions>
            <!-- 编辑用户状态弹窗 -->
            <el-dialog v-if="selectValue == 1" v-model="dialogFormVisible"
                :title="`${tableData[0].name}的账号状态：${tableData[0].status == 0 ? '正常' : '冻结'}`" width="500">
                <el-radio-group v-model="userStatus" class="ml-4">
                    <el-radio value="0" size="large">解冻账户</el-radio>
                    <el-radio value="1" size="large">冻结账户</el-radio>
                </el-radio-group>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="handleEdit()">确定</el-button>
                        <el-button @click="dialogFormVisible = false">
                            取消
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 编辑文章状态弹窗 -->
            <el-dialog v-if="selectValue == 2" v-model="dialogFormVisible"
                :title="`当前文章的状态：${tableData[0].status == 0 ? '正常' : '下架'}`" width="500">
                操作类型：
                <el-radio-group v-model="articleStatus1" class="ml-4">
                    <el-radio value="1" size="large">是否下架</el-radio>
                    <el-radio value="2" size="large">是否删除</el-radio>
                </el-radio-group>
                <br />
                执行操作：
                <el-radio-group v-model="articleStatus2" class="ml-4">
                    <el-radio value="0" size="large">否</el-radio>
                    <el-radio value="1" size="large">是</el-radio>
                </el-radio-group>
                <br />
                添加备注：
                <el-input v-model="articleSubmit.desc" style="width: 240px" autosize type="textarea"
                    placeholder="请输入备注信息" />
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="handleEdit()">确定</el-button>
                        <el-button @click="dialogFormVisible = false">
                            取消
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </pagecontainer>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
}

.input-with-select {
    width: 300px;
}

:deep(.label-class) {
    width: 200px;
    max-width:300px !important;
}
</style>