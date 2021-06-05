import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let proModal = '';
let delModal = '';

createApp({
    data() {
        return {
            apiUrl: "https://vue3-course-api.hexschool.io",
            apiPath: "ccyy915",
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    methods: {
        getData(page = 1) {
            console.log("start getting data...");
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
                .then(res => {
                    if (res.data.success) {
                        this.products = res.data.products;
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        updateData() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = "put";
            }

            axios[http](url, { data: this.tempProduct })
                .then(res => {
                    console.log(res.data);
                    if (res.data.success) {
                        alert(res.data.message);
                        proModal.hide();
                        this.getData();
                    } else {
                        alert(res.data.message);
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        deleteData() {
            console.log('start deleting...');
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
                .then(res => {
                    if (!res.data.success) {
                        alert(res.data.message);
                        return;
                    } else {
                        alert(res.data.message);
                        delModal.hide();
                        this.getData();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        openModal(isNew, item) {
            console.log("start opening modal...");
            if (isNew === "add") {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                proModal.show();
            } else if (isNew === "edit") {
                this.tempProduct = { ...item };
                this.isNew = false;
                proModal.show();
            } else if (isNew === "delete") {
                console.log("delete", item);
                this.tempProduct = { ...item };
                delModal.show();
            }
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        logout() {
            axios.post(`${this.apiUrl}/logout`)
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message);
                        let cookie = document.cookie.split(';');
                        for (let i = 0; i < cookie.length; i++) {
                            let chip = cookie[i],
                                entry = chip.split("="),
                                name = entry[0];
                            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        }
                        window.location.href = "index.html";
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    created() {
        console.log("start creating...");
        // get cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('您尚未登入請再次登入！');
            window.location = 'index.html';
        }
        axios.defaults.headers.common.Authorization = token;
        // Render 
        this.getData();
    },
    mounted() {
        console.log("start mounting...");
        // Modal
        proModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delModal = new bootstrap.Modal(document.querySelector('#delProductModal'));

    },
}).mount('#app');