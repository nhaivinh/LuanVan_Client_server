require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: item.name_product,
            },
            unit_amount: item.unit_price_product,
          },
          quantity: item.quantity_product_cart,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/checkout?status=success`,
      cancel_url: `${process.env.CLIENT_URL}/order`,
    })  
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(4000)
