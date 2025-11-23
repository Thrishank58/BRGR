/* BRGRR Burger Builder - Vanilla JS
   Features:
   - Dynamic toppings & buns
   - Live price update
   - Favorites via localStorage
   - "Repeat last" via sessionStorage
   - Login simulation (sessionStorage)
   - Validation & friendly feedback
   - Conditional UI & animations
   - Checkout summary
   - Session order history
*/

// Data models
const BUNS = [
  { id: "classic", name: "Classic", price: 2.0 },
  { id: "sesame", name: "Sesame", price: 2.5 },
  { id: "brioche", name: "Brioche", price: 3.0 },
  { id: "glutenfree", name: "Gluten-free", price: 3.2 }
];

const TOPPINGS = [
  { id: "patty", name: "Beef Patty", price: 4.0 },
  { id: "cheese", name: "Cheddar Cheese", price: 1.0 },
  { id: "bacon", name: "Bacon", price: 1.5 },
  { id: "lettuce", name: "Lettuce", price: 0.5 },
  { id: "tomato", name: "Tomato", price: 0.5 },
  { id: "onion", name: "Onion", price: 0.4 },
  { id: "pickle", name: "Pickles", price: 0.4 },
  { id: "mushroom", name: "Mushrooms", price: 0.9 },
  { id: "jalapeno", name: "Jalapeños", price: 0.8 },
  { id: "egg", name: "Fried Egg", price: 1.2 }
];

// State
const state = {
  user: null, // session only
  bun: null,
  toppings: new Set(),
  total: 0,
  bunConfirmed: false
};

const els = {};
function q(id) { return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", init);

function init() {
  els.loginForm = q("login-form");
  els.loginName = q("login-name");
  els.welcome = q("welcome");

  els.bunSelect = q("bun-select");
  els.bunFeedback = q("bun-feedback");
  els.toppingsGrid = q("toppings-grid");
  els.toppingFeedback = q("topping-feedback");

  els.selectedList = q("selected-list");
  els.totalPrice = q("total-price");
  els.favoriteSave = q("favorite-save");
  els.favoriteApply = q("favorite-apply");
  els.repeatLast = q("repeat-last");
  els.confirmBun = q("confirm-bun");
  els.checkout = q("checkout");
  els.builderFeedback = q("builder-feedback");

  els.checkoutContent = q("checkout-content");
  els.orderHistory = q("order-history");

  // Session login
  restoreSessionUser();
  bindLogin();

  // Populate UI
  renderBuns();
  renderToppingButtons();

  // Bind actions
  bindBuilderActions();

  // Initial UI update
  updatePriceAndList();
  refreshButtons();
  renderOrderHistory();
}

// Login simulation (sessionStorage)
function restoreSessionUser() {
  const name = sessionStorage.getItem("brgrr_user");
  if (name) {
    state.user = name;
    els.loginForm.style.display = "none";
    els.welcome.textContent = `Welcome, ${name}`;
  }
}

function bindLogin() {
  els.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (els.loginName.value || "").trim();
    if (!name) return;
    sessionStorage.setItem("brgrr_user", name);
    state.user = name;
    els.loginForm.style.display = "none";
    els.welcome.textContent = `Welcome, ${name}`;
  });
}

// Builder: buns
function renderBuns() {
  els.bunSelect.innerHTML = `<option value="">-- Select bun --</option>`;
  BUNS.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = `${b.name} ($${b.price.toFixed(2)})`;
    els.bunSelect.appendChild(opt);
  });

  els.bunSelect.addEventListener("change", () => {
    const id = els.bunSelect.value;
    state.bun = BUNS.find(b => b.id === id) || null;
    state.bunConfirmed = false;
    els.confirmBun.disabled = !state.bun;
    validateBuilder();
    updatePriceAndList();
    refreshButtons();
  });
}

