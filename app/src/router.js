import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/shared/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/admin/Admin'),
    },
    {
      path: '/patient',
      name: 'patient',
      component: () => import('./views/patient/Patient'),
    },
    {
      path: '/parent',
      name: 'parent',
      component: () => import('./views/parent/Parent'),
    },
    {
      path: '/*',
      redirect: '/login',
    },
  ],
});
