<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-lg border-0">
          <div :class="['card-header text-white text-center', isChangeMode ? 'bg-warning' : 'bg-primary']">
            <h4 class="mb-0">
              <i :class="isChangeMode ? 'bi bi-shield-lock' : 'bi bi-person-circle'"></i>
              {{ isChangeMode ? 'Смена временного пароля' : 'Вход в систему Склад' }}
            </h4>
          </div>
          
          <div class="card-body p-4">
            <!-- ФОРМА ВХОДА (Обычный режим) -->
            <form v-if="!isChangeMode" @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label fw-bold small">Логин</label>
                <input type="text" v-model="username" class="form-control form-control-lg" required placeholder="Введите ваш ID">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold small">Пароль</label>
                <input type="password" v-model="password" class="form-control form-control-lg" required placeholder="Ваш пароль">
              </div>
              <div v-if="error" class="alert alert-danger py-2 small border-0">
                <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
              </div>
              <button type="submit" class="btn btn-primary w-100 btn-lg shadow-sm" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Войти в систему
              </button>
            </form>

            <!-- ФОРМА СМЕНЫ ПАРОЛЯ (Режим госучреждения) -->
            <form v-else @submit.prevent="changePassword">
              <div class="alert alert-info small py-2">
                Для обеспечения безопасности вашего аккаунта, пожалуйста, установите новый пароль вместо временного.
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold small">Придумайте новый пароль</label>
                <input type="password" v-model="newPassword" class="form-control form-control-lg" required placeholder="Минимум 6 символов">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold small">Подтвердите пароль</label>
                <input type="password" v-model="confirmPassword" class="form-control form-control-lg" required placeholder="Повторите ввод">
              </div>
              <div v-if="error" class="alert alert-danger py-2 small border-0">
                {{ error }}
              </div>
              <button type="submit" class="btn btn-warning w-100 btn-lg fw-bold shadow-sm" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Установить и войти
              </button>
            </form>
          </div>
        </div>
        <div class="text-center mt-4 text-muted small">
            &copy; 2026 Система управления складом (Java 25 Enterprise)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from '../config';

export default {
  name: "LoginComponent",
  data() {
    return {
      username: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
      isChangeMode: false, // Переключатель между Входом и Сменой пароля
      error: null,
      loading: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.error = null;

      axios.post(`${API_URL}/api/auth/signin`, {
        username: this.username,
        password: this.password
      })
      .then(response => {
        // --- ТЕСТОВЫЙ БЛОК ДЛЯ ПРОВЕРКИ ДАННЫХ ---
        console.log("Полный ответ сервера:", response.data);
        alert("Данные из Java: " + JSON.stringify(response.data));
        // -----------------------------------------

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;

        // Проверяем флаг, который пришел в alert
        if (response.data.needsChange === true || response.data.needsChange === "true") {
          console.log("Переключаю в режим смены пароля...");
          this.isChangeMode = true; 
          this.error = "Внимание: требуется смена временного пароля!";
        } else {
          console.log("Вход разрешен, перехожу на склад.");
          this.$router.push('/goods');
        }
      })
      .catch(err => {
        console.error("Ошибка запроса:", err);
        this.error = "Ошибка авторизации: неверные данные или сервер недоступен";
      })
      .finally(() => { this.loading = false; });
    },

    changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = "Пароли не совпадают!";
        return;
      }
      if (this.newPassword.length < 3) {
        this.error = "Слишком короткий пароль!";
        return;
      }

      this.loading = true;
      axios.post(`${API_URL}/api/auth/update-password`, {
        username: this.username,
        newPassword: this.newPassword
      })
      .then(() => {
        alert("Пароль успешно обновлен! Теперь используйте его для входа.");
        this.isChangeMode = false;
        this.password = ""; // Очищаем старый временный пароль
        this.error = null;
        // После смены выкидываем на логин для проверки новым паролем
        localStorage.removeItem('token');
        location.reload(); 
      })
      .catch(err => {
        this.error = "Не удалось обновить пароль. Попробуйте позже.";
      })
      .finally(() => { this.loading = false; });
    }
  }
};
</script>

<style scoped>
.card { border-radius: 15px; }
.btn-lg { border-radius: 10px; font-weight: 600; }
</style>
