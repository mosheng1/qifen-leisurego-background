import request from '@/utils/request'

//登录
export const userLoginService = ({ username, password }) =>
  request.post('/bg/login', { username, password })

//获取用户信息
export const getUserInfoService = (data) =>
  request.post(`/api/bg/user/${data}`)

//修改用户信息
export const modifyUserInfoService = ({id,name,username,image}) =>
  request.post('/api/bg/user/update', {id,name,username,image})

// 上传头像
export const uploadAvatarService = (data) =>
  request.post('/api/bg/user/upload', data)