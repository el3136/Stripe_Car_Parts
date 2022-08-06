import React, { useState } from 'react';

export default function Basket(props) {
  const { cartItems, onAdd, onRemove } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = itemsPrice > 2000 ? 0 : 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    if (!loading) {
      setLoading(true);
      let cart = { items: [
        { id: 1, quantity: 1},
        { id: 2, quantity: 1},
        { id: 3, quantity: 1},
      ] };
      // for (let i = 1; i <= 3; i++) {
      //   const exist = cartItems.find((x) => x.id === i);
      //   if (exist) {
      //     const it = { id: i, quantity: exist.quantity };
      //     cart.items.push(it);
      //   } else {
      //     const it = { id: i, quantity: 0 };
      //     cart.items.push(it);
      //   }
      // }
      const exist1 = cartItems.find((x) => x.id === 1);
      const exist2 = cartItems.find((x) => x.id === 2);
      const exist3 = cartItems.find((x) => x.id === 3);
      cart.items.push(exist1)
      console.log(cart);

      fetch(`${process.env.REACT_APP_SERVER_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            { id: 1, quantity: 1},
            { id: 2, quantity: 1},
            { id: 3, quantity: 1},
          ],
        }),
        // body: JSON.stringify({...cart}),
        // body: JSON.stringify({
        //   items: [...cartItems],
        // }),
      }).then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
      }).then(({ url }) => {
        window.location = url
      }).catch(e => {
        console.error(e.error)
      })
      setLoading(false);
    }
  }
  
  return (
    <aside className="block col-1">
      <h2>Cart Items</h2>
      <div>
        {cartItems.length === 0 && <div>Cart is empty</div>}
        {cartItems.map((item) => (
          <div key={item.id} className="row">
            <div className="col-2">{item.name}</div>
            <div className="col-2">
              <button onClick={() => onRemove(item)} className="remove">
                -
              </button>{' '}
              <button onClick={() => onAdd(item)} className="add">
                +
              </button>
            </div>

            <div className="col-2 text-right">
              {item.quantity} x ${item.price.toFixed(2)}
            </div>
          </div>
        ))}

        {cartItems.length !== 0 && (
          <>
            <hr></hr>
            <div className="row">
              <div className="col-2">Items Price</div>
              <div className="col-1 text-right">${itemsPrice.toFixed(2)}</div>
            </div>
            <div className="row">
              <div className="col-2">Tax Price</div>
              <div className="col-1 text-right">${taxPrice.toFixed(2)}</div>
            </div>
            <div className="row">
              <div className="col-2">Shipping Price</div>
              <div className="col-1 text-right">
                ${shippingPrice.toFixed(2)}
              </div>
            </div>

            <div className="row">
              <div className="col-2">
                <strong>Total Price</strong>
              </div>
              <div className="col-1 text-right">
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
            </div>
            <hr />
            <div className="row">
              <button onClick={checkout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}