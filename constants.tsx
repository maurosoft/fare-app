
import React from 'react';
import { Layout, MessageSquare, ShoppingCart, CreditCard, Radio, FormInput, Bell, Share2, Globe, MapPin, Search, Smartphone } from 'lucide-react';
import { Module, Template } from './types';

export const SITE_LOGO = ""; 
export const GLOBAL_PLAY_STORE = "";
export const GLOBAL_APP_STORE = "";

export const MODULES: Module[] = [
  {
    id: 'push',
    title: 'Notifiche Push',
    description: 'Invia messaggi illimitati direttamente sugli smartphone dei tuoi clienti per promozioni e avvisi.',
    icon: 'bell'
  },
  {
    id: 'mcommerce',
    title: 'M-Commerce',
    description: 'Un vero negozio online nel palmo della mano. Gestisci ordini, prodotti e pagamenti sicuri.',
    icon: 'shopping-cart'
  },
  {
    id: 'loyalty',
    title: 'Fidelity Card',
    description: 'Digitalizza la raccolta punti. Fidelizza i tuoi clienti con premi e sconti esclusivi.',
    icon: 'credit-card'
  },
  {
    id: 'forms',
    title: 'Moduli Personalizzati',
    description: 'Crea form di contatto, prenotazione o sondaggi su misura per le tue esigenze aziendali.',
    icon: 'form-input'
  },
  {
    id: 'radio',
    title: 'Audio & Radio',
    description: 'Integra streaming audio live, podcast o playlist per intrattenere la tua community.',
    icon: 'radio'
  },
  {
    id: 'social',
    title: 'Integrazione Social',
    description: 'Collega i tuoi profili Facebook, Instagram e YouTube per una presenza cross-canale.',
    icon: 'share2'
  },
  {
    id: 'booking',
    title: 'Prenotazioni',
    description: 'Permetti ai clienti di prenotare appuntamenti, tavoli o servizi direttamente dall\'app.',
    icon: 'layout'
  },
  {
    id: 'directory',
    title: 'Directory & Mappe',
    description: 'Mostra i tuoi punti vendita o partner su una mappa interattiva con indicazioni stradali.',
    icon: 'map-pin'
  }
];

export const TEMPLATES: Template[] = [
  {
    "id": "1",
    "name": "Ristorante Elite",
    "category": "Food & Drink",
    "image": "https://images.unsplash.com/photo-1550966841-3ee32931de15?auto=format&fit=crop&q=80&w=800",
    "description": "Gestione tavoli, menu digitale e prenotazioni veloci."
  },
  {
    "id": "2",
    "name": "Gourmet Light",
    "category": "Food & Drink",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    "description": "Esperienza utente raffinata per alta cucina."
  },
  {
    "id": "3",
    "name": "Cafè Moderno",
    "category": "Food & Drink",
    "image": "https://images.unsplash.com/photo-1501339817302-ee4fba293ee8?auto=format&fit=crop&q=80&w=800",
    "description": "Ordini rapidi al bancone e programmi fedeltà."
  },
  {
    "id": "4",
    "name": "Bistrot Dark",
    "category": "Food & Drink",
    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    "description": "Interfaccia elegante con tema scuro."
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  'bell': <Bell className="w-8 h-8 text-blue-600" />,
  'shopping-cart': <ShoppingCart className="w-8 h-8 text-blue-600" />,
  'credit-card': <CreditCard className="w-8 h-8 text-blue-600" />,
  'form-input': <FormInput className="w-8 h-8 text-blue-600" />,
  'radio': <Radio className="w-8 h-8 text-blue-600" />,
  'share2': <Share2 className="w-8 h-8 text-blue-600" />,
  'layout': <Layout className="w-8 h-8 text-blue-600" />,
  'map-pin': <MapPin className="w-8 h-8 text-blue-600" />,
  'smartphone': <Smartphone className="w-8 h-8 text-blue-600" />
};
