import request from '@/utils/request'
//获取违章查询列表
export const getViolationList =({pageNum,pageSize,type,id}) =>
  request.post('/api/bg/violations/list',{pageNum,pageSize,type,id})

// 搜索违章记录
export const searchViolation =({pageNum,pageSize,type,id}) =>
  request.post('/api/bg/violations/list',{pageNum,pageSize,type,id})
