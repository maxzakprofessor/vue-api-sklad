<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5><i class="bi bi-people-fill"></i> Управление сотрудниками</h5>
      </div>
      <div class="card-body">
        <!-- Форма создания -->
        <div class="row g-3 align-items-end mb-4">
          <div class="col-md-4">
            <label class="form-label small fw-bold">Логин (для входа)</label>
            <input type="text" v-model="newUser.username" class="form-control" placeholder="н-р: i.ivanov">
          </div>
          <div class="col-md-5">
            <label class="form-label small fw-bold">ФИО сотрудника</label>
            <input type="text" v-model="newUser.fullName" class="form-control" placeholder="Иванов Иван Иванович">
          </div>
          <div class="col-md-3">
            <button @click="registerUser" class="btn btn-success w-100" :disabled="!newUser.username">
              Создать и выдать пароль
            </button>
          </div>
        </div>

        <!-- Результат генерации (виден только после успеха) -->
        <div v-if="generatedInfo" class="alert alert-warning border-dark shadow-sm">
          <h6 class="alert-heading fw-bold text-danger">⚠️ ПАРОЛЬ СГЕНЕРИРОВАН!</h6>
          <p>Передайте эти данные сотруднику под подпись:</p>
          <hr>
          <p class="mb-0">Логин: <strong>{{ generatedInfo.username }}</strong></p>
          <p class="mb-0">Временный пароль: <span class="badge bg-dark fs-6">{{ generatedInfo.temporaryPassword }}</span></p>
          <small class="text-muted mt-2 d-block">* Пароль действителен для первого входа. Система заставит его сменить.</small>
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
      generatedInfo: null
    };
  },
  methods: {
    registerUser() {
      if (!confirm("Создать учетную запись для этого сотрудника?")) return;

      axios.post(`${API_URL}/api/auth/admin/create-user`, this.newUser)
        .then(response => {
          this.generatedInfo = response.data;
          this.newUser = { username: "", fullName: "" }; // Очистка формы
        })
        .catch(err => {
          alert(err.response?.data || "Ошибка при создании пользователя");
        });
    }
  }
};
</script>
