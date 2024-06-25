<template>

<div class="container"  style="margin-top:60px;">
  <h1>產品頁面</h1>
  <div class="card mb-3" style="width: 100%;height: 700px;">
    <div class="row g-0">
      <div class="col-md-4">
        <img :src="getImageUrl(product.Image)" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h1 class="card-title">{{ product.Product_Name }}</h1>
          <p class="card-text" style="margin-top: 50px;">{{ product.Description }}</p>
          <p>價格 ${{ product.Price }} </p>

          <form>
            <label for="amount-select">選擇數量:</label>
            <select id="amount-select" v-model="selectedOption">
              <option value="" disabled>數量</option>
              <option v-for="(option, index) in product.Amount" :key="index" :value="option">{{ option }}</option>
            </select>
            <br>
            <button type="submit" class="btn btn-outline-primary" style="margin-top: 40px;" v-on:click="addCart">加入購物車</button>
          </form>
        </div>

      </div>



    </div>

  </div>
  
</div>


</template>
  
<script>
import axios from "axios";
import { mapGetters, mapActions } from 'vuex';
export default {
  data() {
  return {
    isAuthenticated: false,
    product: [],
    productId: null,
    selectedOption: '',
    options: null,
    };
  },
  computed: {

	},
  created() {
    // 初始化 productId
    this.productId = this.$route.params.id;
    this.getSessionData();
    // 在Vue實例被創建後立即執行API請求
    this.getProduct();
  },
  methods: {
    ...mapActions(['onlogin', 'offlogout']),
    getProduct() {
    // event.preventDefault();
      axios.get(`http://localhost:3000/api/products/${this.productId}`).then((response) => {
        console.log(response.data);
        this.product = response.data;
      }).catch(function (error) {
        // 請求失敗時
        console.log(error);
      }).then(function () {
        // 總是執行
      });
    },
    getImageUrl(imagePath) {
      return this.product?.Image?.substr(1) ? `http://localhost:3000${imagePath.substr(1)}` : '';
    },
    getSessionData() {
      axios.post('http://localhost:3000/api/session', { withCredentials: true })
      .then(response => {
        console.log('Session data:', response.data);
        if (response.data.isAuthenticated == true){
        // 登入狀態
          this.isAuthenticated = true;
          this.onlogin(); // 成功後觸發 Vuex 的 login action
        }
      
      // alert('Session data: ' + JSON.stringify(response.data));
      })
      .catch(error => {
        console.log('Error getting session data:', error);
      });
    },
    addCart() {
      console.log("進入addCart",this.isAuthenticated);
      if(this.isAuthenticated == false){
        alert('加入購物車前請先登入~!!!');
        return;
      }
      this.options = { 
        "Product_ID": this.product.Product_ID,
        "Price": this.product.Price,
        "Amount": this.selectedOption,
      };
      console.log(this.options);
      console.log('選擇數量: ',this.selectedOption);

      axios.post(`http://localhost:3000/api/mycart`, {'productID': this.productId, 'selectAmount': this.selectedOption, 'productPrice': this.product.Price} ).then((response) => {
        alert(response.data.message);
        console.log(response.data);
        location.reload();

      }).catch(function (error) {
        // 請求失敗時
        console.log(error);
        alert(error.response.data.message);
      }).then(function () {
        // 總是執行
      });
      
    },

    },
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center; /* 水平置中 */
  position: absolute;
  bottom: 0;
  width: 100%; /* 確保按鈕容器佔據整個寬度 */
}
</style>