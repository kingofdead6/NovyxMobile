import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function FinalizeOrder() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [availableWilayas, setAvailableWilayas] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    customerEmail: "",        // ← Email added
    wilaya: "",
    desk: "",
    address: "",
    deliveryType: "desk",
  });

  // Load Cart
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (!savedCart || savedCart === "[]") {
      toast.error("Votre panier est vide");
      navigate("/cart");
      return;
    }
    setCartItems(JSON.parse(savedCart));
  }, [navigate]);

  // Load Wilayas
  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/delivery-areas`);
        setAvailableWilayas(res.data.areas || []);
      } catch (err) {
        toast.error("Impossible de charger les zones de livraison");
      }
    };
    fetchWilayas();
  }, []);

  // Calculate Delivery Price
  useEffect(() => {
    if (!form.wilaya) {
      setDeliveryPrice(null);
      return;
    }
    const selected = availableWilayas.find(w => w.wilaya === form.wilaya);
    if (selected) {
      setDeliveryPrice(form.deliveryType === "home" ? selected.priceHome : selected.priceDesk);
    }
  }, [form.wilaya, form.deliveryType, availableWilayas]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithDelivery = deliveryPrice !== null ? subtotal + deliveryPrice : subtotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/orders/create`, {
        ...form,
        deliveryPrice,
        items: cartItems,
      });

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Commande passée avec succès !");
      setIsSuccess(true);

      setTimeout(() => navigate("/products"), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  const desks = availableWilayas.find(w => w.wilaya === form.wilaya)?.desks || [];

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 max-w-md text-center">
          <CheckCircle className="w-24 h-24 mx-auto text-green-600 mb-6" />
          <h1 className="text-4xl font-light mb-4">Commande Confirmée !</h1>
          <p className="text-lg text-stone-600">Nous vous contacterons bientôt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-5 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Link to="/cart" className="inline-flex items-center gap-2 text-stone-600 mb-8 hover:text-black transition">
          <ArrowLeft size={28} />
          <span className="text-xl font-light">Retour au panier</span>
        </Link>

        <h1 className="text-4xl sm:text-5xl font-light mb-10">Finaliser votre commande</h1>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-stone-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <input 
                  type="text" 
                  placeholder="Nom complet *" 
                  required
                  value={form.customerName} 
                  onChange={e => setForm({...form, customerName: e.target.value})}
                  className="w-full p-5 border border-stone-200 rounded-xl text-lg focus:border-black outline-none"
                />

                <input 
                  type="tel" 
                  placeholder="Numéro de téléphone *" 
                  required
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full p-5 border border-stone-200 rounded-xl text-lg focus:border-black outline-none"
                />

                {/* Email Field - Now Required */}
                <input 
                  type="email" 
                  placeholder="Adresse email *" 
                  required
                  value={form.customerEmail} 
                  onChange={e => setForm({...form, customerEmail: e.target.value})}
                  className="w-full p-5 border border-stone-200 rounded-xl text-lg focus:border-black outline-none"
                />

                <div>
                  <label className="block mb-2 font-medium text-stone-700">Wilaya *</label>
                  <select 
                    required 
                    value={form.wilaya} 
                    onChange={e => setForm({...form, wilaya: e.target.value, desk: ""})}
                    className="w-full p-5 border border-stone-200 rounded-xl text-lg focus:border-black outline-none cursor-pointer"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {availableWilayas.map(w => (
                      <option key={w.wilaya} value={w.wilaya}>{w.wilaya}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-3 font-medium text-stone-700">Type de livraison</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setForm({...form, deliveryType: "desk", desk: ""})}
                      className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                        form.deliveryType === "desk" 
                          ? "border-blue-800 bg-blue-200 text-white" 
                          : "border-stone-200 hover:border-blue-800"
                      }`}
                    >
                      Point de livraison
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setForm({...form, deliveryType: "home"})}
                      className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                        form.deliveryType === "home" 
                          ? "border-blue-800 bg-blue-200 text-white" 
                          : "border-stone-200 hover:border-blue-800"
                      }`}
                    >
                      À domicile
                    </button>
                  </div>
                </div>

                {form.deliveryType === "desk" && desks.length > 0 && (
                  <select 
                    required 
                    value={form.desk} 
                    onChange={e => setForm({...form, desk: e.target.value})}
                    className="w-full p-5 border border-stone-200 rounded-xl text-lg focus:border-black outline-none cursor-pointer"
                  >
                    <option value="">Choisir un point de livraison</option>
                    {desks.map((d, i) => (
                      <option key={i} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                )}

                {form.deliveryType === "home" && (
                  <textarea 
                    placeholder="Adresse complète (rue, bâtiment, étage...)" 
                    required 
                    rows={4}
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full p-5 border border-stone-200 rounded-xl text-lg focus:border-black outline-none resize-y"
                  />
                )}

                <button
                  type="submit"
                  disabled={loading || !form.wilaya || (form.deliveryType === "desk" && !form.desk)}
                  className="cursor-pointer w-full py-6 bg-black hover:bg-blue-800 text-white text-xl font-medium rounded-xl disabled:opacity-50 transition-all"
                >
                  {loading 
                    ? "Commande en cours..." 
                    : `Confirmer la commande - ${totalWithDelivery.toLocaleString()} DA`
                  }
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-stone-100 sticky top-24">
              <h2 className="text-2xl font-light mb-8">Résumé de la commande</h2>
              
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 py-5 border-b last:border-0 items-start">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-xl" 
                  />
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{item.name}</p>
                    <p className="text-sm text-stone-500 mt-1">Quantité : {item.quantity}</p>
                  </div>
                  <p className="font-medium text-blue-700 whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString()} DA
                  </p>
                </div>
              ))}

              <div className="mt-8 space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString()} DA</span>
                </div>
                
                {deliveryPrice !== null && (
                  <div className="flex justify-between">
                    <span>Livraison ({form.wilaya})</span>
                    <span>{deliveryPrice.toLocaleString()} DA</span>
                  </div>
                )}

                <div className="flex justify-between text-2xl font-medium pt-6 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-blue-700">{totalWithDelivery.toLocaleString()} DA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}