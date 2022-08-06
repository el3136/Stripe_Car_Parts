require("dotenv").config()  // load all environment variables

const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
// app.use(express.static('public'))
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`
  })
)

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const storeItems = new Map([
  [1, { priceInCents: 30000, name: "Car Tire" }],
  [2, { priceInCents: 3000, name: "Steering Wheel" }],
  [3, { priceInCents: 15000, name: "Side Mirror" }]
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.priceInCents
          },
          quantity: item.quantity
        }
      }),
      success_url: `${process.env.CLIENT_URL}?success=true`,
      cancel_url: `${process.env.CLIENT_URL}?cancel=true`
    })
    res.json({ url: session.url })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(5000, () => { console.log("Server started on port 5000") })