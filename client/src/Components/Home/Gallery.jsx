"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/gallery`);
        setImages(res.data || []);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-2xl font-light text-stone-600 animate-pulse">
          Chargement de la galerie...
        </div>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-xl text-stone-500">
          Aucune image disponible
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900">
            Nos réalisations
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Découvrez quelques exemples de nos installations et réalisations.
          </p>
        </motion.div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={images.length > 3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 25 },
          }}
          className="pb-14"
        >
          {images.map((item, index) => (
            <SwiperSlide key={item._id || index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title || "Gallery image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                </div>

                {/* Caption */}
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="text-lg font-medium drop-shadow">
                      {item.title}
                    </h3>
                  </div>
                )}
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}