import request from '@/utils/request'

//获取审核列表数据type值：1.用户、2.文章、3.评论
export const getAuditingData = ( { pageNum, pageSize, type } ) =>
  request.post(`/api/bg/audit/list`, { pageNum, pageSize, type })

//用户详情data值：用户id
export const getUserData = ( data ) =>
  request.post(`/api/bg/audit/user/${data}`)

//文章详情data值：文章id
export const getArticleData = ( data ) =>
  request.post(`/api/bg/audit/article/${data}`)

//评论详情data值：评论id
export const getCommentData = ( data ) =>
  request.post(`/api/bg/audit/comment/${data}`)

//审核是否通过
export const auditPass = ( {type,auditId,isPass,desc} ) =>
  request.post(`/api/bg/audit/pass`, {type,auditId,isPass,desc})