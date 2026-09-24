const categories = {
  Electronics: [
    { name: "Smartphone", price: 500 },
    { name: "Laptop", price: 1200 },
    { name: "Headphones", price: 150 },
    { name: "Mouse", price: 45 },
    { name: "Tablet", price: 850 },
    { name: "Smartwatch", price: 220 },
    { name: "Bluetooth Speaker", price: 120 },
    { name: "Webcam", price: 70 },
    { name: "Keyboard", price: 65 },
    { name: "Monitor", price: 950 },
    { name: "Power Bank", price: 35 },
    { name: "Router", price: 140 },
    { name: "Drone", price: 3200 },
    { name: "SSD", price: 450 },
    { name: "Action Camera", price: 180 },
  ],
  Stationery: [
    { name: "Notebook", price: 5 },
    { name: "Pen", price: 1.5 },
    { name: "Marker", price: 2.5 },
    { name: "Calculator", price: 15 },
    { name: "Pencil", price: 0.8 },
    { name: "Eraser", price: 0.6 },
    { name: "Stapler", price: 8 },
    { name: "Paper Pack", price: 12 },
    { name: "Highlighter", price: 3 },
    { name: "Ruler", price: 2 },
    { name: "Sticky Notes", price: 4 },
    { name: "Folder", price: 7 },
    { name: "Glue", price: 2.2 },
    { name: "Tape", price: 2.8 },
    { name: "Scissors", price: 9 },
  ],
  Groceries: [
    { name: "Milk", price: 2.5 },
    { name: "Bread", price: 1.8 },
    { name: "Eggs", price: 3.2 },
    { name: "Rice", price: 2.2 },
    { name: "Sugar", price: 2 },
    { name: "Salt", price: 1 },
    { name: "Cooking Oil", price: 6 },
    { name: "Tea", price: 4.5 },
    { name: "Coffee", price: 5.5 },
    { name: "Apples", price: 3.8 },
    { name: "Bananas", price: 1.2 },
    { name: "Tomatoes", price: 2.5 },
    { name: "Potatoes", price: 1.6 },
    { name: "Onion", price: 1.7 },
    { name: "Chicken", price: 6.5 },
    { name: "Yogurt", price: 1.9 },
    { name: "Cereal", price: 4.3 },
  ],
  Clothing: [
    { name: "T-shirt", price: 12 },
    { name: "Jeans", price: 25 },
    { name: "Socks", price: 4 },
    { name: "Jacket", price: 40 },
    { name: "Hoodie", price: 35 },
    { name: "Cap", price: 8 },
    { name: "Scarf", price: 10 },
    { name: "Belt", price: 9 },
    { name: "Dress", price: 45 },
    { name: "Shorts", price: 18 },
    { name: "Sweater", price: 28 },
    { name: "Shoes", price: 70 },
    { name: "Sunglasses", price: 22 },
    { name: "Gloves", price: 12 },
    { name: "Wallet", price: 15 },
  ],
  Home: [
    { name: "Lamp", price: 18 },
    { name: "Mug", price: 8 },
    { name: "Pillow", price: 20 },
    { name: "Cleaner", price: 10 },
    { name: "Cushion", price: 14 },
    { name: "Table Mat", price: 10 },
    { name: "Blanket", price: 25 },
    { name: "Vase", price: 22 },
    { name: "Shower Curtain", price: 16 },
    { name: "Soap", price: 3 },
    { name: "Detergent", price: 9 },
    { name: "Pan", price: 24 },
    { name: "Knife Set", price: 30 },
    { name: "Brush", price: 5 },
    { name: "Clock", price: 18 },
  ],
  Beauty: [
    { name: "Moisturizer", price: 12 },
    { name: "Lip Balm", price: 4 },
    { name: "Face Wash", price: 7 },
    { name: "Shampoo", price: 10 },
    { name: "Conditioner", price: 10 },
    { name: "Perfume", price: 25 },
    { name: "Hand Cream", price: 6 },
    { name: "Nail Polish", price: 5 },
    { name: "Body Lotion", price: 11 },
    { name: "Makeup Kit", price: 22 },
    { name: "Sunscreen", price: 9 },
    { name: "Hair Oil", price: 8 },
    { name: "Toothpaste", price: 3 },
    { name: "Shaving Cream", price: 6 },
    { name: "Deodorant", price: 7 },
  ],
};

