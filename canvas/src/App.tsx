import { useMemo, useState } from 'react';
import { CATALOG, type Entry, type Source } from './catalog';
import { Card, type Width } from './Card';
import { Canvas } from './Canvas';

type Mode = 'boxes' | 'parity';

export default function App() {
  // ?q=&mode=&width=&src= seed the view, so a filmed URL names what it shows.
  const url = new URLSearchParams(location.search);
  const [q, setQ] = useState(url.get('q') || '');
  const [mode, setMode] = useState<Mode>((url.get('mode') as Mode) || 'boxes');
  const [width, setWidth] = useState<Width>((url.get('width') as Width) || 'auto');
  const [src, setSrc] = useState<'all' | Source>((url.get('src') as Source) || 'all');
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggleDark = () => { document.documentElement.classList.toggle('dark'); setDark(document.documentElement.classList.contains('dark')); };

  const shown = useMemo(() => CATALOG.filter((e) => (src === 'all' || e.source === src) && (!q || (e.folder + '/' + e.name).toLowerCase().includes(q.toLowerCase()))), [q, src]);
  const counts = { vps: CATALOG.filter((e) => e.source === 'vps').length, paul: CATALOG.filter((e) => e.source === 'paul').length };

  // Boxes: one column per box, grouped by folder. Parity: one row per component name, VPS beside Paul.
  const groups = useMemo(() => {
    if (mode === 'parity') {
      const byName = new Map<string, Partial<Record<Source, Entry>>>();
      for (const e of shown) byName.set(e.folder + '/' + e.name, { ...(byName.get(e.folder + '/' + e.name) || {}), [e.source]: e });
      return [...byName.entries()].sort(([a], [b]) => a.localeCompare(b));
    }
    return null;
  }, [mode, shown]);

  const folders = (s: Source) => {
    const m = new Map<string, Entry[]>();
    for (const e of shown) if (e.source === s) m.set(e.folder || '(top)', [...(m.get(e.folder || '(top)') || []), e]);
    return [...m.entries()];
  };

  return (
    <div className="ic-app">
      <header className="ic-bar">
        <strong>Interface Canvas</strong>
        <span className="ic-counts">VPS {counts.vps} · Paul's box {counts.paul} · showing {shown.length}</span>
        <input className="ic-search" placeholder="search components…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={src} onChange={(e) => setSrc(e.target.value as 'all' | Source)}><option value="all">both boxes</option><option value="vps">VPS only</option><option value="paul">Paul's box only</option></select>
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}><option value="boxes">by box</option><option value="parity">parity (side by side)</option></select>
        <select value={width} onChange={(e) => setWidth(e.target.value as Width)}><option value="auto">natural width</option><option value="wide">wide 720</option><option value="phone">phone 390</option></select>
        <button onClick={toggleDark}>{dark ? 'light' : 'dark'}</button>
        <span className="ic-hint">drag ground to pan · ⌘/ctrl+wheel or pinch to zoom · scroll to pan</span>
      </header>
      <Canvas resetKey={mode + src}>
        {mode === 'boxes' ? (
          <div className="ic-columns">
            {(['vps', 'paul'] as Source[]).filter((s) => src === 'all' || s === src).map((s) => (
              <section key={s} className="ic-column">
                <h2>{s === 'vps' ? 'VPS dashboard' : "Paul's box dashboard"}</h2>
                {folders(s).map(([folder, list]) => (
                  <div key={folder} className="ic-group">
                    <h3>{folder}</h3>
                    <div className="ic-grid">{list.map((e) => <Card key={e.id} entry={e} width={width} />)}</div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        ) : (
          <div className="ic-parity">
            {groups!.map(([name, pair]) => (
              <div key={name} className="ic-pair" data-parity={pair.vps && pair.paul ? 'both' : pair.vps ? 'vps-only' : 'paul-only'}>
                <div className="ic-pair-name">{name}<span className="ic-pair-tag">{pair.vps && pair.paul ? 'both' : pair.vps ? 'VPS only' : "Paul's box only"}</span></div>
                <div className="ic-pair-row">
                  {pair.vps ? <Card entry={pair.vps} width={width} /> : <div className="ic-missing">not on VPS</div>}
                  {pair.paul ? <Card entry={pair.paul} width={width} /> : <div className="ic-missing">not on Paul's box</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Canvas>
    </div>
  );
}
