import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartList from './components/CartList';
import { useEffect, useState } from 'react';

function App() {

  const [product, setProduct] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductList = async () => {
      const response = await fetch('http://localhost:5000/list')
      const data = await response.json();
      setLoading(false);
      setProduct(data);
    }
    fetchProductList();
  }, []);

  if (loading) {
    return <p>Loading....</p>
  }

  //
  const addToCart = async (data) => {
    const isPresent = cart.find((cartItem) => cartItem.name === data.name);
    console.log(`Data: ${JSON.stringify(data)}`)
    //
    let response = await fetch('http://localhost:5000/addToCart', {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 200) {
      setLoading(false);
      //
      if (isPresent) {
        const resCart = cart.map((cartItem) => {
          if (cartItem.name === data.name) cartItem.quantity++;
          return cartItem;
        })
        setCart(resCart);
      }
      else {
        console.log('');
        setCart([...cart, { ...data, quantity: 1 }])
      }
    }
  }

  const removeFromCart = async (data) => {
    const isPresent = cart.find((cartItem) => cartItem.name === data.name);
    console.log(`Data: ${JSON.stringify(data)}`)

    //
    let response = await fetch('http://localhost:5000/removeFromCart', {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 200) {
      setLoading(false);
      //
      if (isPresent) {
        const resCart = cart.map((cartItem) => {
          if (cartItem.name === data.name) cartItem.quantity--;
          return cartItem;
        })
        setCart(resCart.filter((cartItem) => cartItem.quantity !== 0))
      }
      else {
        alert(`Can't remove the product - ${data.name} as it's not present in cart`)
      }
    }
  }

  const handleShow = (value) => {
    setShowCart(value)
  }

  const totalItems = () => {
    let sum = 0;
    cart.forEach((cartItem) => sum += cartItem.quantity)
    return sum;
  }
  return (
    <div className='body'>
      <Header count={totalItems()}
        handleShow={handleShow} ></Header>

      {
        showCart ?
          <CartList cart={cart} setCart={setCart} addToCart={addToCart} removeFromCart={removeFromCart} ></CartList> :
          <ProductList product={product} addToCart={addToCart} removeFromCart={removeFromCart} ></ProductList>
      }


    </div>
  );
}

export default App;