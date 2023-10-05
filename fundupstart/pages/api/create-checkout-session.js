require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const stripe = require("stripe")(
  "sk_test_51Nk7IzSEBFON0EJBR49AsAhYc5E9LEGJOwpwDgno7co8msn4NiODrrHQEthWPQfqi07nwBDTE5D30hDq68zluzrJ0046eRH5rQ"
);
//new Stripe(process.env.STRIPE_PRIVATE_KEY);
//
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
]);

export default async (req, res) => {
  try {
    console.log("Inside api");
    console.log(req.body);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/success`,
      cancel_url: `${process.env.SERVER_URL}/cancel`,
    });
    res.json({ url: session.url, id: session.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// app.listen(3000);