import { createContext, useContext, useState } from 'react';
import api from '../api/axios.js';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

const initiateKhaltiPayment = async (totalAmount, cartItems, formData) => {
    setLoading(true);
    try {
        // No need to manually get token here, the interceptor does it!
        const { data } = await api.post('/payment/checkout', {
            totalAmount,
            cartItems,
            shippingInfo: {
                full_name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            }
        });

        if (data.payment_url) {
            window.location.href = data.payment_url;
            return { success: true };
        }
        return { success: false, message: "Unable to start checkout." };
    } catch (error) {
        // If it still says "Invalid Token", the token in localStorage['token'] is expired or wrong
        console.error("Payment Error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || "Checkout failed",
        };
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
