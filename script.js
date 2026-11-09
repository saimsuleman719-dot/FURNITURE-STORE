
"use strict";

// Furniture products shown on the website.
// Prices are sample prices in Pakistani Rupees.
const products = [
  {
    id: 1,
    name: "Cloud Comfort Sofa",
    category: "sofa",
    price: 85000,
    tag: "Bestseller",
    description: "A cozy sofa with a clean, contemporary finish.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Nordic Lounge Chair",
    category: "chair",
    price: 28500,
    tag: "Popular",
    description: "A timeless accent chair for relaxed living.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Oak Coffee Table",
    category: "table",
    price: 22000,
    tag: "New Arrival",
    description: "A warm wooden table with a minimalist design.",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Modern Dream Bed",
    category: "bed",
    price: 92000,
    tag: "Premium",
    description: "A beautifully styled bed for restful nights.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Velvet Accent Chair",
    category: "chair",
    price: 32000,
    tag: "Trending",
    description: "Add a touch of elegance to your favorite corner.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Elegant Dining Table",
    category: "table",
    price: 67000,
    tag: "Handpicked",
    description: "Bring family and friends together in style.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const productSearch = document.getElementById("productSearch");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeCategory = "all";
let searchTerm = "";

// Format sample prices in PKR.
function formatPrice(price) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(price);
}

// Safely create product cards using DOM elements.
// This avoids inserting user-provided text as HTML.
function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  const imageBox = document.createElement("div");
  imageBox.className = "product-image";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    imageBox.replaceChildren();
    imageBox.textContent = "Image unavailable";
    imageBox.style.display = "grid";
    imageBox.style.placeItems = "center";
    imageBox.style.color = "#77756d";
  }, { once: true });

  const tag = document.createElement("span");
  tag.className = "product-tag";
  tag.textContent = product.tag;

  imageBox.append(image, tag);

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const description = document.createElement("p");
  description.textContent = product.description;

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const buyButton = document.createElement("button");
  buyButton.className = "buy-btn";
  buyButton.type = "button";
  buyButton.textContent = "Buy Now";
  buyButton.setAttribute("aria-label", `Buy ${product.name}`);
  buyButton.addEventListener("click", () => {
    showToast(
      `${product.name} selected! Connect a checkout system to complete your purchase.`
    );
  });

  bottom.append(price, buyButton);
  info.append(category, name, description, bottom);
  article.append(imageBox, info);

  return article;
}

// Render the product cards.
function renderProducts() {
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" ||
      product.category === activeCategory;

    const matchesSearch = (
      product.name + " " +
      product.category + " " +
      product.description
    ).toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.replaceChildren();

  filteredProducts.forEach((product) => {
    productGrid.appendChild(createProductCard(product));
  });

  emptyMessage.hidden = filteredProducts.length > 0;
}

// Product category buttons.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    renderProducts();
  });

  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

// Search products.
productSearch.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});

// View Collection button resets filters and search.
document.getElementById("viewAll").addEventListener("click", () => {
  activeCategory = "all";
  searchTerm = "";
  productSearch.value = "";

  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === "all";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
});

// Toast notification.
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// Sell furniture form.
// Submitted listings are added to the current page only.
document.getElementById("sellForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("itemCategory").value;
  const price = Number(document.getElementById("itemPrice").value);
  const imageUrl = document.getElementById("itemImage").value.trim();

  if (!name || !category || !Number.isFinite(price) || price <= 0) {
    showToast("Please enter valid furniture details.");
    return;
  }

  // Restrict custom images to HTTP(S) URLs.
  let safeImage =
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";

  if (imageUrl) {
    try {
      const parsedUrl = new URL(imageUrl);

      if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
        safeImage = parsedUrl.href;
      } else {
        showToast("Please use a valid HTTP or HTTPS image URL.");
        return;
      }
    } catch {
      showToast("Please enter a valid image URL.");
      return;
    }
  }

  const newProduct = {
    id: Date.now(),
    name,
    category,
    price,
    tag: "Community Listing",
    description: "Listed by a community seller.",
    image: safeImage
  };

  products.unshift(newProduct);
  renderProducts();

  form.reset();

  activeCategory = "all";
  searchTerm = "";
  productSearch.value = "";

  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === "all";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });

  showToast("Furniture listed on this page successfully!");
});

// Feedback form demo.
document.getElementById("feedbackForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const rating = document.getElementById("rating").value;

  showToast(`Thank you for your ${rating}-star feedback!`);
  form.reset();
});

// Contact form demo.
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  showToast(
    "Thank you for contacting us! Connect a backend to deliver your message."
  );

  form.reset();
});

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Toggle navigation"
  );
});

// Close mobile navigation after selecting a section.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Toggle navigation");
  });
});

// Smooth reveal animations when sections enter the viewport.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// Referral link.
// Generates a shareable link containing a referral code.
// Replace this demo logic with a real referral system on your backend.
const referralInput = document.getElementById("referralLink");

function createReferralLink() {
  const baseUrl = window.location.href.split("#")[0];
  const referralCode = "LUXE" + "2026";

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("ref", referralCode);
    return url.href;
  } catch {
    return baseUrl;
  }
}

referralInput.value = createReferralLink();

// Copy referral link.
document.getElementById("copyReferral").addEventListener("click", async () => {
  const link = referralInput.value;
  const status = document.getElementById("copyStatus");

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
    } else {
      referralInput.focus();
      referralInput.select();

      const copied = document.execCommand("copy");

      if (!copied) {
        throw new Error("Copy command failed");
      }

      referralInput.setSelectionRange(0, 0);
    }

    status.textContent = "Referral link copied successfully!";
    showToast("Referral link copied!");
  } catch {
    referralInput.focus();
    referralInput.select();
    status.textContent = "Select the link and copy it manually.";
    showToast("Please select and copy the referral link.");
  }
});

// Automatically update the footer year.
document.getElementById("year").textContent = new Date().getFullYear();

// Render products when the page loads.
renderProducts();
