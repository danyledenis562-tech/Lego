// ----------------------
// Глобальні змінні
// ----------------------
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart");
const totalSpan = document.getElementById("total");

// ----------------------
// Завантаження товарів
// ----------------------
fetch("../backend/products.php")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  });

// ----------------------
// Відображення товарів
// ----------------------
function renderProducts(list) {
  productsDiv.innerHTML = "";

  list.forEach(p => {
    productsDiv.innerHTML += `
      <div class="product" onclick="openProduct(${p.id})">
        <img src="images/${p.image}">
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.price} $</p>
        </div>
      </div>
    `;
  });
}

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}




// ----------------------
// Пошук
// ----------------------
function searchProducts() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q)
  );
  renderProducts(filtered);
}

// ----------------------
// Фільтр по ціні
// ----------------------
function filterByPrice(min, max) {
  const filtered = products.filter(p =>
    p.price >= min && p.price <= max
  );
  renderProducts(filtered);
}

// ----------------------
// Кошик
// ----------------------
function addToCart(product) {
  cart.push(product);
  saveCart();
  renderCart();
  alert("Товар додано в кошик!");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  if (!cartDiv) return;

  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach((p, i) => {
    total += parseFloat(p.price);
    cartDiv.innerHTML += `
      <li>
        ${p.name} - ${p.price} $
        <button onclick="removeFromCart(${i})">❌</button>
      </li>
    `;
  });

  totalSpan.innerText = total.toFixed(2);
}

renderCart();

// ----------------------
// Оформлення замовлення
// ----------------------
function checkout() {
  if (cart.length === 0) {
    alert("Кошик порожній!");
    return;
  }

  fetch("../backend/order.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      products: cart,
      total: totalSpan.innerText
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Замовлення успішно оформлено!");
    cart = [];
    saveCart();
    renderCart();
  });
}

// ----------------------
// Демо-оплата
// ----------------------
function pay() {
  if (cart.length === 0) {
    alert("Немає товарів для оплати!");
    return;
  }

  alert("Оплата пройшла успішно (Demo) 💳");
  checkout();
}

// ----------------------
// Перевірка ролі
// ----------------------
function checkAdmin() {
  if (localStorage.getItem("role") !== "admin") {
    alert("Доступ тільки для адміністратора!");
    location.href = "login.html";
  }
}

// ----------------------
// Логаут
// ----------------------
function logout() {
  localStorage.clear();
  location.href = "login.html";
}

function logout() {
  fetch("../backend/logout.php")
    .then(()=> location.href="login.html");
}
