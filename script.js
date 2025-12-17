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

let cartsInfo = {};

const initCarts = () => {
    axios.get(`${API_URL}/carts`)
        .then(response => {
            cartsInfo = response.data ?? {};
            renderCarts(cartsInfo);
        })
        .catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};

initCarts();

const shoppingCartTbody = document.querySelector(".shoppingCart-table tbody");
const shoppingCartTfoot = document.querySelector(".shoppingCart-table tfoot");
const finalTotalSpan = document.querySelector(".shoppingCart-table tfoot td:last-of-type");

const renderCarts = (cartsInfo) => {
    const { carts = [], finalTotal = 0 } = cartsInfo;
    const tbodyHtml = carts
        .map(cart => {
            const product = cart.product;
            return `
                <tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${product.images}" alt="">
                            <p>${product.title}</p>
                        </div>
                    </td>
                    <td>NT$${product.price.toLocaleString("zh-TW")}</td>
                    <td>${cart.quantity}</td>
                    <td>NT$${(product.price * cart.quantity).toLocaleString("zh-TW")}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${cart.id}">
                            clear
                        </a>
                    </td>
                </tr>
            `;
        }).join("");

    shoppingCartTbody.innerHTML = tbodyHtml
        ? tbodyHtml
        : "<tr><td colspan='5' align='center'>無商品資料</td></tr>";
    finalTotalSpan.textContent = `NT$${finalTotal.toLocaleString("zh-TW")}`;
};