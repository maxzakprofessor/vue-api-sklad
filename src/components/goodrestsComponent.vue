<template>
  <div class="container mt-3">
    <div class="row align-items-end">
      <!-- Кнопки управления -->
      <div class="col-md-auto mb-3">
        <button type="button" class="btn btn-primary m-1" @click="GetReport">
          <i class="bi bi-table"></i> Показать отчет
        </button>
        <button type="button" class="btn btn-danger m-1" @click="GetReportPDF">
          <i class="bi bi-file-earmark-pdf"></i> Скачать PDF
        </button>
        <button @click="AskAI" :disabled="loadingAI" class="btn btn-info m-1 text-white">
          <span v-if="loadingAI" class="spinner-border spinner-border-sm me-1"></span>
          🤖 AI-советник
        </button>
      </div>

      <!-- Фильтры -->
      <div class="col-md-3 mb-3">
        <label class="form-label small fw-bold">Склад</label>
        <select class="form-select" v-model="nameStock">
          <option v-for="st in stocks" :key="st.id" :value="st.nameStock">{{st.nameStock}}</option>
        </select>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label small fw-bold">Товар</label>
        <select class="form-select" v-model="nameGood">
          <option v-for="g in goods" :key="g.id" :value="g.nameGood">{{g.nameGood}}</option>
        </select>
      </div>
    </div>

    <!-- Блок AI -->
    <div v-if="aiMessage" class="alert alert-success mt-2 shadow-sm border-start border-4 border-success">
      <h6 class="fw-bold">Анализ Gemini 2.0:</h6>
      <p class="mb-0">{{ aiMessage }}</p>
    </div>

    <!-- Таблица данных -->
    <div class="table-responsive mt-3">
      <table class="table table-striped table-hover border">
        <thead class="table-dark">
          <tr>
            <th>Наименование склада</th>
            <th>Наименование товара</th>
            <th>Кол-во</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acc in goodrests" :key="acc.id">
            <td>{{acc.nameStock}}</td>
            <td>{{acc.nameGood}}</td>
            <td class="fw-bold">{{acc.qty}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ENDPOINTS } from "../config";

export default {
  name: 'goodrestsComponent',
  data() {
    return {
      aiMessage: '',
      loadingAI: false,
      goodrests: [],
      goods: [],
      stocks: [],
      nameGood: "Все",
      nameStock: "Все"
    }
  },
  methods: {
    // 1. Загрузка списков для фильтров
    refreshData() {
      axios.get(ENDPOINTS.STOCKS).then(res => {
        this.stocks = [{ id: 0, nameStock: "Все" }, ...res.data];
      });
      axios.get(ENDPOINTS.GOODS).then(res => {
        this.goods = [{ id: 0, nameGood: "Все" }, ...res.data];
      });
    },

    // 2. Получение данных (Ваш расчет на Java)
    GetReport() {
      axios.get(`${ENDPOINTS.GOODRESTS}/${this.nameStock}/${this.nameGood}`)
        .then(res => {
          this.goodrests = res.data;
        })
        .catch(err => console.error("Ошибка загрузки отчета", err));
    },

    // 3. СКАЧИВАНИЕ PDF С СЕРВЕРА (Java 25)
    GetReportPDF() {
      const url = `${ENDPOINTS.GOODRESTS}/export/pdf/${this.nameStock}/${this.nameGood}`;
      axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // Важно для файлов
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Отчет_Склад_${this.nameStock}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    },

    // 4. AI-советник
    async AskAI() {
      this.loadingAI = true;
      this.aiMessage = "";
      try {
        const res = await axios.get(ENDPOINTS.AI_REPORT);
        this.aiMessage = res.data.report || res.data.message;
      } catch (error) {
        this.aiMessage = "Сервис AI временно недоступен";
      } finally {
        this.loadingAI = false;
      }
    }
  },
  mounted() {
    this.refreshData(); // Загружаем списки при открытии
    this.GetReport();   // Сразу показываем общие остатки
  }
}
</script>
