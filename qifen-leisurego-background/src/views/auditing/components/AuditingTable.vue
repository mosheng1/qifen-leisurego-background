<template>
  <!-- 表格 -->
  <el-table v-loading="tableLoading" :data="tableData.list" style="width: 100%" highlight-current-row
    @row-click="rowClick" size="large" :default-sort="{ prop: 'date', order: 'descending' }">
    <el-table-column label="编号">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="来源">
      <template #default="scope">
        <el-tag :type="scope.row.origin == 1 ? 'danger' : 'success'">{{ scope.row.origin == 1 ? '用户举报' : '正常流程'
          }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="发布时间" sortable prop="createTime" />
    <el-table-column :label="auditingType !== 2 ? '违规事项' : '描述'" prop="auditDesc" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="text" @click.stop="rowClick(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="tableData.pageNum" v-model:page-size="tableData.pageSize"
    :page-sizes="[3, 5, 7, 9, 11, 13, 15]" :background="true" layout="jumper,total, sizes, prev, pager, next "
    :total="tableData.total" @size-change="onSizeChange" @current-change="onCurrentChange" :default-page-size="11"
    style="margin-top: 20px; justify-content: flex-end" />
  <!-- 抽屉 -->
  <el-drawer v-model="drawer" title="审核详情" with-header>
    <!-- 
      1.ID      1.ID        1.ID
      2.名字    2.描述      2.详情
      3.违规项  3.价格      3.违规项
      4.时间    4.创建时间  4.创建时间
      5.头像    5.图片      5.图片
     -->
    <!-- <p>{{ auditingType }} </p> -->
    <el-descriptions title="" border column="1">
      <el-descriptions-item size="large" label="ID">{{ rowData.auditId }}</el-descriptions-item>
      <el-descriptions-item size="large" :label="auditingType == 1 ? '名字' : auditingType == 2 ? '描述' : '详情'">{{
    auditingType == 1 ? details.name : details.content }}</el-descriptions-item>
      <el-descriptions-item v-if="auditingType == 1" size="large" label="简介">{{ details.desc }}</el-descriptions-item>
      <el-descriptions-item size="large" :label="auditingType == 1 ? '时间' : '创建时间'">{{ rowData.createTime
        }}</el-descriptions-item>
      <el-descriptions-item size="large" label-class-name="my-label" v-if="auditingType != 2" label="违规项">
        <template #title>
          <el-badge value="new" class="item">
            违规项
          </el-badge>
        </template>
        <template #default>
          <el-tag type="danger">{{ rowData.auditDesc }}</el-tag>
        </template>
      </el-descriptions-item>
      <el-descriptions-item size="large" v-if="auditingType == 2" label="交易额">{{ details.price }}/{{ details.timeType
    ===
    1 ? '月' : details.timeType === 2 ? '日' : details.timeType === 3 ? '时' : '次' }}</el-descriptions-item>
    </el-descriptions>
    <!-- {{ details.name}} -->
    <el-image v-if="auditingType == 1" style="width: 100px; height: 100px" :src="details.image" :zoom-rate="1.2"
      :max-scale="7" :min-scale="0.2" fit="cover" :preview-src-list="details.image" />
    <el-image v-if="auditingType == 2" style="width: 100px; height: 100px" :src="item" :zoom-rate="1.2" :max-scale="7"
      :min-scale="0.2" fit="cover" :preview-src-list="details.images" v-for="(item, index) in details.images"
      :key="index" />
    <!-- <img style="width: 100px; height: 100px" :src="auditingType==1 ? details.image : item" alt="" v-for="(item,index) in details.images" :key="index"> -->
    <div class="btn-group">
      <el-tooltip effect="dark" content="双击通过审核" placement="top">
        <el-button type="success" @dblclick="auditPassOperate(0)">通过</el-button>
      </el-tooltip>
      <el-button type="danger" @click="auditPassOperate(1)">不通过</el-button>
    </div>
  </el-drawer>
  <!-- 弹窗 -->
  <el-dialog v-model="dialogFormVisible" title="选择不通过的原因" width="500">
    <el-checkbox-group v-model="checkedCities" :min="0">
      <el-checkbox v-for="city in cities" :key="city" :label="city" :value="city">
        {{ city }}
      </el-checkbox>
    </el-checkbox-group>
    <el-input type="textarea" v-if="!checkedCities.includes('其他违规') ? false : true" v-model="reason"
      placeholder="请输入不通过原因"></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="reasonSure(1)">确定</el-button>
        <el-button @click="reasonSure(0)">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getAuditingData, getUserData, getArticleData, getCommentData, auditPass } from '@/api/auditing.js'
