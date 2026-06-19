"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    question: "Quels types de produits propose MOBUMES ?",
    answer:
      "MOBUMES est spécialisée dans la fabrication et la fourniture de coffres-forts, armoires sécurisées, portes blindées, portes coupe-feu et mobilier métallique pour professionnels et particuliers.",
  },
  {
    question: "Proposez-vous l’installation sur site ?",
    answer:
      "Oui. Nos équipes assurent l’installation complète sur site, garantissant une mise en place sécurisée et conforme aux normes de sécurité.",
  },
  {
    question: "Assurez-vous la maintenance des équipements ?",
    answer:
      "Oui, nous proposons un service de maintenance et de réparation sur tous types de coffres-forts et systèmes de sécurité, toutes marques confondues.",
  },
  {
    question: "Est-il possible de demander un devis personnalisé ?",
    answer:
      "Oui, chaque projet fait l’objet d’un devis personnalisé en fonction des besoins, du niveau de sécurité et du type d’équipement souhaité.",
  },
  {
    question: "Travaillez-vous uniquement avec les professionnels ?",
    answer:
      "Non. Nous travaillons aussi bien avec les entreprises, les administrations que les particuliers.",
  },
  {
    question: "Vos produits sont-ils certifiés ?",
    answer:
      "Oui, nos solutions respectent des standards de sécurité élevés et sont conçues pour répondre aux exigences de protection physique modernes.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-950">
            Questions fréquentes
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Tout ce que vous devez savoir sur nos services et solutions de sécurité
          </p>
        </motion.div>

        {/* FAQ */}
        <div className="space-y-5">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              layout
              className="bg-white border border-stone-100 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/40 transition"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {/* Question */}
              <div className="flex justify-between items-center p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-medium text-stone-900 pr-6">
                  {faq.question}
                </h3>

                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-light text-blue-700"
                >
                  {openIndex === index ? "−" : "+"}
                </motion.div>
              </div>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-8">
                      <p className="text-stone-700 leading-relaxed text-base sm:text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
