<template>
	<div class="container"  style="margin-top:60px;">
		<h1>上架產品</h1>


		<div class="page-section section pt-120 pb-120" v-if="isAuthenticated = true">
			<div class="container" style="display: flex;justify-content: center;">
                <div class="col-lg-6 mb-40">
                    <form @submit.prevent="uploadProduct">
                        <div class="mb-3">
                            <label class="form-label">產品名稱<span class="req">*</span></label>
                            <input type="text" class="form-control" required="required" v-model="productName">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">價格<span class="req">*</span></label>
                            <input type="number" class="form-control" required="required" min="1" v-model="price" >
                        </div>
                        <div class="mb-3">
                            <label class="form-label">數量<span class="req">*</span></label>
                            <input type="number" class="form-control" required="required" min="1" v-model="amount">
                        </div>
                        <div class="mb-3">
                            <label for="formFile" class="form-label">上傳圖片<span class="req">*</span></label>
                            <input class="form-control" type="file" id="formFile" required="required" @change="handleUpload" accept=".jpeg, .jpg">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" maxlength="100">產品介紹<span class="req">*</span></label>
                            <textarea class="form-control" rows="3" required="required" v-model="description"></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary">送出</button>
                    </form>										
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
            isAuthenticated: false,
            mycart: [],
            total: 0,
            test: "",
            selectedFile: null,
            productName: "",
            price: null,
            amount: null,
            description: "",
            
		};
    },
	computed: {
		// ...mapGetters(['isAuthenticated']),
	},
	created() {
		this.getSessionData();
        // this.getProducts();
        // this.getMycart();
	},
    methods: {
		...mapActions(['onlogin', 'offlogout']),
		getSessionData() {
			return axios.post(`${this.apiServer}session`, { withCredentials: true })
            .then(response => {
			console.log('Session data:', response.data);
			if (response.data.isAuthenticated == false){
				this.isAuthenticated = false;
				// window.location.href = `${this.frontRedirect}products/`;
                this.$router.push('/products');
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
            axios.get(`${this.apiServer}mycart`)
            .then(response => {
                console.log(response.data);
                this.mycart = response.data.results;
                console.log(this.mycart);
                for (let i = 0; i < this.mycart.length; i++){

                    axios.get(`${this.apiServer}products/${this.mycart[i].Product_ID}`).then((responseProduct) => {
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
        handleUpload(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadProduct() {
            await this.getSessionData();
            console.log('這是isAuthenticated~~~~~~~~~~~~~~~~~~~~:',this.isAuthenticated);
            if( this.isAuthenticated == false){
                return;
            }
            if (!this.selectedFile) {
                alert('Please select a image to upload');
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('productName', this.productName);
            formData.append('price', this.price);
            formData.append('amount', this.amount);
            formData.append('description', this.description);
           
            try {
                const response = await axios.post(`${this.apiServer}upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                }});
                console.log('File uploaded successfully:', response.data);
                alert('產品上架完成~!');
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
        }


    },
  };
</script>

<style>
    .req {
    color: red;
    }


</style>