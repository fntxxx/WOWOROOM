const API_PATH = "shanglun";
const API_URL = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${API_PATH}`;

let products = [];

const initProducts = () => {
    axios.get(`${API_URL}/products`)
        .then(response => {
            products = response.data?.products ?? [];
            renderProducts(products);
        })
        .catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};

initProducts();

const productWrap = document.querySelector(".productWrap");

const renderProducts = (products) => {
    const productsHtml = products
        .map(product => `
            <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${product.images}"
                    alt="${product.title}">
                <a href="#" class="addCartBtn" data-id="${product.id}">加入購物車</a>
                <h3>${product.title}</h3>
                <del class="originPrice">NT$${product.origin_price.toLocaleString("zh-TW")}</del>
                <p class="nowPrice">NT$${product.price.toLocaleString("zh-TW")}</p>
            </li>
        `).join("");

    productWrap.innerHTML = productsHtml;
};