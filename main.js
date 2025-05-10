const products = JSON.parse(localStorage.getItem("products") || "[]");

function login() {
  const code = document.getElementById("access-code").value;
  if (code === "mie-san-secret") {
    document.getElementById("admin-panel").classList.remove("hidden");
  } else {
    alert("Incorrect access code.");
  }
}

// Expose the login function globally
window.login = login;

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow p-4 rounded";
    card.innerHTML = `
      <img src="${p.img}" alt="Product" class="h-40 object-contain w-full mb-2">
      <input value="${p.title}" onchange="editTitle(${index}, this.value)" class="w-full mb-2 p-1 border rounded" />
      <input value="${p.img}" onchange="editImg(${index}, this.value)" class="w-full mb-2 p-1 border rounded" />
      <a href="${p.url}" target="_blank" class="text-blue-600">Open in Shopee</a>
    `;
    container.appendChild(card);
  });
}

function addProduct() {
  const url = document.getElementById("product-url").value;
  fetchShopeeMeta(url).then(meta => {
    products.push({ url, title: meta.title, img: meta.img });
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    document.getElementById("product-url").value = "";
  }).catch(() => alert("Failed to fetch product info."));
}

function editTitle(index, value) {
  products[index].title = value;
  localStorage.setItem("products", JSON.stringify(products));
}

function editImg(index, value) {
  products[index].img = value;
  localStorage.setItem("products", JSON.stringify(products));
}

async function fetchShopeeMeta(url) {
  const res = await fetch("https://corsproxy.io/?" + encodeURIComponent(url));
  const html = await res.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "Untitled";
  const img = html.match(/<meta property="og:image" content="(.*?)"/)?.[1] || "";
  return { title, img };
}

renderProducts();
