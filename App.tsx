
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  CheckCircle, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Rocket, 
  Lightbulb, 
  Code, 
  Smartphone, 
  MapPin, 
  Mail, 
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  Heart
} from 'lucide-react';
import ModuleGallery from './components/ModuleGallery';
import TemplateGallery from './components/TemplateGallery';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [siteLogo, setSiteLogo] = useState<string>('');

  const loadBranding = () => {
    const savedLogo = localStorage.getItem('fareapp_site_logo');
    setSiteLogo(savedLogo || '');
  };

  useEffect(() => {
    loadBranding();
    
    const handleUpdate = () => {
      loadBranding();
    };
    
    window.addEventListener('fareapp_data_updated', handleUpdate);
    return () => window.removeEventListener('fareapp_data_updated', handleUpdate);
  }, []);

  const LogoComponent = () => (
    <div className="flex items-center group">
      <div className={`rounded-xl shadow-lg transition-transform group-hover:scale-110 overflow-hidden flex items-center justify-center ${siteLogo ? 'bg-transparent' : 'bg-blue-600 p-2 shadow-blue-500/20'}`}>
        {siteLogo ? (
          <img src={siteLogo} alt="Logo Fare App" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        ) : (
          <Smartphone className="text-white w-5 h-5 md:w-6 md:h-6" />
        )}
      </div>
      <span className="ml-2 md:ml-3 text-lg md:text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
        Fare<span className="text-blue-600">App.it</span>
      </span>
    </div>
  );

  const FooterLogoComponent = () => (
    <div className="flex items-center group">
      <div className={`rounded-xl shadow-lg transition-transform group-hover:scale-110 overflow-hidden flex items-center justify-center ${siteLogo ? 'bg-transparent' : 'bg-blue-600 p-2 shadow-blue-500/40'}`}>
        {siteLogo ? (
          <img src={siteLogo} alt="Logo Fare App" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        ) : (
          <Smartphone className="text-white w-5 h-5 md:w-6 md:h-6" />
        )}
      </div>
      <span className="ml-2 md:ml-3 text-lg md:text-xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">
        Fare<span className="text-blue-500">App.it</span>
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center group">
              <LogoComponent />
            </a>
          </div>
          <div className="hidden lg:flex space-x-8 font-medium text-gray-600">
            <a href="#perche" className="hover:text-blue-600 transition-colors">Perché un'App?</a>
            <a href="#processo" className="hover:text-blue-600 transition-colors">Il Processo</a>
            <a href="#moduli" className="hover:text-blue-600 transition-colors">Moduli</a>
            <a href="#template" className="hover:text-blue-600 transition-colors">Template</a>
          </div>
          <a href="https://fareapp.it/contatti" className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5">
            Richiedi Preventivo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-48 md:pb-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 md:w-96 md:h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-10 duration-700 text-center md:text-left">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 border border-blue-100">
              <Zap size={14} className="mr-2 fill-blue-600" /> Agenzia Sviluppo Mobile
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Sviluppiamo App <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Native e Vincenti</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed mx-auto md:mx-0">
              Trasforma la tua idea in un business digitale. Realizziamo applicazioni iOS e Android su misura, progettate per vendere e fidelizzare.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start pt-2">
              <a href="https://fareapp.it/preventivo" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center hover:bg-blue-700 transition-all group shadow-xl shadow-blue-200 hover:-translate-y-1">
                Inizia il Progetto <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://fareapp.it/portfolio" className="bg-white border-2 border-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center shadow-sm hover:shadow-md">
                Vedi Portfolio
              </a>
            </div>
            <div className="pt-4 flex items-center justify-center md:justify-start gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><Smartphone size={14}/> iOS & Android</span>
              <span className="flex items-center gap-1"><Rocket size={14}/> Pubblicazione Inclusa</span>
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right-10 duration-700 mt-8 md:mt-0 px-4 md:px-0">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-200/40 to-indigo-100/40 rounded-full blur-[80px]"></div>
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800" 
              alt="Fare App Mobile Development" 
              className="rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-[8px] md:border-[12px] border-white w-full max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-2 md:-left-12 bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-[160px] md:max-w-[200px] border border-gray-50">
              <div className="flex items-center space-x-2 text-green-500 mb-1 md:mb-2">
                <CheckCircle size={18} className="fill-green-100" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight text-gray-900">Risultati Reali</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-tight">Le nostre App aumentano il fatturato medio del +30%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Why an App? */}
      <section id="perche" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Perché scegliere Fare App?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">Un'App non è solo tecnologia, è un nuovo modo di relazionarsi con i propri clienti.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <CheckCircle />, title: "Fidelizzazione Diretta", desc: "Comunica con i tuoi clienti tramite notifiche push personalizzate e geolocalizzate.", color: "indigo" },
              { icon: <Globe />, title: "Performance Native", desc: "Sviluppiamo con tecnologie native per garantire la massima velocità e fluidità su ogni dispositivo.", color: "blue" },
              { icon: <ShieldCheck />, title: "Supporto Totale", desc: "Ti seguiamo dalla progettazione grafica fino alla manutenzione post-lancio sugli store.", color: "green" }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 md:p-10 rounded-3xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
                <div className={`bg-blue-50 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 md:mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                  {React.cloneElement(feature.icon as React.ReactElement<{ size?: number }>, { size: 32 })}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Gallery */}
      <ModuleGallery />

      {/* The Process Section */}
      <section id="processo" className="py-16 md:py-24 bg-gray-900 text-white overflow-hidden scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
            <div className="flex-1 space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight text-center md:text-left">Come realizziamo la tua <span className="text-blue-400">Strategia Mobile.</span></h2>
              <div className="space-y-8 md:space-y-12">
                {[
                  { icon: <Lightbulb />, step: "01", title: "Analisi e Brainstorming", text: "Definiamo insieme gli obiettivi e le funzionalità chiave per il successo della tua app." },
                  { icon: <Code />, step: "02", title: "Sviluppo e Design", text: "I nostri designer e programmatori danno vita all'interfaccia e al cuore pulsante dell'applicazione." },
                  { icon: <Rocket />, step: "03", title: "Pubblicazione e Lancio", text: "Gestiamo l'intero processo di approvazione sugli store Apple e Android." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start group">
                    <div className="bg-blue-600 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                      {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold text-[10px] md:text-sm mb-1 uppercase tracking-widest">Fase {item.step}</div>
                      <h4 className="text-lg md:text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-sm md:text-base text-gray-400 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative mt-8 md:mt-0">
               <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-[60px] md:blur-[100px]"></div>
               <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" 
                alt="Business Team working on App" 
                className="rounded-[2.5rem] md:rounded-[3rem] shadow-3xl relative z-10 border-4 border-white/10 w-full max-w-lg mx-auto"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Business Visual Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 overflow-hidden relative flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 flex-1 space-y-4 md:space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Porta la tua azienda <br className="hidden md:block"/>ovunque, sempre.</h2>
              <p className="text-blue-100 text-base md:text-xl max-w-lg mx-auto md:mx-0">
                Non perdere l'opportunità di essere presente nel posto dove i tuoi clienti passano più tempo: il loro smartphone.
              </p>
              <div className="pt-2 md:pt-4">
                 <a href="https://fareapp.it/contatti" className="bg-white text-blue-600 px-6 py-4 md:px-10 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-gray-100 transition-all inline-block shadow-2xl shadow-blue-900/40 transform hover:-translate-y-1">
                  Parliamo del tuo Progetto
                 </a>
              </div>
            </div>
            <div className="relative z-10 flex-1 w-full max-w-md">
               <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800" 
                alt="Business Success" 
                className="rounded-3xl shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/20 w-full"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <TemplateGallery />

      {/* Footer */}
      <footer id="contatti" className="bg-gray-900 text-white pt-16 md:pt-24 pb-12 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6 md:space-y-8">
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <FooterLogoComponent />
              </a>
            </div>
            <p className="text-gray-300 max-w-md text-base md:text-lg leading-relaxed">
              Specialisti nello sviluppo di applicazioni mobili professionali per PMI, E-commerce e liberi professionisti. Creiamo valore digitale attraverso l'innovazione mobile.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 text-white border border-white/10">
                <Facebook size={20}/>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-tr hover:from-orange-500 hover:to-purple-600 transition-all hover:scale-110 text-white border border-white/10">
                <Instagram size={20}/>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110 text-white border border-white/10">
                <Linkedin size={20}/>
              </a>
            </div>
          </div>
          <div className="md:border-l md:border-white/10 md:pl-12">
            <h4 className="font-bold text-lg md:text-xl mb-6 md:mb-8 text-white uppercase tracking-tight">Soluzioni</h4>
            <ul className="space-y-3 md:space-y-4 text-gray-300">
              <li><a href="https://fareapp.it/ristorazione" className="hover:text-blue-400 transition-colors">App Ristorazione</a></li>
              <li><a href="https://fareapp.it/ecommerce" className="hover:text-blue-400 transition-colors">App E-commerce</a></li>
              <li><a href="https://fareapp.it/booking" className="hover:text-blue-400 transition-colors">App Prenotazioni</a></li>
              <li><a href="https://fareapp.it/personalizzate" className="hover:text-blue-400 transition-colors">App Personalizzate</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg md:text-xl mb-6 md:mb-8 text-white uppercase tracking-tight">Contatti</h4>
            <div className="space-y-4 text-gray-300 text-sm md:text-base">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg"><MapPin size={18} className="text-blue-400 flex-shrink-0" /></div>
                <p>Via delle Terme, 1<br/><span className="text-gray-400 text-xs">03043 - Cassino (FR)</span></p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg"><Mail size={18} className="text-blue-400 flex-shrink-0" /></div>
                <a href="mailto:info@fareapp.it" className="hover:text-blue-400 transition-colors">info@fareapp.it</a>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg"><Phone size={18} className="text-blue-400 flex-shrink-0" /></div>
                <a href="tel:07761805710" className="hover:text-blue-400 transition-colors text-nowrap">0776.1805710</a>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg"><Globe size={18} className="text-blue-400 flex-shrink-0" /></div>
                <a href="https://fareapp.it/" className="hover:text-blue-400 underline decoration-blue-500/30">fareapp.it</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 pt-10 md:pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 text-gray-400 text-xs md:text-sm">
          <div className="text-center lg:text-left leading-relaxed">
            &copy; 2026 <span className="text-white font-bold">FareApp.it</span> - Tutti i diritti riservati.<br/>
            <span className="text-gray-500 block mt-2">
              FareApp.it è un marchio di <a href="https://promoweb.me" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">PromoWeb</a> - Via delle Terme, 1 - 03043 - Cassino (FR) - info@promoweb.me - P. Iva 03145220608
            </span>
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-1.5 text-[10px] md:text-xs font-medium text-gray-400 tracking-wide uppercase">
              Realizzato con <Heart size={10} className="text-red-600 fill-red-600" /> in <span className="flex items-center gap-1">Italia <img src="https://flagcdn.com/w20/it.png" alt="Bandiera Italiana" className="w-4 h-auto rounded-sm" /></span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-blue-400 transition-colors group border-b border-transparent hover:border-blue-500/30 px-2 py-1"
            >
              <Lock size={12} className="group-hover:scale-110 transition-transform" /> Area Admin
            </button>
            <div className="flex gap-4 md:gap-8">
              <a href="https://fareapp.it/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="https://fareapp.it/cookies" className="hover:text-white transition-colors">Cookies</a>
              <a href="https://fareapp.it/termini" className="hover:text-white transition-colors">Termini</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot />

      {/* Admin Panel Modal */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
};

export default App;
