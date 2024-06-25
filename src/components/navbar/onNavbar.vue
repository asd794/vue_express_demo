<template>
  
  <div class="navbar" style="margin-bottom: 80px;">
    
      <nav class="navbar custom-nav  fixed-top navbar-expand-lg navbar-light bg-light">
        <!-- <a class="navbar-brand" href="/" style="margin-left: 20px;">購物網站</a> -->
        <router-link to="/products" class="navbar-brand" style="margin-left: 20px;">購物網站</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse " id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto">
              <!-- <li class="nav-item active">
                
              </li> -->
              <!-- <li class="nav-item active">
                <router-link to="/" class="nav-link">主頁</router-link>
              </li> -->
              <li class="nav-item">
                <router-link to="/products" class="nav-link">產品</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/mycart" class="nav-link">購物車</router-link>
              </li>
              
              <li class="nav-item dropdown" style="margin-right: 20px;">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  您好, {{ Name }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" style="min-width: 100px;">
                  <li class="nav-item">
                    <router-link to="/myaccount" class="dropdown-item">我的帳號</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/myproducts" class="dropdown-item">我的產品</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/myorders" class="dropdown-item">我的訂單</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/shelves" class="dropdown-item">上架產品</router-link>
                  </li>
                  <li class="nav-item">
                    <a href="" class="dropdown-item" v-on:click="logout">登出</a>
                  </li>
                </ul>
              </li>
            </ul>          

        </div>     





        <!-- <div style="position: relative;">
          <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            這才是購物車
          </a>
          <div class="card" style="position: absolute; top: 100%; left: 0; z-index: 100;">
            <div class="card-header d-flex justify-content-between align-items-end">
              購物車內容
            </div>
            <div class="collapse" id="collapseExample">
              <div class="card card-body">
   
                 
              </div>
            </div>
          </div>
        </div> -->
        
        <!--  -->
        <div class="card" style="position: relative;  margin-right: 10px; background-color: #f5db9e; ">

          <a class="" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" >
            <img src="https://lh5.googleusercontent.com/proxy/VutmyUebf2BT0sa_mtkcMemSDN8tmcqszsEa-C_9b8S--NRN9HjItVS3Pa5lYFiYMvqo4mcTUCyiF_B1aX_qJhWD75z_kHz1Qw" alt="" style="max-width: 60px; max-height: 60px;" >
          </a>


          <div class="collapse" id="collapseExample">
            <div class="card card-body" style="position: absolute; top: 100%; right:0%; z-index: 100; min-width: 600px;">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" width="50"></th>
                    <th scope="col" width="50">
                    
                    </th>
                    <th scope="col" width="200">產品名稱</th>
                    <th scope="col" width="100">數量</th>
                    <th scope="col" width="50">單價</th>
                  </tr>
                </thead>
                <tbody v-for="(product, index) in mycart" :key="index">
                  <tr>
                    <th scope="row">
                      <a href=""><img src="https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-delete-vector-icon-png-image_963971.jpg" alt="" style="max-width: 30px; max-height: 30px;" v-on:click="deleteaMycart(product.Product_ID)"></a>
                    </th>
                    <td>
                      <!-- <div class="card border-secondary">
                        <div class="card-body bg-cover" style=";">
                          
                        </div>
                      </div> -->                      
                    </td>
                    <td>{{ product.Product_Name }}</td>
                    <td>{{ product.Amount }}</td>
                    <td class="text-right">$ {{ product.Price }}</td>
                  </tr>

                </tbody>
                <tfoot >
                  <tr>
                    <td colspan="4" class="text-right">總計 </td>
                    <td class="text-right">$ {{ total }}</td>
                  </tr> 
                  
                </tfoot>
                
              </table>
              <router-link to="/mycart" class="btn btn-primary" @click.prevent="" style="display: flex; justify-content: center;">去結帳</router-link>
            </div>
          </div>
        </div>
        <!--  -->

    </nav>  
    
  </div>
  <!-- <router-view /> -->

</template>
   
<script>

  import axios from "axios";

  export default {
    name: 'onNavbar',
    props: {
      msg: String
    },
      data() {
        return {
          Name: "",
          Email: "",
          isAuthenticated: null,
          mycart: [],
          total: 0,
        };
    },
    created (){
      this.getSessionData();
      this.getMycart();
    },
    methods: {
      logout(){
        axios.get('http://localhost:3000/api/logout')
        .then(function (response) {
          // 當請求成功時
          console.log('成功請求get logoutAPI~')
          // 前往特定網頁
          window.location.href = 'http://localhost:5173/products/';
        })
        .catch(function (error) {
          // 請求失敗時
          console.log(error);
        })
        .then(function () {
          // 總是執行
        });
      },
      getSessionData() {
          console.log('這在onNavbar.vue裡面');
          axios.post('http://localhost:3000/api/session', { withCredentials: true })
          .then(response => {
            if (response.data.isAuthenticated == true){
              console.log(response.data);
              this.Name = response.data.Name;
              this.Email = response.data.Email;
            }
            // alert('Session data: ' + JSON.stringify(response.data));
          })
          .catch(error => {
            console.log('Error getting session data:', error);
          });
      },
      getMycart() {
        axios.get('http://localhost:3000/api/mycart')
        .then(response => {
          console.log(response.data);
          this.mycart = response.data.results;
          console.log(this.mycart);

          for (let i = 0; i < this.mycart.length; i++){
            axios.get(`http://localhost:3000/api/products/${this.mycart[i].Product_ID}`).then((responseProduct) => {
                this.mycart[i].Product_Name = responseProduct.data.Product_Name;
                this.total+= this.mycart[i].Price*this.mycart[i].Amount;
            }).catch(function (errorProduct) {
                // 請求失敗時
                console.log(errorProduct);
            }).then(function () {
                // 總是執行
            });
          }
          console.log(this.mycart);
        }).catch(error => {
            console.log(error);
        });           
      },
      deleteaMycart(delete_Product_ID) {
        console.log(`有近來deleteaMycart${delete_Product_ID}`);
        axios.delete(`http://localhost:3000/api/mycart/${delete_Product_ID}`).then((response) => {
          console.log(response.data.message);
          }).catch(function (errorProduct) {
              // 請求失敗時
              console.log(errorProduct);
          }).then(function () {
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
     .border-rounded{
        border-radius:50px;
      }
      .bg-cover{
        background-size: cover;
        background-position: center center;
      }
</style>