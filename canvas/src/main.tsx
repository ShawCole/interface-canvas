import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@vps/index.css';
import '@paul/index.css';
import './canvas.css';
import App from './App';

// Nothing on the canvas talks to a live box. Every /api call answers an empty 200 so a component
// shows its empty state instead of a network error; a component that needs rows gets them from
// its fixture, not from the server.
const realFetch = window.fetch.bind(window);
window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (/^(\/api\/|https?:\/\/[^/]+\/api\/)/.test(url) || url.startsWith('/api')) {
    return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }
  return realFetch(input, init);
}) as typeof window.fetch;
// EventSource and WebSocket likewise: inert.
class InertSource extends EventTarget { url: string; readyState = 0; onmessage: unknown = null; onerror: unknown = null; onopen: unknown = null; constructor(url: string) { super(); this.url = String(url); } close() { this.readyState = 2; } }
(window as unknown as { EventSource: unknown }).EventSource = InertSource;

const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity, queryFn: async () => ({}) } } });
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <MemoryRouter><App /></MemoryRouter>
    </QueryClientProvider>
  </StrictMode>
);
