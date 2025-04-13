import dotenv from "dotenv";
import Stripe from "stripe";

//for some reason the stripe key showed as undefined, so i had to get the config again
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    if (!amount || !currency) {
      return res
        .status(400)
        .json({ error: "Amount and currency are required" });
    }

    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
