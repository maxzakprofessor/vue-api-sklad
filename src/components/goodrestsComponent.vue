<template>
<div class="container">
  <div class="row">
    <div class="col">
            <button type="button"
                class="btn btn-primary m-2 fload-end"
                @click="GetReport()">
                 Показать отчет
            </button>
    </div>
    <div class="col">
            <button type="button"
                class="btn btn-primary m-2 fload-end"
                @click="GetReportPDF()">
                 Скачать PDF
            </button>
    </div>

            <!-- Кнопка вызова -->
        <button @click="AskAI" :disabled="loadingAI" class="btn btn-primary m-2">
            <span v-if="loadingAI" class="spinner-border spinner-border-sm"></span>
            🤖 Спросить AI-советника (Gemini 2.0)
        </button>

        <!-- Блок ответа (ставим сразу под кнопкой) -->
        <div v-if="needUpgrade" class="alert alert-warning mt-3 shadow-sm border-2">
            <h5 class="alert-heading">🚀 Gemini 2.0 Flash интегрирован!</h5>
            <p>{{ aiMessage }}</p>
            <hr>
            <p class="mb-0 small text-muted">
                <strong>Статус:</strong> Архитектура бэкенда (Django + Docker) полностью готова. 
                Для работы требуется API-ключ уровня Premium.
            </p>
        </div>

        <div v-else-if="aiMessage" class="alert alert-success mt-3 shadow-sm">
            <strong>Анализ склада:</strong> {{ aiMessage }}
        </div>

    
    <div class="col-md-auto">
        <div class="input-group mb-3">
                <span class="input-group-text">Склад</span>
                <select class="form-select" v-model="nameStock">
                    <option v-for="st in stocks" v-bind:key="st.id" v-bind:value="st.nameStock">
                    {{st.nameStock}}
                    </option>
                </select>
        </div>
    </div>
    <div class="col-md-auto">
        <div class="input-group mb-3">
                <span class="input-group-text">Товар</span>
                <select class="form-select" v-model="nameGood">
                    <option v-for="st in goods" v-bind:key="st.id" v-bind:value="st.nameGood">
                    {{st.nameGood}}
                    </option>
                </select>
            </div>   
    </div>
    
  </div>
</div> 

<div>
<table class="table table-striped">
<thead>
    <tr>
        <th>
            Наименование склада
        </th>
        <th>
            Наименование товара
        </th>
        <th>
            Кол-во
        </th>
    </tr>
</thead>
<tbody>
    <tr v-for="acc in goodrests" v-bind:key="acc.id">
        <td>{{acc.nameStock}}</td>
        <td>{{acc.nameGood}}</td>
        <td>{{acc.qty}}</td>
    </tr>
</tbody>

</table>

</div>
</template>

