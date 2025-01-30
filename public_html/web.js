// Helper function to show an error message
function showError(elementId, message) {
    let element = document.getElementById(elementId);
    element.classList.add("text-danger");
    element.style.display = 'block';
    element.innerText = message;
}

// Helper function to hide an error message
function hideError(elementId) {
    let element = document.getElementById(elementId);
    element.classList.remove("text-danger");
    element.style.display = 'none';
    element.innerText = '';
}

// Helper function to show success message
function showSuccess(elementId, message) {
    let element = document.getElementById(elementId);
    element.classList.remove("text-danger");
    element.classList.add("text-success");
    element.style.display = 'inline';
    element.innerHTML = message
}

// Form validation function
function validateForm() {
    let valid = true;

    // Clear all previous error messages and error styles
    document.querySelectorAll('.text-danger').forEach(function (element) {
        // Call the helper function to remove existing error messages
        hideError(element.id);
    });

    // Validate First Name & Last Name
    let firstName = document.getElementById("FName").value;
    let lastName = document.getElementById("LName").value;
    if (!firstName && !lastName) {
        showError("nameError", "First name and last name are required.");
        valid = false;
    } else {
        // First name validation
        if (!firstName) {
            showError("nameError", "First name is required.");
            valid = false;
        }
        // Last name validation
        else if (!lastName) {
            showError("nameError", "Last name is required.");
            valid = false;
        } else {
            showSuccess("nameError", "Valid name entered.");
        }
    }

    // Validate Customer ID (optional but specific length)
    let customer = document.getElementById("Id").value;
    if (customer && (customer.length !== 9)) {
        showError("idError", "Please enter a valid customer ID.");
        valid = false;
    } else {
        hideError("idError");
    }

    // Validate Email
    let email = document.getElementById("email").value;
    if (!email || !validateEmail(email)) {
        showError("emailError", "Please enter a valid email address.");
        valid = false;
    } else {
        hideError("emailError");
    }

    // Validate Phone Number (format: 040-000-0000)
    let phone = document.getElementById("phone").value;
    let phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phone) {
        showError("phoneError", "Phone number is required.");
        valid = false;
    } else {
        if (!phoneRegex.test(phone)) {
            showError("phoneError", "Please enter a valid phone number.");
            valid = false;
        } else {
            showSuccess("phoneError", "Valid phone number entered.");
        }
    }

    // Validate Issue Category
    let issueType = document.getElementById('issueType').value;
    if (issueType === "Choose one of the option" || issueType === "") {
        showError('issueTypeError', 'Please select an issue category.');
        valid = false;
    } else {
        showSuccess("issueTypeError", "Issue category choosen.");
    }

    // Validate Order Number (optional but specific format: 000-000-000-00000)
    let order = document.getElementById("order").value;
    let orderRegex = /^\d{3}-\d{3}-\d{3}-\d{5}$/;
    if (order && !orderRegex.test(order)) {
        showError("orderError", "Please enter a valid order number.");
        valid = false;
    } else {
        hideError("orderError");
    }

    // Validate Issue Description
    let issueDesc = document.getElementById("IssueDesc").value;
    if (!issueDesc) {
        showError("issueDescError", "Issue description is required.");
        valid = false;
    } else {
        showSuccess("issueDescError", "Issue description entered.");
    }

    return valid;
}

// Function to validate and submit the form
function submitForm(event) {
    // This will stop default form from submission
    event.preventDefault();

    // Not valid, return
    if (!validateForm()) {
        return;
    }

    // Collect form data, use trim in case there is spacing
    let formData = {
        fname: document.getElementById("FName").value.trim(),
        lname: document.getElementById("LName").value.trim(),
        customer_id: document.getElementById("Id").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        order_num: document.getElementById("order").value.trim(),
        issue_type: document.getElementById("issueType").value,
        issue_desc: document.getElementById("IssueDesc").value.trim(),
    };

    // Using fetch and catch to send the data
    fetch("/submitHelpRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    // This will convert the response to JSON format, opt for this instead of res.render in POST handler
    .then(response => response.json())
    .then(data => {
        // Ensure that the data submission is good, redirect to helprequests to show submitted info
        if (data.success) {
            alert(data.message);
            // Reset the form and the input fields
            resetForm();
            event.target.reset();
            // Redirect to the help requests page after success
            window.location.href = "/helprequests";
        } else {
            throw new Error(data.message); // Display the error message
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
    });
}


// Reset form and error messages and error color using forEach
function resetForm() {
    document.querySelectorAll('.text-danger, .text-success').forEach(function (element) {
        element.style.display = 'none';
        element.classList.remove("text-danger", "text-success");
        element.innerHTML = '';
    });
}

// Real-time formating phone number as user types function
function formatPhoneNumber(input) {
    // Remove all non-numeric characters first
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 6) {
        input.value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
    } else {
        input.value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
    }
}

// Real-time formating order number as user types function
function formatOrderNumber(input) {
    // Remove all non-numeric characters first
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 6) {
        input.value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
    } else if (value.length <= 9) {
        input.value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1-$2-$3');
    } else {
        input.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,5})/, '$1-$2-$3-$4');
    }
}

