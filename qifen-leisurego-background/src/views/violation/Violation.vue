<script setup>
import pagecontainer from '@/components/PageContainer.vue';
import { ref, onMounted } from 'vue';
import { getViolationList, searchViolation } from '@/api/violation.js'
import { Search } from '@element-plus/icons-vue'
const tableData = ref([])
const retableData = ref({
    pageNum: 1,
    pageSize: 24,
    type: '',
    id: ''
})
const loading = ref(false)
const getTableData = async () => {
    loading.value = true
    const { data } = await getViolationList(retableData.value)
    loading.value = false
    tableData.value = data.data
    console.log(tableData.value);
}
getTableData() 
// 分页
const onCurrentChange = (currentPage) => {
    retableData.value.pageNum = currentPage
    getTableData()
}
const onSizeChange = (size) => {
    retableData.value.pageSize = size
    getTableData()
}
// 搜索
const search = ref()
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
        label: '评论',
    },
]
const searchSubmit = async () => {
    console.log(search.value);
    if (search.value == '' || search.value == undefined || search.value == null || search.value == 0) {
        // 如果搜索框为空，重新获取完整数据
        getTableData()
    } else {
        retableData.value.type = selectValue.value
        retableData.value.id = search.value
        loading.value = true
        const { data } = await searchViolation(retableData.value)
        loading.value = false
        tableData.value = data.data
        // 清空selectValue.value和search.value
        retableData.value.type = ''
        retableData.value.id = ''
    }
}
onMounted(() => {
    selectValue.value = select[0].value
})
</script>
<template>
    <div class="container">
        <pagecontainer title="违规内容">
            <el-input v-model="search" style="max-width: 300px;z-index: 99999 !important; " placeholder="请输入ID进行查询"
                class="input-with-select">
                <template #prepend>
                    <el-select style="z-index: 99999 !important;width: 100px" v-model="selectValue" placeholder="类型">
                        <el-option style="z-index: 99999 !important;" v-for="item in select" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </template>
                <template #append>
                    <el-button type="primary" @click="searchSubmit" :icon="Search" />
                </template>
            </el-input>
            <el-table :data="tableData.list" v-loading="loading" style="width: 100%;z-index: 0 !important;"
                size="large">
                <el-table-column label="编号">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="auditId" label="ID" />
                <el-table-column prop="type" label="违规类型">
                    <template #default="scope">
                        <el-tag type="danger">{{ scope.row.type == 1 ? '用户' : scope.row.type == 2 ? '文章' : '评论'
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="dateTime" label="违规时间" />
                <el-table-column :show-overflow-tooltip="true" label="违规内容" width="220">
                    <template #default="scope">
                        <el-tag
                            
                            type="danger">
                            {{ scope.row.auditDesc }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="tableData.pageNum" v-model:page-size="tableData.pageSize"
                :page-sizes="[3, 5, 7, 9, 11, 13, 15]" :background="true"
                layout="jumper,total, sizes, prev, pager, next " :total="tableData.total" @size-change="onSizeChange"
                @current-change="onCurrentChange" :default-page-size="11"
                style="margin-top: 20px; justify-content: flex-end" />
        </pagecontainer>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: #f6b6b6;
}
::v-deep .el-select-dropdown__item {
    z-index: 99999 !important;
}
::v-deep .el-tag{
    max-width: 200px ;
    overflow: hidden !important;
    // 显示不完用省略号
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
}
</style>