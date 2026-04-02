'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import { IKImage } from '@imagekit/next';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [selectedSpice, setSelectedSpice] = useState('medium');
  const [showToast, setShowToast] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/menu/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          const relRes = await fetch(`${baseUrl}/menu`);
          const relData = await relRes.json();
          const categoryId = typeof data.data.category === 'object' ? data.data.category._id : data.data.category;
          setRelatedProducts(
            (relData.data || [])
              .filter(item => {
                const itemCatId = typeof item.category === 'object' ? item.category._id : item.category;
                return itemCatId === categoryId && item._id !== id;
              })
              .slice(0, 4)
          );
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const sizes = [
    { name: 'Regular', price: 0, multiplier: 1 },
    { name: 'Large', price: 300, multiplier: 1.3 },
    { name: 'Family', price: 600, multiplier: 1.6 }
  ];
  const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

  const getPrice = () => {
    let basePrice = product?.price || 0;
    const size = sizes.find(s => s.name.toLowerCase() === selectedSize);
    if (size) basePrice = Math.round(basePrice * size.multiplier);
    return basePrice * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: getPrice() / quantity,
      image: product.image?.url || product.image,
      qty: quantity,
      size: selectedSize,
      spice: selectedSpice
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const productImages = [
    product?.image?.url || product?.image,
    product?.image?.url?.replace('.jpg', '_2.jpg') || product?.image
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d8a43f]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {product.name} added to cart!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#d8a43f]">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          <Link href="/products" className="hover:text-[#d8a43f]">Products</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          <span className="text-white truncate max-w-[150px]">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
              <IKImage
                src={productImages[activeImage]}
                alt={product.name}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                loading="eager"
              />
              {product.price > 2000 && <span className="absolute top-4 left-4 bg-[#d8a43f] text-black text-xs font-black px-3 py-1 rounded-full">🔥 Chef's Special</span>}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#d8a43f]' : 'border-gray-800 hover:border-gray-600'}`}>
                    <IKImage src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <span className="text-[#d8a43f] text-sm font-bold uppercase tracking-wider">{typeof product.category === 'object' ? product.category.name : 'Premium Dish'}</span>
            <h1 className="text-3xl md:text-4xl font-black mt-2 mb-4">{product.name}</h1>
            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Select Size</h3>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button key={size.name} onClick={() => setSelectedSize(size.name.toLowerCase())} className={`px-5 py-2 rounded-full border-2 font-bold transition ${selectedSize === size.name.toLowerCase() ? 'border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                    {size.name}{size.price > 0 && <span className="text-xs ml-1">(+Rs.{size.price})</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Spice Level</h3>
              <div className="flex gap-3 flex-wrap">
                {spiceLevels.map((level) => (
                  <button key={level} onClick={() => setSelectedSpice(level.toLowerCase())} className={`px-5 py-2 rounded-full border-2 font-bold transition ${selectedSpice === level.toLowerCase() ? 'border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center hover:bg-[#d8a43f] hover:border-[#d8a43f] transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg></button>
                <span className="text-2xl font-black w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center hover:bg-[#d8a43f] hover:border-[#d8a43f] transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <div className="flex justify-between items-center mb-6"><span className="text-gray-400">Total Price:</span><span className="text-3xl font-black text-[#d8a43f]">Rs. {getPrice()}</span></div>
              <button onClick={handleAddToCart} className="w-full min-h-[56px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl uppercase tracking-wider hover:shadow-xl transition-all">Add to Cart</button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link href={`/product/${item._id}`} key={item._id}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#d8a43f]/50 transition-all">
                    <div className="h-32 md:h-40 overflow-hidden">
                      <IKImage src={item.image?.url || item.image} alt={item.name} width={300} height={200} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-[#d8a43f] font-black text-sm mt-1">Rs. {item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}