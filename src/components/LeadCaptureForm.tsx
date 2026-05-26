import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Users } from "lucide-react";
import { Lead } from "../types";

// High fidelity custom vector for WhatsApp Brand Icon
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.001 4.908A11.817 11.817 0 0 0 11.968 0C5.414 0 .08 5.334.077 11.89c0 2.096.547 4.142 1.588 5.945L.005 24l6.335-1.662c1.746.953 3.71 1.456 5.704 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413zM12.05 21.803h-.005a9.78 9.78 0 0 1-4.99-1.364l-.358-.213-3.71 .973.99-3.61-.233-.372a9.799 9.799 0 0 1-1.5-5.234c.002-5.412 4.41-9.82 9.823-9.82a9.75 9.75 0 0 1 6.947 2.88 9.773 9.773 0 0 1 2.876 6.95c-.004 5.414-4.412 9.82-9.82 9.82zm5.422-7.421c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
  </svg>
);

// Autentic custom SVG replica of the "Rancho do Churrasqueiro RC" Logo
export function RCLogo() {
  return (
    <div className="flex justify-center -mb-2">
      <svg viewBox="0 0 200 200" className="w-28 h-28 md:w-32 md:h-32 mx-auto drop-shadow-xl select-none">
        {/* Outer white circle with dark solid border */}
        <circle cx="100" cy="100" r="94" fill="#ffffff" stroke="#171717" strokeWidth="6" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        
        {/* Sign hanger with "Rancho Do Churrasqueiro" text */}
        <rect x="52" y="22" width="96" height="30" fill="#000000" rx="3" />
        <text x="100" y="34" fill="#ffffff" fontSize="10.5" fontWeight="900" fontFamily='"Arial Black", Impact, sans-serif' textAnchor="middle" letterSpacing="1.2">RANCHO DO</text>
        <text x="100" y="47" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily='"Arial Black", Impact, sans-serif' textAnchor="middle" letterSpacing="0.8">CHURRASQUEIRO</text>
        
        {/* Twin vertical bars supporting the hanging sign */}
        <rect x="71" y="52" width="3.5" height="15" fill="#000000" />
        <rect x="125" y="52" width="3.5" height="15" fill="#000000" />
        
        {/* Bold black "R" and "C" text */}
        <text x="43" y="161" fill="#000000" fontSize="114" fontWeight="900" fontFamily='"Arial Black", Impact, sans-serif'>R</text>
        <text x="115" y="161" fill="#000000" fontSize="114" fontWeight="900" fontFamily='"Arial Black", Impact, sans-serif'>C</text>
        
        {/* Knife silhouette inside/over the letter C */}
        {/* Blade profile */}
        <path 
          d="M 143.5,95 
             C 143.5,112 141.5,126 138.5,134 
             L 137,138 
             L 134,138 
             L 134,95 
             Z" 
          fill="#ffffff" 
        />
        {/* Knife handle pointing down */}
        <path 
          d="M 134,138 
             L 137,138 
             L 137,148 
             C 137,152 135.5,153 135.5,155 
             C 135.5,157 133,157 133,155 
             L 133,138 
             Z" 
          fill="#ffffff" 
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        {/* Handle rivets detail */}
        <circle cx="135.2" cy="142" r="0.8" fill="#000000" />
        <circle cx="135.2" cy="147" r="0.8" fill="#000000" />
        <circle cx="135.2" cy="151" r="0.8" fill="#000000" />
      </svg>
    </div>
  );
}

interface LeadCaptureFormProps {
  onCapture: (leadData: Omit<Lead, "id" | "capturedAt">) => void;
  whatsappUrl: string;
}

export default function LeadCaptureForm({ onCapture, whatsappUrl }: LeadCaptureFormProps) {
  const handleJoinClick = () => {
    // Registra clique de redirecionamento no painel de administração local
    const randomID = Math.floor(Math.random() * 90000 + 10000);
    onCapture({
      name: `Acesso Direto #${randomID}`,
      phone: "Redirecionado para o WhatsApp",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-900/90 rounded-2xl border-4 border-emerald-500/30 p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative overflow-hidden text-center space-y-6">
      
      {/* Visual background lights for modern polish */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Custom Brand Logo */}
      <RCLogo />

      {/* 2. Direct Value Heading */}
      <div className="space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          GRUPO OFICIAL DE RIFAS
        </h2>
        <p className="text-base sm:text-lg text-neutral-200 font-medium max-w-lg mx-auto">
          Participe e concorra a facas artesanais brutais por apenas{" "}
          <span className="text-amber-400 font-extrabold underline decoration-amber-500 decoration-2">R$ 2,50 a dezena</span>!
        </p>
      </div>

      {/* 3. COLOSSAL, HIGHLY VISIBLE PULSING GREEN BUTTON (Perfect for older targets) */}
      <div className="pt-2">
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleJoinClick}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-full relative py-5 px-6 rounded-2xl font-black bg-[#25D366] hover:bg-[#20ba5a] text-neutral-950 shadow-[0_15px_45px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_60px_rgba(37,211,102,0.6)] transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer border-2 border-[#3cf37e] select-none group focus:outline-none focus:ring-4 focus:ring-[#3cf37e]"
          id="submit_capture_btn"
        >
          <WhatsAppIcon className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0" />
          <span className="text-lg sm:text-2xl text-neutral-950 tracking-tight leading-none text-left font-black">
            CLIQUE AQUI PARA ENTRAR NO GRUPO ➔
          </span>
        </motion.a>
        
        {/* Simple Trust Assurance */}
        <p className="text-xs sm:text-sm text-neutral-450 mt-4 font-sans font-medium flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Acesso 100% Grátis, Seguro & Direto no WhatsApp</span>
        </p>
      </div>

      {/* 4. Tiny active counter made readable and clean */}
      <div className="pt-3 flex items-center justify-center space-x-2 text-xs sm:text-sm text-neutral-400 font-semibold border-t border-neutral-850">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Grupo online agora com <strong className="text-neutral-100 font-bold">+2.800 gaúchos</strong> participando</span>
      </div>

    </div>
  );
}
