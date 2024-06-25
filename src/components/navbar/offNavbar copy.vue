<template>
  
  <div class="navbar">
      <nav class="navbar custom-nav  fixed-top navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">購物網站</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse " id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item active">
                <router-link to="/" class="nav-link">主頁</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/products" class="nav-link">產品</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/myproducts" class="nav-link">我的產品</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">我的帳號</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">上架產品</router-link>
              </li>
              <li class="nav-item">
                <a href="" class="nav-link" v-on:click="logout">登出</a>
              </li>
            </ul>
            


        </div>
        
    </nav>
  </div>
  <router-view />

</template>
   
<script>
  import axios from "axios";

  export default {
    name: 'offNavbar',
    props: {
      msg: String
    },
    methods: {
      logout(){
        axios.get('http://localhost:3000/api/logout')
        .then(function (response) {
          // 當請求成功時
          console.log('成功請求get logoutAPI~')
          // 前往特定網頁
          window.location.href = 'http://localhost:5173/';
        })
        .catch(function (error) {
          // 請求失敗時
          console.log(error);
        })
        .then(function () {
          // 總是執行
        });
      },
    },
  }
  </script>
   
  <style scoped lang="scss">
    @media (min-width: 992px) { 
      .navbar.custom-nav{
        padding-top:16px;
        padding-bottom:16px;
        background-color: #f5db9e !important;
      }
     }
</style>