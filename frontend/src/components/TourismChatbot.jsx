import { useState, useRef, useEffect } from 'react'

const WELCOME = '¡Hola! 👋 Soy tu guía virtual de turismo. Pregúntame sobre los lugares, actividades, restaurantes o lo que quieras saber del pueblo. 🌴'

export default function TourismChatbot({ town, places }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const generateResponse = (text, places, town) => {
    const q = text.toLowerCase()

    if (q.includes('playa') || q.includes('surf') || q.includes('mar') || q.includes('playa')) {
      const playas = places?.filter(p => p.category === 'PLAYA')
      if (playas?.length) return `🏖️ En ${town?.name} tenés ${playas.length} playas increíbles: ${playas.map(p => p.name).join(', ')}. ¡Perfectas para surf y relajarse!`
    }
    if (q.includes('comer') || q.includes('restaurante') || q.includes('comida') || q.includes('cena') || q.includes('almuerzo')) {
      const restos = places?.filter(p => p.category === 'RESTAURANTE' || p.category === 'GASTRONOMIA')
      if (restos?.length) return `🍽️ Para comer te recomiendo: ${restos.map(p => p.name).join(', ')}. ¡Todos con sabor tico auténtico!`
    }
    if (q.includes('hotel') || q.includes('hostal') || q.includes('dormir') || q.includes('alojamiento') || q.includes('hospedarse')) {
      const hoteles = places?.filter(p => p.category === 'HOTEL')
      if (hoteles?.length) return `🏨 Para hospedarte tenés: ${hoteles.map(p => p.name).join(', ')}. ¡Excelentes opciones para todos los presupuestos!`
    }
    if (q.includes('mirador') || q.includes('vista') || q.includes('foto') || q.includes('paisaje')) {
      const miradores = places?.filter(p => p.category === 'MIRADOR')
      if (miradores?.length) return `🏔️ Para las mejores vistas visitá: ${miradores.map(p => p.name).join(', ')}. ¡Las fotos van a quedar increíbles!`
    }
    if (q.includes('parque') || q.includes('naturaleza') || q.includes('animal') || q.includes('tortuga') || q.includes('mono')) {
      const parques = places?.filter(p => p.category === 'PARQUE')
      if (parques?.length) return `🌿 Para conectar con la naturaleza: ${parques.map(p => p.name).join(', ')}. ¡Flora y fauna únicas de Costa Rica!`
    }
    if (q.includes('cultural') || q.includes('museo') || q.includes('arte') || q.includes('historia')) {
      const cultural = places?.filter(p => p.category === 'CULTURAL' || p.category === 'MUSEO')
      if (cultural?.length) return `🎭 Para lo cultural e histórico: ${cultural.map(p => p.name).join(', ')}. ¡Una experiencia enriquecedora!`
    }
    if (q.includes('mercado') || q.includes('artesania') || q.includes('comprar') || q.includes('souvenir')) {
      const gastro = places?.filter(p => p.category === 'GASTRONOMIA')
      if (gastro?.length) return `🛍️ Para compras y gastronomía local: ${gastro.map(p => p.name).join(', ')}. ¡Los mejores productos de la zona!`
    }
    if (q.includes('hacer') || q.includes('actividad') || q.includes('visitar') || q.includes('hoy') || q.includes('recomienda')) {
      const categorias = [...new Set(places?.map(p => p.category) || [])]
      return `🗺️ En ${town?.name} podés: hacer surf en las playas, explorar miradores con vistas increíbles, disfrutar gastronomía local y conectar con la naturaleza. Tenemos ${places?.length || 0} lugares en ${categorias.length} categorías. ¿Qué te interesa más?`
    }
    if (q.includes('hola') || q.includes('buenos') || q.includes('buenas')) {
      return `¡Hola! 😊 Bienvenido a ${town?.name}, ${town?.province}. Soy tu guía virtual y estoy aquí para ayudarte a descubrir los mejores lugares del pueblo. ¿Qué te gustaría explorar?`
    }
    if (q.includes('gracias')) {
      return `¡Con mucho gusto! 🌴 Esperamos que disfrutes mucho tu visita a ${town?.name}. ¡Pura vida!`
    }
    if (q.includes('precio') || q.includes('costo') || q.includes('cuanto')) {
      return `💰 Los precios varían según el lugar. Te recomiendo consultar directamente en cada sitio. En general, ${town?.name} tiene opciones para todos los presupuestos. ¿Te ayudo a encontrar algo específico?`
    }
    if (q.includes('como llegar') || q.includes('transporte') || q.includes('bus') || q.includes('taxi')) {
      return `🚗 Para llegar a ${town?.name} podés tomar un bus desde San José o alquilar un auto. También hay taxis y shuttles disponibles. ¡El viaje vale la pena!`
    }

    const lugaresAleatorios = places?.slice(0, 3).map(p => p.name).join(', ')
    return `¡Buena pregunta! 🌴 ${town?.name} es un pueblo increíble con ${places?.length || 0} lugares para explorar como ${lugaresAleatorios || 'playas, restaurantes y más'}. ¿Te puedo ayudar con algo específico como playas, restaurantes, hoteles o actividades?`
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 700))

    const reply = generateResponse(text, places, town)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    '¿Qué puedo hacer hoy?',
    '¿Dónde comer?',
    '¿Cuáles son las mejores playas?',
  ]

  return (
    <>
      <style>{`
        .cb-fade-in { animation: cbFade 0.2s ease; }
        @keyframes cbFade { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .cb-msg-in { animation: cbMsgIn 0.25s ease; }
        @keyframes cbMsgIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .cb-input:focus { outline:none; border-color:#2F7C91 !important; box-shadow: 0 0 0 3px rgba(47,124,145,0.15); }
        .cb-send:hover { background:#0f5060 !important; }
        .cb-send:disabled { opacity:0.5; cursor:not-allowed; }
        .cb-fab:hover { transform:scale(1.08); box-shadow:0 8px 24px rgba(0,0,0,0.3) !important; }
        .cb-quick:hover { background:#e6f4f6 !important; border-color:#2F7C91 !important; color:#123C3A !important; }
        .cb-dot { width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:cbDot 1.2s infinite ease-in-out; }
        .cb-dot:nth-child(2){animation-delay:0.2s;} .cb-dot:nth-child(3){animation-delay:0.4s;}
        @keyframes cbDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
      `}</style>

      {/* FAB */}
      <button
        className="cb-fab"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 8888,
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #123C3A, #2F7C91)',
          color: 'white', fontSize: 24, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        title="Asistente de turismo"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Ventana del chat */}
      {open && (
        <div
          className="cb-fade-in"
          style={{
            position: 'fixed', bottom: 90, right: 24, zIndex: 8888,
            width: 340, height: 480, borderRadius: 16, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #123C3A, #2F7C91)',
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🌴</div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: 14 }}>
                Guía de {town?.name || 'Turismo'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: 11 }}>
                Asistente virtual · En línea
              </p>
            </div>
            <button
              onClick={() => setMessages([{ role: 'assistant', content: WELCOME }])}
              style={{
                marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none',
                color: 'rgba(255,255,255,0.7)', borderRadius: 6, padding: '3px 8px',
                fontSize: 11, cursor: 'pointer',
              }}
              title="Limpiar chat"
            >
              🗑️
            </button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} className="cb-msg-in" style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#123C3A,#2F7C91)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, marginRight: 7, marginTop: 2,
                  }}>🌴</div>
                )}
                <div style={{
                  maxWidth: '78%', padding: '9px 12px', borderRadius: msg.role === 'user'
                    ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg,#123C3A,#2F7C91)' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1e293b',
                  fontSize: 13, lineHeight: 1.5,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="cb-msg-in" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#123C3A,#2F7C91)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                }}>🌴</div>
                <div style={{
                  background: 'white', padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  <div className="cb-dot" /><div className="cb-dot" /><div className="cb-dot" />
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>SUGERENCIAS</p>
                {quickQuestions.map((q, i) => (
                  <button key={i} className="cb-quick"
                    onClick={() => { setInput(q); inputRef.current?.focus() }}
                    style={{
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
                      padding: '7px 11px', fontSize: 12, color: '#475569',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', background: 'white',
            borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, alignItems: 'flex-end',
            flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              className="cb-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu pregunta..."
              rows={1}
              style={{
                flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 10,
                padding: '9px 12px', fontSize: 13, fontFamily: 'inherit',
                resize: 'none', lineHeight: 1.4, maxHeight: 80, overflowY: 'auto',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            <button
              className="cb-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none',
                background: '#123C3A', color: 'white', fontSize: 16,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}