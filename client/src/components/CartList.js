import '../App.css';

//Simple structure of the function to List the Cart items
function CartList({ cart, setCart, addToCart, removeFromCart }) {

    async function checkoutOrder() {
        let response = await fetch('http://localhost:5000/checkoutOrder', {
            body: JSON.stringify(cart),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const { finalAmount, discount } = await response.json();
        if (finalAmount !== 0) {
            alert(`Your Order is placed with the Final Amount: ${finalAmount} after applying the discount ${discount}`)
        }
        else {
            alert(`Your Order now is with the Final Amount ${finalAmount} !!`);
        }
        setCart([])
    }

    return (
        <div>
            {
                cart?.map((cartItem) => {
                    return (
                        <div key={Math.random()} style={{ padding: "30px", fontFamily: "Spectra" }}>
                            <img src={cartItem.url} width="5%" height="5%" alt={cartItem.name} />
                            <span> {cartItem.name} </span>
                            <button
                                onClick={() => removeFromCart(cartItem)}
                            >-</button>
                            <span> {cartItem.quantity} </span>
                            <button
                                onClick={() => addToCart(cartItem)}
                            >+</button>
                            <span> Rs. {cartItem.price * cartItem.quantity} </span>
                        </div>
                    )
                })
            }
            <p style={{ paddingLeft: "30px", fontSize: "20px", fontFamily: "Spectra", fontWeight: "bold" }}>Total: <span></span>
                {
                    cart.map(item => item.price * item.quantity).reduce((total, value) => total + value, 0)
                }
            </p>
            <button style={{ fontSize: "20px", fontFamily: "Spectra", fontWeight: "bold" }} onClick={() => checkoutOrder()} id='checkoutDetails'>Checkout</button>
        </div >
    )
}

export default CartList;