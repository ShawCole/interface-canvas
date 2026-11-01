// Props per component, several states each. Keyed by file name (both trees share most names), or
// by `vps:Name` / `paul:folder/Name` when the two boxes differ. A component with no fixture mounts
// with {} inside an error boundary: a red card means "needs a fixture", not a broken canvas.
export interface Fixture { label: string; props: Record<string, unknown> }
const agent = (over: Record<string, unknown> = {}) => ({ id: 'pm-shoreline', name: 'pm-shoreline', status: 'online', state: 'working', tier: 'T1', model: 'claude-opus-5-5', project: 'shoreline', context_pct: 46, activity: 'Running Bash', last_active: new Date().toISOString(), ...over });
export const FIXTURES: Record<string, Fixture[]> = {
  StatusDot: [{ label: 'online', props: { status: 'online' } }, { label: 'working', props: { status: 'working' } }, { label: 'stalled', props: { status: 'stalled' } }, { label: 'offline', props: { status: 'offline' } }],
  AgentStatusDot: [{ label: 'working', props: { status: 'working' } }, { label: 'idle', props: { status: 'idle' } }, { label: 'stalled', props: { status: 'stalled' } }, { label: 'stranded', props: { status: 'stranded' } }],
  TierBadge: [{ label: 'T0', props: { tier: 'T0' } }, { label: 'T1', props: { tier: 'T1' } }, { label: 'T2', props: { tier: 'T2' } }],
  PriorityBadge: [{ label: 'high', props: { priority: 'high' } }, { label: 'medium', props: { priority: 'medium' } }, { label: 'low', props: { priority: 'low' } }],
  StatCard: [{ label: 'plain', props: { label: 'Agents online', value: 27, sub: 'of 31' } }, { label: 'alert', props: { label: 'Stalled', value: 3, sub: 'needs you', alert: true } }],
  UsageBar: [{ label: '46%', props: { label: 'Context', percent: 46, color: '#3b82f6', sublabel: '460K of 1M' } }, { label: '91%', props: { label: 'Context', percent: 91, color: '#ef4444', sublabel: 'rotate soon' } }],
  AgentCard: [{ label: 'working', props: { agent: agent() } }, { label: 'stalled', props: { agent: agent({ state: 'stalled', status: 'stalled', activity: 'No visible progress for 12m' }) } }, { label: 'offline', props: { agent: agent({ status: 'offline', state: 'stopped' }) } }],
  ApprovalCard: [{ label: 'pending', props: { approval: { id: 'apr_demo', from_agent: 'pm-shoreline', feature: 'Deploy call experience', question: 'Deploy the call experience to Paul\'s box?', summary: 'Decide by: 2026-11-02 12:00 ET. Dashboard only, no restarts, rollback branch kept.', category: 'deploy', created_at: new Date().toISOString(), status: 'pending' } } }, { label: 'resolved', props: { isResolved: true, approval: { id: 'apr_demo2', from_agent: 'gm', feature: 'Rotate seat', question: 'Rotate gm now?', summary: 'Approved', category: 'infra', status: 'approved', created_at: new Date().toISOString() } } }],
  GenChip: [{ label: 'gen 11', props: { generation: 11 } }],
  'paul/avatar/AgentAvatar': [{ label: 'pm-shoreline 64', props: { agentId: 'pm-shoreline', size: 64 } }, { label: 'gm selected', props: { agentId: 'gm', size: 48, selected: true } }, { label: 'codex seat', props: { agentId: 'codex-gm', size: 48, provider: 'codex' } }],
  'paul/avatar/AgentIdentityPill': [{ label: 'header', props: { agentId: 'pm-shoreline', name: 'pm-shoreline' } }, { label: 'inline bare', props: { agentId: 'gm', name: 'gm', variant: 'bare', text: 'inline', size: 20 } }],
  'paul/call/CallBar': [{ label: 'on a call', props: { agentId: 'pm-shoreline', name: 'pm-shoreline' } }],
  'paul/call/CallChip': [{ label: 'elsewhere', props: { onAgentPage: null } }],
  'paul/kit/ObjectChip': [{ label: 'file', props: { label: 'PARITY.md', title: 'Open PARITY.md' } }],
  'paul/kit/CompactionRow': [{ label: 'running', props: { state: 'running' } }, { label: 'done', props: { state: 'done' } }, { label: 'failed', props: { state: 'failed' } }],
  'paul/agent/AgentWorkingRow': [{ label: 'typing', props: { agentId: 'pm-shoreline', name: 'pm-shoreline', typing: true } }],
  'paul/FleetTicker': [{ label: 'three messages', props: { messages: [{ id: 'm1', from: 'gm', to: 'pm-shoreline', subject: 'Stitched chat fix', ts: Date.now() }, { id: 'm2', from: 'pm-shoreline', to: 'gm', subject: 'Gestures released', ts: Date.now() - 60000 }, { id: 'm3', from: 'orchestra-builder', to: 'gm', subject: 'Beat report', ts: Date.now() - 120000 }] } }],
};
export function fixturesFor(source: string, rel: string, name: string): Fixture[] {
  const key = `${source}/${rel.replace(/\.tsx$/, '')}`;
  return FIXTURES[key] || FIXTURES[`${source}/${name}`] || FIXTURES[name] || [{ label: 'no fixture', props: {} }];
}
