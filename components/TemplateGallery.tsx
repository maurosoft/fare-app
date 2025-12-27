
import React, { useState, useEffect } from 'react';
import { TEMPLATES as DEFAULT_TEMPLATES } from '../constants';
import { Template } from '../types';
import { Wifi, BatteryMedium, Signal, Smartphone, ExternalLink, Menu, Home, Search, ShoppingBag, User as UserIcon, Bell } from 'lucide-react';

const TemplateGallery: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [globalPlayStoreUrl, setGlobalPlayStoreUrl] = useState<string>('');
  const [globalAppStoreUrl, setGlobalAppStoreUrl] = useState<string>('');

  const loadSettings = () => {
    // Load Templates
    const savedTemplates = localStorage.getItem('fareapp_templates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error("Error parsing templates from localStorage", e);
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }

    // Load Global Store Links
    setGlobalPlayStoreUrl(localStorage.getItem('fareapp_play_store_url') || '');
    setGlobalAppStoreUrl(localStorage.getItem('fareapp_app_store_url') || '');
  };

  useEffect(() => {
    loadSettings();

    // Listen for custom event from AdminPanel
    const handleUpdate = () => {
      loadSettings();
    };
    
    window.addEventListener('fareapp_data_updated', handleUpdate);
    return () => window.removeEventListener('fareapp_data_updated', handleUpdate);
  }, []);

  const getDeviceStoreUrl = (template: Template) => {
    if (typeof window === 'undefined') return '#';
    
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);

    // Prioritize specific template link, then fallback to global branding link
    if (isIOS) {
      return template.appStoreUrl || globalAppStoreUrl || '#';
    }

    if (isAndroid) {
      return template.playStoreUrl || globalPlayStoreUrl || '#';
    }

    // Desktop default: pick any available specific link, then global
    return template.playStoreUrl || template.appStoreUrl || globalPlayStoreUrl || globalAppStoreUrl || '#';
  };

  const hasAnyLink = (template: Template) => {
    return template.playStoreUrl || template.appStoreUrl || globalPlayStoreUrl || globalAppStoreUrl;
  };

  return (
    <section id="template" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Smartphone size={14} className="text-blue-600" />
            <span>UI/UX Professionale Native</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">Ecco Alcune App</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ogni app realizzata da Fare App include un design curato nei minimi dettagli, con navigazione intuitiva e componenti nativi per un'esperienza fluida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="group flex flex-col items-center"
            >
              {/* Phone Frame Mockup */}
              <div className="relative w-full max-w-[280px] aspect-[9/18.5] bg-gray-900 rounded-[3rem] border-[10px] border-gray-800 shadow-2xl overflow-hidden transform group-hover:-translate-y-4 transition-all duration-500 ease-out ring-1 ring-gray-700">
                
                {/* Status Bar simulation */}
                <div className="absolute top-0 left-0 w-full h-8 flex justify-between items-center px-6 z-30 text-white/90">
                  <span className="text-[10px] font-bold">12:30</span>
                  <div className="flex items-center space-x-1 opacity-70">
                    <Signal size={10} />
                    <Wifi size={10} />
                    <BatteryMedium size={10} />
                  </div>
                </div>

                {/* Notch / Speaker Grill */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-800 rounded-b-3xl z-40 flex justify-center items-start pt-1">
                  <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
                </div>

                {/* SIMULATED APP UI HEADER */}
                <div className="absolute top-8 left-0 w-full h-12 bg-white/80 backdrop-blur-md z-30 flex items-center justify-between px-4 border-b border-gray-100">
                  <Menu size={18} className="text-gray-900" />
                  <span className="text-xs font-black tracking-tight text-gray-900 truncate max-w-[120px]">{template.name}</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <UserIcon size={14} className="text-blue-600" />
                  </div>
                </div>
                
                {/* Screen Content */}
                <div className="w-full h-full relative bg-gray-100 pt-20 pb-16">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-100 block"
                  />
                  
                  {/* Content Overlay - Card simulation */}
                  <div className="absolute inset-x-4 bottom-20 z-20">
                     <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 space-y-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{template.category}</p>
                              <h4 className="text-xs font-black text-gray-900 leading-tight">{template.name}</h4>
                           </div>
                           <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">
                          {template.description || "Benvenuto nell'app ufficiale. Scopri le ultime novità e prenota i tuoi servizi preferiti."}
                        </p>
                        <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-[9px] font-bold mt-2">SCOPRI DI PIÙ</button>
                     </div>
                  </div>

                  {/* PUBBLICATA Badge Link */}
                  {hasAnyLink(template) && (
                    <a 
                      href={getDeviceStoreUrl(template)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-24 right-3 bg-blue-600 text-white px-2 py-1.5 rounded-lg shadow-xl flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 hover:bg-blue-700 z-50 cursor-pointer"
                    >
                      <Smartphone size={12} className="text-white" />
                      <span className="text-[10px] font-black tracking-tighter uppercase flex items-center gap-1">
                        LIVE <ExternalLink size={8} />
                      </span>
                    </a>
                  )}
                </div>

                {/* SIMULATED APP UI BOTTOM NAV */}
                <div className="absolute bottom-0 left-0 w-full h-16 bg-white border-t border-gray-100 z-30 flex items-center justify-around px-2 pb-2">
                  <div className="flex flex-col items-center gap-1 text-blue-600">
                    <Home size={18} />
                    <span className="text-[8px] font-bold">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Search size={18} />
                    <span className="text-[8px] font-bold">Cerca</span>
                  </div>
                  <div className="bg-blue-600 text-white p-2 rounded-xl -mt-6 shadow-lg shadow-blue-200">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Bell size={18} />
                    <span className="text-[8px] font-bold">Avvisi</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <UserIcon size={18} />
                    <span className="text-[8px] font-bold">Profilo</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-200 rounded-full z-40"></div>
              </div>

              {/* Template Info (External to Mockup) */}
              <div className="mt-8 text-center space-y-2">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {template.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 p-10 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-100">
              <Smartphone className="text-white w-12 h-12" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-gray-900">Il Tuo Design, il Nostro Motore.</h4>
              <p className="text-gray-600 text-lg">Tutti i nostri mockup sono 100% personalizzabili con il tuo logo e i tuoi colori.</p>
            </div>
          </div>
          <a href="https://fareapp.it/contatti" className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200">
            Crea la tua App
          </a>
        </div>
      </div>
    </section>
  );
};

export default TemplateGallery;
