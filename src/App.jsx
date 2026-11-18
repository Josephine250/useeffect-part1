import { useState, useEffect } from 'react';

const page = { fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '20px auto', padding: 10 };
const card = { border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 16 };
const row = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 };
const label = { width: 180, fontWeight: 'bold' };
const input = { flex: 1, padding: 6 };

// A: examples that are not Effects (no outside system)
function PartA() {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [sent, setSent] = useState('');

  // 4. Pure calculation
  const isValid = email.includes('@');

  // 6. Pure calculation
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  // 5. Event handler
  function handleSend() {
    setSent('Email sent to ' + email);
  }

  return (
    <section style={card}>
      <h2> Not Effects</h2>

      <div style={row}>
        <span style={label}>4. Email check</span>
        <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        <span>{isValid ? 'Valid' : 'Not valid'}</span>
      </div>

      <div style={row}>
        <span style={label}>5. Send email</span>
        <button onClick={handleSend} disabled={!isValid}>Send</button>
        <span>{sent}</span>
      </div>

      <div style={row}>
        <span style={label}>6. Word count</span>
        <input style={input} value={text} onChange={(e) => setText(e.target.value)} />
        <span>Words: {words}</span>
      </div>
    </section>
  );
}

// B: Title Mirror
function TitleMirror() {
  const [text, setText] = useState('');

  useEffect(() => {
    document.title = text || 'Effects Lab';
  }, [text]);

  return (
    <section style={card}>
      
      <div style={row}>
        <span style={label}>Title Mirror</span>
        <input style={input} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    </section>
  );
}

// C: Saved Note
function SavedNote() {
  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem('note') ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('note', note);
    } catch {}
  }, [note]);

  return (
    <section style={card}>
      
      <div style={row}>
        <span style={label}>Saved Note</span>
        <input style={input} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
    </section>
  );
}

// D: Live Clock
function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={row}>
      <span style={label}>Live Clock</span>
      <span>{now.toLocaleTimeString()}</span>
    </div>
  );
}

export default function App() {
  const [showClock, setShowClock] = useState(true);

  return (
    <main style={page}>
      <h1>Effects Lab</h1>
      <PartA />
      <TitleMirror />
      <SavedNote />
      <section style={card}>
        
        {showClock && <LiveClock />}
        <button onClick={() => setShowClock((s) => !s)}>
          {showClock ? 'Hide' : 'Show'} clock
        </button>
      </section>
    </main>
  );
}