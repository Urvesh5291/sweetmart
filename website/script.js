let cart = JSON.parse(localStorage.getItem('sweetmart_cart')) || [];

function addToCart(itemName, itemPrice, itemWeight) {
    alert("Button click thayu: " + itemName); // Test karva mate alert
    
    cart.push({
        name: itemName,
        price: Number(itemPrice),
        weight: itemWeight,
        quantity: 1
    });

    localStorage.setItem('sweetmart_cart', JSON.stringify(cart));
    alert("Cart ma add thai gayu! Total items: " + cart.length);
}
