import React, { useState } from 'react';

export default function Checkout() {

  const [loading, setLoading] = useState(false);

  const onClickButton = async () => {
    if (!loading) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_SERVER_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            { id: 1, quantity: 1},
            { id: 2, quantity: 2},
          ],
        }),
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
    <div>
      {(!loading) && <button onClick={onClickButton}>Checkout</button>}
    </div>
  )
}
