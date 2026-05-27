import React, { useState } from "react";
import { ShieldCheck, Heart, MessageSquare, ZoomIn, X, BadgeCheck } from "lucide-react";

// Real WhatsApp conversation screenshots provided by the user
const FEEDBACK_SCREENSHOTS = [
  {
    id: "f1",
    url: "https://i.ibb.co/mrqnXqPt/feedback.jpg",
    caption: "Marcelo RC - Peça Entregue via Sedex",
    whatsappName: "Marcelo RC"
  },
  {
    id: "f2",
    url: "https://i.ibb.co/B2VF7JQw/Whats-App-Image-2026-05-26-at-18-24-15.jpg",
    caption: "Faca de Elite com dorso mosqueado na prancha",
    whatsappName: "Vinicius Pereira"
  },
  {
    id: "f3",
    url: "https://i.ibb.co/zTgy71QF/Whats-App-Image-2026-05-26-at-18-25-33.jpg",
    caption: "Trio de Facas de Exposição entregue com sucesso",
    whatsappName: "Gabriel G."
  }
];

export default function WhatsAppProofList() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Section */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Entrega 100% Comprovada</span>
        </span>
        
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
          QUEM JÁ GANHOU COMPROVA!
        </h3>
        
        <p className="text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Sem enrolação nem conversinha. Veja os prints e fotos reais enviadas pelos nossos ganhadores direto no grupo do WhatsApp assim que o Sedex chega na casa deles!
        </p>
        <div className="w-16 h-0.5 bg-emerald-500 mx-auto rounded"></div>
      </div>

      {/* Grid displaying the 3 real screenshots, rendered like elegant borderless floating physical photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pt-4 max-w-3xl mx-auto">
        {FEEDBACK_SCREENSHOTS.map((fb, index) => {
          // Define a soft natural tilt for each photo to give a "casual physical photos on desk" look
          const tiltClasses = 
            index === 0 ? "sm:rotate-[-2deg] hover:rotate-0" :
            index === 1 ? "sm:rotate-[1.5deg] hover:rotate-0" :
            "sm:rotate-[-1deg] hover:rotate-0";

          return (
            <div 
              key={fb.id} 
              className={`group relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_30px_70px_rgba(16,185,129,0.3)] transition-all duration-500 ease-out hover:scale-105 cursor-zoom-in ${tiltClasses}`}
              onClick={() => setSelectedImg(fb.url)}
            >
              <img 
                src={fb.url} 
                alt={fb.caption} 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              


              {/* Blur-overlay on hover */}
              <div className="absolute inset-0 bg-neutral-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-neutral-900/95 border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-black text-neutral-200 flex items-center space-x-1.5 shadow-2xl">
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                  <span>Ampliar Sprint</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Image Dialog for expansion (Excellent for elderly looking at small text details) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 bg-neutral-950/95 z-55 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300 animate-fadeIn"
          onClick={() => setSelectedImg(null)}
        >
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={() => setSelectedImg(null)}
              className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 transition shadow-xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div 
            className="relative max-w-full max-h-[85vh] md:max-h-[92vh] flex items-center justify-center border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImg} 
              alt="Feedback Ampliado" 
              className="max-w-full max-h-[80vh] md:max-h-[88vh] rounded-xl object-contain"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}
