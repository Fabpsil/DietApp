import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

// --- COMPONENTE DE GESTOS (SWIPE & LONG PRESS) ---
const SwipeableItem = ({ item, onClick, onLongPress, onSwipeLeft, onSwipeRight, children }) => {
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const pressTimer = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    // Inicia o timer do clique longo (600ms)
    pressTimer.current = setTimeout(() => {
      onLongPress();
      setTranslateX(0); // Reseta o swipe se ativou o long press
    }, 600);
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    // Cancela o clique longo se o dedo mexer mais de 10px (é um arraste, não um clique segurado)
    if (Math.abs(diff) > 10) clearTimeout(pressTimer.current);
    
    // Limita o arraste a 80px para os lados
    if (diff > 80) setTranslateX(80);
    else if (diff < -80) setTranslateX(-80);
    else setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
    if (translateX > 50) onSwipeRight(); // Da Esquerda p/ Direita -> Deleta
    else if (translateX < -50) onSwipeLeft(); // Da Direita p/ Esquerda -> Edita
    else if (Math.abs(translateX) < 10) onClick(); // Foi só um clique normal
    
    setTranslateX(0); // Volta pro lugar
  };

  return (
    <div className="swipe-container">
      <div className="swipe-actions">
        <div className="delete-action"><i className="fas fa-trash"></i> Deletar</div>
        <div className="edit-action"><i className="fas fa-edit"></i> Editar</div>
      </div>
      <div 
        className={`swipe-content ${item.ok ? 'completed' : ''}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DO APP ---
export default function DashboardCasal() {
  // Configuração do Tema persistente
  const [temaEscuro, setTemaEscuro] = useState(() => localStorage.getItem('tema') === 'dark');
  const [abaAtiva, setAbaAtiva] = useState('Home');
  const [perfilAtivoId, setPerfilAtivoId] = useState(1);
  
  // Modais
  const [modalLembrete, setModalLembrete] = useState(false);
  const [modalDetalhe, setModalDetalhe] = useState(null); // Guarda o item clicado

  // Perfis
  const [perfis, setPerfis] = useState([
    { id: 1, nome: 'Ele', idade: 37, peso: 86, altura: 1.75, saude: 'Fibromialgia, Artrose, Fascite', xp: 120, foto: '👨' },
    { id: 2, nome: 'Ela', idade: 30, peso: 60, altura: 1.57, saude: 'SOP, Inflamação no Ciático', xp: 350, foto: '👩' }
  ]);
  
  const perfilAtivo = perfis.find(p => p.id === perfilAtivoId);

  // Banco de Alternativas (Substituição de Refeições)
  const bancoSubstituicoes = {
    'Almoço': { titulo: 'Frango com Purê', desc: '1 Filé de frango grelhado + Purê de abóbora. Mesmo valor calórico.', cal: 340 },
    'Lanche': { titulo: 'Iogurte com Cacau', desc: 'Iogurte zero açúcar com gotas de chocolate 70%.', cal: 150 }
  };

  const [tarefas, setTarefas] = useState([
    { id: 1, hora: '08:00', titulo: 'Café da Manhã', desc: 'Pão Francês sem miolo + 2 ovos', receita: 'Retire o miolo do pão para reduzir o índice glicêmico. Frite os ovos com mínimo de gordura. Adicione canela ao café.', tipo: 'Café', cor: 'var(--warning)', icone: 'fa-sun', ok: false, xp: 20 },
    { id: 2, hora: '13:00', titulo: 'Almoço (Volume Alto)', desc: '2 col de arroz + Iscas de Carne + Salada', receita: 'Refogue a carne patinho em iscas. O segredo é encher metade do prato de salada para dar saciedade e não subir a glicose da SOP.', tipo: 'Almoço', cor: 'var(--success)', icone: 'fa-leaf', ok: false, xp: 30 },
    { id: 3, hora: '16:00', titulo: 'Lanche Anti-Ansiedade', desc: 'Mingau de Aveia com Canela', receita: 'Aqueça leite desnatado, 2 col de aveia e adoçante. A temperatura quente e a canela enganam o cérebro tirando a fissura por doce.', tipo: 'Lanche', cor: 'var(--danger)', icone: 'fa-cookie-bite', ok: false, xp: 50 }
  ]);

  // Aplica o tema
  useEffect(() => {
    localStorage.setItem('tema', temaEscuro ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', temaEscuro ? 'dark' : 'light');
  }, [temaEscuro]);

  // Ações de Swipe e Clique
  const deletarItem = (id, setLista) => {
    if(window.confirm("Deseja deletar este item?")) {
      setLista(prev => prev.filter(item => item.id !== id));
    }
  };

  const editarItem = (item) => {
    alert(`Modo de edição para: ${item.titulo || item.item}`);
    // Futuro: Abrir formulário de edição pré-preenchido
  };

  const alternarConclusao = (id, xp) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, ok: !t.ok } : t));
    const isOk = tarefas.find(t => t.id === id).ok;
    setPerfis(perfis.map(p => p.id === perfilAtivoId ? { ...p, xp: p.xp + (isOk ? -xp : xp) } : p));
  };

  const substituirRefeicao = () => {
    const alternativa = bancoSubstituicoes[modalDetalhe.tipo];
    if(alternativa) {
      setTarefas(tarefas.map(t => t.id === modalDetalhe.id ? { ...t, titulo: alternativa.titulo, desc: alternativa.desc } : t));
      setModalDetalhe(null);
      alert('Refeição substituída por uma opção equivalente!');
    } else {
      alert('Nenhuma substituição cadastrada para este horário no momento.');
    }
  };

  // Funções do Perfil
  const calcularIMC = (peso, altura) => (peso / (altura * altura)).toFixed(1);

  return (
    <div className="app-wrapper" data-theme={temaEscuro ? 'dark' : 'light'}>
      <div className="neu-container" style={{ paddingBottom: '90px' }}>
        
        {/* HEADER TOP */}
        <div className="header-top">
          <div className="avatar-circle" onClick={() => setPerfilAtivoId(perfilAtivoId === 1 ? 2 : 1)}>
            {perfilAtivo.foto}
          </div>
          <div style={{ flex: 1, marginLeft: '15px' }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Bom dia, {perfilAtivo.nome}!</h4>
            <h2 style={{ margin: '5px 0', fontSize: '1.4em' }}>
              Nível {Math.floor(perfilAtivo.xp / 100) + 1} <span style={{ color: 'var(--warning)' }}>⭐ {perfilAtivo.xp} XP</span>
            </h2>
          </div>
        </div>

        {/* =========================================
            ABA 1: HOME / TIMELINE
        ========================================= */}
        {abaAtiva === 'Home' && (
          <>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Tarefas de Hoje 
              <button className="neu-btn" style={{ padding: '5px 15px', color: 'var(--primary)', fontSize: '0.9em' }} onClick={() => setModalLembrete(true)}>+ Add</button>
            </h3>
            <p style={{ fontSize: '0.8em', color: 'var(--text-muted)', textAlign: 'center' }}>
              Toque longo para concluir • Arraste ⬅ para editar • Arraste ➡ para deletar
            </p>

            <div className="timeline-container">
              {tarefas.map(tarefa => (
                <div className="timeline-item" key={tarefa.id}>
                  <div className="timeline-dot" style={{ borderColor: tarefa.cor }}></div>
                  
                  <SwipeableItem 
                    item={tarefa}
                    onClick={() => setModalDetalhe(tarefa)} // Abre Modal
                    onLongPress={() => alternarConclusao(tarefa.id, tarefa.xp)} // Conclui
                    onSwipeRight={() => deletarItem(tarefa.id, setTarefas)} // Deleta
                    onSwipeLeft={() => editarItem(tarefa)} // Edita
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ color: tarefa.cor, fontWeight: 'bold', fontSize: '0.85em', marginBottom: '5px' }}>
                        {tarefa.hora} • +{tarefa.xp} XP
                      </div>
                      <h4 style={{ margin: '0 0 5px 0', textDecoration: tarefa.ok ? 'line-through' : 'none' }}>{tarefa.titulo}</h4>
                      <p style={{ margin: 0, fontSize: '0.85em', color: 'var(--text-muted)' }}>{tarefa.desc}</p>
                    </div>
                    <div className="avatar-circle" style={{ width: '40px', height: '40px', color: tarefa.cor }}>
                      <i className={`fas ${tarefa.icone}`}></i>
                    </div>
                  </SwipeableItem>

                </div>
              ))}
            </div>
          </>
        )}

        {/* =========================================
            ABA 2: PERFIL (NOVO)
        ========================================= */}
        {abaAtiva === 'Perfil' && (
          <>
            <h2 style={{ textAlign: 'center' }}>Meu Perfil</h2>
            
            <div className="neu-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Tema Escuro</span>
              <input type="checkbox" className="toggle-switch" checked={temaEscuro} onChange={() => setTemaEscuro(!temaEscuro)} />
            </div>

            <div className="neu-card">
              <h3 style={{ marginTop: 0 }}>Dados Físicos</h3>
              <div className="profile-grid">
                <div className="stat-box">
                  <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>Peso (kg)</span><br/>
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{perfilAtivo.peso}</span>
                </div>
                <div className="stat-box highlight">
                  <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>IMC Atual</span><br/>
                  <span style={{ fontSize: '1.5em' }}>{calcularIMC(perfilAtivo.peso, perfilAtivo.altura)}</span>
                </div>
              </div>
              
              <div className="neu-input" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>Condições de Saúde:</span><br/>
                <strong style={{ color: 'var(--danger)' }}>{perfilAtivo.saude}</strong>
              </div>
            </div>

            <div className="neu-card">
              <h3 style={{ marginTop: 0 }}>Evolução & Exames</h3>
              <div className="upload-area">
                <i className="fas fa-camera" style={{ fontSize: '2em', marginBottom: '10px' }}></i>
                <p style={{ margin: 0 }}>Adicionar Foto de Evolução ou Exame (Simulação)</p>
              </div>
              <div className="gallery-grid">
                <div className="stat-box" style={{ padding: '10px', fontSize: '0.8em' }}>Exame Sangue<br/>12/10</div>
                <div className="stat-box" style={{ padding: '10px', fontSize: '0.8em' }}>Foto Frente<br/>10/10</div>
                <div className="stat-box" style={{ padding: '10px', fontSize: '0.8em', color: 'var(--primary)' }}><i className="fas fa-plus"></i></div>
              </div>
            </div>
            
            <button className="neu-btn" style={{ width: '100%' }}>
              <i className="fas fa-user-plus"></i> Criar Novo Perfil
            </button>
          </>
        )}

        {/* =========================================
            MODAL DE DETALHES DA TAREFA/REFEIÇÃO
        ========================================= */}
        {modalDetalhe && (
          <div className="modal-overlay" onClick={() => setModalDetalhe(null)}>
            <div className="neu-card modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: modalDetalhe.cor }}>{modalDetalhe.hora}</h2>
                <button className="neu-btn" style={{ padding: '8px', color: 'var(--danger)' }} onClick={() => setModalDetalhe(null)}><i className="fas fa-times"></i></button>
              </div>
              
              <h3 style={{ marginTop: '10px' }}>{modalDetalhe.titulo}</h3>
              <p><strong>Descrição:</strong> {modalDetalhe.desc}</p>
              
              {modalDetalhe.receita && (
                <div className="recipe-box">
                  <strong><i className="fas fa-utensils"></i> Receita / Instruções:</strong><br/>
                  {modalDetalhe.receita}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="neu-btn" 
                  style={{ flex: 1, color: modalDetalhe.ok ? 'var(--text-muted)' : 'var(--success)' }}
                  onClick={() => { alternarConclusao(modalDetalhe.id, modalDetalhe.xp); setModalDetalhe(null); }}
                >
                  <i className="fas fa-check"></i> {modalDetalhe.ok ? 'Desmarcar' : 'Concluir'}
                </button>
                
                {modalDetalhe.tipo && (
                  <button className="neu-btn" style={{ flex: 1, color: 'var(--primary)' }} onClick={substituirRefeicao}>
                    <i className="fas fa-exchange-alt"></i> Substituir
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            MODAL DE ADICIONAR LEMBRETE FUNCIONAL
        ========================================= */}
        {modalLembrete && (
          <div className="modal-overlay">
            <div className="neu-card" style={{ width: '90%', maxWidth: '400px' }}>
              <h3 style={{ marginTop: 0 }}>Adicionar Novo Lembrete</h3>
              <input type="text" id="novoTitulo" placeholder="Título (ex: Tomar Remédio)" className="neu-input" />
              <input type="time" id="novaHora" className="neu-input" defaultValue="12:00" />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="neu-btn" style={{ flex: 1, color: 'var(--danger)' }} onClick={() => setModalLembrete(false)}>Cancelar</button>
                <button className="neu-btn" style={{ flex: 1, color: 'var(--primary)' }} onClick={() => {
                  const titulo = document.getElementById('novoTitulo').value;
                  const hora = document.getElementById('novaHora').value;
                  if(titulo) {
                    setTarefas([...tarefas, { id: Date.now(), hora, titulo, desc: 'Lembrete Personalizado', cor: 'var(--primary)', icone: 'fa-bell', ok: false, xp: 10 }]);
                    setModalLembrete(false);
                  }
                }}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BOTTOM */}
        <div className="bottom-nav">
          <div className={`nav-item ${abaAtiva === 'Home' ? 'active' : ''}`} onClick={() => setAbaAtiva('Home')}>
            <i className="fas fa-home"></i> Tarefas
          </div>
          {/* Pode adicionar aqui seus botões antigos de Compras e Dieta */}
          <div className={`nav-item ${abaAtiva === 'Perfil' ? 'active' : ''}`} onClick={() => setAbaAtiva('Perfil')}>
            <i className="fas fa-user"></i> Perfil
          </div>
        </div>

      </div>
    </div>
  );
}
