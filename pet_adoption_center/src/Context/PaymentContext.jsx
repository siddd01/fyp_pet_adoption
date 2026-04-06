import axios from 'axios';
import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const initiateKhaltiPayment = async (amount, orderId) => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/payment/initiate', {
                amount,
                purchase_order_id: orderId,
                purchase_order_name: "Adoption Center Transaction"
            });

            if (data.payment_url) {
                // Save order info to local storage if needed before redirect
                localStorage.setItem('pending_order_id', orderId);
                window.location.href = data.payment_url;
            }
        } catch (error) {
            console.error("Payment Error:", error);
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaymentContext.Provider value={{ initiateKhaltiPayment, loading, paymentStatus }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);