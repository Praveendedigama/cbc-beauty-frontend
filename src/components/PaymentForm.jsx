import React, { useState } from 'react';
import { XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const PaymentForm = ({ onSuccess, onCancel, amount }) => {
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
        }

        // Format expiry date
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
        }

        // Format CVV
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setCardData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!cardData.cardNumber.replace(/\s/g, '')) {
            newErrors.cardNumber = 'Card number is required';
        } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }

        if (!cardData.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
            newErrors.expiryDate = 'Invalid expiry date format';
        }

        if (!cardData.cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (cardData.cvv.length < 3) {
            newErrors.cvv = 'CVV must be at least 3 digits';
        }

        if (!cardData.cardholderName.trim()) {
            newErrors.cardholderName = 'Cardholder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate payment success
            const paymentData = {
                transactionId: `txn_${Date.now()}`,
                cardLast4: cardData.cardNumber.slice(-4),
                amount: amount
            };

            onSuccess(paymentData);
        } catch (error) {
            console.error('Payment failed:', error);
            setErrors({ general: 'Payment failed. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                        </label>
                        <input
                            type="text"
                            name="cardholderName"
                            value={cardData.cardholderName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter cardholder name"
                        />
                        {errors.cardholderName && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardData.cardNumber}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date *
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={cardData.expiryDate}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="MM/YY"
                            />
                            {errors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV *
                            </label>
                            <input
                                type="text"
                                name="cvv"
                                value={cardData.cvv}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="123"
                            />
                            {errors.cvv && (
                                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Amount</span>
                            <span className="text-lg font-semibold text-gray-900">Rs.{amount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCardIcon className="h-4 w-4 mr-2" />
                                    Complete Payment
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Test Card Info */}
                <div className="px-6 pb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Test Card Information</h3>
                        <div className="text-xs text-blue-600 space-y-1">
                            <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
                            <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
                            <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;