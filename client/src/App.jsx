import { useEffect, useState } from 'react';
import fallback from './data/portfolioData.js';
import startEngine from './engine/engine.js';
import Background from './components/Background.jsx';
import Sections from './components/Sections.jsx';
import { Chrome, Preloader, Controls } from './components/Hud.jsx';

// Load content from the Express/MongoDB API; fall back to the bundled copy so the
// site still works as a static deploy or if the server is down.
// The API is only used in local dev, or when VITE_USE_API=1 is set at build time.
// A static Cloudflare deploy skips the request and uses the bundled data directly.
const USE_API = import.meta.env.DEV || import.meta.env.VITE_USE_API === '1';

async function loadData() {
  if (!USE_API) return fallback;
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 2500);
  try {
    const r = await fetch('/api/portfolio', { signal: ctl.signal });
    if (!r.ok) throw new Error('bad status');
    const d = await r.json();
    if (!d || !Array.isArray(d.companies)) throw new Error('bad shape');
    return d;
  } catch {
    return fallback;
  } finally {
    clearTimeout(t);
  }
}

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let live = true;
    loadData().then((d) => live && setData(d));
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!data) return;
    return startEngine(data, { elkR: data.elkR });
  }, [data]);

  if (!data) return <div id="pre" style={{ animation: 'none' }}><b id="pn">000</b><i></i></div>;

  const count = 2 + data.companies.length + 4;
  return (
    <>
      <Background />
      <Chrome count={count} />
      <Preloader />
      <Controls />
      <Sections data={data} />
    </>
  );
}
