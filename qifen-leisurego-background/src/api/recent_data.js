import request from '@/utils/request'
//获取折线图数据
export const getLineData = ( {begin, end} ) =>
  request.post('/api/bg/index/userOrOrder',  {begin, end} )

//获取饼图数据
export const getColumnData = ( {begin, end} ) =>
  request.post('/api/bg/index/top10',  {begin, end} )

  