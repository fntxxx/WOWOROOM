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

const productSelect = document.querySelector(".productSelect");

productSelect.addEventListener("change", () => {
    const selectedCategory = productSelect.value;

    const filtered =
        selectedCategory === "全部"
            ? products
            : products.filter(product => product.category === selectedCategory);

    renderProducts(filtered);
})

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

const addToCart = (id) => {
    const [choiceProduct] = cartsInfo.carts.filter(cart => cart.product?.id === id);
    const quantity = (choiceProduct?.quantity || 0) + 1;
    axios.post(`${API_URL}/carts`, {
        "data": {
            "productId": id,
            "quantity": quantity
        }
    }).then(response => {
        cartsInfo = response.data ?? {};
        renderCarts(cartsInfo);
        quantity > 1
            ? alert("已將購物車中的該品項數量加一")
            : alert("已將該品項加入購物車");
    }).catch(error => {
        console.error("資料載入錯誤： " + error);
    })
}

productWrap.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.className === "addCartBtn") {
        const userChoice = confirm("請確認是否將該品項加入購物車");
        if (!userChoice) return;

        const productId = e.target.dataset.id;
        addToCart(productId);
    }
    return;
})

const discardCart = (id) => {
    axios.delete(`${API_URL}/carts/${id}`)
        .then(response => {
            cartsInfo = response.data ?? {};
            renderCarts(cartsInfo);
            alert("已刪除購物車中的該品項");
        })
        .catch(error => {
            console.error("資料載入錯誤： " + error);
        })
}

shoppingCartTbody.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.closest(".discardBtn")) {
        const userChoice = confirm("請確認是否將該品項從購物車刪除");
        if (!userChoice) return;

        const cartId = e.target.dataset.id;
        discardCart(cartId);
    }
    return;
})

const discardAllCart = () => {
    axios.delete(`${API_URL}/carts`)
        .then(response => {
            cartsInfo = response.data ?? {};
            renderCarts(cartsInfo);
            alert("已刪除購物車中的所有品項");
        })
        .catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};

shoppingCartTfoot.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.className === "discardAllBtn") {
        if (cartsInfo.carts?.length === 0) {
            alert("您的購物車已經沒有商品了")
            return;
        }

        const userChoice = confirm("請確認是否將所有品項從購物車刪除");
        if (!userChoice) return;

        discardAllCart();
    }
    return;
})

const submitOrder = (user) => {
    axios.post(`${API_URL}/orders`,
        {
            "data": {
                "user": user
            }
        }).then(response => {
            initCarts();
            alert("已送出預訂資料");
        }).catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};