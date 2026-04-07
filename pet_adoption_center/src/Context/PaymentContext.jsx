import axios from 'axios';
import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const initiateKhaltiPayment = async (totalAmount, cartItems, formData) => {
        setLoading(true);
        try {
            // Get token from localStorage (assuming that's where you store it)
            const token = localStorage.getItem('token'); 
            if (!token) {
            alert("Please log in to continue");
            return;
        }

            // Inside initiateKhaltiPayment in PaymentContext.jsx
const { data } = await axios.post('/api/payment/checkout', {
    totalAmount: totalAmount,
    cartItems: cartItems,
    shippingInfo: {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
    }
}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

            if (data.payment_url) {
                window.location.href = data.payment_url;
            }
        } catch (error) {
            console.error("Payment Error:", error.response?.data || error.message);
            alert("Checkout failed: " + (error.response?.data?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaymentContext.Provider value={{ initiateKhaltiPayment, loading }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);