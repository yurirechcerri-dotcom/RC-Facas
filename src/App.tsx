import React, { useState, useEffect, useRef } from "react";
import { 
  Flame, Award, Shield, Truck, Sparkles, MessageCircle, 
  Settings, CheckCircle, ChevronDown, Phone, Users, 
  Star, Coffee, Package, Compass, Lock, Trash2, ShieldCheck, Mail,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Lead, Testimonial, AppConfig } from "./types";
import LeadCaptureForm from "./components/LeadCaptureForm";
import AdminPanel from "./components/AdminPanel";
import TestimonialCard from "./components/TestimonialCard";
import WhatsAppProofList from "./components/WhatsAppProofList";
import { initMetaPixel, trackUnifiedMetaEvent } from "./utils/metaTracking";

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

// Core image paths pointing to the real custom knife assets from ImgBB
const luxuryDamascusKnife = "https://i.ibb.co/RGFK4h9x/Whats-App-Image-2026-05-26-at-18-16-03.jpg";
const silverMasonicKnives = "https://i.ibb.co/m1F6H7R/Whats-App-Image-2026-05-26-at-18-16-02-1.jpg";
const completeBarbecueSet = "https://i.ibb.co/fGB4wSmS/Whats-App-Image-2026-05-26-at-18-16-02-2.jpg";
const rotatingKnifeBlock = "https://i.ibb.co/Qv0zwJ67/Whats-App-Image-2026-05-26-at-18-16-03-1.jpg";
const logoUrl = "https://i.ibb.co/vvVy8hX1/Captura-de-Tela-2026-05-26-a-s-18-59-34.png";

// Full gallery array containing other custom handcrafted blades (first photo removed to avoid repetition)
const ALL_KNIFE_PHOTOS = [
  "https://i.ibb.co/m1F6H7R/Whats-App-Image-2026-05-26-at-18-16-02-1.jpg",
  "https://i.ibb.co/fGB4wSmS/Whats-App-Image-2026-05-26-at-18-16-02-2.jpg",
  "https://i.ibb.co/Qv0zwJ67/Whats-App-Image-2026-05-26-at-18-16-03-1.jpg",
  "https://i.ibb.co/NgP5szVt/Whats-App-Image-2026-05-26-at-18-16-03-4.jpg",
  "https://i.ibb.co/21djyqtH/Whats-App-Image-2026-05-26-at-18-16-03-3.jpg",
  "https://i.ibb.co/kgz5TY9m/Whats-App-Image-2026-05-26-at-18-16-03-2.jpg",
  "https://i.ibb.co/609NdPCt/Whats-App-Image-2026-05-26-at-18-16-02.jpg"
];

const DEFAULT_CONFIG: AppConfig = {
  whatsappUrl: "https://chat.whatsapp.com/F7ySdGRX8MR3fsozKMwcJy?s=cl&p=a&mlu=1",
  ticketPrice: "R$ 2,50",
  totalClients: "+2800 clientes satisfeitos",
  activeRaffleTitle: "Rancho do Churrasqueiro - Faca Gaúcha de Luxo",
  activeRaffleDescription: "Peça de elite forjada artesanalmente com altíssimo padrão de churrasco, cortes cirúrgicos, dorso mosqueado e empunhadura híbrida customizada.",
  hasSorteioDiario: true,
  hasEnvioGarantido: true,
  termsAndConditions: "Ao participar das ações, você declara possuir mais de 18 anos. Todos os sorteios são baseados nos números da Loteria Federal."
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Carlos Eduardo S.",
    location: "Porto Alegre - RS",
    text: "Minha faca Gaúcha chegou na semana passada. Acabamento impecável e o fio é coisa de outro mundo! Já peguei mais dezenas para o próximo sorteio de Damasco.",
    prizeWon: "Faca Campeira Carbono"
  },
  {
    id: "t2",
    author: "André Oliveira",
    location: "Belo Horizonte - MG",
    text: "Grupo excelente, transparência total. O mestre cuteleiro manda foto do rastreamento do Sedex no mesmo dia e tira todas as dúvidas de imediato.",
    prizeWon: "Adaga Sorocabana"
  }
];

const SAMPLE_LEADS_MOCK: Lead[] = [
  { id: "l-mock-1", name: "Felipe Mendes da Silva", phone: "(51) 98745-2231", capturedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "l-mock-2", name: "Rodrigo Alencar de Souza", phone: "(11) 99824-4411", capturedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "l-mock-3", name: "Mateus Ribeiro", phone: "(62) 99125-9008", capturedAt: new Date(Date.now() - 3600000 * 12).toISOString() }
];

