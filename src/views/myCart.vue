<template>
	<div class="container"  style="margin-top:60px;">
		<h1>我的購物車</h1>

		<div class="page-section section pt-120 pb-120" v-if="isAuthenticated = true">
			<div class="container">       

                    <div class="row">
                        <div class="col-lg-6 mb-40">
                            <h3>訂單資訊</h3>
                            <form>
                                <div class="mb-3">
                                    <label class="form-label">名字<span class="req">*</span></label>
                                    <input type="text" class="form-control" required="required" v-model="name">
                                </div>
                                <!-- <div class="mb-3">
                                    <label class="form-label">Email<span class="req">*</span></label>
                                    <input type="email" class="form-control" required="required" v-model="email">
                                </div> -->
                                <div class="mb-3">
                                    <label class="form-label">手機<span class="req">*</span></label>
                                    <input type="text" class="form-control" required="required" v-model="phone"> 
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">地址<span class="req">*</span></label>
                                    <input type="text" class="form-control" required="required" v-model="address">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" maxlength="100">備註</label>
                                    <textarea class="form-control" rows="3" v-model="notes"></textarea>
                                </div>

                                <button type="submit" class="btn btn-primary" v-on:click="sendOrder">送出訂單</button>
                            </form>										
                        </div>
                        <div class="col-lg-6 col-12 mb-40">
                            <div class="order-wrapper">
                                <h3>你的訂單</h3>
                                <div class="order-table table-responsive mb-30">
                                    <table>
                                        <tr>
                                            <th class="product-name">產品</th>
                                            <th class="product-total">單價</th>
                                        </tr>							
                                        <tr v-for="(item, index) in mycart" :key="index">
                                                
                                                <td >
                                                    {{ item.Product_Name }} <strong style="margin-right: 10px;"> × {{ item.Amount }}</strong>
                                                </td>                                                
                                                <td>
                                                    <span>$ {{ item.Price }}</span>
                                                </td>
                                        </tr>
                                        
                                        <br>
                                        <tfoot>
                                            <tr id="order-total">
                                                <th>總金額</th>
                                                <td><strong>$ {{ total }}</strong>
                                                </td>
                                            </tr>								
                                        </tfoot>
                                    </table>
                                </div>
                                <button type="submit" class="btn btn-danger" v-on:click="cleanCart">清除購物車</button>
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
            isAuthenticated: false,
            mycart: [],
            total: 0,
            test: "",
            name: "",
            email: "",
            phone: null,
            address: "",
            notes: "",            
            
		};
    },
	computed: {
		// ...mapGetters(['isAuthenticated']),
	},
	created() {
		this.getSessionData();
        // this.getProducts();
        this.getMycart();
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
        getMycart() {
            axios.get('http://localhost:3000/api/mycart')
            .then(response => {
                console.log(response.data);
                this.mycart = response.data.results;
                console.log(this.mycart);
                console.log("test = " ,this.test);
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
			}).catch(error => {
                console.log(error);
			});           
        },
        sendOrder() {
            axios.post('http://localhost:3000/api/sendOrder', {'name': this.name, 'phone': this.phone, 'address': this.address, 'notes': this.notes })
            .then(response => {
                console.log(response.data.message)
                alert(response.data.message);
			}).catch(error => {
                console.log(error);
			});
            console.log(this.name,this.phone,this.address,this.notes)  
        },
        cleanCart() {
        console.log("進入cleanCart");
        axios.delete(`http://localhost:3000/api/mycart`).then((response) => {
            alert(response.data.message);
            window.location.reload();
            console.log(response.data);

        }).catch(function (error) {
            // 請求失敗時
            console.log(error);
            alert(error.response.data.message);
        }).then(function () {
            // 總是執行
        });
        },


    },
  };
</script>

<style>
    .req {
    color: red;
    }

</style>