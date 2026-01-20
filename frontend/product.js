const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../backend/products.php")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === id);

    document.getElementById("productImage").src = `images/${product.image}`;
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productDesc").innerText = product.description;
    document.getElementById("productPrice").innerText = product.price + " $";

    document.getElementById("buyBtn").onclick = () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Додано в кошик!");
    };
  });
