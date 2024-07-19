<script setup>
import AuditingTable from './components/AuditingTable.vue';
import pagecontainer from '@/components/PageContainer.vue';
import { ref, onMounted } from 'vue';
const count = ref(2)
const auditingTable = ref()
onMounted(() => {
    auditingTable.value.returnData.type=count.value
    auditingTable.value.AuditingData()
})
</script>

<template>
    <pagecontainer title="审核发布">
        <AuditingTable ref="auditingTable" />
    </pagecontainer>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
}
</style>