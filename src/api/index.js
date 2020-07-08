export {default as login} from './acl/login'
export {default as user} from './acl/user'
export {default as role} from './acl/role'
export {default as permission} from './acl/permission'
export {default as category} from './category'
export {default as clientUser} from './clientUser'
export {default as order} from './order'

// export {default as trademark} from './product/trademark'
// 引入并暴露
export {default as trademark} from './product/trademark'


/* 
当前模块的结构:
{
  login: {},
  user: {},
  role: {},
  permission: {},
  category: {},
  clientUser: {},
  order: {},
  trademark: {},
}
也就是API对象
Vue.prototype.$API = API
this.$API.trademark.getList(2, 5)
*/
