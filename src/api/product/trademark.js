/* 
包含商品管理下的品牌管理的相关接口请求函数
*/

import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {


  /* 
  获取品牌的分页列表
    GET /admin/product/baseTrademark/{page}/{limit}
  获取所有品牌列表
    GET /admin/product/baseTrademark/getTrademarkList
  */
  getList (page, limit) {
    if (page && limit) {
      return request({
        url: `${api_name}/${page}/${limit}`,
        method: 'GET',
      })
    } else {
      return request.get(`${api_name}/getTrademarkList`)
    }
  },

  /* 
  获取指定id的品牌
  GET /admin/product/baseTrademark/get/{id}
  */
  getById (id) {
    return request.get(`${api_name}/get/${id}`)
  },

  /* 
  修改Trademark
  PUT /admin/product/baseTrademark/update
    {
      "id": 0,
      "logoUrl": "string",
      "tmName": "string"
    }
  */
  update (trademark) { // 有id
    // return request({ 
    //   url: `${api_name}/update`,
    //   method: 'PUT',
    //   data: trademark
    // })

    return request.put(`${api_name}/update`, trademark)
  },

  /* 
  添加Trademark
  POST /admin/product/baseTrademark/save
    {
      "logoUrl": "string",
      "tmName": "string"
    }
  */
  add (trademark) {  // 没有id
    // return request({
    //   url: `${api_name}/save`,
    //   method: 'POST',
    //   data: trademark
    // })
    return request.post(`${api_name}/save`, trademark)
  },

  /* 
  删除trademark
  DELETE /admin/product/baseTrademark/remove/{id}
  */
 removeById(id) {
  // return request({
  //   url: `${api_name}/remove/${id}`,
  //   method: 'DELETE'
  // })
  return request.delete(`${api_name}/remove/${id}`)
 },






  /* 
  获取后台用户分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  /* 
  根据ID获取某个后台用户
  */
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  /* 
  保存一个新的后台用户
  */
  add(user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  },

  /* 
  更新一个后台用户
  */
  update(user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },

  /* 
  获取某个用户的所有角色
  */
  getRoles(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },

  /* 
  给某个用户分配角色
  roleId的结构: 字符串, 'rId1,rId2,rId3'
  */
  assignRoles(userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: {
        userId,
        roleId
      }
    })
  },

  /* 
  删除某个用户
  */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  /* 
  批量删除多个用户
  ids的结构: ids是包含n个id的数组
  */
  removeUsers(ids) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: ids
    })
  }
}
