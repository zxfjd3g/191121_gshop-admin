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
  }
}