import request from '@/utils/request'
// 获取搜索到的违章内容
export const getSearch =({type,id}) =>
  request.post('/api/bg/search',{type,id})

// 编辑用户状态
export const editUserStatus =({userId,status}) =>
  request.post('/api/bg/search/updateUser',{userId,status})

// 编辑文章状态
export const editArticleStatus =({articleId,type,operate,desc}) =>
  request.post('/api/bg/search/updateArticle',{articleId,type,operate,desc})