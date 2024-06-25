<template>
	<div class="container"  style="margin-top:60px;">
		<h1>我的帳號</h1>


		<div class="page-section section pt-120 pb-120" v-if="isAuthenticated = true">
			<div class="container">

         
                <form class="row g-3" style="margin-bottom: 40px;">
                    <div class="col-12">
                    <label for="inputAddress" class="form-label">信箱</label>
                    <input type="text" class="form-control" id="inputAddress" v-model="email" disabled>
                    </div>
                </form>

                <form class="row g-3">                    
                    <div class="col-md-6">
                        <label for="inputEmail4" class="form-label">舊名稱</label>
                        <input type="text" class="form-control" v-model="oldName" disabled>
                    </div>
                    <div class="col-md-6">
                        <label for="inputPassword4" class="form-label">新名稱</label>
                        <input type="text" class="form-control" v-model="newName" >
                    </div>
                    <div style="display: flex;justify-content: center;margin-bottom: 40px;">
                        <button type="submit" class="btn btn-primary" v-on:click="patchMemberName">變更名稱</button>
                    </div>
                </form>
                
                <form class="row g-3">
                    <div class="col-md-6">
                        <label for="inputEmail4" class="form-label">舊密碼</label>
                        <input type="password" class="form-control" v-model="oldPassword">
                    </div>
                    <div class="col-md-6">
                        <label for="inputPassword4" class="form-label">新密碼</label>
                        <input type="password" class="form-control" v-model="newPassword">
                    </div>
                    <div style="display: flex;justify-content: center;margin-bottom: 40px;">
                        <button type="submit" class="btn btn-primary" v-on:click="patchMemberPassword">變更密碼</button>
                    </div>
                </form>

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
			MyProducts: [],
            isAuthenticated: false,
            email: "",
            oldName: "",
            newName: "",
            oldPassword: "",
            newPassword: "",
            member_id: "",
            
		};
    },
	computed: {
		// ...mapGetters(['isAuthenticated']),
	},
	created() {
		this.getSessionData();
		// console.log(this.isAuthenticated);
		// if (this.isAuthenticated) {
		// 	this.getMyProducts();
		// }
		// console.log(this.products);
	},
    methods: {
		...mapActions(['onlogin', 'offlogout']),
		getSessionData() {
			axios.post('http://localhost:3000/api/session', { withCredentials: true })
            .then(response => {
			console.log('Session data:', response.data);
			if (response.data.isAuthenticated == false){
				
				window.location.href = 'http://localhost:5173/products/';
			}else{
				this.onlogin(); // 成功後觸發 Vuex 的 login action
                this.isAuthenticated = response.data.isAuthenticated;
                this.email = response.data.Email;
                this.oldName = response.data.Name;
                this.member_id = response.data.Member_ID;
			}
			
			// alert('Session data: ' + JSON.stringify(response.data));
			})
            .catch(error => {
			console.log('Error getting session data:', error);
			});
		},
        patchMemberName() {
            axios.patch('http://localhost:3000/api/member', { "newName": this.newName, "Member_ID": this.member_id, "condition": "changeName"})
            .then(response => {
                this.isAuthenticated = response.data.isAuthenticated;
                this.email = response.data.Email;
                this.oldName = response.data.Name;
                this.member_id = response.data.Member_ID;		
			// alert('Session data: ' + JSON.stringify(response.data));
			})
            .catch(error => {
			console.log('Error getting session data:', error);
            alert(error.response.data)
			});
        },
        patchMemberPassword() {
            axios.patch('http://localhost:3000/api/member', { "oldPassword": this.oldPassword, "newPassword": this.newPassword, "Member_ID": this.member_id ,"condition": "changePassword"})
            .then(response => {
                this.isAuthenticated = response.data.isAuthenticated;
                this.email = response.data.Email;
                this.oldName = response.data.Name;
                this.member_id = response.data.Member_ID;
                console.log("response");
			})
            .catch(error => {
			console.log('Error getting session data:', error);
            alert(error.response.data)
			});
        },

    },
  };
</script>