export default function App() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedKnifeUrl, setSelectedKnifeUrl] = useState<string | null>(null);
  const captureSectionRef = useRef<HTMLDivElement | null>(null);
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryScrollRef.current) {
      const { scrollLeft, clientWidth } = galleryScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      galleryScrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Load from localStorage in client-side safely
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem("arcanjo_config");
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }
      
      const storedLeads = localStorage.getItem("arcanjo_leads");
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      }
    } catch (e) {
      console.error("Local storage not enabled", e);
    }
  }, []);

  // Initialize and update Meta Pixel dynamically when Pixel ID in configurations is changed
  useEffect(() => {
    initMetaPixel(config.metaPixelId);
  }, [config.metaPixelId]);

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("arcanjo_config", JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCaptureLead = (leadData: Omit<Lead, "id" | "capturedAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: "lead-" + Math.random().toString(36).slice(2, 9),
      capturedAt: new Date().toISOString()
    };
    
    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    
    try {
      localStorage.setItem("arcanjo_leads", JSON.stringify(updatedLeads));
    } catch (e) {
      console.error(e);
    }

    // Parse the ticket price from config dynamically (e.g. "R$ 2,50" -> "2.50")
    let rawPrice = "2.50";
    if (config.ticketPrice) {
      const match = config.ticketPrice.match(/[\d,.]+/);
      if (match) {
        rawPrice = match[0].replace(",", ".");
      }
    }

    const emailStr = leadData.email || "";
    // Clean phone number placeholder vs real input digits if available
    const isPlaceholderPhone = leadData.phone && (leadData.phone.toLowerCase().includes("redirecionado") || leadData.phone.includes("#"));
    const phoneStr = leadData.phone && !isPlaceholderPhone ? leadData.phone : "";

    // 1. Fire Lead Unified (Hybrid) event
    trackUnifiedMetaEvent({
      eventName: "Lead",
      emailStr,
      phoneStr,
      value: rawPrice,
      currency: "BRL",
      config
    });

    // 2. Fire Purchase Unified (Hybrid) event as requested by user payload
    trackUnifiedMetaEvent({
      eventName: "Purchase",
      emailStr,
      phoneStr,
      value: rawPrice,
      currency: "BRL",
      config
    });
  };

  const handleDeleteLead = (id: string) => {
    const filteredLeads = leads.filter(l => l.id !== id);
    setLeads(filteredLeads);
    try {
      localStorage.setItem("arcanjo_leads", JSON.stringify(filteredLeads));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearLeads = () => {
    setLeads([]);
    try {
      localStorage.removeItem("arcanjo_leads");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSampleLeads = () => {
    setLeads(SAMPLE_LEADS_MOCK);
    try {
      localStorage.setItem("arcanjo_leads", JSON.stringify(SAMPLE_LEADS_MOCK));
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToCapture = () => {
    captureSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 font-sans flex flex-col justify-between">
      
      {/* Core Hero Section - Captures attention immediately with extreme readability */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-20 border-b border-neutral-900 bg-neutral-950" ref={captureSectionRef} id="lead_capture_form_section">
        <div className="absolute top-0 left-12 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Direct Ultimate Hook & Colossal Button */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left flex flex-col justify-center">
              
              {/* Brand Logo directly on top of the title section */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden flex items-center justify-center select-none bg-transparent">
                  <img src={logoUrl} alt="Rancho do Churrasqueiro Logo" className="w-full h-full object-contain scale-[1.05]" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase">
                  🔥 Última etapa para garantir sua vaga no <span className="text-[#ff5a00] font-black">grupo vip</span> de rifas de facas artesanais
                </h1>
                
                <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Acesse agora o grupo oficial das rifas exclusivas e concorra a facas brutas de alto padrão!
                </p>
              </div>

              {/* Colossal Green Pulsing Button */}
              <div className="pt-2">
                <a
                  href={config.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCaptureLead({ name: "Acesso Direto Hero", phone: "Redirecionado" })}
                  className="inline-flex w-full sm:w-auto items-center justify-center space-x-3 py-5 px-8 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-neutral-950 font-black text-xl sm:text-2xl tracking-tight uppercase border-2 border-[#3cf37e] shadow-[0_15px_45px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_60px_rgba(37,211,102,0.65)] transition-all duration-300 select-none animate-bounce"
                  style={{ animationDuration: "2s" }}
                >
                  <WhatsAppIcon className="w-8 h-8 flex-shrink-0" />
                  <span>👉 CLIQUE AQUI E ENTRE NO GRUPO VIP DA RIFA 👈</span>
                </a>
              </div>

              {/* Huge clear visual bullets under the main button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left max-w-xl mx-auto lg:mx-0 font-sans text-sm sm:text-base">
                <div className="flex items-center space-x-2.5 text-neutral-200 bg-neutral-900/40 p-3 rounded-lg border border-neutral-900">
                  <span className="text-emerald-400 font-extrabold text-xl">✓</span>
                  <span><strong>+2.800</strong> clientes ativos</span>
                </div>
                <div className="flex items-center space-x-2.5 text-neutral-200 bg-neutral-900/40 p-3 rounded-lg border border-neutral-900">
                  <span className="text-emerald-400 font-extrabold text-xl">✓</span>
                  <span>Rifas a partir de <strong>R$ 2,50</strong></span>
                </div>
                <div className="flex items-center space-x-2.5 text-neutral-200 bg-neutral-900/40 p-3 rounded-lg border border-neutral-900">
                  <span className="text-emerald-400 font-extrabold text-xl">✓</span>
                  <span>Envios para todo o Brasil</span>
                </div>
                <div className="flex items-center space-x-2.5 text-neutral-200 bg-neutral-900/40 p-3 rounded-lg border border-neutral-900">
                  <span className="text-emerald-400 font-extrabold text-xl">✓</span>
                  <span>Sorteios diários seguros</span>
                </div>
              </div>

            </div>

            {/* Right Column: Ultimate Rounded Vertical Display (Static) */}
            <div className="lg:col-span-5 flex items-center justify-center pt-2 lg:pt-0">
              <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-900 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-neutral-800/60">
                <img
                  src={luxuryDamascusKnife}
                  alt="Faca Gaúcha de Luxo"
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Immersive Gallery Section with no ugly borders, displaying floating photos */}
      <section className="py-16 bg-neutral-950 border-b border-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              ⚔️ FOTOS REAIS DAS NOSSAS LÂMINAS DE ELITE
            </h2>
            <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto">
              Toque nas fotos para ampliar. Arraste para o lado ou clique nas setas para ver todas as facas.
            </p>
            <div className="w-16 h-0.5 bg-amber-500 mx-auto rounded"></div>
          </div>

          {/* Draggable/Scrollable Carousel Area */}
          <div className="relative max-w-6xl mx-auto px-2">
            
            {/* Left Scroll Trigger (Desktop only) */}
            <button 
              onClick={() => scrollGallery("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-30 w-12 h-12 rounded-full bg-neutral-900/95 hover:bg-amber-500 border border-neutral-800 text-neutral-200 hover:text-neutral-950 flex items-center justify-center shadow-2xl transition duration-300 active:scale-95 cursor-pointer hidden sm:flex"
              title="Voltar foto"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Right Scroll Trigger (Desktop only) */}
            <button 
              onClick={() => scrollGallery("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-30 w-12 h-12 rounded-full bg-neutral-900/95 hover:bg-amber-500 border border-neutral-800 text-neutral-200 hover:text-neutral-950 flex items-center justify-center shadow-2xl transition duration-300 active:scale-95 cursor-pointer hidden sm:flex"
              title="Próxima foto"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Scrollable track containing pure image cards */}
            <div 
              ref={galleryScrollRef}
              className="overflow-x-auto scrollbar-none flex gap-6 py-4 px-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
            >
              {ALL_KNIFE_PHOTOS.map((url, idx) => {
                const tiltClass = 
                  idx % 3 === 0 ? "md:rotate-[-1deg]" :
                  idx % 3 === 1 ? "md:rotate-[1deg]" :
                  "md:rotate-[-0.5deg]";

                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedKnifeUrl(url)}
                    className={`group shrink-0 w-[265px] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-[0_22px_50px_rgba(0,0,0,0.92)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-neutral-850 hover:border-neutral-700 transition-all duration-500 ease-out hover:scale-103 snap-center cursor-zoom-in relative ${tiltClass}`}
                  >
                    <img 
                      src={url} 
                      alt={`Faca de Elite ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />

                    {/* Hover absolute action overlay helper */}
                    <div className="absolute inset-0 bg-neutral-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-neutral-900/95 border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-black text-neutral-200 flex items-center space-x-1.5 shadow-2xl">
                        <span>🔍 Ampliar Detalhes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive swipe/drag hint for mobile touch users */}
            <div className="flex items-center justify-center space-x-2 pt-4 sm:hidden">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase flex items-center">
                ◄ deslize para os lados para ver mais lâminas ►
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Section 3: WhatsApp Conversational Proofs (Matches third screenshot copy) */}
      <section className="py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhatsAppProofList />
          
          {/* Colossal Ganhadores bottom green button repeat */}
          <div className="text-center pt-10">
            <a
              href={config.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCaptureLead({ name: "Acesso Bottom Provas", phone: "Redirecionado" })}
              className="inline-flex w-full sm:w-auto items-center justify-center space-x-3 py-5 px-8 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-neutral-950 font-black text-xl sm:text-2xl tracking-tight uppercase border-2 border-[#3cf37e] shadow-[0_15px_45px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_60px_rgba(37,211,102,0.65)] transition-all duration-300 select-none animate-pulse"
            >
              <WhatsAppIcon className="w-8 h-8 flex-shrink-0" />
              <span>👉 CLIQUE AQUI E ENTRE NO GRUPO VIP DA RIFA 👈</span>
            </a>
          </div>
        </div>
      </section>

      {/* Section 4: Why Join the VIP Group (Requested section exactly as image mockup) */}
      <section className="py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              PORQUE ENTRAR NO GRUPO VIP
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-medium">
              — sempre surge uma oportunidade de você garantir a peça que falta na sua coleção.
            </p>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded"></div>
          </div>

          {/* Floating Benefit Pills as requested */}
          <div className="space-y-4">
            
            {/* Benefit Row 1 */}
            <div className="flex items-center space-x-4 p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-amber-500/20 hover:bg-neutral-900/70 transition duration-300">
              <span className="text-2xl flex-shrink-0 leading-none" role="img" aria-label="presente">🎁</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-neutral-200">
                Acesso antecipado às rifas antes de abrir para o público geral
              </p>
            </div>

            {/* Benefit Row 2 */}
            <div className="flex items-center space-x-4 p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-amber-500/20 hover:bg-neutral-900/70 transition duration-300">
              <span className="text-2xl flex-shrink-0 leading-none" role="img" aria-label="dinheiro">💰</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-neutral-200">
                Ofertas exclusivas apenas para membros do grupo
              </p>
            </div>

            {/* Benefit Row 3 */}
            <div className="flex items-center space-x-4 p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-amber-500/20 hover:bg-neutral-900/70 transition duration-300">
              <span className="text-2xl flex-shrink-0 leading-none" role="img" aria-label="raio">⚡</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-neutral-200">
                Premiações diárias e dezenas promocionais limitadas
              </p>
            </div>

            {/* Benefit Row 4 */}
            <div className="flex items-center space-x-4 p-5 rounded-xl bg-neutral-900/40 border border-emerald-950 hover:border-emerald-500/20 hover:bg-neutral-900/70 transition duration-300">
              <span className="text-2xl flex-shrink-0 leading-none" role="img" aria-label="caixa">📦</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-neutral-100">
                Transparência total — envios reais, comprovantes e suporte imediato
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Styled Authentic Footer (Contains Terms and Owner login trigger) */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-10 text-neutral-500 text-[10px] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">


          <p className="max-w-md mx-auto leading-relaxed text-neutral-600">
            {config.termsAndConditions || DEFAULT_CONFIG.termsAndConditions}
          </p>

          <p className="text-neutral-700">
            © {new Date().getFullYear()} – Rancho do Churrasqueiro - RC Facas. Todos os Direitos Reservados.
          </p>

          {/* Quick administrative toggle at footer to protect but easily customize */}
          <div className="pt-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[9px] text-neutral-700 hover:text-amber-500/50 hover:underline inline-flex items-center space-x-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 mr-1" />
              <span>Painel de Controle Administrativo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal for Knife Photos */}
      {selectedKnifeUrl && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-955/95 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedKnifeUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center">
            <button 
              className="absolute -top-12 right-0 bg-neutral-900 hover:bg-[#1a1a1a] text-neutral-200 border border-neutral-800 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition cursor-pointer"
              onClick={() => setSelectedKnifeUrl(null)}
            >
              ✕ FECHAR
            </button>
            <img 
              src={selectedKnifeUrl} 
              alt="Visualização da Faca" 
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-neutral-800"
              referrerPolicy="no-referrer"
            />
            <p className="text-center text-xs text-neutral-400 font-bold uppercase tracking-widest mt-4">
              ✓ Imagem em alta definição de luxo — Clique em qualquer lugar para fechar
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Popups/Modals */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        leads={leads}
        onClearLeads={handleClearLeads}
        onDeleteLead={handleDeleteLead}
        onAddSampleLeads={handleAddSampleLeads}
      />
    </div>
  );
}
