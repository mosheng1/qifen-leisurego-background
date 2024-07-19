import request from '@/utils/request'
//获取违禁词列表
export const getManagementList =({status,sensitive,pageNum,pageSize}) =>
  request.post('/api/bg/manage/list',{status,sensitive,pageNum,pageSize})

//添加违禁词
  export const addManagement = ({sensitive}) =>
  request.post('/api/bg/manage/addSensitive',{sensitive})

//删除违禁词
  export const deleteManagement = (data) =>
  request.post(`/api/bg/manage/delete/${data}`)

