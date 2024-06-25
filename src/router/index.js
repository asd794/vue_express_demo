import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue')
    },
    // {
    //   path: '/products/testpen',
    //   name: 'testpen',
    //   component: () => import('../views/aProductView.vue')
    // },
    {
      path: '/products/:id',
      name: 'products Page',
      component: () => import('../views/aProductView.vue')
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/myproducts',
      name: 'myproducts',
      component: () => import('../views/myProductsView.vue')
    },
    {
      path: '/myorders',
      name: 'myorders',
      component: () => import('../views/myOrdersView.vue')
    },
    {
      path: '/myaccount',
      name: 'myaccount',
      component: () => import('../views/myAccount.vue')
    },
    {
      path: '/mycart',
      name: 'mycart',
      component: () => import('../views/myCart.vue')
    },
    {
      path: '/shelves',
      name: 'shelves',
      component: () => import('../views/shelvesView.vue')
    },
    {
      path: '/navbar',
      component: () => import('../components/navbar/offNavbar.vue')
    },
    {
      path: '/test',

      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'pinia',
          component: () => import('../views/ProductsView.vue')
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 将被渲染到 User 的 <router-view> 内部
          path: 'test',
          component: () => import('../views/test/testAbout.vue')
        },
      ],
    },
  ]
})

export default router
