import React, { useState } from "react";
import { 
  Settings, Users, Download, Trash2, X, Lock, Save, 
  RefreshCw, CheckCircle, FileSpreadsheet, Eye, Sliders 
} from "lucide-react";
import { Lead, AppConfig } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  leads: Lead[];
  onClearLeads: () => void;
  onDeleteLead: (id: string) => void;
  onAddSampleLeads: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  leads,
  onClearLeads,
  onDeleteLead,
  onAddSampleLeads,
}: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "settings">("leads");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit config state
  const [whatsappUrl, setWhatsappUrl] = useState(config.whatsappUrl);
  const [ticketPrice, setTicketPrice] = useState(config.ticketPrice);
  const [totalClients, setTotalClients] = useState(config.totalClients);
  const [activeRaffleTitle, setActiveRaffleTitle] = useState(config.activeRaffleTitle);
  const [activeRaffleDescription, setActiveRaffleDescription] = useState(config.activeRaffleDescription);
  const [hasSorteioDiario, setHasSorteioDiario] = useState(config.hasSorteioDiario);
  const [hasEnvioGarantido, setHasEnvioGarantido] = useState(config.hasEnvioGarantido);
  const [metaPixelId, setMetaPixelId] = useState(config.metaPixelId || "1382017203733797");
  const [metaAccessToken, setMetaAccessToken] = useState(config.metaAccessToken || "");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234" || password.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta! Use a senha padrão '1234'.");
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      whatsappUrl,
      ticketPrice,
      totalClients,
      activeRaffleTitle,
      activeRaffleDescription,
      hasSorteioDiario,
      hasEnvioGarantido,
      termsAndConditions: config.termsAndConditions,
      metaPixelId,
      metaAccessToken
    });
    setSuccessMsg("Configurações salvas com sucesso!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("Nenhum lead capturado para exportar.");
      return;
    }

    const headers = ["ID", "Data de Captura", "Nome", "WhatsApp", "E-mail"];
    const rows = leads.map((lead) => [
      lead.id,
      new Date(lead.capturedAt).toLocaleString("pt-BR"),
      lead.name,
      lead.phone,
      lead.email || "Não informado"
    ]);

    // Build standard CSV
    const csvContent = 
      "data:text/csv;charset=utf-8,\uFEFF" + // UTF-8 byte order mark
      [headers.join(";"), ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_arcanjo_cutelaria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-600/15 text-amber-500">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-neutral-100 font-sans">
                Painel Administrativo
              </h3>
              <p className="text-xs text-neutral-400">
                Gerencie seus leads e personalize os dados da página
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850 transition duration-150"
            aria-label="Minimizar ou fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-amber-600/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-medium text-neutral-200 mb-2">Login Requerido</h4>
            <p className="text-sm text-neutral-400 mb-6">
              Para ver os contatos dos clientes capturados e editar as informações, digite a senha de acesso rápido.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Digite a senha (padrão: 1234)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-lg placeholder:text-sm font-mono tracking-widest"
                  autoFocus
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">Dica para testes: use a senha <strong className="text-neutral-300">1234</strong></span>
              </div>
              
              {error && (
                <div className="p-2 rounded bg-red-950/40 border border-red-900/30 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold bg-amber-500 hover:bg-amber-600 text-neutral-950 transition duration-150 cursor-pointer text-sm"
              >
                Desbloquear Painel
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard Content */
          <>
            {/* Tabs */}
            <div className="flex border-b border-neutral-850 bg-neutral-950 px-4">
              <button
                onClick={() => setActiveTab("leads")}
                className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center space-x-2 transition duration-150 cursor-pointer ${
                  activeTab === "leads"
                    ? "border-amber-500 text-amber-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Leads Capturados ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center space-x-2 transition duration-150 cursor-pointer ${
                  activeTab === "settings"
                    ? "border-amber-500 text-amber-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Personalizar Página</span>
              </button>
            </div>

            {/* Panels */}
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
              
              {successMsg && (
                <div className="mb-4 p-3 rounded bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-sm flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {activeTab === "leads" ? (
                /* Tab : Leads Table */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-400">
                      Estes contatos foram capturados quando o cliente clicou para entrar no grupo vip.
                    </div>
                    <div className="flex items-center space-x-2">
                      {leads.length === 0 && (
                        <button
                          onClick={onAddSampleLeads}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700 transition duration-150 flex items-center space-x-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Adicionar Clientes Fictícios</span>
                        </button>
                      )}
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-neutral-950 transition duration-150 flex items-center space-x-1 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Exportar em Planilha (CSV)</span>
                      </button>
                    </div>
                  </div>

                  {leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-neutral-800 rounded-lg text-neutral-500 bg-neutral-950/20">
                      <Users className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-sm text-neutral-400">Sem leads capturados</p>
                      <p className="text-xs text-neutral-500 mt-1">Preencha o formulário na página inicial para testar a captação.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-neutral-800 rounded-lg bg-neutral-950/40">
                      <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-neutral-950 text-neutral-400 text-xs font-mono border-b border-neutral-800">
                          <tr>
                            <th className="py-3 px-4 font-normal">Data/Hora</th>
                            <th className="py-3 px-4 font-normal">Nome</th>
                            <th className="py-3 px-4 font-normal">WhatsApp</th>
                            <th className="py-3 px-4 font-normal">E-mail</th>
                            <th className="py-3 px-4 text-center font-normal w-16">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-850/50">
                          {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-neutral-800/40 transition duration-100">
                              <td className="py-3 px-4 text-xs font-mono text-neutral-500">
                                {new Date(lead.capturedAt).toLocaleString("pt-BR")}
                              </td>
                              <td className="py-3 px-4 font-medium text-neutral-200">
                                {lead.name}
                              </td>
                              <td className="py-3 px-4 font-mono text-amber-500">
                                <a 
                                  href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center space-x-1"
                                >
                                  <span>{lead.phone}</span>
                                </a>
                              </td>
                              <td className="py-3 px-4 text-xs text-neutral-400 font-mono">
                                {lead.email || <span className="italic text-neutral-605">Não informado</span>}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => onDeleteLead(lead.id)}
                                  className="p-1 rounded hover:bg-red-500/10 text-neutral-550 hover:text-red-400 transition"
                                  title="Deletar contato"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                    <span className="text-xs text-neutral-500 font-mono">
                      Filtrando contatos ativos de forma transparente
                    </span>
                    {leads.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja apagar TODOS os leads? Esta ação não pode ser desfeita.")) {
                            onClearLeads();
                          }
                        }}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-400 flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Apagar Banco de Dados Local</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab : Customizer Form */
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Link whats */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-neutral-400 flex items-center space-x-1">
                        <span>Link do WhatsApp do Grupo VIP (Redirecionamento final)</span>
                      </label>
                      <input
                        type="url"
                        value={whatsappUrl}
                        onChange={(e) => setWhatsappUrl(e.target.value)}
                        placeholder="https://chat.whatsapp.com/..."
                        required
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-sm"
                      />
                      <span className="text-[10px] text-neutral-500 block">
                        Este é o link oficial para onde as pessoas serão encaminhadas imediatamente após preencherem os dados na captura.
                      </span>
                    </div>

                    {/* Preço de Rifa */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400">
                        Preço inicial das Rifas (R$)
                      </label>
                      <input
                        type="text"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        placeholder="R$ 2,50"
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Total de Clientes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400">
                        Total de Clientes Ativos (Gatilho de Prova Social)
                      </label>
                      <input
                        type="text"
                        value={totalClients}
                        onChange={(e) => setTotalClients(e.target.value)}
                        placeholder="+2800 clientes ativos"
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Título de Faca Ativa */}
                    <div className="space-y-1.5 md:col-span-2 border-t border-neutral-800 pt-5 mt-2">
                      <h5 className="text-sm font-medium text-amber-500 mb-2">Próximo Sorteio em Evidência</h5>
                      
                      <label className="text-xs font-semibold text-neutral-400">
                        Título ou Prémio Principal
                      </label>
                      <input
                        type="text"
                        value={activeRaffleTitle}
                        onChange={(e) => setActiveRaffleTitle(e.target.value)}
                        placeholder="EX: Faca Gaúcha Damasco 10 Polegadas"
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Descrição de Faca Ativa */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-neutral-400">
                        Descrição das peças artesanais e detalhes
                      </label>
                      <textarea
                        value={activeRaffleDescription}
                        onChange={(e) => setActiveRaffleDescription(e.target.value)}
                        placeholder="Cabo híbrido em madeira exótica e resina, dorso mosqueado, bainha em couro bovino costurada à mão."
                        rows={3}
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    {/* Features flags */}
                    <div className="space-y-3 md:col-span-2 border-t border-neutral-800 pt-5">
                      <h5 className="text-sm font-medium text-neutral-300">Destaques Visuais rápidos</h5>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="sorteioDiario"
                          checked={hasSorteioDiario}
                          onChange={(e) => setHasSorteioDiario(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-neutral-950 border-neutral-800"
                        />
                        <label htmlFor="sorteioDiario" className="text-sm text-neutral-400 cursor-pointer">
                          Selo ativo: <strong className="text-neutral-100">Sorteios Diários</strong> na barra inicial
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="envioGarantido"
                          checked={hasEnvioGarantido}
                          onChange={(e) => setHasEnvioGarantido(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-neutral-950 border-neutral-800"
                        />
                        <label htmlFor="envioGarantido" className="text-sm text-neutral-400 cursor-pointer">
                          Selo ativo: <strong className="text-neutral-100">Envia para todo o Brasil</strong>
                        </label>
                      </div>
                    </div>

                    {/* Meta integration settings */}
                    <div className="space-y-4 md:col-span-2 border-t border-neutral-800 pt-5 mt-2">
                      <h5 className="text-sm font-medium text-amber-500 flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-emerald-500" />
                        <span>Configuração de Integração Meta (Pixel & Conversões)</span>
                      </h5>
                      <p className="text-xs text-neutral-400 leading-relaxed -mt-1.5">
                        Defina o ID do Pixel e o Token do usuário do sistema (Conversions API) para envio simultâneo e seguro de eventos pelo navegador e servidor.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-neutral-400 block">
                            Meta Pixel ID
                          </label>
                          <input
                            type="text"
                            value={metaPixelId}
                            onChange={(e) => setMetaPixelId(e.target.value)}
                            placeholder="1382017203733797"
                            className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-xs"
                          />
                          <span className="text-[10px] text-neutral-500 block">
                            Ex: 1382017203733797. Caso vazio, usará o Pixel padrão da conta.
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-neutral-400 block">
                            Token de Acesso da Conversões API (CAPI)
                          </label>
                          <input
                            type="password"
                            value={metaAccessToken}
                            onChange={(e) => setMetaAccessToken(e.target.value)}
                            placeholder="EAAW..."
                            className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-xs"
                          />
                          <span className="text-[10px] text-neutral-500 block">
                            Insira o Token de Acesso permanente Meta. Se em branco, usará a chave da variável de ambiente.
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800 pt-5">
                    <span className="text-xs text-neutral-500">
                      Após salvar, as modificações são refletidas ao vivo na visualização.
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded font-semibold bg-amber-500 hover:bg-amber-600 text-neutral-950 transition duration-150 flex items-center space-x-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Configuração</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom bar inside settings */}
            <div className="p-4 bg-neutral-950 text-neutral-400 border-t border-neutral-850 flex justify-between items-center text-xs">
              <span>Senha padrão: <strong className="text-amber-500 font-mono">1234</strong></span>
              <span className="text-[10px] text-neutral-500 font-mono">Modo Offline LocalStorage</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
