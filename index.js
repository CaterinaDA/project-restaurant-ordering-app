import menuArray from "./data.js";

let order = [];

const menuContainer = document.getElementById("menu-container");
const orderSection = document.getElementById("order-section");
const orderItemsEl = orderSection.querySelector(".order-items");
const orderTotalEl = orderSection.querySelector(".order-total-price");
const paymentModal = document.getElementById("payment-modal");
const paymentForm = document.getElementById("payment-form");
const completeOrderBtn = document.querySelector(".complete-order-btn");

// Modal view
completeOrderBtn.addEventListener("click", () => {
  paymentModal.classList.remove("hidden");
});

// Menu
function getMenuHtml() {
  return menuArray
    .map((item) => {
      const { id, name, ingredients, price, emoji } = item;

      return `
        <article class="menu-item">
                <p class="item-emoji">${emoji}</p>
                <div class="item-info">
                    <h2>${name}</h2>
                    <p class="item-description">${ingredients.join(", ")}</p>
                    <h3 class="item-price">$${price}</h3>
                </div>
                <div class="btn-group">
                    <button class="btn minus-btn" data-id="${id}"> - </button>
                    <button class="btn plus-btn" data-id="${id}"> + </button>
                </div>
            </article> 
        `;
    })
    .join("");
}

menuContainer.innerHTML = getMenuHtml();

// Add/Remove Button
menuContainer.addEventListener("click", (event) => {
  const plusBtn = event.target.closest(".plus-btn");
  const minusBtn = event.target.closest(".minus-btn");

  if (plusBtn) {
    const id = plusBtn.dataset.id;
    handleAddItem(Number(id));
  }

  if (minusBtn) {
    const id = minusBtn.dataset.id;
    handleRemoveItem(Number(id));
  }
});

// Remove Button
orderSection.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".order-remove-btn");

  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    handleRemoveAllOfItem(id);
  }
});

// Add Item
function handleAddItem(id) {
  const targetItem = menuArray.find((item) => item.id === id);

  const existingOrderItem = order.find((orderItem) => orderItem.id === id);

  if (existingOrderItem) {
    existingOrderItem.quantity += 1;
  } else {
    order.push({
      id: targetItem.id,
      name: targetItem.name,
      price: targetItem.price,
      quantity: 1,
    });
  }

  renderOrder();
}

// Remove Item (-1)
function handleRemoveItem(id) {
  const existingOrderItem = order.find((orderItem) => orderItem.id === id);

  if (!existingOrderItem) {
    return;
  }

  if (existingOrderItem.quantity > 1) {
    existingOrderItem.quantity -= 1;
  } else {
    order = order.filter((orderItem) => orderItem.id !== id);
  }

  renderOrder();
}

// Remove All Items
function handleRemoveAllOfItem(id) {
  order = order.filter((orderItem) => orderItem.id !== id);

  renderOrder();
}

// Render Order
function renderOrder() {
  if (order.length === 0) {
    orderSection.classList.add("hidden");
    orderItemsEl.innerHTML = "";
    orderTotalEl.textContent = "$0";
    return;
  }

  orderSection.classList.remove("hidden");

  const orderHtml = order
    .map((orderItem) => {
      return `
         <div class="order-item">
        <div class="order-item-info">
          <span class="order-item-name">${orderItem.name} x ${
        orderItem.quantity
      }</span>
          <button 
            class="order-remove-btn" 
            data-id="${orderItem.id}"
          >remove</button>
        </div>
        <span class="order-item-price">$${
          orderItem.price * orderItem.quantity
        }</span>
      </div>
        `;
    })
    .join("");

  orderItemsEl.innerHTML = orderHtml;

  const total = order.reduce((sum, orderItem) => {
    return sum + orderItem.price * orderItem.quantity;
  }, 0);

  orderTotalEl.textContent = `$${total}`;
}

// Payment Form
paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(paymentForm);
  const fullName = formData.get("fullName");

  paymentModal.classList.add("hidden");

  order = [];
  renderOrder();

  showThankYouMessage(fullName);
});

// Thank You Message
function showThankYouMessage(name) {
  const appEl = document.querySelector(".app");

  const messageEl = document.createElement("div");
  messageEl.className = "thank-you-message";
  messageEl.textContent = `Thanks, ${name}! Your order is on its way!`;

  appEl.appendChild(messageEl);

  setTimeout(() => messageEl.remove(), 5000);
}
