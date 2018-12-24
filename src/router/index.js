import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login/login'
import message from '@/views/message/message'
import infoData from '@/views/info/infoData'
import successfully from '@/views/successfully/successfully'
import auditSuccess from '@/views/auditSuccess/auditSuccess'
import auditFailure from '@/views/auditFailure/auditFailure'

Vue.use(Router)

// export const constantRouterMap = [
//   { path: '/login', component: () => import('@/views/login/login'), hidden: true },
//   { path: '/404', component: () => import('@/views/404'), hidden: true },
// ] 
export default new Router({
  routes: [
    {        //注册
      path: '/', //链接路径
      name: 'login',  //路由名称
      component: login  //对应的组件模版
    },
    {        //企业入驻信息
      path: '/message', //链接路径
      name: 'message',  //路由名称
      component: message  //对应的组件模版
    },
    {        //商家信息入驻
      path: '/infoData', //链接路径
      name: 'infoData',  //路由名称
      component: infoData  //对应的组件模版
    },
    {        //提交成功
      path: '/successfully', //链接路径
      name: 'successfully',  //路由名称
      component: successfully  //对应的组件模版
    },
    {        //审核成功
      path: '/auditSuccess', //链接路径
      name: 'auditSuccess',  //路由名称
      component: auditSuccess  //对应的组件模版
    },
    {        //审核失败
      path: '/auditFailure', //链接路径
      name: 'auditFailure',  //路由名称
      component: auditFailure  //对应的组件模版
    }
  ]
})


