import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './components/Checkout';
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Error404 from "./components/Error404";
import itemList from "./itemList";

import Header from './components/Header';
import Main from './components/Main';
import Basket from './components/Basket';

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

// const storeItems = new Map([
//   [1, { priceInCents: 15000, name: "Tire" }],
//   [2, { priceInCents: 3000, name: "Steering Wheel"}]
// ])

function App() {
  const { products } = itemList;
  const [cartItems, setCartItems] = useState([]);
  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  
      

  return (
    <div className="App">
      <Header countCartItems={cartItems.length} />
      <div className="row">
        <Main products={products} onAdd={onAdd} />
        <Basket
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
      {message && <Message message={message} />}
    </div>
  );
}

export default App;
