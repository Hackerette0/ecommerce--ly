import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';
import { Heart, CheckCircle } from 'lucide-react'; // Added CheckCircle
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Home() {
  const { categoryName } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then((res) => {
        setAllProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    if (categoryName) {
      const filtered = allProducts.filter(p => 
        p.category?.toLowerCase().replace(/ /g, '-') === categoryName
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [categoryName, allProducts]);

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const toggleWishlist = (e, product) => {
    e.preventDefault();
    let updatedWishlist = [...wishlist];
    const isPresent = wishlist.find(item => item._id === product._id);

    if (isPresent) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
      triggerToast("Removed from wishlist");
    } else {
      updatedWishlist.push(product);
      triggerToast("Added to wishlist ✨");
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event('storage'));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true,
  };

  if (loading) return <div className="py-40 text-center font-sans-aesthetic text-slate-400 italic">Loading your beauty favorites... 💄✨</div>;

  return (
    <div style={{ background: '#fdfcfb', minHeight: '100vh' }}>
      
      {/* Toast Notification UI */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
          <CheckCircle size={16} className="text-emerald-400" />
          <span className="font-sans-aesthetic text-[11px] font-bold uppercase tracking-widest">{toast.message}</span>
        </div>
      </div>

      {!categoryName && (
        <div className="hero-carousel" style={{ marginBottom: '60px' }}>
          <Slider {...settings}>
            {allProducts.slice(0, 5).map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <div className="relative group overflow-hidden">
                  <img 
                    src={product.image ? `${backendUrl}${product.image}` : 'https://placehold.co/800x500'} 
                    style={{ width: '100%', height: '550px', objectFit: 'cover' }} 
                    alt={product.name}
                    className="transition-transform duration-[10s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-16">
                     <span className="text-white/70 font-sans-aesthetic text-[10px] uppercase tracking-[0.4em] mb-4">Limited Edition</span>
                     <h2 className="text-white text-6xl font-serif-aesthetic italic leading-tight">{product.name}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      )}

      <h2 className="text-center mt-12 mb-12 text-[#F11A00] text-3xl font-serif-aesthetic italic capitalize tracking-tight">
        {categoryName ? categoryName.replace(/-/g, ' ') : 'Trending Beauty Picks'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 px-6 max-w-7xl mx-auto pb-32">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isWished = wishlist.some(item => item._id === product._id);
            return (
              <div key={product._id} className="relative group">
                <button 
                  onClick={(e) => toggleWishlist(e, product)}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-white/70 backdrop-blur-xl rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <Heart 
                    size={18} 
                    className={isWished ? "fill-[#F11A00] text-[#F11A00]" : "text-slate-400"} 
                  />
                </button>

                <Link to={`/product/${product._id}`} className="block">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <img 
                      src={product.image ? `${backendUrl}${product.image}` : 'https://placehold.co/300x400'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                      alt={product.name}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-[#F11A00] uppercase tracking-widest mb-1">{product.brand || "ōly exclusive"}</p>
                  <h3 className="font-sans-aesthetic text-[13px] font-semibold text-slate-800 leading-snug mb-1">{product.name}</h3>
                  <p className="text-slate-500 font-sans-aesthetic text-[13px]">₹{product.price}</p>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-32 border-2 border-dashed border-slate-100 rounded-3xl">
             <p className="text-slate-400 font-serif-aesthetic italic text-xl">Coming soon to the collection...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;