import Vue from 'vue'
import VueRouter from 'vue-router'
import Logout from "@/components/Logout";

import store from '@/store';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "foo" */ '../views/Home.vue')
  },
  {
    path: '/visits',
    name: 'Visits',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "foo" */ '../views/Visits.vue')
  },
    {
      path: '/clients',
      name: 'Clients',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "foo" */ '../views/Clients.vue')
    },
    {
      path: '/goods',
      name: 'Goods',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "foo" */ '../views/Goods.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "foo" */ '../views/Login.vue')
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.getters.isAuthenticated) next({ name: 'Login' });
  else next();
});

export default router