// Builder: toppings (dynamic, no hardcoding)
function renderToppingButtons() {
  els.toppingsGrid.innerHTML = "";
  TOPPINGS.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "topping-btn";
    btn.setAttribute("type", "button");
    btn.setAttribute("data-id", t.id);
    btn.innerHTML = `
      <span>${t.name}</span>
      <span>$${t.price.toFixed(2)}</span>
    `;
    btn.addEventListener("click", () => toggleTopping(t.id, btn));
    els.toppingsGrid.appendChild(btn);
  });
}

function toggleTopping(id, btnEl) {
  if (state.bunConfirmed) {
    setFeedback(els.builderFeedback, "Bun is confirmed. Toppings remain editable, but bun cannot change.", "warn");
  }
  if (state.toppings.has(id)) {
    state.toppings.delete(id);
    btnEl.classList.remove("active");
  } else {
    state.toppings.add(id);
    btnEl.classList.add("active");
  }
  validateBuilder();
  updatePriceAndList();
  refreshButtons();
}

// UI: validation & feedback
function validateBuilder() {
  if (!state.bun) {
    setFeedback(els.bunFeedback, "Please select a bun to continue.", "warn");
  } else {
    setFeedback(els.bunFeedback, "Bun selected ✓", "success");
  }

  if (state.toppings.size === 0) {
    setFeedback(els.toppingFeedback, "Pick at least one topping for a proper burger.", "warn");
  } else {
    setFeedback(els.toppingFeedback, "Looks tasty! Keep adding or proceed.", "success");
  }

  const ready = !!state.bun && state.toppings.size > 0;
  els.checkout.disabled = !ready;
  els.confirmBun.disabled = !state.bun || state.bunConfirmed;
}

function setFeedback(el, msg, type = "") {
  el.classList.remove("success", "warn", "error");
  if (type) el.classList.add(type);
  el.textContent = msg;
}

// UI: list + price
function updatePriceAndList() {
  const bunPrice = state.bun ? state.bun.price : 0;
  let toppingTotal = 0;

  const selected = [];
  els.selectedList.innerHTML = "";

  if (state.bun) {
    selected.push({ label: `Bun: ${state.bun.name}`, price: state.bun.price });
  }
  state.toppings.forEach(id => {
    const t = TOPPINGS.find(x => x.id === id);
    if (t) {
      toppingTotal += t.price;
      selected.push({ label: t.name, price: t.price });
    }
  });

  selected.forEach(item => {
    const li = document.createElement("li");
    li.className = "selected-item";
    li.innerHTML = `<span>${item.label}</span><span>$${item.price.toFixed(2)}</span>`;
    els.selectedList.appendChild(li);
  });

  state.total = bunPrice + toppingTotal;
  els.totalPrice.textContent = `$${state.total.toFixed(2)}`;
}

// Buttons & conditional UI
function refreshButtons() {
  const ready = !!state.bun && state.toppings.size > 0;
  els.checkout.disabled = !ready;
  els.confirmBun.disabled = !state.bun || state.bunConfirmed;
}

