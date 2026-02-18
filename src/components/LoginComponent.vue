<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white text-center">
            <h4>Вход в систему Склад</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Логин</label>
                <input type="text" v-model="username" class="form-control" required placeholder="Введите логин">
              </div>
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input type="password" v-model="password" class="form-control" required placeholder="Введите пароль">
              </div>
              <div v-if="error" class="alert alert-danger p-2 small">
                {{ error }}
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Войти
              </button>
            </form>
          </div>
        </div>
        <div class="text-center mt-3 small text-muted">
          Java 25 Backend + Vue 3 Frontend
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// Импортируем конфиг, чтобы не хардкодить URL
import { API_URL } from '../config';

export default {
  name: "LoginComponent",
  data() {
    return {
      username: "",
      password: "",
      error: null,
      loading: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.error = null;

      // Шлем запрос на ваш Java-контроллер AuthController
      axios.post(`${API_URL}/api/auth/signin`, {
        username: this.username,
        password: this.password
      })
      .then(response => {
        // 1. Сохраняем токен в localStorage (это проверяет роутер)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);

        // 2. Устанавливаем заголовок по умолчанию для всех будущих запросов Axios
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;

        // 3. Переходим на страницу товаров (или любую другую защищенную)
        this.$router.push('/goods');
      })
      .catch(err => {
        console.error(err);
        this.error = "Неверный логин или пароль";
      })
      .finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