// Validate Sign In Form
function validateSignInForm() {
    let email = document.getElementById('signInEmail').value;
    let password = document.getElementById('signInPassword').value;
    let valid = true;
    // Reset errors
    resetErrors();

    if (!email || !validateEmail(email)) {
        document.getElementById('signInEmailError').innerText = 'Please enter a valid email address.';
        document.getElementById('signInEmailError').style.display = 'block';
        valid = false;
    }
    if (!password) {
        document.getElementById('signInPasswordError').innerText = 'Password is required.';
        document.getElementById('signInPasswordError').style.display = 'block';
        valid = false;
    }
    return valid;
}

// Validate Create Account Form
function validateCreateAccountForm() {
    let email = document.getElementById('createEmail').value;
    let password = document.getElementById('createPassword').value;
    let valid = true;
    // Reset errors
    resetErrors();

    if (!email || !validateEmail(email)) {
        document.getElementById('createEmailError').innerText = 'Please enter a valid email address.';
        document.getElementById('createEmailError').style.display = 'block';
        valid = false;
    }
    if (!password) {
        document.getElementById('createPasswordError').innerText = 'Password is required.';
        document.getElementById('createPasswordError').style.display = 'block';
        valid = false;
    }
    return valid;
}

// Helper Function to Validate Email (used in Sign In, Create Account, and Contact Us forms)
function validateEmail(email) {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// Array to hold products added to cart
let cart = [];
// Function to render the cart (offcanvas)
function renderCart() {
    let cartItemsList = document.getElementById('cartItemsList');
    let totalPriceElement = document.getElementById('totalPrice');
    let totalSection = document.getElementById('totalSection');
    let checkoutSection = document.getElementById('checkoutSection');
    let emptyCartMessage = document.getElementById('emptyCartMessage');

    // Clear the cart list
    cartItemsList.innerHTML = '';

    // Set the total price and cart item count to 0
    let total = 0;
    let cartItemCount = 0;

    // Loop through the products and add them to the cart list
    cart.forEach(product => {
        let listItem = document.createElement('li');
        listItem.classList.add('d-flex', 'justify-content-between', 'mb-3');

        listItem.innerHTML = `
            <div class="d-flex">
                <img src="${product.img}" class="img-fluid" style="max-width: 50px;" alt="${product.name}">
                <div class="ms-3">
                    <h6>${product.name}</h6>
                    <p class="mb-1">Price: $${product.price.toFixed(2)}</p>
                    <small>Qty: ${product.quantity}</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <span class="text-muted">$${(product.price * product.quantity).toFixed(2)}</span>
            </div>
        `;
        cartItemsList.appendChild(listItem);
        total += product.price * product.quantity;
        cartItemCount++;
    });

    // Show the empty cart message if the cart is empty
    if (cartItemCount === 0) {
        emptyCartMessage.classList.remove('d-none');
        totalSection.classList.add('d-none');
        checkoutSection.classList.add('d-none');
    } else {
        emptyCartMessage.classList.add('d-none');
        totalSection.classList.remove('d-none');
        checkoutSection.classList.remove('d-none');
    }

    // Update total price
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Function to fetch product data from the server
async function loadProducts(containerId) {
    try {
        // Path to the JSON file
        const response = await fetch('/server/products.json');
        const products = await response.json();

        // Select the productCards id and render it there
        const productCards = document.getElementById(containerId);
        renderProducts(products, productCards);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Function to render the products dynamically
function renderProducts(products, container) {
    // Clear previous existing products
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-6', 'mb-4');

        productCard.innerHTML = `
            <div class="card h-100">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Price: $${product.price.toFixed(2)}</p>
                    <div>
                        <button class="btn btn-link p-0 text-primary" data-bs-toggle="collapse" data-bs-target="#description${product.id}" aria-expanded="false">
                            View More
                        </button>
                        <div class="collapse" id="description${product.id}">
                            <p class="mt-2">${product.description}</p>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <button class="btn btn-primary w-100 mt-3" onclick="addToCart('${product.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(productCard);
    });
}

// Call loadProducts when only the index page OR the default page "http://localhost:3000/" loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        loadProducts('productCards');
    }
});

// Update addToCart function to work with product data
function addToCart(productId) {
    // Fetch product information dynamically by its ID
    fetch('/server/products.json')
        .then(response => response.json())
        .then(products => {
            // Find the product based on the ID
            const product = products.find(p => p.id === productId);
            if (!product) {
                console.error('Product not found!');
                return;
            }

            // Check if the product is already in the cart
            let existingProductIndex = cart.findIndex(item => item.id === productId);
    
            if (existingProductIndex !== -1) {
                // If the product is already in the cart, increase the quantity
                cart[existingProductIndex].quantity += 1;
            } else {
                // If the product is not in the cart, add it
                const newProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    img: product.img,
                    quantity: 1
                };
                cart.push(newProduct);
            }

            // Save the cart to localStorage
            saveCartToLocalStorage();
            // Update the cart display
            renderCart();

            // Open the cart offcanvas
            let cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
            cartOffcanvas.show();
        })
        .catch(error => console.error('Error fetching product:', error));
}

//----------------------------------------------------------------------------------
// This is done after I learnt about JSON and Local Storage

// Function to save the items in cart to the browser's localStorage (get addToCart function to call this function)
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

// Function to render the checkout page
function renderCheckoutPage() {
    let checkoutItems = document.getElementById('checkoutItems');
    // let cart store the items in the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart'));
    let total = 0;

    // Clear the all product items if exist
    checkoutItems.innerHTML = '';

    // Check if cart is empty in checkout page
    if (cart.length === 0) {
        checkoutItems.innerHTML = `<p class="text-center text-muted">Your cart is empty</p>`;
        return;
    }

    // Loop through the items in the cart and add them to the checkout page
    cart.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'col-12 mb-3 d-flex justify-content-between align-items-center';

        productElement.innerHTML = `
            <div class="d-flex">
                <img src="${product.img}" class="img-fluid" style="max-width: 50px;" alt="${product.name}">
                <div class="ms-3">
                    <h6>${product.name}</h6>
                    <p class="mb-1">Price: $${product.price.toFixed(2)}</p>
                    <small>Qty: ${product.quantity}</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <span class="text-muted">$${(product.price * product.quantity).toFixed(2)}</span>
            </div>
        `;

        checkoutItems.appendChild(productElement);
        total += product.price * product.quantity;
    });

    // Add the total price row
    const totalRow = document.createElement('div');
    totalRow.className = 'col-12 mb-3 d-flex justify-content-between align-items-center';
    totalRow.innerHTML = `
        <div class="w-75"><strong>Total</strong></div>
        <div>
            <h5>$${total.toFixed(2)}</h5>
        </div>
    `;
    checkoutItems.appendChild(totalRow);
}

// Function to process the order using form validation (similar to Help Form)
function processOrder() {
    let valid = true;

    // Clear all previous error messages
    document.querySelectorAll('.text-danger').forEach(function (element) {
        hideError(element.id);
    });

    // Validate First Name & Last Name
    let firstName = document.getElementById("FName").value.trim();
    let lastName = document.getElementById("LName").value.trim();
    if (!firstName && !lastName) {
        showError("nameError", "First name and last name are required.");
        valid = false;
    } else {
        if (!firstName) {
            showError("nameError", "First name is required.");
            valid = false;
        } else if (!lastName) {
            showError("nameError", "Last name is required.");
            valid = false;
        } else {
            showSuccess("nameError", "Valid name entered.");
        }
    }

    // Validate Email
    let email = document.getElementById("email").value.trim();
    if (!email || !validateEmail(email)) {
        showError("emailError", "Please enter a valid email address.");
        valid = false;
    } else {
        showSuccess("emailError", "Valid email address.");
    }

    // Validate Address (there aren't really a universal format for addresses)
    let address = document.getElementById("address").value.trim();
    if (!address) {
        showError("addressError", "Address is required.");
        valid = false;
    } else {
        showSuccess("addressError", "Valid address entered.");
    }

    // Final Validation Check, maybe add an INSERT to myDB???
    if (valid) {
        alert("Order processed successfully!");
        // Clear the cart
        localStorage.removeItem("cart");
        // Redirect to homepage or confirmation page
        window.location.href = "index.html";
    }

    return valid; // Return validation status
}

// Function to call renderCheckoutPage when the checkout page is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('checkout.html')) {
        renderCheckoutPage();
    }
});