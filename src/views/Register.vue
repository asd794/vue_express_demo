<template>

  <div class="container" style="margin-top: 40px;">
    <div class="row pt-3">
      <div class="col"></div>
      <div class="col-4">
        <img  class="img-fluid" src="https://img.599ku.com/element2/647f6c9aba5a950c6ce02d013f658a3e.jpg" />
      </div>
      <div class="col-3 my-auto">
        <form id="form">
          <h1 class="mb-4 text-center">註冊</h1>
          <input type="text" placeholder="請輸入會員名稱" class="mb-3 px-3 pe-4 py-2" v-model="name"/>
          <input type="email" placeholder="請輸入電子郵件" class="mb-3 px-3 pe-4 py-2" v-model="email"/>
          <input type="password" placeholder="請輸入密碼" class="mb-4 px-3 pe-4 py-2" v-model="password"/>
          <button class="btn btn-lg btn-primary w-100" type="submit" @click.prevent="" v-on:click="register">
            註冊
          </button>
        </form>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import testnavbar from '../components/test/testNavbar.vue';
export default {
  // components: {
  //   navbar: testnavbar,
  // },
  data() {
    return {
			apiServer: "http://localhost:3000/api/",
			frontRedirect: "http://localhost/",
      name: "",
      email: "",
      password: "",
    };
  },
  created() {      
    this.getSessionData();
    console.log('created');
  },
  methods: {
    test(){
      console.log('進入到test方法');
    },
    register() {
      // event.preventDefault();

      // 簡易驗證不能為空值
      if(this.name == '' || this.email == '' || this.passowrd == ''){
        alert('欄位不能為空');
        return
      }
      console.log('進入register方法');
      axios.post(`${this.apiServer}member`,{
        name: this.name,
        email: this.email,
        password: this.password
      }).then(function (response) {
        // 當請求成功時
        console.log(response['data']['message']);
        if(response['data']['message']=='EmailFound'){
          // console.log('email已被註冊，請重新註冊');
          alert('email已被註冊，請重新註冊');
        }else if(response['data']['message']=='EmailNotFound'){
          alert('註冊成功~!');
          window.location.href = `${this.frontRedirect}login/`;
        }
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
        axios.post(`${this.apiServer}session`, { withCredentials: true })
      .then(response => {
        console.log('Session data:', response.data);
        if (response.data.isAuthenticated == true){
          window.location.href = `${this.frontRedirect}products/`;
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