const billItems = [];
const categorySelect = document.getElementById("category-select");
const productSelect = document.getElementById("product-select");
const nameInput = document.getElementById("product-name");
const customNameRow = document.getElementById("custom-name-row");
const quantityInput = document.getElementById("product-quantity");
const priceInput = document.getElementById("product-price");
const addButton = document.getElementById("add-product");
const billItemsContainer = document.getElementById("bill-items");
const subtotalEl = document.getElementById("subtotal");
const discountPercentEl = document.getElementById("discount-percent");
const discountAmountEl = document.getElementById("discount-amount");
const totalEl = document.getElementById("total");

function formatMoney(value) {
  return `₹${value.toFixed(2)}`;
}

function calculateTotals() {
  const subtotal = billItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  let discountPercent = 0;
  if (subtotal > 1000) {
    discountPercent = Math.floor(subtotal / 1000) * 5;
    if (discountPercent > 50) {
      discountPercent = 50;
    }
  }

  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;
  return { subtotal, discountPercent, discount, total };
}

function renderBill() {
  if (billItems.length === 0) {
    billItemsContainer.innerHTML =
      '<li class="cart-item">No items added yet.</li>';
  } else {
    billItemsContainer.innerHTML = billItems
      .map(
        (item, index) => `
        <li class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <div>${item.quantity} × ${formatMoney(item.price)}</div>
          </div>
          <div class="item-actions">
            <span>${formatMoney(item.price * item.quantity)}</span>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        </li>
      `,
      )
      .join("");
  }

  const totals = calculateTotals();
  subtotalEl.textContent = formatMoney(totals.subtotal);
  discountPercentEl.textContent = `${totals.discountPercent}%`;
  discountAmountEl.textContent = formatMoney(totals.discount);
  totalEl.textContent = formatMoney(totals.total);
}

function removeItem(index) {
  billItems.splice(index, 1);
  renderBill();
}

billItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button.remove-btn");
  if (!button) return;

  const index = Number(button.dataset.index);
  removeItem(index);
});

function populateCategories() {
  categorySelect.innerHTML = Object.keys(categories)
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function populateProducts() {
  const selectedCategory = categorySelect.value;
  const products = categories[selectedCategory] || [];

  productSelect.innerHTML = `${products
    .map(
      (item) =>
        `<option value="${item.name}" data-price="${item.price}">${item.name}</option>`,
    )
    .join("")}
    <option value="__other__">Other product...</option>`;

  updateProductSelection();
}

function updateProductSelection() {
  const selectedOption = productSelect.value;
  const selectedItem = productSelect.selectedOptions[0];

  if (selectedOption === "__other__") {
    customNameRow.classList.remove("hidden");
    nameInput.value = "";
    priceInput.value = "0.00";
    return;
  }

  customNameRow.classList.add("hidden");
  if (selectedItem) {
    priceInput.value = Number(selectedItem.dataset.price).toFixed(2);
  }
}

function addItem() {
  const selectedProduct = productSelect.value;
  const name =
    selectedProduct === "__other__" ? nameInput.value.trim() : selectedProduct;
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);

  if (!name || quantity < 1 || price < 0) {
    alert("Please enter a valid product name, quantity, and price.");
    return;
  }

  billItems.push({ name, quantity, price });
  quantityInput.value = 1;
  priceInput.value =
    selectedProduct === "__other__" ? "0.00" : priceInput.value;
  if (selectedProduct === "__other__") {
    nameInput.value = "";
  }

  renderBill();
}

categorySelect.addEventListener("change", populateProducts);
productSelect.addEventListener("change", updateProductSelection);
addButton.addEventListener("click", addItem);

populateCategories();
populateProducts();
renderBill();
