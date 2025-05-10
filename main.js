const products = JSON.parse(localStorage.getItem("products") || "[]");

function login() {
  const code = document.getElementById("access-code").value;
  if (code === "test") {
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
    card.className = "bg-white shadow p-4 rounded relative";
    card.innerHTML = `
      <button onclick="removeProduct(${index})" class="absolute top-2 right-2 text-red-600">✖</button>
      <img src="${p.img || './placeholder.png'}" alt="Product" class="h-40 object-contain w-full mb-2">
      <input value="${p.title}" onchange="editTitle(${index}, this.value)" class="w-full mb-2 p-1 border rounded" />
      <input value="${p.img}" onchange="editImg(${index}, this.value)" class="w-full mb-2 p-1 border rounded" />
      <a href="${p.url}" target="_blank" class="text-blue-600">Open in Shopee</a>
    `;
    container.appendChild(card);
  });
}

function addProduct() {
  const affiliateUrl = document.getElementById("product-url").value; // Use affiliate link
  fetchShopeeMeta(affiliateUrl).then(meta => {
    const newProduct = { url: meta.affiliateUrl, title: meta.title, img: meta.img };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    document.getElementById("product-url").value = ""; // Clear input field
  }).catch(() => alert("Failed to fetch product info. Please check your link or try again later."));
}

// Expose the addProduct function globally
window.addProduct = addProduct;

function removeProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

// Expose the removeProduct function globally
window.removeProduct = removeProduct;

function editTitle(index, value) {
  products[index].title = value;
  localStorage.setItem("products", JSON.stringify(products));
}

function editImg(index, value) {
  products[index].img = value;
  localStorage.setItem("products", JSON.stringify(products));
}

async function fetchShopeeMeta(affiliateUrl) {
  try {
    // Attempt to fetch metadata using the affiliate URL
    const response = await fetch(affiliateUrl, { redirect: "follow" });

    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const html = await response.text();

    // Extract metadata from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const imgMatch = html.match(/<meta property="og:image" content="(.*?)"/);

    const title = titleMatch ? titleMatch[1] : "Untitled";
    const img = imgMatch ? imgMatch[1] : "";

    return { title, img, affiliateUrl };
  } catch (error) {
    console.error("Failed to fetch product metadata:", error);

    // Return placeholder data on failure
    return { title: "Failed to fetch title", img: "./placeholder.png", affiliateUrl };
  }
}

renderProducts();
