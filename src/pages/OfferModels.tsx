import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, ArrowLeft, ArrowRight } from 'lucide-react';

export function OfferModels() {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Alimentação',
      models: [
        { title: 'Combo Família', objetivo: 'Aumentar Ticket', estrutura: 'Produto Principal + Adicionais por Preço Fechado' },
        { title: 'Giro de Estoque', objetivo: 'Limpar Estoque', estrutura: 'Compre 1 e o segundo sai por X%' },
        { title: 'Entrega Facilitada', objetivo: 'Vender Hoje', estrutura: 'Frete Grátis acima de R$ X' }
      ]
    },
    {
      name: 'Serviços & Beleza',
      models: [
        { title: 'Agenda da Semana', objetivo: 'Lotar Agenda', estrutura: 'Últimos horários com bônus de X' },
        { title: 'Pacote de Manutenção', objetivo: 'Venda Recorrente', estrutura: 'Pacote mensal com % de vantagem' },
        { title: 'Serviço Premium', objetivo: 'Aumentar Ticket', estrutura: 'Combo Vip com tudo incluso' }
      ]
    },
    {
      name: 'Moda',
      models: [
        { title: 'Últimas Peças', objetivo: 'Limpar Estoque', estrutura: 'Grade furada com X% OFF' },
        { title: 'Look Completo', objetivo: 'Aumentar Ticket', estrutura: 'Compre a blusa e a calça sai por X' },
        { title: 'Coleção Nova', objetivo: 'Divulgar Novidade', estrutura: 'Brinde exclusivo nas 10 primeiras vendas' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/ofertas')} className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Library className="w-8 h-8 text-amber-500" />
            Modelos de Oferta
          </h1>
          <p className="text-lg text-zinc-400 mt-2">
            Estruturas validadas para você adaptar ao seu negócio.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map((category, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wide border-b border-zinc-800 pb-2">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.models.map((model, j) => (
                <div key={j} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-amber-400 uppercase tracking-tight mb-2">
                      {model.title}
                    </h3>
                    <div className="space-y-2 mb-6 text-sm">
                      <p className="text-zinc-300"><span className="text-zinc-500 font-bold uppercase text-xs">Objetivo:</span> {model.objetivo}</p>
                      <p className="text-zinc-300"><span className="text-zinc-500 font-bold uppercase text-xs">Estrutura:</span> {model.estrutura}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/ofertas/nova', { state: { template: model } })}
                    className="w-full bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Usar este modelo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
