import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios' // Добавляем импорт axios
import 'bootstrap'

const app = createApp(App)

// --- НАСТРОЙКА БЕЗОПАСНОСТИ (SOLID: Перехватчики) ---

// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ: Автоматически добавляет "паспорт" (JWT) в каждый запрос
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // Формат Bearer — стандарт для Spring Security
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 2. ПЕРЕХВАТЧИК ОТВЕТОВ: Если токен "протух" или неверен (401/403)
axios.interceptors.response.use(
  response => response,
  error => {
    // Если сервер ответил "Доступ запрещен"
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Доступ отклонен или сессия истекла. Переход на Login.");
      localStorage.removeItem('token'); // Очищаем память
      localStorage.removeItem('username');
      router.push('/login'); // Выбрасываем пользователя на страницу входа
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------

app.use(router)
app.mount('#app')



