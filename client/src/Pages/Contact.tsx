"use client";

import React, { useState } from "react";
import SellRequestForm from "../Components/contact/SellRequestForm";
import ContactForm from "../Components/contact/ContactForm";
import RepairRequestForm from "../Components/contact/RepairRequestForm";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"sell" | "contact" | "repair">("sell");

  const tabs = [
    { id: "sell", label: "Vendre un article", icon: "💼" },
    { id: "contact", label: "Nous contacter", icon: "📞" },
    { id: "repair", label: "Demander une réparation", icon: "🔧" },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-stone-900">
            Nos Services
          </h1>
          <p className="mt-6 text-xl text-stone-600">
            Choisissez le service dont vous avez besoin
          </p>
        </div>

        {/* Buttons / Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-3xl text-lg font-medium transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "bg-black text-white shadow-xl scale-105"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-2xl mx-auto">
          {activeTab === "sell" && <SellRequestForm />}
          {activeTab === "contact" && <ContactForm />}
          {activeTab === "repair" && <RepairRequestForm />}
        </div>
      </div>
    </div>
  );
}