<template>
  <div class="container-fluid mt-3">
    <div class="row align-items-end mb-4">
      <!-- Кнопки управления -->
      <div class="col-md-auto mb-3">
        <button type="button" class="btn btn-primary shadow-sm m-1" @click="GetReport">
          <i class="bi bi-table"></i> Показать отчет
        </button>
        <button type="button" class="btn btn-danger shadow-sm m-1" @click="GetReportPDF">
          <i class="bi bi-file-earmark-pdf"></i> Скачать PDF
        </button>
        <button @click="AskAI" :disabled="loadingAI" class="btn btn-info shadow-sm m-1 text-white">
          <span v-if="loadingAI" class="spinner-border spinner-border-sm me-1"></span>
          🤖 AI-советник
        </button>
      </div>

      <!-- Основные фильтры (запрос к серверу) -->
      <div class="col-md-3 mb-3">
        <label class="form-label small fw-bold">Склад (база)</label>
        <select class="form-select" v-model="nameStock">
          <option v-for="st in stocks" :key="st.id" :value="st.nameStock">{{st.nameStock}}</option>
        </select>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label small fw-bold">Товар (база)</label>
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

    <!-- Таблица данных с локальными фильтрами и стрелками -->
    <div class="table-responsive shadow-sm rounded mt-3">
      <table class="table table-striped table-hover align-middle border">
        <thead class="table-dark">
          <tr>
            <th style="min-width: 250px;">
              <div class="d-flex align-items-center mb-1">
                <input class="form-control form-control-sm me-2 shadow-none" v-model="nameStockFilter" v-on:keyup="FilterFn()" placeholder="🔍 Поиск">
                <div class="btn-group-vertical">
                  <button type="button" class="btn btn-dark btn-xs p-0 px-1" @click="sortResult('nameStock', true)">▲</button>
                  <button type="button" class="btn btn-dark btn-xs p-0 px-1" @click="sortResult('nameStock', false)">▼</button>
                </div>
              </div>
              <small class="ps-2">Наименование склада</small>
            </th>
            <th style="min-width: 250px;">
              <div class="d-flex align-items-center mb-1">
                <input class="form-control form-control-sm me-2 shadow-none" v-model="nameGoodFilter" v-on:keyup="FilterFn()" placeholder="🔍 Поиск">
                <div class="btn-group-vertical">
                  <button type="button" class="btn btn-dark btn-xs p-0 px-1" @click="sortResult('nameGood', true)">▲</button>
                  <button type="button" class="btn btn-dark btn-xs p-0 px-1" @click="sortResult('nameGood', false)">▼</button>
                </div>
              </div>
              <small class="ps-2">Наименование товара</small>
            </th>
            <th class="text-center">
              <div class="d-flex justify-content-center mb-1">
                <button type="button" class="btn btn-dark btn-xs p-0 px-1 me-1" @click="sortResult('qty', true)">▲</button>
                <button type="button" class="btn btn-dark btn-xs p-0 px-1" @click="sortResult('qty', false)">▼</button>
              </div>
              <small>Кол-во</small>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acc in goodrests" :key="acc.id">
            <td>{{acc.nameStock}}</td>
            <td>{{acc.nameGood}}</td>
            <td class="fw-bold text-center">{{acc.qty}}</td>
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
      goodrestsWithoutFilter: [], // Для локальной фильтрации
      goods: [],
      stocks: [],
      nameGood: "Все",
      nameStock: "Все",
      nameStockFilter: "",
      nameGoodFilter: ""
    }
  },
  methods: {
    refreshData() {
      axios.get(ENDPOINTS.STOCKS).then(res => {
        this.stocks = [{ id: 0, nameStock: "Все" }, ...res.data];
      });
      axios.get(ENDPOINTS.GOODS).then(res => {
        this.goods = [{ id: 0, nameGood: "Все" }, ...res.data];
      });
    },

    // Получение данных с сервера
    GetReport() {
      axios.get(`${ENDPOINTS.GOODRESTS}/${this.nameStock}/${this.nameGood}`)
        .then(res => {
          this.goodrests = res.data;
          this.goodrestsWithoutFilter = res.data;
        })
        .catch(err => console.error("Ошибка загрузки отчета", err));
    },

    // Локальная фильтрация в таблице
    FilterFn() {
      const sF = this.nameStockFilter.toLowerCase().trim();
      const gF = this.nameGoodFilter.toLowerCase().trim();
      this.goodrests = this.goodrestsWithoutFilter.filter(el => {
        return el.nameStock.toLowerCase().includes(sF) &&
               el.nameGood.toLowerCase().includes(gF);
      });
    },

    // Сортировка по колонкам
    sortResult(prop, asc) {
      this.goodrests = [...this.goodrestsWithoutFilter].sort((a, b) => {
        if (asc) return a[prop] > b[prop] ? 1 : -1;
        return a[prop] < b[prop] ? 1 : -1;
      });
    },

    GetReportPDF() {
      const url = `${ENDPOINTS.GOODRESTS}/export/pdf/${this.nameStock}/${this.nameGood}`;
      axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Отчет_Остатки_${this.nameStock}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    },

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
    this.refreshData();
    this.GetReport();
  }
}
</script>

<style scoped>
.btn-xs { font-size: 0.65rem; }
th { vertical-align: top; }
</style>
