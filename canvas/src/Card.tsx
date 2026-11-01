import { Component, Suspense, lazy, useMemo, useState, type ReactNode } from 'react';
import type { Entry } from './catalog';
import { pick } from './catalog';
import { fixturesFor, notACard } from './fixtures';

class Boundary extends Component<{ children: ReactNode; resetKey: string }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidUpdate(prev: { resetKey: string }) { if (prev.resetKey !== this.props.resetKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (this.state.err) return <div className="ic-err"><b>needs a fixture</b><div>{String(this.state.err.message || this.state.err).slice(0, 240)}</div></div>;
    return this.props.children;
  }
}

export const WIDTHS = { wide: 720, phone: 390, auto: 0 } as const;
export type Width = keyof typeof WIDTHS;

export function Card({ entry, width }: { entry: Entry; width: Width }) {
  const fixtures = fixturesFor(entry.source, entry.rel, entry.name);
  const [fi, setFi] = useState(0);
  const why = notACard(entry.source, entry.rel, entry.name);
  const fixture = fixtures[Math.min(fi, fixtures.length - 1)];
  const exp = fixture.export;
  const Lazy = useMemo(() => lazy(async () => {
    const mod = await entry.load();
    const C = exp ? (mod[exp] as React.ComponentType<any> | undefined) || null : pick(mod, entry.name);
    return { default: C ? (p: Record<string, unknown>) => <C {...p} /> : () => <div className="ic-err"><b>no component export</b></div> };
  }), [entry, exp]);
  const w = WIDTHS[width];
  if (why) return (
    <div className="ic-card ic-grey" data-source={entry.source} data-id={entry.id}>
      <div className="ic-head"><span className="ic-src">{entry.source === 'vps' ? 'VPS' : "Paul's box"}</span><span className="ic-name" title={entry.rel}>{entry.folder ? entry.folder + '/' : ''}<b>{entry.name}</b></span></div>
      <div className="ic-body ic-why">{why}</div>
    </div>
  );
  return (
    <div className="ic-card" data-source={entry.source} data-id={entry.id} style={w ? { width: w + 24 } : undefined}>
      <div className="ic-head">
        <span className="ic-src">{entry.source === 'vps' ? 'VPS' : "Paul's box"}</span>
        <span className="ic-name" title={entry.rel}>{entry.folder ? entry.folder + '/' : ''}<b>{entry.name}</b></span>
        {fixtures.length > 1 && (
          <select className="ic-fix" value={fi} onChange={(e) => setFi(Number(e.target.value))}>
            {fixtures.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
          </select>
        )}
        {fixtures.length === 1 && <span className="ic-fixlabel">{fixture.label}</span>}
      </div>
      <div className="ic-body" style={w ? { width: w } : undefined}>
        <Boundary resetKey={entry.id + ':' + fi}>
          <Suspense fallback={<div className="ic-loading">loading…</div>}>
            <Lazy {...fixture.props} />
          </Suspense>
        </Boundary>
      </div>
    </div>
  );
}
