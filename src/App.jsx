import { useState, useEffect } from 'react';

// ---------- light styling ----------
const page = { fontFamily: 'Arial, sans-serif', maxWidth: 650, margin: '20px auto', padding: 10 };
const section = { border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 12 };
const row = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 };
const label = { width: 150, fontWeight: 'bold' };
const input = { flex: 1, padding: 5 };
const tab = (active) => ({
  padding: '6px 14px',
  cursor: 'pointer',
  border: '1px solid #888',
  borderRadius: 4,
  background: active ? '#333' : 'white',
  color: active ? 'white' : 'black',
});

/* ---------------- ASSIGNMENT 1: Effects Lab ---------------- */

function PartA() {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [sent, setSent] = useState('');

  const isValid = email.includes('@'); // pure calculation
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length; // pure calculation

  function handleSend() { // event handler
    setSent('Email sent to ' + email);
  }

  return (
    <div style={section}>
      <h3>Part A: Not Effects</h3>
      <div style={row}>
        <span style={label}>Email check</span>
        <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        <span>{isValid ? 'Valid' : 'Not valid'}</span>
      </div>
      <div style={row}>
        <span style={label}>Send email</span>
        <button onClick={handleSend} disabled={!isValid}>Send</button>
        <span>{sent}</span>
      </div>
      <div style={row}>
        <span style={label}>Word count</span>
        <input style={input} value={text} onChange={(e) => setText(e.target.value)} />
        <span>Words: {words}</span>
      </div>
    </div>
  );
}

function TitleMirror() {
  const [text, setText] = useState('');

  useEffect(() => {
    document.title = text || 'Effects Lab';
  }, [text]);

  return (
    <div style={section}>
      <h3>Part B: Title Mirror</h3>
      <div style={row}>
        <span style={label}>Title Mirror</span>
        <input style={input} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    </div>
  );
}

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
    <div style={section}>
      <h3>Part C: Saved Note</h3>
      <div style={row}>
        <span style={label}>Saved Note</span>
        <input style={input} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{now.toLocaleTimeString()}</span>;
}

function ClockPart() {
  const [show, setShow] = useState(true);
  return (
    <div style={section}>
      <h3>Part D: Live Clock</h3>
      <div style={row}>
        <span style={label}>Live Clock</span>
        {show && <LiveClock />}
        <button onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
      </div>
    </div>
  );
}

function EffectsLab() {
  return (
    <div>
      <h2>Effects Lab</h2>
      <PartA />
      <TitleMirror />
      <SavedNote />
      <ClockPart />
    </div>
  );
}

/* ---------------- FIX THE LEAKY EFFECTS ---------------- */

// Round A: when roomId changes, Console prints: disconnect (old), then connect (new)
function ChatRoom({ roomId }) {
  useEffect(() => {
    console.log('connect', roomId);
    return () => console.log('disconnect', roomId);
  }, [roomId]);

  return <span>Connected to: {roomId}</span>;
}

// Round B: fix = clearInterval in cleanup
function Ticker() {
  useEffect(() => {
    const id = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>Ticking (see Console)</span>;
}

// Round C: fix = same named function in add and remove
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <span>{width}px</span>;
}

// Round D: fix = functional update (no stale closure)
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{count}</span>;
}

// Round E: AbortController + loading/error UI
function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [userId]);

  if (loading) return <p>Loading user {userId}...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <div style={row}><span style={label}>Name</span><span>{user.name}</span></div>
      <div style={row}><span style={label}>Email</span><span>{user.email}</span></div>
      <div style={row}><span style={label}>Phone</span><span>{user.phone}</span></div>
      <div style={row}><span style={label}>City</span><span>{user.address.city}</span></div>
      <div style={row}><span style={label}>Company</span><span>{user.company.name}</span></div>
    </div>
  );
}

function HideShow({ title, name, children }) {
  const [show, setShow] = useState(true);
  return (
    <div style={section}>
      <h3>{title}</h3>
      <div style={row}>
        <span style={label}>{name}</span>
        {show && children}
        <button onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
      </div>
    </div>
  );
}

function FixLeakyEffects() {
  const [roomId, setRoomId] = useState('general');
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <h2>Fix the leaky effects</h2>

      <div style={section}>
        <h3>Round A: Cleanup order</h3>
        <div style={row}>
          <span style={label}>Room</span>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option>general</option>
            <option>music</option>
            <option>travel</option>
          </select>
          <ChatRoom roomId={roomId} />
        </div>
      </div>

      <HideShow title="Round B: Ticker" name="Ticker">
        <Ticker />
      </HideShow>

      <HideShow title="Round C: Resize listener" name="Window width">
        <WindowWidth />
      </HideShow>

      <HideShow title="Round D: Counter" name="Counter">
        <Counter />
      </HideShow>

      <div style={section}>
        <h3>Round E: User details</h3>
        <div style={row}>
          <span style={label}>Choose user</span>
          {[1, 2, 3, 4, 5].map((id) => (
            <button key={id} onClick={() => setUserId(id)}>{id}</button>
          ))}
          <button onClick={() => setUserId(999)}>999 (error)</button>
        </div>
        <UserDetails userId={userId} />
      </div>
    </div>
  );
}

/* ---------------- APP: two buttons choose the assignment ---------------- */

export default function App() {
  const [view, setView] = useState(1);

  return (
    <main style={page}>
      <div style={row}>
        <button style={tab(view === 1)} onClick={() => setView(1)}>Effect lab</button>
        <button style={tab(view === 2)} onClick={() => setView(2)}>Fix leaky effects</button>
      </div>
      {view === 1 ? <EffectsLab /> : <FixLeakyEffects />}
    </main>
  );
}