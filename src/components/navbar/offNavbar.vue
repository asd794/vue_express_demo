<template>
  
  <div class="navbar" style="margin-bottom: 80px;">
      <nav class="navbar custom-nav  fixed-top navbar-expand-lg navbar-light bg-light">
        <!-- <a class="navbar-brand" href="/" style="margin-left: 20px;">購物網站</a> -->
        <router-link to="/products" class="navbar-brand" style="margin-left: 20px;">購物網站</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse " id="navbarSupportedContent" style="margin-right: 20px;">
            <ul class="navbar-nav ms-auto">
              <!-- <li class="nav-item active">
                <router-link to="/" class="nav-link">主頁</router-link>
              </li> -->
              <li class="nav-item">
                <router-link to="/products" class="nav-link">產品</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/register" class="nav-link">註冊</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/login" class="nav-link">登入</router-link>
              </li>
            </ul>
            


        </div>
        
    </nav>
  </div>
  <!-- <router-view /> -->

</template>
   
  <script>
  export default {
    name: 'offNavbar',
    props: {
      msg: String
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