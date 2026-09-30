import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import User from '../models/User.js';

// Checkout Session for Top-up (USD)
export const createCheckoutSession = async (req, res) => {
    try {
        const { tokenAmount, priceInUSD } = req.body; 

        if (!req.user || !req.user._id) 
            return res.status(401).json({ error: "Not authorized, user missing" });
        
        if (!priceInUSD || typeof priceInUSD !== 'number') 
            return res.status(400).json({ error: "Invalid or missing priceInUSD parameter" });

        const userId = req.user._id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${tokenAmount} AI Tokens`,
                            description: `Top up your account with ${tokenAmount} tokens.`,
                        },
                        unit_amount: priceInUSD,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/dashboard?payment_success=true&tokens=${tokenAmount}`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment_success=false`,
            metadata: {
                userId: userId.toString(),
                tokens: tokenAmount.toString(),
            },
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Stripe Session Error Details:", error.message);
        res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
};

// Stripe Webhook to fulfill the order safely
export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.metadata.userId;
        const tokensToAdd = parseInt(session.metadata.tokens, 10);

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $inc: { tokens: tokensToAdd } },
                { new: true }
            );

            if (!updatedUser) {
                console.error(`User not found for ID: ${userId}`);
                return res.status(404).json({ error: "User not found" });
            }

            console.log(`Successfully added ${tokensToAdd} tokens to user ${userId}`);
        } catch (dbError) {
            console.error("Database update error via webhook:", dbError);
            return res.status(500).json({ error: "Database error updating tokens" });
        }
    }

    res.status(200).json({ received: true });
};

// TO UPDATE THE USER'S TOKEN BALANCE
export const claimTokens = async (req, res) => {
    try {
        const { tokens } = req.body;
        const userId = req.user._id;

        if (!tokens || isNaN(tokens)) {
            return res.status(400).json({ error: "Invalid token amount" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { tokens: parseInt(tokens, 10) } },
            { new: true }
        );

        res.status(200).json({ message: "Tokens added successfully", tokens: updatedUser.tokens });
    } catch (error) {
        res.status(500).json({ error: "Server error claiming tokens" });
    }
};