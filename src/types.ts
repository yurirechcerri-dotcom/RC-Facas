export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  capturedAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  text: string;
  prizeWon?: string;
  avatarUrl?: string;
}

export interface AppConfig {
  whatsappUrl: string;
  ticketPrice: string;
  totalClients: string;
  activeRaffleTitle: string;
  activeRaffleDescription: string;
  hasSorteioDiario: boolean;
  hasEnvioGarantido: boolean;
  termsAndConditions: string;
  metaPixelId?: string;
  metaAccessToken?: string;
}
