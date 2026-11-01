// Every component file in both trees, discovered at build time. Nothing is listed by hand:
// a new file on either box is a new card on the next reload.
export type Source = 'vps' | 'paul';
export interface Entry { id: string; source: Source; rel: string; name: string; folder: string; load: () => Promise<Record<string, unknown>> }

const vps = import.meta.glob('@vps/components/**/*.tsx') as Record<string, () => Promise<Record<string, unknown>>>;
const paul = import.meta.glob('@paul/components/**/*.tsx') as Record<string, () => Promise<Record<string, unknown>>>;

function entries(mods: Record<string, () => Promise<Record<string, unknown>>>, source: Source, root: string): Entry[] {
  return Object.entries(mods)
    .filter(([p]) => !/\.test\.tsx$/.test(p))
    .map(([p, load]) => {
      const rel = p.startsWith(root) ? p.slice(root.length + 1) : p.replace(/^.*\/components\//, '');
      const parts = rel.split('/');
      const name = parts[parts.length - 1].replace(/\.tsx$/, '');
      const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
      return { id: `${source}:${rel}`, source, rel, name, folder, load };
    })
    .sort((a, b) => (a.folder + '/' + a.name).localeCompare(b.folder + '/' + b.name));
}

export const CATALOG: Entry[] = [
  ...entries(vps, 'vps', `${__CANVAS_VPS__}/components`),
  ...entries(paul, 'paul', `${__CANVAS_PAUL__}/components`),
];

declare const __CANVAS_VPS__: string;
declare const __CANVAS_PAUL__: string;

/** The component a module exports: default, then the export named like the file, then the first function export. */
export function pick(mod: Record<string, unknown>, name: string): React.ComponentType<any> | null {
  const cands = [mod.default, mod[name], ...Object.values(mod)];
  for (const c of cands) {
    if (typeof c === 'function' && /^[A-Z]/.test((c as { name?: string }).name || 'X')) return c as React.ComponentType<any>;
    // forwardRef / memo components are objects with $$typeof and a render function.
    if (c && typeof c === 'object' && '$$typeof' in (c as object)) return c as React.ComponentType<any>;
  }
  return null;
}
