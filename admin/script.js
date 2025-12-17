const API_PATH = "shanglun";
const API_URL = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${API_PATH}`;
const API_TOKEN = "qEsZdrWijvf5d3ek8PH9uOPS9yU2";

let orders = [];

const initOrders = () => {
    axios.get(`${API_URL}/orders`,
        {
            headers: {
                'Authorization': API_TOKEN
            }
        }).then(response => {
            orders = response.data?.orders ?? [];
            renderOrders(orders);
            renderProductsChart(orders);
        }).catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};

initOrders();

const orderPageTbody = document.querySelector(".orderPage-table tbody");

const renderOrders = (orders) => {
    const tbodyHtml = orders
        .map(order => {
            const user = order.user;

            const productsHtml = order.products
                .map(product => `<p>${product.title} (${product.quantity})</p>`)
                .join("");

            const orderTime = new Date(order.createdAt * 1000);

            return `
                <tr>
                    <td>${order.id}</td>
                    <td>
                        <p>${user.name}</p>
                        <p>${user.tel}</p>
                    </td>
                    <td>${user.address}</td>
                    <td>${user.email}</td>
                    <td class="order-products">
                        ${productsHtml}
                    </td>
                    <td>${orderTime.toLocaleDateString("zh-TW")}</td>
                    <td class="orderStatus">
                        <a href="#" data-id="${order.id}">${order.paid ? "已處理" : "未處理"}</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${order.id}">
                    </td>
                </tr>
            `;
        }).join("");

    orderPageTbody.innerHTML = tbodyHtml
        ? tbodyHtml
        : "<tr><td colspan='8'>無訂單資料</td></tr>";
};

const delSingleOrder = (id) => {
    axios.delete(`${API_URL}/orders/${id}`,
        {
            headers: {
                'Authorization': API_TOKEN
            }
        }).then(response => {
            orders = response.data?.orders ?? [];
            renderOrders(orders);
            renderProductsChart(orders);
            alert("已刪除該筆訂單");
        }).catch(error => {
            console.error("資料載入錯誤： " + error);
        })
}

const changeOrderStatus = (id) => {
    const [choiceOrder] = orders.filter(order => order.id === id);
    axios.put(`${API_URL}/orders`,
        {
            "data": {
                "id": id,
                "paid": !choiceOrder.paid
            }
        },
        {
            headers: {
                'Authorization': API_TOKEN
            }
        }).then(response => {
            orders = response.data?.orders ?? [];
            renderOrders(orders);
            alert("已更改該筆訂單狀態");
        }).catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};

orderPageTbody.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.classList.contains("delSingleOrder-Btn")) {
        const userChoice = confirm("請確認是否刪除該筆訂單");
        if (!userChoice) return;

        const orderId = e.target.dataset.id;
        delSingleOrder(orderId);
        return;
    }

    if (e.target.parentElement.classList.contains("orderStatus")) {
        const userChoice = confirm("請確認是否更改該筆訂單狀態");
        if (!userChoice) return;

        const orderId = e.target.dataset.id;
        changeOrderStatus(orderId);
        return;
    }

    return;
})

const discardAllOrders = () => {
    axios.delete(`${API_URL}/orders`,
        {
            headers: {
                'Authorization': API_TOKEN
            }
        }).then(response => {
            orders = response.data?.orders ?? [];
            renderOrders(orders);
            renderProductsChart(orders);
            alert("已清除全部訂單");
        }).catch(error => {
            console.error("資料載入錯誤： " + error);
        })
};

const discardAllBtn = document.querySelector(".discardAllBtn");

discardAllBtn.addEventListener("click", e => {
    e.preventDefault();

    if (orders.length === 0) {
        alert("已經沒有訂單了")
        return;
    }

    const userChoice = confirm("請確認是否清除全部訂單");
    if (!userChoice) return;

    discardAllOrders();
})

const renderProductsChart = (orders) => {
    const productCountMap = orders.reduce((map, order) => {
        order.products.forEach(product => {
            map[product.title] =
                (map[product.title] || 0)
                + product.quantity * product.price;
        });
        return map;
    }, {});

    const pieColumns = Object.entries(productCountMap);
    pieColumns.sort((a, b) => b[1] - a[1]);

    if (pieColumns.length > 3) {
        const other = pieColumns.splice(3);
        const otherTotal = other.reduce((total, item) => {
            total[1] += item[1];
            return total;
        }, ["其他", 0])
        pieColumns.push(otherTotal);
        pieColumns.sort((a, b) => b[1] - a[1]);
    }

    chart = c3.generate({
        bindto: '#chart',
        data: {
            type: "pie",
            columns: pieColumns
        },
        color: {
            pattern: ['#301E5F', '#5434A7', '#9D7FEA', '#DACBFF']
        }
    })
};