
import React, { useState, useEffect } from 'react';
import { Settings, X, Lock, CheckCircle2, Image as ImageIcon, Bot, Link as LinkIcon, Loader2, AlertTriangle, Smartphone, Trash2, Plus, Upload, Camera, Copy, Globe, Server, HardDrive, ShoppingBag, Apple } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION, geminiService } from '../services/geminiService';
import { TEMPLATES as DEFAULT_TEMPLATES, SITE_LOGO, GLOBAL_APP_STORE, GLOBAL_PLAY_STORE } from '../constants';
import { Template } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_ADMIN = {
  email: 'info@fareapp.it',
  password: '123456'
};

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/demo/image/upload";
const UPLOAD_PRESET = "docs_upload_example_us_preset";

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'login' | 'editor' | 'templates' | 'branding' | 'publish'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [siteLogo, setSiteLogo] = useState<string>('');
  const [playStoreUrl, setPlayStoreUrl] = useState<string>('');
  const [appStoreUrl, setAppStoreUrl] = useState<string>('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [globalUploading, setGlobalUploading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedPrompt = localStorage.getItem('fareapp_chatbot_prompt');
      setPrompt(savedPrompt || DEFAULT_SYSTEM_INSTRUCTION);

      const savedTemplates = localStorage.getItem('fareapp_templates');
      if (savedTemplates) {
        const parsed: Template[] = JSON.parse(savedTemplates);
        const cleaned = parsed.map(t => {
          if (t.image && t.image.startsWith('blob:')) {
            const def = DEFAULT_TEMPLATES.find(dt => dt.id === t.id);
            return { ...t, image: def ? def.image : 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800' };
          }
          return t;
        });
        setTemplates(cleaned);
      } else {
        setTemplates(DEFAULT_TEMPLATES);
      }

      const savedLogo = localStorage.getItem('fareapp_site_logo');
      setSiteLogo(savedLogo && !savedLogo.startsWith('blob:') ? savedLogo : SITE_LOGO);
      
      setPlayStoreUrl(localStorage.getItem('fareapp_play_store_url') || GLOBAL_PLAY_STORE);
      setAppStoreUrl(localStorage.getItem('fareapp_app_store_url') || GLOBAL_APP_STORE);
      
      setView('login');
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      setView('editor');
    } else {
      setLoginError(true);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return null;
    }
  };

  const persistChanges = () => {
    localStorage.setItem('fareapp_templates', JSON.stringify(templates));
    localStorage.setItem('fareapp_chatbot_prompt', prompt);
    localStorage.setItem('fareapp_site_logo', siteLogo);
    localStorage.setItem('fareapp_play_store_url', playStoreUrl);
    localStorage.setItem('fareapp_app_store_url', appStoreUrl);
    window.dispatchEvent(new Event('fareapp_data_updated'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const updateTemplateField = (id: string, field: keyof Template, value: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      updateTemplateField(id, 'image', localUrl);
      setUploadingId(id);
      const publicUrl = await uploadToCloudinary(file);
      if (publicUrl) updateTemplateField(id, 'image', publicUrl);
      setUploadingId(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setSiteLogo(localUrl);
      setGlobalUploading(true);
      const publicUrl = await uploadToCloudinary(file);
      if (publicUrl) setSiteLogo(publicUrl);
      setGlobalUploading(false);
    }
  };

  const hasBlobs = () => {
    return templates.some(t => t.image.startsWith('blob:')) || siteLogo.startsWith('blob:');
  };

  const generateConfigCode = () => {
    return JSON.stringify({ templates, siteLogo, playStoreUrl, appStoreUrl, prompt }, null, 2);
  };

  const copyConfigCode = () => {
    if (hasBlobs()) {
      alert("ATTENZIONE: Alcune immagini sono ancora in fase di caricamento online (pallino arancione). Attendi che diventino verdi prima di copiare il codice!");
      return;
    }
    navigator.clipboard.writeText(generateConfigCode());
    alert("Codice SYNC copiato! Incollamelo ora nella chat per completare la pubblicazione.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {view === 'login' ? (
          <div className="max-w-md mx-auto w-full py-24 px-6 text-center">
             <div className="bg-gray-950 p-12 rounded-[3rem] text-white">
                <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20"><Lock size={40} /></div>
                <h2 className="text-3xl font-black mb-2">Accesso Admin</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Sync Engine v18.5</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Email" required />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Password" required />
                  {loginError && <p className="text-red-400 text-xs font-bold">Accesso negato</p>}
                  <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all">SBLOCCA</button>
                </form>
                <button onClick={onClose} className="mt-8 text-gray-500 hover:text-white text-xs font-bold transition-colors">Chiudi</button>
             </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-950 p-6 text-white flex flex-col md:flex-row gap-6 justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <div className="bg-blue-600 p-3 rounded-2xl"><Settings size={24} /></div>
                <nav className="flex bg-white/5 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                  {[
                    {id: 'editor', label: 'Chatbot'},
                    {id: 'templates', label: 'Schede App'},
                    {id: 'branding', label: 'Identità'},
                    {id: 'publish', label: 'Pubblica'}
                  ].map((v) => (
                    <button key={v.id} onClick={() => setView(v.id as any)} className={`px-6 py-3 rounded-xl text-xs font-black transition-all uppercase whitespace-nowrap ${view === v.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                      {v.id === 'publish' && <Globe size={14} className="inline mr-2" />}
                      {v.label}
                    </button>
                  ))}
                </nav>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-3 rounded-full text-gray-400 hover:text-white transition-colors"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-12">
              {view === 'templates' && (
                <div className="max-w-6xl mx-auto space-y-10">
                  <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div>
                      <h3 className="text-3xl font-black text-gray-900">Portfolio App</h3>
                      <p className="text-gray-500 font-medium">Gestisci le immagini e i link agli store per ogni progetto.</p>
                    </div>
                    <button onClick={() => setTemplates(prev => [...prev, { id: Date.now().toString(), name: 'Nuova App', category: 'Settore', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', description: '', playStoreUrl: '', appStoreUrl: '' }])} className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase hover:bg-blue-700 shadow-xl flex items-center gap-3">
                      <Plus size={20} /> NUOVA APP
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {templates.map((t) => (
                      <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col sm:flex-row gap-8 relative">
                        <button onClick={() => removeTemplate(t.id)} className="absolute -top-3 -right-3 p-4 bg-red-600 text-white rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform"><Trash2 size={24} /></button>
                        
                        <div className="w-full sm:w-44 aspect-[9/18.5] bg-gray-100 rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shrink-0 relative group">
                          <img src={t.image} className="w-full h-full object-cover" alt="" />
                          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${uploadingId === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                             {uploadingId === t.id ? <Loader2 size={32} className="animate-spin text-white" /> : <Camera size={40} className="text-white" />}
                          </div>
                          <div className={`absolute bottom-4 left-4 p-2 rounded-full shadow-lg ${t.image.startsWith('blob:') ? 'bg-orange-500 animate-pulse' : 'bg-green-500'} text-white`}>
                             {t.image.startsWith('blob:') ? <HardDrive size={12} /> : <CheckCircle2 size={12} />}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <label className={`w-full bg-blue-600 text-white p-4 rounded-xl font-black text-[11px] text-center cursor-pointer hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 ${uploadingId ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload size={16} /> CARICA MOCKUP
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTemplateUpload(e, t.id)} disabled={!!uploadingId} />
                          </label>
                          <div className="space-y-3 pt-2 border-t border-gray-100">
                            <input value={t.name} onChange={(e) => updateTemplateField(t.id, 'name', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-black outline-none focus:bg-white border border-transparent focus:border-blue-100" placeholder="Nome App" />
                            <input value={t.category} onChange={(e) => updateTemplateField(t.id, 'category', e.target.value)} className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl text-xs font-black outline-none" placeholder="Categoria" />
                            
                            {/* Campi Store Links */}
                            <div className="grid grid-cols-1 gap-2">
                               <div className="relative">
                                  <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={16} />
                                  <input value={t.playStoreUrl || ''} onChange={(e) => updateTemplateField(t.id, 'playStoreUrl', e.target.value)} className="w-full pl-12 p-3 bg-gray-50 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-green-200" placeholder="Link Play Store (Android)" />
                               </div>
                               <div className="relative">
                                  <Apple className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800" size={16} />
                                  <input value={t.appStoreUrl || ''} onChange={(e) => updateTemplateField(t.id, 'appStoreUrl', e.target.value)} className="w-full pl-12 p-3 bg-gray-50 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-gray-200" placeholder="Link App Store (iOS)" />
                               </div>
                            </div>

                            <textarea value={t.description || ''} onChange={(e) => updateTemplateField(t.id, 'description', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl text-[10px] h-16 resize-none outline-none" placeholder="Breve descrizione..." />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'publish' && (
                <div className="max-w-4xl mx-auto">
                   <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border-4 border-green-500/10">
                      <div className="flex items-center gap-8 mb-10">
                         <div className="bg-green-500 p-6 rounded-[2rem] text-white shadow-xl shadow-green-200"><Server size={48} /></div>
                         <div>
                            <h3 className="text-4xl font-black text-gray-900 leading-tight">Pubblicazione</h3>
                            <p className="text-gray-500 text-lg font-medium">Assicurati che tutti i mockup abbiano il pallino verde.</p>
                         </div>
                      </div>
                      
                      <div className={`p-10 rounded-[3rem] mb-12 shadow-2xl transition-all duration-500 ${hasBlobs() ? 'bg-orange-50 border-4 border-orange-500/30' : 'bg-gray-950'}`}>
                         {hasBlobs() ? (
                           <div className="text-center space-y-6 py-8">
                              <AlertTriangle size={64} className="text-orange-500 mx-auto animate-bounce" />
                              <h4 className="text-2xl font-black text-orange-900 uppercase">Attendere Sync...</h4>
                              <p className="text-orange-700 font-medium">Alcuni file sono ancora "locali". Attendi il caricamento cloud per copiare il codice definitivo.</p>
                           </div>
                         ) : (
                           <div className="text-center space-y-8">
                             <div className="flex justify-center -space-x-4">
                                {templates.slice(0, 5).map((t, idx) => (
                                  <div key={idx} className="w-16 h-16 rounded-full border-4 border-gray-900 overflow-hidden shadow-xl bg-white scale-110">
                                    <img src={t.image} className="w-full h-full object-cover" alt="" />
                                  </div>
                                ))}
                             </div>
                             <p className="text-blue-400 text-xs font-black uppercase tracking-[0.4em]">Ready for Global Sync</p>
                             <button onClick={copyConfigCode} className="w-full bg-green-500 text-white py-8 rounded-3xl font-black text-2xl uppercase flex items-center justify-center gap-4 hover:bg-green-600 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                                <Copy size={32} /> COPIA CODICE SYNC
                             </button>
                           </div>
                         )}
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-4">Configurazione Generata</label>
                        <textarea readOnly value={generateConfigCode()} className="w-full h-64 p-8 bg-gray-50 border border-gray-200 text-gray-800 font-mono text-xs rounded-[2.5rem] outline-none shadow-inner resize-none" />
                      </div>
                   </div>
                </div>
              )}

              {view === 'branding' && (
                <div className="max-w-3xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-black mb-10 flex items-center gap-3"><ImageIcon className="text-blue-600" /> Logo Aziendale</h3>
                  <div className="flex flex-col md:flex-row items-center gap-10 p-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-56 h-56 bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 border-2 border-white overflow-hidden relative group">
                      <img src={siteLogo} className="w-full h-full object-contain" alt="Logo" />
                      {globalUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-blue-600" /></div>}
                      <div className={`absolute top-4 right-4 p-2 rounded-full ${siteLogo.startsWith('blob:') ? 'bg-orange-500' : 'bg-green-500'} text-white`}>
                         {siteLogo.startsWith('blob:') ? <HardDrive size={16} /> : <CheckCircle2 size={16} />}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <label className={`w-full bg-blue-600 text-white p-6 rounded-2xl font-black text-center cursor-pointer hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-3 ${globalUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload size={24} /> CAMBIA LOGO
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Store Links Globali</label>
                        <input value={playStoreUrl} onChange={(e) => setPlayStoreUrl(e.target.value)} className="w-full p-4 bg-white border rounded-xl text-xs font-bold" placeholder="Play Store Global URL" />
                        <input value={appStoreUrl} onChange={(e) => setAppStoreUrl(e.target.value)} className="w-full p-4 bg-white border rounded-xl text-xs font-bold" placeholder="App Store Global URL" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {view === 'editor' && (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                  <div className="flex items-center gap-8 mb-10">
                     <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-200"><Bot size={48} /></div>
                     <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Consulente Zap</h3>
                        <p className="text-gray-400 font-medium">Modifica le istruzioni dell'intelligenza artificiale.</p>
                     </div>
                  </div>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-[450px] p-10 bg-gray-50 border border-gray-100 rounded-[3rem] text-sm font-mono focus:bg-white transition-all outline-none leading-relaxed" />
                </div>
              )}
            </div>

            <div className="p-10 bg-white border-t flex items-center justify-between shrink-0">
              <button onClick={() => { if(window.confirm('Reset?')){ localStorage.clear(); window.location.reload(); } }} className="text-gray-300 hover:text-red-500 text-[10px] font-black uppercase tracking-widest px-4 py-2">Reset</button>
              <div className="flex items-center gap-6">
                <button onClick={onClose} className="px-10 py-5 text-gray-500 font-black text-sm uppercase tracking-widest hover:text-gray-900 transition-colors">Chiudi</button>
                <button onClick={persistChanges} className="bg-blue-600 text-white px-20 py-6 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-4">
                  {isSaved ? <CheckCircle2 size={28} /> : <Settings size={28} />}
                  {isSaved ? 'MODIFICHE SALVATE' : 'SALVA TUTTO'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
