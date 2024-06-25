<template>
  <div>
    <!-- 根據登入狀態顯示不同的導航欄 -->
    <!-- <component :is="isAuthenticated ? 'OnNavbar' : 'OffNavbar'"></component> -->

	<div class="container">
		
		<div class="row" v-if="products.length > 0" >

			<div class="col" style="max-width: 340px;max-height: 489.9px; margin-bottom: 40px;" v-for="(product, index) in products" :key="index">
				<div class="desc" >
					<a :href="'http://localhost:5173/products/' + product.Product_ID"><img :src="getImageUrl(product.Image)" width="300" height="400" ></a>
					<h3>{{ product.Product_Name }}</h3>
					<br>
					<span>$ {{ product.Price }}</span>
				</div>
			</div>	

		</div>	
	</div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from 'vuex';
// import OnNavbar from '../components/navbar/onNavbar.vue';
// import OffNavbar from '../components/navbar/offNavbar.vue';

export default {
  components: {
    // OnNavbar,
    // OffNavbar,
  },
	data() {
		return {
			products: [],
		};
	},
	computed: {
		// ...mapGetters(['isAuthenticated']),
	},
	created() {
		// console.log('Created hook: isAuthenticated:', this.isAuthenticated);
		
		// 在Vue實例被創建後立即執行API請求
		// if (this.isAuthenticated) {

		// }
		this.getProducts();

		// if (this.isAuthenticated) {
		// 	this.getProducts();
		// }

		this.getSessionData();
		
	},
  methods: {
    ...mapActions(['onlogin', 'offlogout']),
	getProducts() {
		// event.preventDefault();
		axios.get('http://localhost:3000/api/products').then((response) => {
			console.log(response.data);			
			this.products = response.data;
			// console.log(this.products);
			// console.log('http://localhost:3000'+response['data'][0]['Image'].substr(1)) 
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
      console.log('進入到testB方法');
      this.$router.replace('/test/test');
    },
	getSessionData() {
		
		axios.post('http://localhost:3000/api/session', { withCredentials: true })
		.then(response => {
			console.log('Session data:', response.data);
			if (response.data.isAuthenticated == true){
			// 登入狀態
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

<style scoped>

</style>
