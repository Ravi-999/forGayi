const express = require('express');
const router = express.Router();

const products = require('./productList');
const cartData = require('./cartData');

const nthOrder = 1;

//List call for the products
router.get('/list', (req, res) => {
  res.status(200).json(products);
});

router.get('/listDiscountDetails', (req, res) => {
  res.status(200).json({
    discountCodes: cartData.discountCodes,
    discountAmount: cartData.discount
  });
})

//Router to add to Cart
router.post('/addToCart', (req, res) => {
  const item = req.body;
  const isPresent = cartData?.productList.find((cartItem) => cartItem.id === item.id);

  if (isPresent) {
    cartData?.productList.forEach((cartItem, index) => {
      if (cartItem.id === item.id) {
        cartItem.quantity++;
      }
    })
  }
  else {
    item.quantity = 1;
    cartData?.productList.push(item);
  }
  cartData.totalNoOfItems = cartData.totalNoOfItems + 1;
  cartData.totalAmount = cartData.totalAmount + item.price;
  res.status(200).json({ message: 'Item added to cart successfully - ', item, status: 200 });
});

//Router to remove items from Cart
router.post('/removeFromCart', (req, res) => {
  const item = req.body;
  const isPresent = cartData?.productList.find((cartItem) => cartItem.id === item.id);

  if (isPresent) {
    cartData?.productList.forEach((cartItem, index) => {
      if (cartItem.id === item.id) {
        cartItem.quantity--;
      }
    })
  }
  else {
    console.log(`Not present to remove`)
  }
  cartData.totalNoOfItems = cartData.totalNoOfItems - 1;
  cartData.totalAmount = cartData.totalAmount - item.price;
  res.status(200).json({ message: 'Item removed from cart successfully - ', item, status: 200 });
});

//Router to checkout to orders on cart
router.post('/checkoutOrder', (req, res) => {
  console.log(`req.body: ${JSON.stringify(req.body)}, ${JSON.stringify(cartData)}`)
  const eligibleForDiscount = cartData?.productList.length % nthOrder === 0;

  // Apply discount if eligible
  const discount = eligibleForDiscount ? 0.1 * cartData?.totalAmount : 0;
  const finalAmount = cartData?.totalAmount - discount;
  const discountCode = eligibleForDiscount ? generateDiscountCode() : null;
  cartData.discount.push(discount);
  cartData.discountCodes.push(discountCode);

  // Clear the cart after checkout
  cartData.productList = [];
  cartData.totalAmount = 0;

  res.json({
    message: 'Order processed successfully',
    totalAmount: cartData?.totalAmount,
    discount,
    finalAmount,
    discountCode
  });
})

//Router to generate the Discount code if the order is applicable for it
router.post('/generateDiscountCode', (req, res) => {
  const eligibleForDiscount = cartData?.productList.length % nthOrder === 0;
  if (eligibleForDiscount) {
    const discountCode = generateDiscountCode();
    cartData?.discountCodes.push(discountCode);
    res.json({ message: 'Discount code generated successfully', discountCode });
  } else {
    res.status(400).json({ error: 'Discount code not generated. Condition not satisfied.' });
  }
})

// Helper function to generate a random discount code
function generateDiscountCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = () => router;