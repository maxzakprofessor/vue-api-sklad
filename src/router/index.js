import { createRouter, createWebHashHistory } from 'vue-router'
import goodsComponent from '../components/goodsComponent.vue'
import stocksComponent from '../components/stocksComponent.vue'
import goodincomesComponent from '../components/goodincomesComponent.vue'
import goodmovesComponent from '../components/goodmovesComponent.vue'
import goodrestsComponent from '../components/goodrestsComponent.vue'
import AboutView from '../views/AboutView.vue'
// 1. Импортируйте ваш новый компонент логина (создадим его следующим шагом)
import LoginComponent from '../components/LoginComponent.vue'

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

// 2. Глобальный "охранник" (Navigation Guard)
// Перед каждым переходом проверяем права доступа
router.beforeEach((to, from, next) => {
  // Список страниц, куда можно заходить без пароля
  const publicPages = ['/login', '/']; 
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token'); // Проверяем наличие токена в браузере

  // Если страница требует авторизации, а токена нет — шлем на Login
  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next(); // В остальных случаях — разрешаем переход
});

export default router

