import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: 'homePage',
      children:[
        {
          path: 'homePage',
          component: () => import('@/views/homePage/Home.vue')
        },
        {
          path: 'auditingUser',
          component: () => import('@/views/auditing/AuditingUser.vue')
        },
        {
          path: 'auditingPublish',
          component: () => import('@/views/auditing/AuditingPublish.vue')
        },
        {
          path: 'auditingComment',
          component: () => import('@/views/auditing/AuditingComment.vue')
        },
        {
          path: 'violation',
          component: () => import('@/views/violation/Violation.vue')
        },
        {
          path: 'query',
          component: () => import('@/views/query/Query.vue')
        },
        {
          path: 'management',
          component: () => import('@/views/management/Management.vue')
        }
      ]
    },
  ]
})
router.beforeEach((to) => {
  //如果没有token,且访问的是非登录页面，跳转到登录页面
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
