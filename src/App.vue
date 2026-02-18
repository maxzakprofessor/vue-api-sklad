<script>
export default {
  name: 'App',
  data() {
    return {
      // Переносим в data, чтобы Vue мог это перерисовывать
      loggedIn: !!localStorage.getItem('token'),
      user: localStorage.getItem('username')
    }
  },
  // Следим за изменением маршрута
  watch: {
    '$route'() {
      this.updateLoginStatus();
    }
  },
  methods: {
    updateLoginStatus() {
      this.loggedIn = !!localStorage.getItem('token');
      this.user = localStorage.getItem('username');
    },
    logout() {
      if (confirm("Вы действительно хотите выйти?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.updateLoginStatus(); // Обновляем статус сразу
        this.$router.push('/login');
      }
    }
  },
  created() {
    this.updateLoginStatus();
  }
}
</script>

<template>
  <div class="container">
      <h3 class="d-flex justify-content-center">Складской учет.</h3>
      <nav class="navbar navbar-expand-sm bg-light navbar-dark">
          <ul class="navbar-nav w-100">
            <!-- Ваши ссылки -->
            <li class="nav-item m-1"><router-link class="btn btn-light btn-outline-primary" to="/stocks">Склады</router-link></li>
            <li class="nav-item m-1"><router-link class="btn btn-light btn-outline-primary" to="/goods">Товары</router-link></li>
            <li class="nav-item m-1"><router-link class="btn btn-light btn-outline-primary" to="/goodincomes">Приход</router-link></li>
            <li class="nav-item m-1"><router-link class="btn btn-light btn-outline-primary" to="/goodmoves">Перемещение</router-link></li>
            <li class="nav-item m-1"><router-link class="btn btn-light btn-outline-primary" to="/goodrests">Остатки</router-link></li>
            <li class="nav-item m-1"><router-link class="btn btn-light btn-outline-primary" to="/users">Сотрудники</router-link></li>
            
            <!-- Кнопка LOGOUT (используем loggedIn из data) -->
            <li v-if="loggedIn" class="nav-item m-1 ms-auto">
                <button class="btn btn-outline-danger" @click="logout">
                  Выйти ({{ user }})
                </button>
            </li>            
          </ul>
      </nav>
      <router-view></router-view>
  </div>
</template>