// Actions: favorite (localStorage)
const FAVORITE_KEY = "brgrr_favorite";
function bindBuilderActions() {
  els.favoriteSave.addEventListener("click", () => {
    if (!state.bun || state.toppings.size === 0) {
      setFeedback(els.builderFeedback, "Select a bun and at least one topping before saving favorite.", "warn");
      return;
    }
    const fav = {
      bunId: state.bun.id,
      toppings: Array.from(state.toppings),
    };
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(fav));
    setFeedback(els.builderFeedback, "Favorite saved! You can apply it anytime.", "success");
  });

  els.favoriteApply.addEventListener("click", () => {
    const raw = localStorage.getItem(FAVORITE_KEY);
    if (!raw) {
      setFeedback(els.builderFeedback, "No favorite found. Save one first.", "warn");
      return;
    }
    const fav = JSON.parse(raw);
    applyCombo(fav);
    setFeedback(els.builderFeedback, "Favorite applied. Yum!", "success");
  });

  // Repeat last order (sessionStorage)
  els.repeatLast.addEventListener("click", () => {
    const raw = sessionStorage.getItem("brgrr_last_order");
    if (!raw) {
      setFeedback(els.builderFeedback, "No last order found this session.", "warn");
      return;
    }
    const combo = JSON.parse(raw);
    applyCombo(combo);
    setFeedback(els.builderFeedback, "Last order rebuilt for you.", "success");
  });

  // Confirm bun (disable bun selector after confirmation)
  els.confirmBun.addEventListener("click", () => {
    if (!state.bun) {
      setFeedback(els.builderFeedback, "Select a bun first.", "warn");
      return;
    }
    state.bunConfirmed = true;
    els.bunSelect.disabled = true;
    setFeedback(els.builderFeedback, `Bun confirmed: ${state.bun.name}.`, "success");
    refreshButtons();
  });

  // Checkout
  els.checkout.addEventListener("click", () => {
    if (!state.bun || state.toppings.size === 0) {
      setFeedback(els.builderFeedback, "Complete your selection first.", "warn");
      return;
    }
    const order = {
      user: state.user,
      bunId: state.bun.id,
      bunName: state.bun.name,
      toppings: Array.from(state.toppings),
      total: state.total,
      ts: Date.now()
    };

    // Session history (persist for current tab)
    const history = getSessionHistory();
    history.push(order);
    sessionStorage.setItem("brgrr_history", JSON.stringify(history));
    sessionStorage.setItem("brgrr_last_order", JSON.stringify({ bunId: order.bunId, toppings: order.toppings }));

    renderOrderHistory();
    renderCheckout(order);
    setFeedback(els.builderFeedback, "Order placed! Summary updated below.", "success");
  });
}

function applyCombo(combo) {
  // Reset
  state.bunConfirmed = false;
  els.bunSelect.disabled = false;

  // Apply bun
  state.bun = BUNS.find(b => b.id === combo.bunId) || null;
  els.bunSelect.value = state.bun ? state.bun.id : "";

  // Apply toppings
  state.toppings = new Set(combo.toppings || []);
  // Update topping buttons styles
  Array.from(els.toppingsGrid.querySelectorAll(".topping-btn")).forEach(btn => {
    const id = btn.getAttribute("data-id");
    if (state.toppings.has(id)) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  validateBuilder();
  updatePriceAndList();
  refreshButtons();
}

// Checkout summary
function renderCheckout(order) {
  const toppingNames = order.toppings.map(id => (TOPPINGS.find(t => t.id === id) || {}).name).filter(Boolean);
  els.checkoutContent.innerHTML = `
    <div class="summary-panel">
      <p><strong>Customer:</strong> ${order.user || "Guest"}</p>
      <p><strong>Bun:</strong> ${order.bunName}</p>
      <p><strong>Toppings:</strong> ${toppingNames.length ? toppingNames.join(", ") : "None"}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    </div>
  `;
}

// Session order history
function getSessionHistory() {
  const raw = sessionStorage.getItem("brgrr_history");
  return raw ? JSON.parse(raw) : [];
}

function renderOrderHistory() {
  const history = getSessionHistory();
  els.orderHistory.innerHTML = "";
  if (history.length === 0) {
    els.orderHistory.innerHTML = `<li class="muted">No orders this session yet.</li>`;
    return;
  }
  history.slice().reverse().forEach(o => {
    const li = document.createElement("li");
    const date = new Date(o.ts).toLocaleString();
    const toppingNames = o.toppings.map(id => (TOPPINGS.find(t => t.id === id) || {}).name).filter(Boolean).join(", ");
    li.innerHTML = `
      <div><strong>${o.user || "Guest"}</strong> • ${date}</div>
      <div>Bun: ${o.bunName} • Toppings: ${toppingNames || "None"}</div>
      <div>Total: $${o.total.toFixed(2)}</div>
    `;
    els.orderHistory.appendChild(li);
  });
}