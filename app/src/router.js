import Vue from 'vue';
import vueChatScroll from 'vue-chat-scroll';
import VueSelect from 'vue-select';
import Router from 'vue-router';
import Login from './views/shared/Login.vue';
import store from './config/store';

Vue.use(vueChatScroll);
Vue.component('v-select', VueSelect);
Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
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
    children: [{
      path: '',
      name: 'admin',
      component: () => import('./views/admin/CreateUsers'),
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
      path: 'attributes/:type',
      name: 'adminManageAttributes',
      component: () => import('./views/admin/ManageAttributes'),
      meta: {
        permission: 'admin',
      },
      props: true,
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
    component: () => import('./views/patient/Patient'),
    meta: {
      permission: 'patient',
    },
    children: [{
      path: '',
      name: 'patient',
      component: () => import('./views/patient/Matches'),
      meta: {
        permission: 'patient',
      },
    },
    {
      path: 'messages',
      name: 'patientMessages',
      component: () => import('./views/patient/Messages'),
      meta: {
        permission: 'patient',
      },
    },
    {
      path: 'messages/:id',
      name: 'patientMessagesWithUser',
      component: () => import('./views/patient/Messages'),
      meta: {
        permission: 'patient',
      },
    },
    {
      path: 'preferences',
      name: 'patientPreferences',
      component: () => import('./views/patient/Preferences'),
      meta: {
        permission: 'patient',
      },
    },
    ],
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
