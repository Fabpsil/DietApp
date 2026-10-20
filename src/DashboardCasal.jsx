import { useState, useEffect } from 'react';
// Certifique-se de ter configurado o firebase como nas etapas anteriores
import { db } from './firebase'; 
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Importa o arquivo de estilos Neumórficos
import './Dashboard.css';

export default function DashboardCasal() {
  const [perfilAtivo, setPerfilAtivo] = useState('Ele'); 
  const [abaAtiva, setAbaAtiva] = useState('Diario'); 
  
  const [peso, setPeso] = useState('');
  const [agua, setAgua] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [refeicaoLivre, setRefeicaoLivre] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  const [historico, setHistorico] = useState([]);

  const metas = {
    Ele: { pesoInicial: 86, meta: 71 },
    Ela: { pesoInicial: 60, meta: 45 }
  };

  const hoje = new Date().toISOString().split('T')[0];
  const docId = `${hoje}_${perfilAtivo}`;

  useEffect(() => {
    const carregarDadosHoje = async () => {
      try {
        const docRef = doc(db, 'registrosDiarios', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dados = docSnap.data();
          setPeso(dados.pesoAtual || '');
          setAgua(dados.aguaLitros || '');
          setSintomas(dados.sintomas || '');
          setRefeicaoLivre(dados.refeicaoLivre || false);
        } else {
          setPeso(''); setAgua(''); setSintomas(''); setRefeicaoLivre(false);
        }
      } catch (e) {
        console.error("Modo offline ativo ou erro de leitura", e);
      }
    };

    const carregarHistorico = async () => {
      try {
        const q = query(collection(db, 'registrosDiarios'), where('perfil', '==', perfilAtivo), orderBy('data', 'asc'));
        const querySnapshot = await getDocs(q);
        setHistorico(querySnapshot.docs.map(doc => doc.data()));
      } catch (e) {
        console.error("Modo offline ativo ou erro no histórico", e);
      }
    };

    carregarDadosHoje();
    if (abaAtiva === 'Graficos') carregarHistorico();
  }, [perfilAtivo, docId, abaAtiva]);

  const salvarRegistro = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await setDoc(doc(db, 'registrosDiarios', docId), {
        data: hoje,
        perfil: perfilAtivo,
        pesoAtual: parseFloat(peso),
        aguaLitros: parseFloat(agua),
        sintomas: sintomas,
        refeicaoLivre: refeicaoLivre,
        atualizadoEm: new Date()
      }, { merge: true });
      alert('Sincronizado! 🚀');
    } catch (error) {
      alert("Salvo offline. Será enviado quando a internet voltar.");
    }
    setSalvando(false);
  };

  const progressoKg = metas[perfilAtivo].pesoInicial - (parseFloat(peso) || metas[perfilAtivo].pesoInicial);

  return (
    <div className="neu-container">
      <h2 className="neu-title">Metas Casal</h2>
      
      {/* Seletor de Perfil Neumórfico */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className={`neu-btn ${perfilAtivo === 'Ele' ? 'active-ele' : ''}`} 
          style={{ flex: 1 }}
          onClick={() => setPerfilAtivo('Ele')}
        >
          👨 Ele
        </button>
        <button 
          className={`neu-btn ${perfilAtivo === 'Ela' ? 'active-ela' : ''}`} 
          style={{ flex: 1 }}
          onClick={() => setPerfilAtivo('Ela')}
        >
          👩 Ela
        </button>
      </div>

      {/* Abas Neumórficas afundadas */}
      <div className="neu-tabs">
        <div 
          className={`neu-tab ${abaAtiva === 'Diario' ? 'active' : ''}`} 
          onClick={() => setAbaAtiva('Diario')}
        >
          Diário
        </div>
        <div 
          className={`neu-tab ${abaAtiva === 'Graficos' ? 'active' : ''}`} 
          onClick={() => setAbaAtiva('Graficos')}
        >
          Progresso
        </div>
      </div>

      {/* Aba do Diário */}
      {abaAtiva === 'Diario' && (
        <div className="neu-content-fade">
          {/* Card de Progresso Saltado */}
          <div className="neu-card">
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Meta: {metas[perfilAtivo].meta} kg</h3>
            <p style={{ margin: 0, fontSize: '1.2em' }}>
              Eliminados: <strong style={{ color: progressoKg > 0 ? 'var(--success-color)' : 'var(--text-main)' }}>
                {progressoKg > 0 ? progressoKg.toFixed(1) : 0} kg
              </strong>
            </p>
          </div>

          <form onSubmit={salvarRegistro}>
            
            {/* Box Afundado para "Sair da dieta" */}
            <div className="neu-toggle-box">
              <span style={{ fontSize: '0.9em', fontWeight: 'bold' }}>🍔 Furo na Dieta hoje?</span>
              <button 
                type="button" 
                onClick={() => setRefeicaoLivre(!refeicaoLivre)} 
                className="neu-btn"
                style={{ padding: '10px 15px', color: refeicaoLivre ? 'var(--danger-color)' : 'var(--text-muted)' }}
              >
                {refeicaoLivre ? 'Desmarcar' : 'Registrar'}
              </button>
            </div>

            <div className="neu-form-group">
              <label className="neu-label">Peso Hoje (kg)</label>
              <input 
                type="number" step="0.1" value={peso} 
                onChange={e => setPeso(e.target.value)} 
                className="neu-input" required 
                placeholder="Ex: 80.5"
              />
            </div>

            <div className="neu-form-group">
              <label className="neu-label">Água (Litros)</label>
              <input 
                type="number" step="0.1" value={agua} 
                onChange={e => setAgua(e.target.value)} 
                className="neu-input" 
                placeholder="Ex: 2.5"
              />
            </div>

            <div className="neu-form-group">
              <label className="neu-label">Sintomas (Dores, Ansiedade)</label>
              <textarea 
                value={sintomas} 
                onChange={e => setSintomas(e.target.value)} 
                className="neu-input" 
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Como estão a fascite e o ciático hoje?"
              />
            </div>

            <button type="submit" disabled={salvando} className="neu-btn neu-btn-save">
              {salvando ? 'Salvando...' : '✔️ Salvar Registro Diário'}
            </button>
          </form>
        </div>
      )}

      {/* Aba de Gráficos */}
      {abaAtiva === 'Graficos' && (
        <div className="neu-card" style={{ height: '350px', padding: '20px 10px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: 0 }}>Evolução de Peso</h3>
          {historico.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historico} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--shadow-dark)" opacity={0.3} />
                <XAxis dataKey="data" stroke="var(--text-muted)" fontSize={12} tickMargin={10} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', border: 'none', borderRadius: '10px', boxShadow: '5px 5px 10px var(--shadow-dark)' }}
                />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Line 
                  type="monotone" 
                  dataKey="pesoAtual" 
                  stroke={perfilAtivo === 'Ele' ? 'var(--ele-color)' : 'var(--ela-color)'} 
                  strokeWidth={4} 
                  name="Peso (kg)" 
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '50px' }}>
              Registrem dados para visualizar o gráfico.
            </p>
          )}
        </div>
      )}
    </div>
  );
}