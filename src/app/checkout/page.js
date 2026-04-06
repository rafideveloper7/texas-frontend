'use client';
// Checkout remains client-rendered because it depends on local cart state and form UX.
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', note: '', orderType: 'delivery', paymentMethod: 'cod'
  });
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const deliveryFee = formData.orderType === 'delivery' ? 150 : 0;
  const subtotal = total || 0;
  const discountAmount = discount;
  const grandTotal = subtotal + deliveryFee - discountAmount;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^03\d{9}$/.test(formData.phone) && formData.phone) newErrors.phone = 'Invalid Pakistani number (03xxxxxxxxx)';
    if (formData.orderType === 'delivery' && !formData.address.trim()) newErrors.address = 'Delivery address required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePromoApply = () => {
    const promos = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'TEXAS50': { discount: 50, type: 'fixed' },
      'GRILL20': { discount: 20, type: 'percentage' },
      'SAVE15': { discount: 15, type: 'percentage' }
    };
    
    if (promos[promoCode.toUpperCase()]) {
      const promo = promos[promoCode.toUpperCase()];
      let discountValue = promo.type === 'percentage' 
        ? (subtotal * promo.discount / 100)
        : promo.discount;
      discountValue = Math.min(discountValue, subtotal);
      setDiscount(discountValue);
      setAppliedPromo(promoCode.toUpperCase());
      setPromoCode('');
    } else {
      setDiscount(0);
      setAppliedPromo(null);
      alert('Invalid promo code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return;
    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Save to Database via API
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.orderType === 'delivery' ? formData.address : 'Takeaway'
        },
        items: cart.map(item => ({
          menuItem: item.id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          totalPrice: item.price * item.qty,
          customizations: {
            size: item.size || 'regular',
            spiceLevel: item.spice || 'medium'
          }
        })),
        totalAmount: grandTotal,
        paymentStatus: 'pending',
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        notes: formData.note
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order in database');
      }

      // 2. Prepare WhatsApp message
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';
      let message = `🍖 *TEXAS GRILL - NEW ORDER* 🍖%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `🆔 *Order ID:* ${result.data?._id || 'Pending'}%0A`;
      message += `📋 *Order Type:* ${formData.orderType.toUpperCase()}%0A`;
      message += `💳 *Payment:* ${formData.paymentMethod.toUpperCase()}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `👤 *Customer:* ${formData.name}%0A`;
      message += `📱 *Phone:* ${formData.phone}%0A`;
      if (formData.orderType === 'delivery') message += `📍 *Address:* ${formData.address}%0A`;
      if (formData.note) message += `📝 *Note:* ${formData.note}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `🍽️ *ORDER ITEMS:*%0A`;
      
      cart.forEach((item, idx) => {
        message += `${idx + 1}. ${item.qty}x ${item.name} (${item.size || 'Reg'}) - Rs. ${item.price * item.qty}%0A`;
      });
      
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `💰 *Subtotal:* Rs. ${subtotal}%0A`;
      if (discountAmount > 0) message += `🎁 *Discount:* -Rs. ${discountAmount}%0A`;
      if (deliveryFee > 0) message += `🚚 *Delivery:* Rs. ${deliveryFee}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `💎 *GRAND TOTAL:* Rs. ${grandTotal}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `⏰ *Order Time:* ${new Date().toLocaleString()}%0A`;
      message += `👨‍🍳 *Preparing in:* 30-45 mins%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `🔗 _Order via Texas Grill App_`;

      // 3. Open WhatsApp and Show Success
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push('/');
      }, 4000);
    } catch (error) {
      console.error('Order Submission Error:', error);
      alert('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fix for updateQuantity – use the CartProvider's updateQuantity
  const updateItemQuantity = (id, newQty) => {
    updateQuantity(id, newQty);
  };

  if (!isMounted) {
    return null;
  }

  if (!cart || cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[100dvh] bg-gradient-to-b from-[#121212] to-[#0a0a0a] flex flex-col items-center justify-center p-6 text-white text-center font-sans pt-24"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-32 h-32 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-800 rounded-full flex items-center justify-center mb-8"
        >
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </motion.div>
        <h1 className="text-4xl font-black uppercase mb-3">Cart Empty</h1>
        <p className="text-gray-400 mb-8 max-w-xs">Your VIP order queue is empty. Time to fill it with deliciousness!</p>
        <Link href="/products">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[56px] px-8 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white rounded-full font-black uppercase tracking-wider shadow-xl shadow-red-900/40"
          >
            Browse Menu
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0a0a0a] min-h-[100dvh] pt-20 md:pt-28 pb-32 font-sans text-white overflow-x-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-8 md:mb-12 border-b border-gray-800 pb-6"
        >
          <div>
            <span className="text-[#d8a43f] font-black tracking-wider text-xs md:text-sm uppercase block mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d8a43f] rounded-full animate-pulse"></span>
              Secure Checkout
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Complete Order
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span className="w-8 h-8 rounded-full bg-[#cc2b2b]/20 text-[#cc2b2b] flex items-center justify-center font-bold">3</span>
            <span>Steps to feast</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-2/3"
          >
            <form id="checkout-form" onSubmit={handleSubmit} ref={formRef} className="space-y-6 md:space-y-8">
              
              {/* Order Type */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white flex items-center justify-center text-sm shadow-lg">1</span>
                  How to serve?
                </h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {['delivery', 'takeaway'].map((type) => (
                    <label key={type} className={`cursor-pointer min-h-[80px] rounded-xl md:rounded-2xl border-2 flex flex-col justify-center items-center transition-all duration-300 ${
                      formData.orderType === type 
                        ? `bg-gradient-to-br ${type === 'delivery' ? 'from-[#cc2b2b]/20 to-[#cc2b2b]/5 border-[#cc2b2b]' : 'from-[#d8a43f]/20 to-[#d8a43f]/5 border-[#d8a43f]'} shadow-lg scale-105` 
                        : 'bg-black/50 border-gray-800 hover:border-gray-600'
                    }`}>
                      <input type="radio" name="orderType" value={type} className="hidden" checked={formData.orderType === type} onChange={(e) => setFormData({...formData, orderType: e.target.value})} />
                      <svg className={`w-7 h-7 mb-2 ${formData.orderType === type ? (type === 'delivery' ? 'text-[#cc2b2b]' : 'text-[#d8a43f]') : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {type === 'delivery' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        )}
                      </svg>
                      <span className="font-black text-xs md:text-sm uppercase tracking-wider">{type === 'delivery' ? 'Door Delivery' : 'Takeaway'}</span>
                      <span className="text-[10px] text-gray-500 mt-1">{type === 'delivery' ? 'Rs. 150 fee' : 'Free pickup'}</span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Customer Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800 space-y-5"
              >
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white flex items-center justify-center text-sm shadow-lg">2</span>
                  Your Details
                </h2>
                
                <div>
                  <input 
                    required 
                    type="text" 
                    placeholder="Full Name *" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full min-h-[56px] bg-black/50 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-xl px-5 text-white focus:outline-none focus:border-[#cc2b2b] font-medium transition-all duration-300 placeholder-gray-600`}
                  />
                  {errors.name && <p className="error-message text-red-500 text-xs mt-2 ml-2">{errors.name}</p>}
                </div>
                
                <div>
                  <input 
                    required 
                    type="tel" 
                    placeholder="WhatsApp / Phone Number *" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full min-h-[56px] bg-black/50 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-xl px-5 text-white focus:outline-none focus:border-[#cc2b2b] font-medium transition-all duration-300 placeholder-gray-600`}
                  />
                  {errors.phone && <p className="error-message text-red-500 text-xs mt-2 ml-2">{errors.phone}</p>}
                </div>
                
                <AnimatePresence>
                  {formData.orderType === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <textarea 
                        required 
                        rows="3" 
                        placeholder="Delivery Address *" 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className={`w-full bg-black/50 border ${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#cc2b2b] font-medium transition-all duration-300 placeholder-gray-600 resize-none`}
                      />
                      {errors.address && <p className="error-message text-red-500 text-xs mt-2 ml-2">{errors.address}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <textarea 
                    rows="2" 
                    placeholder="Special instructions (spice level, allergies, etc.)" 
                    value={formData.note} 
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full bg-black/50 border border-dashed border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#d8a43f] font-medium transition-all duration-300 placeholder-gray-600 resize-none"
                  />
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800"
              >
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white flex items-center justify-center text-sm shadow-lg">3</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <label className={`cursor-pointer min-h-[72px] rounded-xl border-2 flex justify-between px-5 items-center transition-all duration-300 ${
                    formData.paymentMethod === 'cod' 
                      ? 'bg-gradient-to-r from-[#d8a43f]/20 to-[#d8a43f]/5 border-[#d8a43f] shadow-lg' 
                      : 'bg-black/50 border-gray-800 hover:border-gray-600'
                  }`}>
                    <input type="radio" name="paymentMethod" value="cod" className="hidden" checked={formData.paymentMethod === 'cod'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} />
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#d8a43f]/20 to-[#d8a43f]/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="font-black text-sm uppercase tracking-wider">Cash on Delivery / Pickup</span>
                        <p className="text-[10px] text-gray-500 mt-1">Pay when you receive your order</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-[#d8a43f]' : 'border-gray-700'}`}>
                      {formData.paymentMethod === 'cod' && <div className="w-3 h-3 bg-[#d8a43f] rounded-full"></div>}
                    </div>
                  </label>
                </div>
              </motion.div>

              {/* Desktop Submit */}
              <motion.button 
                type="submit" 
                disabled={isProcessing}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="hidden lg:flex w-full min-h-[72px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white rounded-2xl font-black uppercase tracking-wider hover:shadow-2xl transition-all duration-300 items-center justify-center text-xl gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Place Order • Rs. {grandTotal}</>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-1/3"
          >
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl border border-gray-800 sticky top-28 shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="p-5 md:p-6 border-b border-gray-800 bg-gradient-to-r from-[#cc2b2b]/10 to-transparent">
                <h3 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Order Summary
                </h3>
                <p className="text-xs text-gray-500 mt-1">{cart.length} items in cart</p>
              </div>

              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} 
                className="lg:hidden w-full flex justify-between items-center p-5 border-b border-gray-800"
              >
                <span className="font-bold text-sm">View Order Details</span>
                <svg className={`w-5 h-5 transform transition-transform ${isSummaryExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Cart Items */}
              <AnimatePresence>
                {(isSummaryExpanded || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-[40vh] overflow-y-auto custom-scrollbar divide-y divide-gray-800">
                      {cart.map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-4 md:p-5 hover:bg-white/5 transition-colors group"
                        >
                          <div className="flex gap-3">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-700" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm md:text-base line-clamp-1">{item.name}</h4>
                              <p className="text-[#d8a43f] font-bold text-sm mt-1">Rs. {item.price * item.qty}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button 
                                  onClick={() => updateItemQuantity(item.id, item.qty - 1)}
                                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#cc2b2b] transition-colors flex items-center justify-center text-white font-bold"
                                >
                                  -
                                </button>
                                <span className="font-bold text-sm w-6 text-center">{item.qty}</span>
                                <button 
                                  onClick={() => updateItemQuantity(item.id, item.qty + 1)}
                                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#cc2b2b] transition-colors flex items-center justify-center text-white font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Promo Code */}
              <div className="p-5 border-t border-gray-800">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Promo code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d8a43f]"
                  />
                  <button 
                    onClick={handlePromoApply}
                    className="px-5 py-3 bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-green-500 text-xs mt-2">✓ Promo {appliedPromo} applied! -Rs. {discountAmount}</p>
                )}
              </div>

              {/* Totals */}
              <div className="p-5 bg-black/30 space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Delivery Fee</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>-Rs. {discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-3 mt-2">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-[#d8a43f]">Rs. {grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Submit */}
              <div className="p-5 lg:hidden bg-gradient-to-t from-black to-transparent">
                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full min-h-[56px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Place Order • Rs. {grandTotal}</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl max-w-md w-full p-8 text-center border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
              <h3 className="text-2xl font-black mb-2">Order Confirmed!</h3>
              <p className="text-gray-400 mb-6">Your order has been sent to WhatsApp. We'll prepare it fresh!</p>
              <div className="bg-black/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400">Order Total</p>
                <p className="text-2xl font-bold text-[#d8a43f]">Rs. {grandTotal}</p>
              </div>
              <p className="text-xs text-gray-500">Redirecting to home...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cc2b2b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
