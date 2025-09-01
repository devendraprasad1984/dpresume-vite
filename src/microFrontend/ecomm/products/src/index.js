import faker from "faker";

let products = [];

for (let i = 0; i < 10; i++) {
  const name = faker.commerce.productName();
  const elem = `<div>${name}</div>`;
  products.push(elem);
}
console.log("products", products);