<template>
	<div class="container"  style="margin-top:60px;">
		<h1>我的商品</h1>


		<div class="page-section section pt-120 pb-120" v-if="MyProducts.length > 0">
			<div class="container">
				<div class="row">				
					<div class="col-lg-8 col-12 mx-auto" v-for="(product, index) in MyProducts" :key="index">
						<a :href="'http://localhost:5173/products/' + product.Product_ID" style="font-size: 30px; line-height: 50px;">
							{{ product.Product_Name }}, Product_ID:{{ product.Product_ID }}
						</a>
						<br>
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
			loading: false,
			MyProducts: [],
		};
    },
	computed: {
		// ...mapGetters(['isAuthenticated']),
	},
	created() {
		// 在Vue實例被創建後立即執行API請求
		console.log('Created hook: isAuthenticated:', this.isAuthenticated);
		this.getSessionData();
		this.getMyProducts();
		// console.log(this.isAuthenticated);
		// if (this.isAuthenticated) {
		// 	this.getMyProducts();
		// }
		// console.log(this.products);
	},
    methods: {
		...mapActions(['onlogin', 'offlogout']),
		getMyProducts() {
		// event.preventDefault();
			axios.get('http://localhost:3000/api/myproducts', {
				// params: {
				// 	'Member_id' :8,
				// }
			}).then((response) => {
				console.log(response.data);
				this.MyProducts = response.data;
				console.log(response.data.length)
				// for(response.data ){

				// }
			}).catch(function (error) {
				// 請求失敗時
				console.log(error);
			}).then(function () {
				// 總是執行
			});
		},
		getSessionData() {
			axios.post('http://localhost:3000/api/session', { withCredentials: true })
		.then(response => {
			console.log('Session data:', response.data);
			if (response.data.isAuthenticated == false){
				
				window.location.href = 'http://localhost:5173/products/';
			}else{
				this.onlogin(); // 成功後觸發 Vuex 的 login action
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