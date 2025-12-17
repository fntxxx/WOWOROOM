const API_PATH = "shanglun";
const API_URL = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${API_PATH}`;

let products = [];

const initProducts = () => {
    axios.get(`${API_URL}/products`)
        .then(response => {
            products = response.data?.products ?? [];
        })
        .catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};