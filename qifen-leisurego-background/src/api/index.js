import request from '@/utils/request'
//获取代办
export const getAgencyData = ( ) =>
  request.post('/api/bg/index/task')

//获取总数
export const getAgencyCount = ( ) =>
  request.post('/api/bg/index/total')
