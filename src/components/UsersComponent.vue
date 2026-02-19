<template>
  <div class="container-fluid mt-4 px-4">
    <div class="row">
      <!-- ЛЕВАЯ КОЛОНКА: Форма регистрации -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-primary text-white py-3">
            <h5 class="mb-0"><i class="bi bi-person-plus-fill me-2"></i> Регистрация сотрудника</h5>
          </div>
          <div class="card-body p-4">
            <div class="mb-3">
              <label class="form-label small fw-bold">Логин (System ID)</label>
              <input type="text" v-model="newUser.username" class="form-control" placeholder="например: a.petrov">
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">ФИО сотрудника</label>
              <input type="text" v-model="newUser.fullName" class="form-control" placeholder="Петров Александр">
            </div>
            <button @click="registerUser" class="btn btn-primary w-100 shadow-sm mt-2" :disabled="!newUser.username || loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              Сгенерировать доступ
            </button>
          </div>
        </div>
      </div>

      <!-- ПРАВАЯ КОЛОНКА: Список сотрудников -->
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="bi bi-people-fill me-2"></i> Список персонала</h5>
            <button class="btn btn-sm btn-outline-light" @click="fetchUsers"><i class="bi bi-arrow-clockwise"></i></button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Логин</th>
                  <th>ФИО</th>
                  <th>Роль</th>
                  <th class="text-center">Статус пароля</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in userList" :key="u.id">
                  <td><code class="text-primary fw-bold">{{ u.username }}</code></td>
                  <td>{{ u.fullName || '—' }}</td>
                  <td><span class="badge bg-secondary small">{{ u.role }}</span></td>
                  <td class="text-center">
                    <span v-if="u.needsPasswordChange" class="badge rounded-pill bg-warning text-dark">
                      <i class="bi bi-clock-history"></i> Временный
                    </span>
                    <span v-else class="badge rounded-pill bg-success">
                      <i class="bi bi-check-circle-fill"></i> Постоянный
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО ДЛЯ ВЫДАЧИ ПАРОЛЯ -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.6)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-danger text-white border-0">
            <h5 class="modal-title"><i class="bi bi-key-fill me-2"></i>Доступ создан</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body text-center p-5">
            <div class="mb-4">
               <div class="h2 fw-bold text-primary">{{ generatedInfo.temporaryPassword }}</div>
               <div class="text-muted small">ВРЕМЕННЫЙ ПАРОЛЬ</div>
            </div>
            <div class="alert alert-light border small text-start">
               <strong>Логин:</strong> {{ generatedInfo.username }} <br>
               <strong>Внимание:</strong> Пароль нужно передать сотруднику. При первом входе система потребует его сменить.
            </div>
            <button class="btn btn-dark w-100 mt-3" @click="closeModal">Я записал данные</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from '../config';

export default {
  name: "UsersComponent",
  data() {
    return {
      newUser: { username: "", fullName: "" },
      userList: [],
      generatedInfo: null,
      showModal: false,
      loading: false
    };
  },
  methods: {
    fetchUsers() {
      axios.get(`${API_URL}/api/auth/admin/all-users`)
        .then(res => { this.userList = res.data; })
        .catch(err => console.error("Ошибка загрузки списка:", err));
    },
    registerUser() {
      this.loading = true;
      axios.post(`${API_URL}/api/auth/admin/create-user`, this.newUser)
        .then(response => {
          this.generatedInfo = response.data;
          this.showModal = true;
          this.newUser = { username: "", fullName: "" };
          this.fetchUsers(); // Обновляем список сразу
        })
        .catch(err => alert(err.response?.data || "Ошибка доступа"))
        .finally(() => this.loading = false);
    },
    closeModal() {
      this.showModal = false;
      this.generatedInfo = null;
    }
  },
  mounted() {
    this.fetchUsers(); // Загружаем список при открытии страницы
  }
};
</script>
