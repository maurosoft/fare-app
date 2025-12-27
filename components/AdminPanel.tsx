
import React, { useState, useEffect, useRef } from 'react';
import { Settings, RotateCcw, X, Lock, CheckCircle2, Image as ImageIcon, Bot, Link as LinkIcon, Loader2, Pencil, Zap, AlertCircle, Smartphone, ExternalLink, Trash2, Plus, LayoutGrid, Info, HelpCircle, ChevronRight, RefreshCw, Upload, Camera } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION, geminiService } from '../services/geminiService';
import { TEMPLATES as DEFAULT_TEMPLATES } from '../constants';
import { Template } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_ADMIN = {
  email: 'info@fareapp.it',
  password: '123456'
};

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'login' | 'editor' | 'templates' | 'branding'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [siteLogo, setSiteLogo] = useState<string>('');
  const [playStoreUrl, setPlayStoreUrl] = useState<string>('');
  const [appStoreUrl, setAppStoreUrl] = useState<string>('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [keyInfo, setKeyInfo] = useState({ status: 'missing', length: 0, env: 'unknown' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const savedPrompt = localStorage.getItem('fareapp_chatbot_prompt') || DEFAULT_SYSTEM_INSTRUCTION;
      setPrompt(savedPrompt);
      
      const savedTemplates = localStorage.getItem('fareapp_templates');
      setTemplates(savedTemplates ? JSON.parse(savedTemplates) : DEFAULT_TEMPLATES);

      setSiteLogo(localStorage.getItem('fareapp_site_logo') || '');
      setPlayStoreUrl(localStorage.getItem('fareapp_play_store_url') || '');
      setAppStoreUrl(localStorage.getItem('fareapp_app_store_url') || '');
      
      setView('login');
      setTestStatus('idle');
      setTestMessage('');
      setKeyInfo(geminiService.getKeyStatus());
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

  const handleTestConnection = async () => {
    setTestStatus('loading');
    const result = await geminiService.testConnection();
    setTestStatus(result.success ? 'success' : 'error');
    setTestMessage(result.message);
    setKeyInfo(geminiService.getKeyStatus());
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateTemplateField(id, 'image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: 'Nuova App',
      category: 'Categoria',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800',
      description: 'Descrizione della nuova applicazione...',
      playStoreUrl: '',
      appStoreUrl: ''
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const removeTemplate = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa applicazione dalla galleria?")) {
      setTemplates(prev => prev.filter(item => item.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {view === 'login' ? (
          <div className="max-w-md mx-auto w-full py-24 px-6">
            <div className="bg-gray-950 p-10 rounded-[2.5rem] text-white">
              <div className="flex flex-col items-center gap-6 mb-10">
                <div className="bg-blue-600 p-5 rounded-2xl shadow-xl shadow-blue-500/20">
                  <Lock size={36} />
                </div>
                <h2 className="font-black text-3xl tracking-tight">Fare App Admin</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Build v15.0 Image Support</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Password" required />
                {loginError && <p className="text-red-400 text-xs font-bold text-center">Credenziali errate</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all">Accedi</button>
              </form>
              <button onClick={onClose} className="w-full mt-6 text-gray-500 hover:text-white text-xs font-bold text-center block">Annulla</button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-950 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2.5 rounded-xl"><Settings size={22} /></div>
                  <h2 className="font-black text-xl">Pannello Controllo</h2>
                </div>
                <nav className="flex bg-white/5 p-1 rounded-xl">
                  <button onClick={() => setView('editor')} className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all ${view === 'editor' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>ALEX AI</button>
                  <button onClick={() => setView('templates')} className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all ${view === 'templates' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>GALLERIA APP</button>
                  <button onClick={() => setView('branding')} className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all ${view === 'branding' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>LOGHI & LINK</button>
                </nav>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors text-gray-400 hover:text-white">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-10">
              
              {view === 'editor' && (
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl"><Bot size={32} /></div>
                          <div>
                            <h3 className="text-xl font-black text-gray-900">Configura Alex AI</h3>
                            <span className="text-[10px] font-black uppercase text-gray-400">Stato API: {keyInfo.status}</span>
                          </div>
                        </div>
                        <button onClick={handleTestConnection} disabled={testStatus === 'loading'} className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-[10px] uppercase bg-gray-900 text-white hover:bg-blue-600 transition-all">
                          {testStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                          TEST SISTEMA v15
                        </button>
                      </div>

                      {testStatus !== 'idle' && (
                         <div className={`mb-8 p-6 rounded-2xl border ${testStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                           <p className="text-sm font-medium leading-relaxed">{testMessage}</p>
                         </div>
                      )}

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Prompt Istruzioni</label>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-[300px] p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-2xl">
                      <h4 className="font-black text-lg mb-4 flex items-center gap-2"><RefreshCw size={22}/> Area Immagini</h4>
                      <p className="text-blue-100 text-xs leading-relaxed mb-6 font-medium">Ora puoi caricare le immagini direttamente:</p>
                      <ul className="space-y-4 text-[11px]">
                        <li className="flex gap-3">
                          <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                          <span>Vai in Galleria App</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                          <span>Clicca l'icona Fotocamera</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                          <span>Salva i dati per applicare</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {view === 'templates' && (
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm">
                    <h3 className="text-2xl font-black text-gray-900">Personalizza App Mockup</h3>
                    <button onClick={addNewTemplate} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase hover:bg-blue-700">
                      <Plus size={20} /> Aggiungi App
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {templates.map((t) => (
                      <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col sm:flex-row gap-8 relative overflow-visible">
                        
                        <button 
                          type="button"
                          onClick={() => removeTemplate(t.id)} 
                          className="absolute -top-3 -right-3 z-50 p-4 bg-red-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-4 border-white"
                        >
                          <Trash2 size={24} />
                        </button>
                        
                        <div className="w-full sm:w-44 aspect-[9/18.5] bg-gray-50 rounded-[2.5rem] overflow-hidden border shrink-0 relative group">
                          <img src={t.image} className="w-full h-full object-cover" alt="" />
                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, t.id)}
                            />
                            <div className="bg-white text-gray-900 p-4 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
                              <Camera size={28} />
                            </div>
                          </label>
                        </div>

                        <div className="flex-1 space-y-5">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Titolo Applicazione</label>
                            <input value={t.name} onChange={(e) => updateTemplateField(t.id, 'name', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm font-black" placeholder="Nome App" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Sottotitolo / Categoria</label>
                            <input value={t.category} onChange={(e) => updateTemplateField(t.id, 'category', e.target.value)} className="w-full p-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-black" placeholder="Categoria" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Descrizione di Vendita</label>
                            <textarea value={t.description || ''} onChange={(e) => updateTemplateField(t.id, 'description', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-[11px] h-24 resize-none" placeholder="Descrizione Marketing" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase block">Link Store</label>
                             <input value={t.playStoreUrl || ''} onChange={(e) => updateTemplateField(t.id, 'playStoreUrl', e.target.value)} className="w-full p-2.5 bg-gray-100 rounded-lg text-[10px]" placeholder="Link Android" />
                             <input value={t.appStoreUrl || ''} onChange={(e) => updateTemplateField(t.id, 'appStoreUrl', e.target.value)} className="w-full p-2.5 bg-gray-100 rounded-lg text-[10px]" placeholder="Link iOS" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'branding' && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="bg-white p-12 rounded-[3.5rem] shadow-xl space-y-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Logo Aziendale Principale</label>
                      <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-gray-50 rounded-[2.5rem]">
                        <div className="w-40 h-40 bg-white rounded-3xl shadow-inner flex items-center justify-center p-4 border overflow-hidden shrink-0">
                          {siteLogo ? (
                            <img src={siteLogo} className="w-full h-full object-contain" alt="Logo" />
                          ) : (
                            <ImageIcon size={48} className="text-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                          <label className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-center cursor-pointer hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-3">
                            <Upload size={22} />
                            CARICA NUOVO LOGO
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Oppure usa un URL esterno:</p>
                            <input value={siteLogo} onChange={(e) => setSiteLogo(e.target.value)} className="w-full p-4 bg-white border rounded-xl text-xs" placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Default Play Store</label>
                            <input value={playStoreUrl} onChange={(e) => setPlayStoreUrl(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Default App Store</label>
                            <input value={appStoreUrl} onChange={(e) => setAppStoreUrl(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl text-xs" />
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 bg-white border-t flex items-center justify-between">
              <button type="button" onClick={() => { if(window.confirm('Vuoi cancellare ogni personalizzazione e tornare ai dati originali?')){ localStorage.clear(); window.location.reload(); } }} className="text-gray-400 hover:text-red-600 text-[10px] font-black uppercase">Reset di Fabbrica</button>
              <div className="flex items-center gap-6">
                <button type="button" onClick={onClose} className="px-8 py-4 text-gray-500 font-black text-xs uppercase">Chiudi</button>
                <button type="button" onClick={persistChanges} className="bg-blue-600 text-white px-16 py-5 rounded-[1.5rem] font-black text-base shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-3">
                  {isSaved ? <CheckCircle2 size={22} /> : null}
                  {isSaved ? 'DATI SALVATI!' : 'SALVA TUTTO'}
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
