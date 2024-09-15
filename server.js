const express = require('express');
const stripe = require('stripe')('your-secret-key'); // Replace with your Stripe secret key
const app = express();

app.use(express.json());

app.post('/payment', async (req, res) => {
    const { token, amount } = req.body;
    try {
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: token,
            description: 'Booking Payment'
        });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
