import faker from "faker";

let products = [];

function handleProductClick(id, name) {
  alert(id);
}

for (let i = 0; i < 10; i++) {
  const name = faker.commerce.productName();
  const elem = `<div onclick="handleProductClick('${i}')">${name}</div>`;
  products.push(elem);
}
document.getElementById("it-products").innerHTML = `
<div id="product-group-container" class="products-group">
  <h2>Products</h2>
  ${products.join("")}
</div>`;