import { ElMessage } from 'element-plus'
// 下拉框选项
const cities = ['内容违规', '图片违规', '用语不当', '其他违规']
// 下拉框值
const checkedCities = ref(['涉嫌违规'])
// 不通过原因
const reason = ref('')
const dialogFormVisible = ref(false)
const tableData = ref([])
const auditingType = ref(0) // 1:用户审核 2:文章审核
const drawer = ref(false)
const returnData = ref({
  pageNum: 1,
  pageSize: 30,
  type: 1
})
//获取审核数据
const tableLoading = ref(false)
const AuditingData = async () => {
  tableLoading.value = true
  const Auditing = await getAuditingData(returnData.value)
  tableLoading.value = false
  // console.log(Auditing.data.data);
  //类型
  auditingType.value = returnData.value.type
  // console.log(Auditing.data.data);
  tableData.value = Auditing.data.data
}

//定义详细信息
const details = ref([])
const rowData = ref({})
const images = ref([])
// 查看详情
const rowClick = async (row) => {
  // console.log(row)
  details.value = []//清空详情数据
  rowData.value = row//保存当前行数据
  drawer.value = true//打开抽屉
  //给auditPassData赋值，用于审核通过
  auditPassData.value.type = returnData.value.type
  auditPassData.value.auditId = row.auditId
  console.log(row.auditId);
  if (returnData.value.type == 1) {
    const data = await getUserData(row.auditId)
    details.value = data.data.data
  } else if (returnData.value.type == 2) {
    const data = await getArticleData(row.auditId)
    details.value = data.data.data

  } else if (returnData.value.type == 3) {
    const data = await getCommentData(row.auditId)
    details.value = data.data.data
  }
  if (details.value.images !== null && details.value.images !== undefined) {
    details.value.images = details.value.images.split(',').map(url => url.trim())
  } else {
    // 处理数据为空的情况
  }
  console.log(details.value);
}

// 审核通过数据
const auditPassData = ref({
  type: 0,//1:用户审核 2:文章审核
  auditId: 0,//审核ID
  isPass: -1,//是否通过0:通过 1:不通过
  desc: ''
})
const reasonSure = async (status) => {
  if (status == 1) {
    // 如果选择了其他违规，则需要输入原因
    if (checkedCities.value.includes('其他违规')) {
      if (reason.value == '') {
        ElMessage({
          type: 'error',
          message: '请输入不通过原因',
        })
      } else {
        handleAuditSuccess(status)
      }
    } else {
      handleAuditSuccess(status)
    }
  } else {
    dialogFormVisible.value = false//关闭弹窗
    ElMessage({
      type: 'info',
      message: '审核取消',
    })
  }
}
const handleAuditSuccess = async (status) => {
  auditPassData.value.isPass = status;
  auditPassData.value.desc = checkedCities.value + '' + reason.value;
  await auditPass(auditPassData.value);
  // 清除输入框
  reason.value = '';
  checkedCities.value = ['内容违规'];
  dialogFormVisible.value = false; // 关闭弹窗
  drawer.value = false; // 关闭抽屉
  //刷新页面
  AuditingData()
  ElMessage({
    type: 'success',
    message: '审核成功',
  });
}
const auditPassOperate = async (status) => {
  if (status == 0) {
    auditPassData.value.isPass = status
    auditPassData.value.desc = ''
    await auditPass(auditPassData.value)
    ElMessage({
      type: 'success',
      message: '审核成功',
    })
    drawer.value = false//关闭抽屉
    //刷新页面
    AuditingData()
  } else {
    dialogFormVisible.value = true
  }
}

// 分页
const onCurrentChange = (currentPage) => {
  returnData.value.pageNum = currentPage
  AuditingData()
}
const onSizeChange = (size) => {
  returnData.value.pageSize = size
  AuditingData()
}

// 暴露方法
defineExpose({ AuditingData, returnData })
</script>
<style scoped lang="scss">
::v-deep .el-table__body tr.current-row>td.el-table__cell {
  background: rgb(255, 230, 2, 0.2) !important;
}

:deep(.my-label) {
  background: rgba(255, 0, 0, 0.3) !important;
}

.btn-group {
  position: absolute;
  bottom: 30px;
  right: auto;
}

::v-deep .el-table__row:hover,
.el-table__body tr.current-row>td.el-table__cell:hover {
  // background-color: rgb(255, 230, 2, 0.2) !important;
  cursor: pointer;
}
</style>