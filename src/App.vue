<script>
export default {
  name: 'App',
  data() {
    return {
      loggedIn: !!localStorage.getItem('token'),
      user: localStorage.getItem('username')
    }
  },
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
    confirmLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.updateLoginStatus();
      this.$router.push('/login');
    }
  },
  created() {
    this.updateLoginStatus();
  }
}
</script>

<template>
  <div class="container-fluid px-4 bg-light min-vh-100 pb-5">
      
      <!-- 📦 ШАПКА-ЗАГОЛОВОК -->
      <div class="d-flex justify-content-center align-items-center mt-4 mb-4 py-3 bg-white rounded shadow-sm border border-primary border-opacity-25">
          <div class="me-4 display-4 warehouse-logo animate-bounce">
              <span>📦</span>
          </div>
          <div class="text-start border-start ps-4">
              <h2 class="mb-0 fw-black text-dark text-uppercase tracking-tighter">
                  Складской учет <span class="text-primary">PRO</span>
              </h2>
              <p class="mb-0 text-muted small fw-bold">
                  <i class="bi bi-cpu"></i> Java 25 & Vue 3 Integration
              </p>
          </div>
      </div>
      
      <!-- 🧭 НАВИГАЦИЯ -->
      <nav class="navbar navbar-expand-lg bg-white navbar-light rounded shadow-sm mb-4 border p-2 sticky-top">
          <div class="container-fluid">
              <ul class="navbar-nav w-100 align-items-center flex-wrap">
                
                <!-- Пункты меню для всех (кроме Логина и О проекте) -->
                <template v-if="loggedIn">
                    <li class="nav-item m-1"><router-link class="nav-link btn btn-nav px-3" to="/stocks">🏬 Склады</router-link></li>
                    <li class="nav-item m-1"><router-link class="nav-link btn btn-nav px-3" to="/goods">🍎 Товары</router-link></li>
                    <li class="nav-item m-1"><router-link class="nav-link btn btn-nav px-3" to="/goodincomes">📥 Приход</router-link></li>
                    <li class="nav-item m-1"><router-link class="nav-link btn btn-nav px-3" to="/goodmoves">🔄 Перемещение</router-link></li>
                    <li class="nav-item m-1"><router-link class="nav-link btn btn-nav px-3" to="/goodrests">📊 Остатки</router-link></li>
                    
                    <!-- Кнопка СОТРУДНИКИ (только админу) -->
                    <li v-if="user === 'admin'" class="nav-item m-1 ms-lg-3 border-start ps-lg-3">
                        <router-link class="nav-link btn btn-outline-danger border-0 fw-bold shadow-none" to="/users">👥 Сотрудники</router-link>
                    </li>
                </template>

                <!-- О проекте доступно всегда -->
                <li class="nav-item m-1">
                    <router-link class="nav-link btn btn-nav px-3" to="/">ℹ️ О проекте</router-link>
                </li>
                
                <!-- ПРАВАЯ ЧАСТЬ МЕНЮ -->
                <div class="ms-auto d-flex align-items-center">
                    <!-- КНОПКА ВХОД (если НЕ залогинен) -->
                    <li v-if="!loggedIn" class="nav-item m-1">
                        <router-link class="btn btn-primary shadow-sm px-4 fw-bold" to="/login">
                          🔐 Вход в систему
                        </router-link>
                    </li>

                    <!-- КНОПКА ВЫХОД (если залогинен) -->
                    <li v-if="loggedIn" class="nav-item m-1">
                        <button class="btn btn-danger shadow-sm px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#logoutModal">
                          🚪 Выйти [{{ user }}]
                        </button>
                    </li>
                </div>
              </ul>
          </div>
      </nav>

      <!-- КОНТЕНТ СТРАНИЦЫ -->
      <div class="content-wrapper p-3 bg-white rounded shadow-sm border min-vh-50">
          <router-view></router-view>
      </div>

      <!-- МОДАЛЬНОЕ ОКНО ВЫХОДА -->
      <div class="modal fade" id="logoutModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-sm modal-dialog-centered">
              <div class="modal-content border-0 shadow-lg">
                  <div class="modal-body text-center p-4">
                      <div class="text-warning mb-3">
                          <svg xmlns="http://www.w3.org" width="48" height="48" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l-.003.217a.25.25 0 0 0 .25.247h.811a.25.25 0 0 0 .25-.25v-.119c0-.7.442-.995 1.059-1.44.609-.436 1.198-1.004 1.198-1.945 0-1.396-1.157-2.097-2.354-2.097-1.243 0-2.394-.741-2.493-2.15a.25.25 0 0 0-.25-.266h-.827q-.27 0-.247.282zm1.286 6.311c0-.46.311-.804.811-.804s.811.339.811.804-.311.804-.811.804-.811-.341-.811-.804"/>
                          </svg>
                      </div>
                      <h5 class="fw-bold">Завершить сессию?</h5>
                      <div class="d-flex justify-content-center gap-2 mt-4">
                          <button type="button" class="btn btn-light px-4 border" data-bs-dismiss="modal">Нет</button>
                          <button type="button" class="btn btn-danger px-4 shadow-sm" @click="confirmLogout" data-bs-dismiss="modal">Да, выйти</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.fw-black { font-weight: 900; }
.btn-nav:hover { background-color: #f8f9fa; color: #0d6efd; transform: translateY(-2px); transition: 0.2s; }
.router-link-active { background-color: #0d6efd !important; color: white !important; font-weight: bold; }
.animate-bounce { animation: bounce 2s infinite; }
@keyframes bounce { 0%, 100% {transform: translateY(0);} 50% {transform: translateY(-10px);} }
</style>
