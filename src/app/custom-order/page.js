"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CustomOrderPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    orderType: "delivery",
    address: "",
    deliveryTime: "",
    occasion: "regular",
    specialRequests: "",
    items: [],
  });
  const [menuItems, setMenuItems] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishQuantity, setDishQuantity] = useState(1);
  const [showDishSelector, setShowDishSelector] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [formStatus, setFormStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/menu`);
        const data = await res.json();
        setMenuItems(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const total = formData.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    setEstimatedPrice(total);
  }, [formData.items]);

  const occasions = [
    { id: "regular", name: "Regular Meal", icon: "🍽️" },
    { id: "birthday", name: "Birthday", icon: "🎂" },
    { id: "anniversary", name: "Anniversary", icon: "💕" },
    { id: "corporate", name: "Corporate Event", icon: "💼" },
    { id: "family", name: "Family Gathering", icon: "👨‍👩‍👧‍👦" },
  ];

  const addDishToOrder = () => {
    if (selectedDish) {
      const existingItem = formData.items.find(
        (item) => item.id === selectedDish._id,
      );
      if (existingItem) {
        setFormData((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === selectedDish._id
              ? { ...item, qty: item.qty + dishQuantity }
              : item,
          ),
        }));
        setToastMessage(`Added ${dishQuantity} more ${selectedDish.name}`);
      } else {
        setFormData((prev) => ({
          ...prev,
          items: [
            ...prev.items,
            {
              id: selectedDish._id,
              name: selectedDish.name,
              price: selectedDish.price,
              image: selectedDish.image?.url || selectedDish.image,
              qty: dishQuantity,
            },
          ],
        }));
        setToastMessage(`${selectedDish.name} added to order`);
      }
      // Reset selection and close modal
      setSelectedDish(null);
      setDishQuantity(1);
      setShowDishSelector(false);
      // Auto-hide toast after 2 seconds
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const removeItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateItemQuantity = (itemId, newQty) => {
    if (newQty <= 0) removeItem(itemId);
    else {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, qty: newQty } : item,
        ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return;
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Prepare order payload
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address:
            formData.orderType === "delivery" ? formData.address : "Takeaway",
        },
        items: cart.map((item) => ({
          menuItem: item.id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          totalPrice: item.price * item.qty,
          customizations: {
            size: item.size || "regular",
            spiceLevel: item.spice || "medium",
          },
        })),
        totalAmount: grandTotal,
        paymentStatus: "pending",
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        notes: formData.note,
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to place order");
      }

      // Build WhatsApp message
      let message = `🍖 *TEXAS GRILL - NEW ORDER* 🍖%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `📋 *Order Type:* ${formData.orderType.toUpperCase()}%0A`;
      message += `💳 *Payment:* ${formData.paymentMethod.toUpperCase()}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `👤 *Customer:* ${formData.name}%0A`;
      message += `📱 *Phone:* ${formData.phone}%0A`;
      if (formData.orderType === "delivery")
        message += `📍 *Address:* ${formData.address}%0A`;
      if (formData.note) message += `📝 *Note:* ${formData.note}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `🍽️ *ORDER ITEMS:*%0A`;

      cart.forEach((item, idx) => {
        message += `${idx + 1}. ${item.qty}x ${item.name} (${item.size || "Reg"}) - Rs. ${item.price * item.qty}%0A`;
      });

      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `💰 *Subtotal:* Rs. ${subtotal}%0A`;
      if (discount > 0) message += `🎁 *Discount:* -Rs. ${discount}%0A`;
      if (deliveryFee > 0) message += `🚚 *Delivery:* Rs. ${deliveryFee}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `💎 *GRAND TOTAL:* Rs. ${grandTotal}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `⏰ *Order Time:* ${new Date().toLocaleString()}%0A`;
      message += `👨‍🍳 *Preparing in:* 30-45 mins%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `🔗 _Order via Texas Grill App_`;

      // WhatsApp number from environment variable
      const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
      );

      setShowSuccessModal(true);
      setTimeout(() => router.push("/"), 4000);
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.name && formData.phone) setStep(2);
    else if (step === 2 && formData.items.length > 0) setStep(3);
  };

  const prevStep = () => setStep(step - 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white overflow-x-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#d8a43f] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-[#d8a43f] font-black tracking-wider text-xs md:text-sm uppercase block mb-2">
            Customize Your Feast
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Custom Order
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Create your perfect meal by selecting dishes and customizing to your
            taste
          </p>
        </motion.div>

        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${
                    step >= s
                      ? "bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white shadow-lg"
                      : "bg-[#1a1a1a] text-gray-500 border border-gray-700"
                  }`}
                >
                  {step > s ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2 hidden md:block">
                  {s === 1 ? "Your Info" : s === 2 ? "Select Dishes" : "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative max-w-md mx-auto mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-800 rounded-full w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800"
            >
              <h2 className="text-2xl font-black mb-6">Your Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                    placeholder="+92 300 0000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    Order Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, orderType: "delivery" })
                      }
                      className={`min-h-[48px] rounded-xl border-2 font-bold transition ${formData.orderType === "delivery" ? "border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]" : "border-gray-700 text-gray-400"}`}
                    >
                      🚚 Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, orderType: "takeaway" })
                      }
                      className={`min-h-[48px] rounded-xl border-2 font-bold transition ${formData.orderType === "takeaway" ? "border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]" : "border-gray-700 text-gray-400"}`}
                    >
                      📦 Takeaway
                    </button>
                  </div>
                </div>
                {formData.orderType === "delivery" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-sm font-bold mb-2 text-gray-300">
                      Delivery Address *
                    </label>
                    <textarea
                      rows="2"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition"
                      placeholder="Enter your complete address"
                    />
                  </motion.div>
                )}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    Occasion
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {occasions.map((occ) => (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, occasion: occ.id })
                        }
                        className={`p-2 rounded-xl text-center transition ${formData.occasion === occ.id ? "bg-[#d8a43f]/20 border border-[#d8a43f]" : "bg-black/30 border border-gray-700"}`}
                      >
                        <div className="text-xl">{occ.icon}</div>
                        <div className="text-xs mt-1">{occ.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    Preferred Delivery Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deliveryTime}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryTime: e.target.value })
                    }
                    className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                  />
                </div>
              </div>
              <button
                onClick={nextStep}
                disabled={!formData.name || !formData.phone}
                className="w-full mt-8 min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Select Dishes
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Select Your Dishes</h2>
                <button
                  onClick={() => setShowDishSelector(true)}
                  className="px-4 py-2 bg-[#d8a43f] text-black font-bold rounded-full text-sm"
                >
                  + Add Dish
                </button>
              </div>
              {formData.items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-gray-400 mb-4">No dishes added yet</p>
                  <button
                    onClick={() => setShowDishSelector(true)}
                    className="text-[#d8a43f] font-bold"
                  >
                    Click here to add your first dish
                  </button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {formData.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/30 rounded-xl p-4 flex gap-4 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-[#d8a43f] text-sm">
                          Rs. {item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.qty - 1)
                          }
                          className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.qty + 1)
                          }
                          className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-red-500"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-gray-300">
                  Special Requests
                </label>
                <textarea
                  rows="3"
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequests: e.target.value,
                    })
                  }
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition"
                  placeholder="Any special instructions? (spice level, allergies, etc.)"
                />
              </div>
              <div className="bg-black/30 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Estimated Total:</span>
                  <span className="text-2xl font-black text-[#d8a43f]">
                    Rs. {estimatedPrice}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 min-h-[52px] bg-gray-800 text-white font-bold rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={formData.items.length === 0}
                  className="flex-1 min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl disabled:opacity-50"
                >
                  Review Order
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800"
            >
              <h2 className="text-2xl font-black mb-6">Review Your Order</h2>
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4">
                  <h3 className="text-[#d8a43f] font-bold mb-2">
                    Customer Details
                  </h3>
                  <p>
                    <span className="text-gray-500">Name:</span> {formData.name}
                  </p>
                  <p>
                    <span className="text-gray-500">Phone:</span>{" "}
                    {formData.phone}
                  </p>
                  {formData.email && (
                    <p>
                      <span className="text-gray-500">Email:</span>{" "}
                      {formData.email}
                    </p>
                  )}
                  <p>
                    <span className="text-gray-500">Order Type:</span>{" "}
                    {formData.orderType === "delivery"
                      ? "🚚 Delivery"
                      : "📦 Takeaway"}
                  </p>
                  {formData.orderType === "delivery" && (
                    <p>
                      <span className="text-gray-500">Address:</span>{" "}
                      {formData.address}
                    </p>
                  )}
                  <p>
                    <span className="text-gray-500">Occasion:</span>{" "}
                    {occasions.find((o) => o.id === formData.occasion)?.name}
                  </p>
                  {formData.deliveryTime && (
                    <p>
                      <span className="text-gray-500">Delivery Time:</span>{" "}
                      {new Date(formData.deliveryTime).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="border-b border-gray-800 pb-4">
                  <h3 className="text-[#d8a43f] font-bold mb-2">Order Items</h3>
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2">
                      <span>
                        {item.qty}x {item.name}
                      </span>
                      <span className="text-[#d8a43f]">
                        Rs. {item.price * item.qty}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-700 font-bold">
                    <span>Total</span>
                    <span className="text-[#d8a43f]">Rs. {estimatedPrice}</span>
                  </div>
                </div>
                {formData.specialRequests && (
                  <div className="border-b border-gray-800 pb-4">
                    <h3 className="text-[#d8a43f] font-bold mb-2">
                      Special Requests
                    </h3>
                    <p className="text-gray-400">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 min-h-[52px] bg-gray-800 text-white font-bold rounded-xl"
                >
                  Edit Order
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={formStatus === "submitting"}
                  className="flex-1 min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl disabled:opacity-50"
                >
                  {formStatus === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Custom Order"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {formStatus === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl max-w-md w-full p-8 text-center border border-gray-700"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-black mb-2">Order Ready!</h3>
                <p className="text-gray-400 mb-4">
                  Your custom order has been added to cart
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to checkout...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dish Selector Modal */}
        <AnimatePresence>
          {showDishSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDishSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-black">Select a Dish</h3>
                  <button
                    onClick={() => setShowDishSelector(false)}
                    className="text-gray-500 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => setSelectedDish(item)}
                        className={`p-3 rounded-xl text-left transition ${
                          selectedDish?._id === item._id
                            ? "bg-[#d8a43f]/20 border border-[#d8a43f]"
                            : "bg-black/30 border border-gray-700 hover:border-gray-500"
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={
                              item.image?.url ||
                              item.image ||
                              "/placeholder.jpg"
                            }
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                          <div>
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-[#d8a43f] text-xs">
                              Rs. {item.price}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDish && (
                  <div className="p-6 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Quantity:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setDishQuantity(Math.max(1, dishQuantity - 1))
                          }
                          className="w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700"
                        >
                          -
                        </button>
                        <span className="font-bold w-8 text-center">
                          {dishQuantity}
                        </span>
                        <button
                          onClick={() => setDishQuantity(dishQuantity + 1)}
                          className="w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={addDishToOrder}
                      className="w-full py-3 bg-[#d8a43f] text-black font-bold rounded-xl hover:bg-[#c49a30] transition"
                    >
                      Add to Order (Rs. {selectedDish.price * dishQuantity})
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
