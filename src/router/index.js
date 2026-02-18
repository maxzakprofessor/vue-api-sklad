import { createRouter, createWebHashHistory } from 'vue-router'
import goodsComponent from '../components/goodsComponent.vue'
import stocksComponent from '../components/stocksComponent.vue'
import goodincomesComponent from '../components/goodincomesComponent.vue'
import goodmovesComponent from '../components/goodmovesComponent.vue'
import goodrestsComponent from '../components/goodrestsComponent.vue'
import AboutView from '../views/AboutView.vue'
import LoginComponent from '../components/LoginComponent.vue'
// 1. Добавляем импорт нового компонента
import UsersComponent from '../components/UsersComponent.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/goods',
    name: 'Goods',
    component: goodsComponent
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: stocksComponent
  },
  {
    path: '/goodincomes',
    name: 'Goodincomes',
    component: goodincomesComponent
  },
  {
    path: '/goodmoves',
    name: 'Goodmoves',
    component: goodmovesComponent
  },
  {
    path: '/goodrests',
    name: 'Goodrests',
    component: goodrestsComponent
  },
  // 2. Регистрируем путь для управления сотрудниками
  {
    path: '/users',
    name: 'Users',
    component: UsersComponent
  },
  {
    path: '/',
    name: 'About',
    component: AboutView
  }     
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Глобальный "охранник" остается без изменений
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/']; 
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token'); 

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router
