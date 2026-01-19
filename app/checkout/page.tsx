
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Shield, 
  Truck,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { apiService } from '../../services/apiService';
import { Product } from '../../types';
import { MOCK_USER } from '../../constants';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'payment' | 'review'>('details');
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: session?.user?.name?.split(' ')[0] || 'Alex',
    lastName: session?.user?.name?.split(' ')[1] || 'Johnson',
    email: session?.user?.email || MOCK_USER.email,
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/28',
    cvv: '123',
    cardName: session?.user?.name || 'Alex Johnson'
  });

  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'overnight'>('standard');

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 20 },
    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 35 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 65 }
  ];

  useEffect(() => {
    const id = searchParams.get('productId');
    const q = parseInt(searchParams.get('qty') || '1');
    console.log('Checkout page loaded with params:', { id, q });
    console.log('Full search params:', searchParams.toString());
    if (id) {
      fetchProduct(id, q);
    } else {
      console.error('No product ID found in URL params');
      toast.error('No product specified');
      router.push('/items');
    }
  }, [searchParams]);

  const fetchProduct = async (id: string, q: number) => {
    setInitialLoading(true);
    try {
      console.log('Fetching product with ID:', id);
      // Try API service first
      const data = await apiService.getProduct(id);
      console.log('Product fetched from API:', data);
      setProduct(data);
      setQty(q);
    } catch (error) {
      console.error('Error fetching product from API:', error);
      // Fallback to localStorage
      const p = dbService.getProductById(id);
      console.log('Product from localStorage:', p);
      if (p) { 
        setProduct(p); 
        setQty(q); 
      } else {
        console.error('Product not found in localStorage either');
        toast.error('Product not found');
        router.push('/items');
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryOption)!;
  const subtotal = product ? parseFloat(product.price.toString()) * qty : 0;
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + selectedDelivery.price + tax;

  const handlePay = async () => {
    setLoading(true);
    
    // Get consistent user ID
    const userId = session?.user?.email || MOCK_USER.email;
    
    try {
      if (product) {
        const orderData = {
          userId: userId,
          items: [{ productId: product.id, quantity: qty, price: parseFloat(product.price.toString()), name: product.name }],
          total: parseFloat(total.toFixed(2)),
          status: 'pending' as const
        };

        await apiService.createOrder(orderData);
        setDone(true);
        toast.success('Order placed successfully! 🎉');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || !product) return (
    <div className="min-h-screen flex items-center justify-center dark:text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Loading product details...</p>
      </div>
    </div>
  );

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white mb-4">Order Confirmed!</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-2">Order #ORD-{Date.now()}</p>
          <p className="text-zinc-500 mb-8">Thank you for your purchase. We'll start processing your order immediately.</p>
          
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold dark:text-white mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                Order confirmation email sent to {shippingInfo.email}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-zinc-300 rounded-full mr-3"></div>
                Processing and quality check (1-2 hours)
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-zinc-300 rounded-full mr-3"></div>
                Packaging and shipping ({selectedDelivery.time})
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
            >
              View Order Status
            </button>
            <Link 
              href="/items"
              className="px-8 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href={`/items/${product.id}`} className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Product
      </Link>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[
          { id: 'details', name: 'Shipping Details', icon: <Truck size={20} /> },
          { id: 'payment', name: 'Payment Info', icon: <CreditCard size={20} /> },
          { id: 'review', name: 'Review Order', icon: <CheckCircle size={20} /> }
        ].map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
              step === s.id ? 'border-primary-600 bg-primary-600 text-white' : 
              ['details', 'payment', 'review'].indexOf(step) > i ? 'border-emerald-500 bg-emerald-500 text-white' :
              'border-zinc-300 dark:border-zinc-700 text-zinc-400'
            }`}>
              {s.icon}
            </div>
            <div className="ml-3 mr-8">
              <div className={`text-sm font-medium ${step === s.id ? 'text-primary-600' : 'text-zinc-500'}`}>
                {s.name}
              </div>
            </div>
            {i < 2 && <div className={`w-16 h-0.5 ${['details', 'payment', 'review'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 'details' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center">
                <Truck className="mr-3 text-primary-600" /> Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Address</label>
                  <input 
                    type="text" 
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">City</label>
                    <input 
                      type="text" 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">State</label>
                    <input 
                      type="text" 
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">ZIP Code</label>
                    <input 
                      type="text" 
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mb-8">
                <h3 className="text-lg font-bold dark:text-white mb-4">Delivery Options</h3>
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <label key={option.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      deliveryOption === option.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <input 
                        type="radio" 
                        name="delivery" 
                        value={option.id}
                        checked={deliveryOption === option.id}
                        onChange={(e) => setDeliveryOption(e.target.value as any)}
                        className="sr-only" 
                      />
                      <div className="flex-1">
                        <div className="font-bold dark:text-white">{option.name}</div>
                        <div className="text-sm text-zinc-500">{option.time}</div>
                      </div>
                      <div className="font-bold dark:text-white">${option.price}</div>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep('payment')}
                className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center group"
              >
                Continue to Payment <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center">
                <CreditCard className="mr-3 text-primary-600" /> Payment Information
              </h2>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 mb-8 flex items-center">
                <Shield className="text-emerald-500 mr-3" size={24} />
                <div>
                  <div className="font-bold text-sm dark:text-white">Secure Payment</div>
                  <div className="text-xs text-zinc-500">Your payment information is encrypted and secure</div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Card Number</label>
                  <input 
                    type="text" 
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Expiry Date</label>
                    <input 
                      type="text" 
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">CVV</label>
                    <input 
                      type="text" 
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Cardholder Name</label>
                  <input 
                    type="text" 
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" 
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('details')}
                  className="flex-1 py-4 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep('review')}
                  className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center group"
                >
                  Review Order <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center">
                <CheckCircle className="mr-3 text-primary-600" /> Review Your Order
              </h2>

              {/* Shipping Info Review */}
              <div className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                <h3 className="font-bold dark:text-white mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} /> Shipping Address
                </h3>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <div>{shippingInfo.firstName} {shippingInfo.lastName}</div>
                  <div>{shippingInfo.address}</div>
                  <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
                  <div>{shippingInfo.country}</div>
                </div>
              </div>

              {/* Payment Info Review */}
              <div className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                <h3 className="font-bold dark:text-white mb-4 flex items-center">
                  <CreditCard className="mr-2" size={20} /> Payment Method
                </h3>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <div>•••• •••• •••• {paymentInfo.cardNumber.slice(-4)}</div>
                  <div>{paymentInfo.cardName}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('payment')}
                  className="flex-1 py-4 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handlePay}
                  disabled={loading}
                  className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center group disabled:opacity-75"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>Complete Purchase <Lock className="ml-2" size={18} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-8">
            <h3 className="text-xl font-bold dark:text-white mb-6">Order Summary</h3>
            
            <div className="flex items-center mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover mr-4" />
              <div className="flex-1">
                <h4 className="font-bold dark:text-white text-sm line-clamp-2">{product.name}</h4>
                <p className="text-zinc-500 text-sm">Qty: {qty}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                <span className="dark:text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Shipping ({selectedDelivery.name})</span>
                <span className="dark:text-white">${selectedDelivery.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Tax</span>
                <span className="dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span className="dark:text-white">Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 space-y-2">
              <div className="flex items-center">
                <Shield size={14} className="mr-2 text-emerald-500" />
                Secure 256-bit SSL encryption
              </div>
              <div className="flex items-center">
                <Truck size={14} className="mr-2 text-blue-500" />
                Free returns within 14 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}