
import React from 'react';
import { MODULES, ICON_MAP } from '../constants';

const ModuleGallery: React.FC = () => {
  return (
    <section id="moduli" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Moduli Professionali</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ogni business è unico. Per questo offriamo una vasta gamma di moduli specializzati per rendere la tua App potente e completa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MODULES.map((module) => (
            <div 
              key={module.id} 
              className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
            >
              <div className="mb-4 bg-blue-50 w-16 h-16 flex items-center justify-center rounded-xl">
                {ICON_MAP[module.icon]}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{module.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModuleGallery;
