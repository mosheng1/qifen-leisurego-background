<script setup>
import { ref } from 'vue'
import { getManagementList, addManagement, deleteManagement } from '@/api/management.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import pagecontainer from '@/components/PageContainer.vue';
import { sub } from 'date-fns';
const tableData = ref([])
const loading = ref(false)
const retableData = ref({
    status: '',
    sensitive: '',
    pageNum: 1,
    pageSize: 11,
})
const getTableData = async () => {
    loading.value = true
    const { data } = await getManagementList(retableData.value)
    loading.value = false
    tableData.value = data.data
    // console.log(tableData.value);
}
getTableData()

// const onSizeChange = (size) => {
//     retableData.value.pageNum = 1
//     retableData.value.pageSize = size
//     getTableData()
// }

// 分页
const onCurrentChange = (currentPage) => {
    retableData.value.pageNum = currentPage
    getTableData()
}
const onSizeChange = (size) => {
    retableData.value.pageSize = size
    getTableData()
}
// 添加违禁词
const formAdd = ref({
    sensitive: ''
})
const dialogFormVisible = ref(false)
const edit = async () => {
    dialogFormVisible.value = true
}
const submitFormAdd = async () => {
    
    if (formAdd.value.sensitive === '') {
        ElMessage({
            type: 'error',
            message: '请输入违禁词',
        })
        formAdd.value.sensitive = ''
        return
    }
    if (formAdd.value.sensitive.includes('陈') || formAdd.value.sensitive.includes('灿') || formAdd.value.sensitive.includes('荣') || formAdd.value.sensitive.includes('ccr')) {
        ElMessage({
            type: 'error',
            message: '该词禁止添加',
        })
        formAdd.value.sensitive = ''
        return
    }
    loading.value = true
    await addManagement(formAdd.value)
    loading.value = false
    dialogFormVisible.value = false
    getTableData()
    formAdd.value.sensitive = ''
}
// 删除违禁词
const dialog = ref(false)
const del = async (row) => {
    const id = row.id
    ElMessageBox.confirm(
        '确定删除该违禁词？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            loading.value = true
            await deleteManagement(id)
            loading.value = false
            getTableData()
            ElMessage({
                type: 'success',
                message: '删除成功！',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
</script>

<template>
    <div class="container">
        <pagecontainer title="违禁词管理">
            <template #extra>
                <el-button type="primary" @click="dialogFormVisible = true">添加违禁词</el-button>
            </template>
            <el-table :data="tableData.list" v-loading="loading" style="width: 100%" size="large">
                <el-table-column label="编号">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="sensitive" label="关键字" />
                <el-table-column prop="createTime" label="创建日期" />
                <el-table-column prop="createUser" label="发布人" />
                <el-table-column label="状态">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
                            {{ scope.row.status === 0 ? '已启用' : '已禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="right">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-dialog v-model="dialog" title="确定删除该违禁词？" width="500">
                <template #footer>
                    <el-button @click="dialog = false">确定</el-button>
                    <el-button type="primary" @click="dialog = false">
                        取消
                    </el-button>
                </template>
            </el-dialog> -->
            <!-- <el-pagination @size-change="onSizeChange" layout="prev, pager, next" :total="tableData.total"
                @current-change="onCurrentChange" hide-on-single-page="true" /> -->
            <el-pagination v-model:current-page="tableData.pageNum" v-model:page-size="tableData.pageSize"
                :page-sizes="[3, 5, 7, 9, 11, 13, 15]" :background="true"
                layout="jumper,total, sizes, prev, pager, next " :total="tableData.total" @size-change="onSizeChange"
                @current-change="onCurrentChange" :default-page-size="11"
                style="margin-top: 20px; justify-content: flex-end" />
            <el-dialog v-model="dialogFormVisible" title="添加违禁词" width="500" draggable>
                <el-form ref="form" :model="formAdd" label-width="80px">
                    <el-form-item label="违禁词">
                        <el-input v-model="formAdd.sensitive" @keyup.enter="submitFormAdd"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="submitFormAdd">确定</el-button>
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
</style>