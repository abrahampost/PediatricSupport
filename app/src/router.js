import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/shared/Login.vue';
import store from './config/store';

Vue.use(Router);

const router = new Router({
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
      component: () => import('./views/admin/Admin'),
      meta: {
        permission: 'admin',
      },
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('./views/admin/CreateUsers'),
          meta: {
            permission: 'admin',
          },
        },
        {
          path: 'attributes',
          name: 'adminManageAttributes',
          component: () => import('./views/admin/ManageAttributes'),
          meta: {
            permission: 'admin',
          },
        },
        {
          path: 'reports',
          name: 'adminManageReports',
          component: () => import('./views/admin/ManageReports'),
          meta: {
            permission: 'admin',
          },
        },
        {
          path: 'users',
          name: 'adminManageUsers',
          component: () => import('./views/admin/ManageUsers'),
          meta: {
            permission: 'admin',
          },
        },
      ],
    },
    {
      path: '/patient',
      name: 'patient',
      component: () => import('./views/patient/Patient'),
      meta: {
        permission: 'patient',
      },
    },
    {
      path: '/parent',
      name: 'parent',
      component: () => import('./views/parent/Parent'),
      meta: {
        permission: 'parent',
      },
    },
    {
      path: '/*',
      redirect: '/login',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!to.meta.permission) {
    next();
  }
  if (store.user !== undefined && store.user.type === to.meta.permission) {
    next();
  } else {
    next('/login');
  }
});

export default router;
