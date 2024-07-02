document.addEventListener("DOMContentLoaded", (event) => {
    initializeProductElements();
});

// Load the cart from the cookie and update the product elements
function initializeProductElements() {
    const cart = getCart();

    cart.forEach((item) => {
        const productId = item.id;
        const productAmount = item.amount;

        // Hide the add button
        if (productAmount > 0) {
            const btn = document.getElementById(`addButton-${productId}`);

            if (btn) {
                btn.classList.add("hidden");
            }
        }

        // Show the amount controls
        const amountControls = document.getElementById(
            `amountControls-${productId}`
        );
        if (amountControls) {
            amountControls.classList.remove("hidden");
        }

        // Set the correct amount
        const amountElement = document.getElementById(`amount-${productId}`);
        if (amountElement) {
            amountElement.textContent = productAmount;
        }

        // Set the correct price
        updateTotalPrice();
    });
}

async function checkout() {
    const cart = separateCartByBusiness();
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    const delivery = document.getElementById("delivery_location").value;
    const contact = document.getElementById("contact").value;

    if (!delivery || !contact) {
        alert("Please fill in the delivery location and contact");
        return;
    }

    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    const response = await fetch(`/checkout?cart=${JSON.stringify(cart)}&delivery_location=${delivery}&contact=${contact}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "'Accept": 'application/json',
            "X-CSRF-Token": csrf,
        },
    });

    const res = await response.json();
    if (res.success) {
        clearCart();
        alert(res.message);
        window.location.href = "/thank-you";
        return;
    }
    alert(res.message);
}

async function saveCartToDatabase(cart) {
    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    await fetch(`/save-cart?cart=${JSON.stringify(cart)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrf,
        },
    });
}

function getCart() {
    const name = "cart=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return []; // Return an empty array if no cart is found
}

function setCart(cart) {
    const d = new Date();
    d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // Cookie expires in 30 days
    const expires = "expires=" + d.toUTCString();
    document.cookie =
        "cart=" + JSON.stringify(cart) + ";" + expires + ";path=/";

    saveCartToDatabase(cart);
    updateTotalPrice();

    if (cart.length === 0) {
        window.location.reload();
    }
}

function updateTotalPrice() {
    const cart = getCart();
    const totalPrice = cart.reduce((total, product) => {
        return total + product.price * product.amount;
    }, 0);
    const totalPriceDom = document.getElementById("totalPrice");
    if (totalPriceDom) {
        totalPriceDom.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
}

function clearCart() {
    setCart([]);
}

function removeProduct(productId) {
    const cart = getCart();
    const updatedCart = cart.filter((product) => product.id !== productId);

    const productElement = document.getElementById(`productId-${productId}`);
    if (productElement) {
        productElement.remove();
    }
    setCart(updatedCart);
}

function separateCartByBusiness() {
    const cart = getCart();
    const businesses = {};
    cart.forEach((product) => {
        if (!businesses[product.business_id]) {
            businesses[product.business_id] = [];
        }
        businesses[product.business_id].push(product);
    });

    console.log(businesses);
    return businesses;
}

function updateCart(
    productId,
    productTitle,
    productPrice,
    businessId,
    amount,
    image
) {
    let cart = getCart();
    const existingProduct = cart.find((product) => product.id === productId);

    if (existingProduct) {
        existingProduct.amount = amount;
    } else {
        cart.push({
            id: productId,
            title: productTitle,
            price: productPrice,
            business_id: businessId,
            amount: amount,
            image: image,
        });
    }

    if (amount === 0) {
        cart = cart.filter((product) => product.id !== productId);

        const productElement = document.getElementById(`productId
        -${productId}`);
        if (productElement) {
            productElement.remove();
        }
    }
    setCart(cart);
}

function addItem(productId, productTitle, productPrice, businessId, image) {
    document.getElementById(`addButton-${productId}`).classList.add("hidden");
    document
        .getElementById(`amountControls-${productId}`)
        .classList.remove("hidden");
    updateCart(productId, productTitle, productPrice, businessId, 1, image);
}

function addItemAndRedirect(productId, productTitle, productPrice, businessId, image) {
    addItem(productId, productTitle, productPrice, businessId, image);
    // Redirect to checkout page
    window.location.href = "/checkout";
}

function increaseAmount(productId, productTitle, productPrice, businessId) {
    const amountSpan = document.getElementById(`amount-${productId}`);
    let amount = parseInt(amountSpan.textContent);
    amount += 1;
    amountSpan.textContent = amount;
    updateCart(productId, productTitle, productPrice, businessId, amount);
}

function decreaseAmount(productId, productTitle, productPrice, businessId) {
    const amountSpan = document.getElementById(`amount-${productId}`);
    let amount = parseInt(amountSpan.textContent);
    if (amount > 1) {
        amount -= 1;
        amountSpan.textContent = amount;
    } else {
        amount = 0;
        document
            .getElementById(`amountControls-${productId}`)
            .classList.add("hidden");
        document
            .getElementById(`addButton-${productId}`)
            .classList.remove("hidden");
    }
    updateCart(productId, productTitle, productPrice, businessId, amount);
}