<script>
  //import { API_URL, ENDPOINTS } from '../config';
  import axios from "axios";
  //import { usePDF } from 'vue3-pdfmake';


  //import pdfMake from "vue3-pdfmake";
  import pdfMake from 'pdfmake/build/pdfmake.js';
  import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ENDPOINTS } from "../config";
  //pdfMake.vfs = pdfFonts.pdfMake.vfs;  
  export default {
    name: 'goodrestsComponent',
    data(){
    return{
        aiMessage: '',
        needUpgrade: false, // Флаг для показа предупреждения
        loadingAI: false,
        goodrests:[],
        goods:[],
        stocks:[],
        s_nameGood:[],
        s_nameStock:[],
        s_qty:[],
        rows1:[],
        which_report:"/All",
        nameGood:"",
        nameStock:"",
    }
},
methods:{


refreshData() {
    // 1. Загружаем склады
    axios.get(ENDPOINTS.STOCKS)
    .then((response) => {
        // Создаем элемент "Все" и объединяем его с данными из БД
        this.stocks = [{ id: 0, nameStock: "Все" }, ...response.data];
        
        // Устанавливаем значение по умолчанию для выпадающего списка
        this.nameStock = "Все";
    });

    // 2. Загружаем товары
    axios.get(ENDPOINTS.GOODS)
    .then((response) => {
        // Создаем элемент "Все" и объединяем его с данными из БД
        this.goods = [{ id: 0, nameGood: "Все" }, ...response.data];
        
        // Устанавливаем значение по умолчанию
        this.nameGood = "Все";            
    });        
},
    addClick(){
        this.modalTitle="Получить остаток товара";
        this.id=0;
        this.id_stock=0;
        this.nameStock="";
        this.id_good=0;
        this.nameGood="";
        this.qty=0;
        this.datetime="yyyy-MM-dd HH:mm:ss"
    },
    editClick(acc){
        this.modalTitle="Редактировать остаток товара";
        this.id_good=acc.id_good;
        this.nameGood=acc.nameGood;
        this.id=acc.id;
        this.id_stock=acc.id_stock;
        this.nameStock=acc.nameStock;
        this.id_good=acc.id_good;
        this.nameGood=acc.nameGood;
        this.qty=acc.qty;
        this.datetime=acc.datetime
    },
        async AskAI() {

                        this.loadingAI = true;
            this.aiMessage = "";
            this.needUpgrade = false;

            try {
                const res = await axios.get(ENDPOINTS.AI_REPORT);
                
                if (res.data.status === "upgrade_required") {
                    this.needUpgrade = true;
                    this.aiMessage = res.data.message;
                } else {
                    this.aiMessage = res.data.report;
                }
            } catch (error) {
                this.aiMessage = "Сервис временно недоступен";
            } finally {
                this.loadingAI = false;
            }

        },
    createClick(){
        axios.post(ENDPOINTS.GOODRESTS,{
            id_stock:this.id_stock,
            nameStock:this.nameStock,
            id_good:this.id_good,
            nameGood:this.nameGood,
            qty:this.qty,
            datetime:this.datetime,
        })
        .then((response)=>{
            this.refreshData();
            //alert(response.data);
        });
    },
    updateClick(){
        axios.put(ENDPOINTS.GOODRESTS,{
            id_stock:this.id_stock,
            nameStock:this.nameStock,
            id_good:this.id_good,
            nameGood:this.nameGood,
            qty:this.qty,
            datetime:this.datetime,
            id:this.id,
        })
        .then((response)=>{
            this.refreshData();
            alert(response.data);
        });
    },
    deleteClick(id){
        if(!confirm("Are you sure?")){
            return;
        }

        axios.delete(ENDPOINTS.GOODRESTS+"/"+id)
        .then((response)=>{
            this.refreshData();
            //alert(response.data);
        });

    },
    FilterFn(){
        var id_goodFilter=this.id_goodFilter;
        var nameGoodFilter=this.nameGoodFilter;

        this.goodrests=this.goodrestsWithoutFilter.filter(
            function(el){
                return el.id_good.toString().toLowerCase().includes(
                    id_goodFilter.toString().trim().toLowerCase()
                )&&
                el.nameGood.toString().toLowerCase().includes(
                    nameGoodFilter.toString().trim().toLowerCase()
                )
            });
    },
    sortResult(prop,asc){
        this.goodrests=this.goodrestsWithoutFilter.sort(function(a,b){
            if(asc){
                return (a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
            }
            else{
                return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
            }
        })
    },
    GetReport(){
        axios.get(ENDPOINTS.GOODRESTS+"/"+this.nameStock+"/"+this.nameGood)
        .then((response)=>{
            this.goodrests=response.data;
            console.log(response.data);
            console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);   
        });
     
    },  
    

    GetReportPDF(){
        var rows2=['Наименование склада','Наименование товара','Кол-во'];
        this.rows1 = [['Наименование склада','Наименование товара','Кол-во']];
        this.goodrests.forEach((gr,jj) => {
        this.s_nameGood[jj]=gr.nameGood;
        this.s_nameStock[jj]=gr.nameStock;
        this.s_qty[jj]=gr.qty;

        //console.log(gr.qty); 
        this.rows1.push([gr.nameStock,gr.nameGood,gr.qty]);
    })  
//    console.log(this.rows1);       


var dd = {
                pageSize: 'A4',
                // by default we use portrait, you can change it to landscape if you wish
                pageOrientation: 'portrait',
                pageMargins: [ 50, 50, 100, 100 ],
                header: {
                        margin: [ 0, 0, 0, 0 ],
                        columns: [
                                    { text: 'Отчет по остаткам', fontSize: 18,    bold: true, alignment: 'center' 
                                    },
                                ]
                        },

                footer: {
                        margin: [ 0, 0, 0, 0 ],                    
                        columns: [
                                '', { text: '', alignment: 'center' }
                            ] 
                        },
  

  defaultStyle: {
    fontSize: 14,
    bold: false,
    alignment: 'right',
  },
  content: {
      table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto'],
              body:this.rows1,

          } 
  
  }
};



  pdfMake.createPdf(dd).open();
  
    },

},
mounted:function(){

    this.refreshData();
}
  }
</script>