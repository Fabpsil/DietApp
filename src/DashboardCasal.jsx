import { useState, useEffect } from 'react';
import './Dashboard.css';

export default function DashboardCasal() {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('Home');
  const [perfilAtivo, setPerfilAtivo] = useState('Ele');
  const [modalLembrete, setModalLembrete] = useState(false);
  
  // Motor de Gamificação
  const [pontos, setPontos] = useState({ Ele: 120, Ela: 350 });
  
  // Receitas baseadas no "Guia de Nutrição e Receitas"
  const [receitas, setReceitas] = useState([
    { id: 1, titulo: 'Pão Francês Limpo', tempo: '5 min', tipo: 'Café da Manhã', cal: 210, icone: 'fa-bread-slice', desc: 'Pão francês sem miolo com ovos mexidos, azeite e orégano. Alta proteína.' },
    { id: 2, titulo: 'Iscas Aceboladas', tempo: '15 min', tipo: 'Almoço', cal: 350, icone: 'fa-drumstick-bite', desc: 'Carne moída refogada rápido com cenoura ralada. Servir com arroz e salada.' },
    { id: 3, titulo: 'Mingau Clássico', tempo: '5 min', tipo: 'Lanche', cal: 180, icone: 'fa-mug-hot', desc: 'Aveia, leite desnatado e adoçante aquecidos. Polvilhe muita canela para reduzir a ansiedade por doces.' },
    { id: 4, titulo: 'Macarrão Bolonhesa', tempo: '20 min', tipo: 'Jantar', cal: 380, icone: 'fa-bowl-food', desc: 'Massa sem glúten com carne moída magra. Refeição leve para não atrapalhar o sono.' }
  ]);

  // Lista de Compras
  const [compras, setCompras] = useState([
    { id: 1, item: 'Brócolis Ninja', ok: false },
    { id: 2, item: 'Pão de Forma Integral', ok: true },
    { id: 3, item: 'Iogurte Zero', ok: false },
  ]);

  // Timeline de Tarefas Diárias (Incluindo refeições e lembretes aleatórios)
  const [tarefas, setTarefas] = useState([
    { id: 1, hora: '08:00', titulo: 'Café da Manhã', desc: 'Ovos ou Iogurte com Chia', cor: 'var(--warning)', icone: 'fa-sun', ok: false, xp: 20 },
    { id: 2, hora: '10:00', titulo: 'Beber 500ml de Água', desc: 'A sede imita a fome!', cor: 'var(--primary)', icone: 'fa-droplet', ok: false, xp: 10 },
    { id: 3, hora: '13:00', titulo: 'Almoço (Volume Alto)', desc: '2 col de arroz + vegetais', cor: 'var(--success)', icone: 'fa-leaf', ok: false, xp: 30 },
    { id: 4, hora: '16:00', titulo: 'Alarme da Ansiedade', desc: 'Comer o Mingau Clássico', cor: 'var(--danger)', icone: 'fa-cookie-bite', ok: false, xp: 50 }
  ]);

  // Alterna o tema no CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaEscuro ? 'dark' : 'light');
  }, [temaEscuro]);

  const concluirTarefa = (id, xp) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, ok: !t.ok } : t));
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa.ok) {
      setPontos({...pontos, [perfilAtivo]: pontos[perfilAtivo] + xp});
    } else {
      setPontos({...pontos, [perfilAtivo]: pontos[perfilAtivo] - xp});
    }
  };

  const concluirCompra = (id) => {
    setCompras(compras.map(c => c.id === id ? { ...c, ok: !c.ok } : c));
  };

  const calcularNivel = (xp) => Math.floor(xp / 100) + 1;

  return (
    <div className="app-wrapper" data-theme={temaEscuro ? 'dark' : 'light'}>
      <div className="neu-container" style={{ paddingBottom: '90px' }}>
        
        {/* HEADER TOP (Image_7d5038) */}
        <div className="header-top">
          <div className="avatar-circle" onClick={() => setPerfilAtivo(perfilAtivo === 'Ele' ? 'Ela' : 'Ele')}>
            {perfilAtivo === 'Ele' ? '👨' : '👩'}
          </div>
          <div style={{ flex: 1, marginLeft: '15px' }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Bom dia, {perfilAtivo}!</h4>
            <h2 style={{ margin: '5px 0', fontSize: '1.4em' }}>
              Nível {calcularNivel(pontos[perfilAtivo])} <span style={{ color: 'var(--warning)' }}>⭐ {pontos[perfilAtivo]} XP</span>
            </h2>
          </div>
          <button className="neu-btn" style={{ padding: '10px' }} onClick={() => setTemaEscuro(!temaEscuro)}>
            <i className={`fas ${temaEscuro ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>

        {/* ABA: HOME / TIMELINE */}
        {abaAtiva === 'Home' && (
          <>
            <div className="neu-input" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <i className="fas fa-search" style={{ color: 'var(--text-muted)' }}></i>
              <input type="text" placeholder="Buscar tarefa ou refeição..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center' }}><div className="avatar-circle" style={{ margin: '0 auto 5px', color: 'var(--danger)' }}><i className="fas fa-clipboard-list"></i></div>A Fazer</div>
              <div style={{ textAlign: 'center' }}><div className="avatar-circle" style={{ margin: '0 auto 5px', color: 'var(--warning)' }}><i className="fas fa-spinner"></i></div>Em Progresso</div>
              <div style={{ textAlign: 'center' }}><div className="avatar-circle" style={{ margin: '0 auto 5px', color: 'var(--success)' }}><i className="fas fa-check-circle"></i></div>Concluídas</div>
            </div>

            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Tarefas de Hoje 
              <button className="neu-btn" style={{ padding: '5px 15px', color: 'var(--primary)', fontSize: '0.9em' }} onClick={() => setModalLembrete(true)}>+ Add</button>
            </h3>

            <div className="timeline-container">
              {tarefas.map(tarefa => (
                <div className="timeline-item" key={tarefa.id}>
                  <div className="timeline-dot" style={{ borderColor: tarefa.cor }}></div>
                  <div className={`timeline-card ${tarefa.ok ? 'completed' : ''}`} onClick={() => concluirTarefa(tarefa.id, tarefa.xp)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: tarefa.cor, fontWeight: 'bold', fontSize: '0.85em', marginBottom: '5px' }}>{tarefa.hora} • +{tarefa.xp} XP</div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{tarefa.titulo}</h4>
                      <p style={{ margin: 0, fontSize: '0.85em', color: 'var(--text-muted)' }}>{tarefa.desc}</p>
                    </div>
                    <div className="avatar-circle" style={{ width: '40px', height: '40px', color: tarefa.cor }}>
                      <i className={`fas ${tarefa.icone}`}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ABA: RECEITAS (Extraídas do PDF) */}
        {abaAtiva === 'Receitas' && (
          <>
            <h2 style={{ textAlign: 'center' }}>Guia Nutricional</h2>
            <button className="neu-btn" style={{ width: '100%', marginBottom: '20px', color: 'var(--success)' }}>
              <i className="fas fa-plus"></i> Adicionar Nova Receita
            </button>
            {receitas.map(rec => (
              <div className="neu-card" key={rec.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div className="avatar-circle" style={{ width: '60px', height: '60px', color: 'var(--primary)' }}>
                  <i className={`fas ${rec.icone}`}></i>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{rec.titulo}</h4>
                  <p style={{ margin: 0, fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    <i className="fas fa-clock"></i> {rec.tempo} • <i className="fas fa-fire"></i> {rec.cal} kcal • {rec.tipo}
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: '0.9em' }}>{rec.desc}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ABA: COMPRAS */}
        {abaAtiva === 'Compras' && (
          <>
            <h2 style={{ textAlign: 'center' }}>Lista de Compras</h2>
            <div className="neu-input" style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Adicionar item..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%' }} />
              <i className="fas fa-plus" style={{ color: 'var(--primary)', cursor: 'pointer' }}></i>
            </div>
            {compras.map(item => (
              <div className={`neu-card ${item.ok ? 'completed' : ''}`} key={item.id} onClick={() => concluirCompra(item.id)} style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', opacity: item.ok ? 0.5 : 1 }}>
                <i className={`far ${item.ok ? 'fa-check-square' : 'fa-square'}`} style={{ fontSize: '1.5em', color: item.ok ? 'var(--success)' : 'var(--text-muted)' }}></i>
                <span style={{ fontWeight: 'bold', textDecoration: item.ok ? 'line-through' : 'none' }}>{item.item}</span>
              </div>
            ))}
          </>
        )}

        {/* MODAL ADICIONAR LEMBRETE (Image_7ce740) */}
        {modalLembrete && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--glass)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="neu-card" style={{ width: '90%', maxWidth: '400px', margin: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0 }}>Adicionar Lembrete</h3>
                <input type="checkbox" className="toggle-switch" defaultChecked />
              </div>

              <div className="neu-segmented">
                <button className="active">Único</button>
                <button>Repetir</button>
                <button>Local...</button>
              </div>

              <div className="grid-circles">
                <button className="circle-btn"><i className="fas fa-sun" style={{ color: '#f7b731' }}></i> Hoje</button>
                <button className="circle-btn"><i className="fas fa-moon" style={{ color: '#4b7bec' }}></i> Tarde</button>
                <button className="circle-btn"><i className="fas fa-mug-hot" style={{ color: '#fc5c65' }}></i> Amanhã</button>
                <button className="circle-btn"><i className="fas fa-cloud-sun" style={{ color: '#a0aec0' }}></i> Próxima</button>
                <button className="circle-btn"><i className="fas fa-rainbow" style={{ color: '#20bf6b' }}></i> Algum Dia</button>
                <button className="circle-btn"><i className="fas fa-calendar-alt" style={{ color: '#4a5568' }}></i> Data</button>
              </div>

              <button className="neu-btn" style={{ width: '100%', marginTop: '30px', color: 'var(--primary)' }} onClick={() => setModalLembrete(false)}>
                Concluir
              </button>
            </div>
          </div>
        )}

        {/* NAVIGATION BOTTOM */}
        <div className="bottom-nav">
          <div className={`nav-item ${abaAtiva === 'Home' ? 'active' : ''}`} onClick={() => setAbaAtiva('Home')}>
            <i className="fas fa-home"></i> Tarefas
          </div>
          <div className={`nav-item ${abaAtiva === 'Receitas' ? 'active' : ''}`} onClick={() => setAbaAtiva('Receitas')}>
            <i className="fas fa-utensils"></i> Dieta
          </div>
          <div className={`nav-item ${abaAtiva === 'Compras' ? 'active' : ''}`} onClick={() => setAbaAtiva('Compras')}>
            <i className="fas fa-shopping-cart"></i> Compras
          </div>
          <div className={`nav-item ${abaAtiva === 'Estatisticas' ? 'active' : ''}`} onClick={() => setAbaAtiva('Estatisticas')}>
            <i className="fas fa-chart-pie"></i> Gráficos
          </div>
        </div>

      </div>
    </div>
  );
}
