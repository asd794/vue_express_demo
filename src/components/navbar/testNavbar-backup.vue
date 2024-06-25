<template>
  
  <div class="navbar">
      <nav class="navbar custom-nav  fixed-top navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">購物網站</a>
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
              <router-link to="/stores" class="nav-link">商店</router-link>
            </li>
            </ul>
            


        </div>
        
    </nav>
  </div>
  <router-view />

</template>
   
  <script>
  export default {
    name: 'testNavbar',
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
        background-color: #dce2da !important;
      }
     }
  </style>