import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

//const Login = () => import('@/views/Login') to allow cloak to work, so we don't see a flash of the sidebar when we refresh the login page, this isn't lazy loaded
import Login from '@/views/Login.vue';
import CloudLogin from '@/views/CloudLogin.vue';
const Home = () => import('@/views/Home')
const Settings = () => import('@/views/Settings')
const Help = () => import('@/views/Help')
const Setup = () => import('@/views/Setup')
const Analytics = () => import('@/views/Analytics')
const Databases = () => import('@/views/Databases')
const APIs = () => import('@/views/APIs')
const AddAPI = () => import('@/components/AddAPI')
const AddDatabase = () => import('@/components/AddDatabase')
const Security = () => import('@/views/Security')

Vue.use(Router)

let login_component = Login;
if(process.env.VUE_APP_ENV=='cloud')
{
  login_component = CloudLogin;
}

let router = new Router({
  //https://router.vuejs.org/en/essentials/history-mode.html
  mode: 'history', //won't use hashmode URLs, so requires we redirect 404 errors to index.html
  //https://vueschool.io/articles/vuejs-tutorials/vue-js-router-performance/
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: login_component,
      meta: { hideNavigation: true }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
      meta: {
        auth: true
      }
    },
    {
        path: '/databases',
        name: 'Databases',
        component: Databases,
        meta: {
          auth: true
        }
    },
    {
        path: '/apis',
        name: 'APIs',
        component: APIs,
        meta: {
          auth: true
        }
    },
    {
      path: '/add/api',
      name: 'AddAPI',
      component: AddAPI,
      meta: {
        auth: true
      }
    },
    {
      path: '/add/database',
      name: 'AddDatabase',
      component: AddDatabase,
      meta: {
        auth: true
      }
    },
    {
        path: '/setup/:step',
        name: 'Setup',
        component: Setup,
        props: true,
        meta: {
          auth: true
        }
    },
    {
        path: '/help',
        name: 'Help',
        component: Help,
        meta: {
          auth: true
        }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        auth: true
      }
    },
    {
      path: '/security',
      name: 'Security',
      component: Security,
      meta: {
        auth: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/',
      redirect: '/home'
    },

  ]
})

router.beforeEach((to, from, next) => 
{
  if(process.env.VUE_APP_ENV=='cloud')
  {
    if (to.matched.some(record => record.meta.auth)) 
    {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          next()
        } else {
          next({
            path: "/login",
          })
        }
      })
    } 
    else if (to.matched.some(record => record.meta.guest)) 
    {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          next({
            path: "/profile",
          })
        } else {
          next()
        }
      })
    } 
    else 
    {
      next()
    }
  }
  else
  {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) 
    {
      return next(
      { 
        path: '/login', 
        query: { returnUrl: to.path } 
      });
    }

    next();
  }
})

export default router
