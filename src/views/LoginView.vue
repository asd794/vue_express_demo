<template>

    <div class="container" style="margin-top: 40px;">
      <div class="row pt-3">
        <div class="col"></div>
        <div class="col-4">
          <img class="img-fluid" src="https://png.pngtree.com/png-clipart/20210910/ourmid/pngtree-cute-girl-welcome-png-image_3896227.jpg" />
        </div>
        <div class="col-3 my-auto">
          <form id="form">
            <h1 class="mb-4 text-center">登入</h1>
            信箱 : <input type="email" placeholder="請輸入電子郵件" class="mb-3 px-3 pe-4 py-2" v-model="email"/>
            <br>
            密碼 : <input type="password" placeholder="請輸入密碼" class="mb-4 px-3 pe-4 py-2" v-model="password"/>
            <button class="btn btn-lg btn-primary w-100" type="submit" @click.prevent="" v-on:click="login">
              登入
            </button>
          </form>

          <!-- <button class="btn btn-lg btn-primary w-100" type="submit" @click.prevent="" v-on:click="getSessionData">
              拿到Session
          </button> -->
        </div>
        <div class="col"></div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  

  export default {

    data() {
      return {
        email: "",
        password: "",
        apiServer: "http://localhost:3000/api/",
        // frontRedirect: "http://localhost/",

      };
    },
    created() {
    // console.log('Created hook: isAuthenticated:', this.isAuthenticated);
    this.getSessionData();
    },
    watch: {
      isAuthenticated(newVal) {
        if (newVal) {
          this.getProducts();
        } else {
          this.products = [];
        }
      }
    },
    methods: {
      test(){
        console.log('進入到test方法');
      },  
      login() {
        // event.preventDefault();
  
        // 簡易驗證不能為空值
        if(this.email === '' || this.passowrd === ''){
          alert('欄位不能為空');
          return
        }
        console.log('進入login方法');
        axios.post(`${this.apiServer}login`,{
          email: this.email,
          password: this.password
        }).then(function (response) {
          // 當請求成功時
          console.log(response.data.message);
          if(response.data.message == "Error"){
            alert('帳密輸入錯誤');
          }else{
            window.location.replace(location.href);
          }
        }).catch(function (error) {
          // 請求失敗時
          console.log(error);
 
        }).then(function () {
          // 總是執行
        });
      },
      getSessionData() {
        axios.post(`${this.apiServer}session`, { withCredentials: true })
      .then(response => {
        console.log('Session data:', response.data);
        if (response.data.isAuthenticated == true){
          // window.location.href = `${this.frontRedirect}products/`;
          this.$router.push('/products');
          
        }
        // alert('Session data: ' + JSON.stringify(response.data));
      })
      .catch(error => {
        console.log('Error getting session data:', error);
      });
    },

  
    },
  };
  </script>