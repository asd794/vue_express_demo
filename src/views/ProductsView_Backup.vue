<template>
	<div class="container">
		
		<div class="row gx-5 gy-5" style="margin-top:60px;margin-bottom: 60px;" v-if="products.length > 0" >

			<button v-on:click="testB"><h1>test store</h1></button>

			<div class="col" v-for="(product, index) in products" :key="index">
				<div class="desc" >
					<a :href="'http://localhost:5173/products/' + product.Product_ID"><img :src="getImageUrl(product.Image)" width="300" height="400" ></a>
					<h3>{{ product.Product_Name }}</h3>
					<br>
					<span>$ {{ product.Price }}</span>
				</div>
			</div>	

		</div>	
	</div>
</template>
  
<script>
	import axios from "axios";
	// import offNavbar from '@/components/navbar/offNavbar.vue'; //這是登入要用的組件
	// import { useAppStore } from './stores/store'; // 导入你的 Pinia store
	import { mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				loading: false,
				products: [],
				name: null
			};
		},
		computed: {
			isLoggedIn() {
			// 在這裡檢查用戶是否已登入，並返回布爾值
			// 例如，可以檢查是否存在用戶的 session 或者 token
			// 如果用戶已登入，返回 true；否則返回 false
			// 這只是一個示例，你需要根據你的實際情況進行修改
			return true; // 假設已登入
			}
		},
		created() {
		// 在Vue實例被創建後立即執行API請求
			this.getProducts();
		// console.log(this.products);
		},
		methods: {

			getProducts() {
			// event.preventDefault();
				axios.get('http://localhost:3000/api/products').then((response) => {
					console.log(response.data);
					this.products = response.data;
					console.log('http://localhost:3000'+response['data'][0]['Image'].substr(1))
				}).catch(function (error) {
					// 請求失敗時
					console.log(error);
				}).then(function () {
					// 總是執行
				});
			},
			getImageUrl(imagePath) {
				return `http://localhost:3000${imagePath.substr(1)}`;
			},
			testB() {
				console.log('進入到testB方法')
				this.$router.replace('/test/test');
			},


		},
  };
</script>