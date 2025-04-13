
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded. Initial cart state:', cart);

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            console.log(`Adding to cart: ${name} at $${price}`);
            addToCart(name, price);
        });
    });

    // Confirm Order
    document.getElementById('confirm-order').addEventListener('click', () => {
        if (cart.length > 0) {
            console.log('Confirming order. Current cart:', cart);
            const confirmButton = document.getElementById('confirm-order');
            confirmButton.classList.add('loading'); 
            setTimeout(() => {
                showOrderModal();
                confirmButton.classList.remove('loading'); 
            }, 1000); 
        } else {
            console.log('Cannot confirm order: Cart is empty');
        }
    });

    
    document.getElementById('start-new-order').addEventListener('click', () => {
        console.log('Starting new order. Resetting cart.');
        cart = [];
        updateCart();
        document.getElementById('order-modal').classList.remove('active'); 
        console.log('Cart after reset:', cart);
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
        console.log(`Increased quantity for ${name}. New quantity: ${existingItem.quantity}`);
    } else {
        cart.push({ name, price, quantity: 1 });
        console.log(`Added new item: ${name} with quantity 1`);
    }
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartHeader = document.querySelector('.cart h2');

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>${item.name} ${item.quantity}x @ $${item.price.toFixed(2)} $${itemTotal.toFixed(2)}</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${index})">✖</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = itemCount;
    cartTotal.textContent = `$${total.toFixed(2)}`;
    console.log('Cart updated. Current cart:', cart);
    console.log(`Total items: ${itemCount}, Total price: $${total.toFixed(2)}`);

    // Trigger animations for cart total and header
    cartTotal.parentElement.classList.add('updated');
    cartHeader.classList.add('updated');
}

function changeQuantity(index, change) {
    const item = cart[index];
    const oldQuantity = item.quantity;
    item.quantity += change;
    if (item.quantity <= 0) {
        console.log(`Removing ${item.name} from cart due to quantity reaching 0`);
        cart.splice(index, 1);
    } else {
        console.log(`Changed quantity for ${item.name}: ${oldQuantity} -> ${item.quantity}`);
    }
    updateCart();
}

function removeFromCart(index) {
    const item = cart[index];
    console.log(`Removing ${item.name} from cart`);
    const cartItem = document.querySelectorAll('.cart-item')[index];
    cartItem.classList.add('removing'); 
    setTimeout(() => {
        cart.splice(index, 1);
        updateCart();
    }, 300); 
}

function showOrderModal() {
    const modal = document.getElementById('order-modal');
    const modalCartItems = document.getElementById('modal-cart-items');
    const modalTotal = document.getElementById('modal-total');

    modalCartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const modalItem = document.createElement('div');
        modalItem.classList.add('cart-item');
        modalItem.innerHTML = `
            <p>${item.name} ${item.quantity}x @ $${item.price.toFixed(2)}</p>
            <p>$${itemTotal.toFixed(2)}</p>
        `;
        modalCartItems.appendChild(modalItem);
    });

    modalTotal.textContent = `$${total.toFixed(2)}`;
    modal.classList.add('active');
    console.log('Order modal displayed. Order summary:', cart);
    console.log(`Order total: $${total.toFixed(2)}`);
}