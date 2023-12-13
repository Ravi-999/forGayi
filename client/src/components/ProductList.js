import '../App.css';

function ProductList({ product, addToCart, removeFromCart }) {
  return (
    <div className='flex'>
      {
        product.map((productItem, productIndex) => {
          return (
            <div style={{ width: '20%', display: "flex" }} key={productItem.id}>
              <div className='product-item'>
                <img src={productItem.url} width="40%" height="40%"/>
                <p>{productItem.name} | {productItem.category} </p>
                <p> {productItem.seller} </p>
                <p> Rs. {productItem.price} /-</p>
                <button
                  onClick={() => addToCart(productItem)}
                >Add To Cart</button>
                <button
                  onClick={() => removeFromCart(productItem)}
                >Remove from Cart</button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ProductList