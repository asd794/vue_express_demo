<template>
	<div class="container" style="margin-top: 60px;">
		<h1 style="margin-top: 80px;">我的訂單</h1>

		<div class="accordion accordion-flush" id="accordionFlushExample">
			<div class="accordion-item" v-for="(order, index) in MyOrders" :key="index">
				<h2 class="accordion-header" :id="'flush-heading-' + order.Order_MID">
					<button class="accordion-button collapsed" type="button" :data-bs-toggle="'collapse'" :data-bs-target="'#flush-collapse-' + order.Order_MID" aria-expanded="false" :aria-controls="'flush-collapse-' + order.Order_MID">
						訂單:{{ order.Order_MID }}, 時間:{{ order.Datetime }} 
					</button>
				</h2>
				<div :id="'flush-collapse-' + order.Order_MID" class="accordion-collapse collapse" :aria-labelledby="'flush-heading-' + order.Order_MID" data-bs-parent="#accordionFlushExample">
					<div class="accordion-body">
						<div class="custom_data_table">
							<table>
								<thead>
									<tr>
										<th width="14%">訂單編號</th>
										<th width="14%">日期</th>
										<th width="14%">買家Name</th>
										<th width="14%">電話號碼</th>
										<th width="15%">地址</th>
										<th width="14%">金額</th>
										<th width="15%">註記</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{{ order.Order_MID }}</td>
										<td>{{ order.Datetime }}</td>
										<td>{{ order.Name }}</td>
										<td>{{ order.Phone }}</td>
										<td>{{ order.Address }}</td>
										<td>{{ order.Price * order.Amount }}</td>
										<td>{{ order.Notes }}</td>
									</tr>
									<tr v-for="(item, childIndex) in order.Items" :key="childIndex">
										<td></td>
										<td>{{ item.ProductName }} ({{ item.ProductID }})</td>
										<td>{{ item.SellerName }} ({{ item.SellerID }})</td>
										<td>{{ item.Price }}</td>
										<td>{{ item.Quantity }}</td>
										<td>{{ item.Amount }}</td>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
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
			apiServer: "http://localhost:3000/api/",
			// frontRedirect: "http://localhost/",
			MyOrders: [],
		};
    },
	computed: {
		// ...mapGetters(['isAuthenticated']),
	},
	created() {
		// 在Vue實例被創建後立即執行API請求
		console.log('Created hook: isAuthenticated:', this.isAuthenticated);
		this.getSessionData();
		this.getMyOrders();

	},
    methods: {
		...mapActions(['onlogin', 'offlogout']),
		getMyOrders() {
		// event.preventDefault();
			axios.get(`${this.apiServer}myorders`, {
			}).then((response) => {
				console.log(response.data);
				this.MyOrders = response.data.reverse(); // 反轉
				console.log(response.data.length)

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
			if (response.data.isAuthenticated == false){
				
				// window.location.href = `${this.frontRedirect}products/`;
				this.$router.push('/products');
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