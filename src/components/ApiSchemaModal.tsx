import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchApiHealth } from '../services/busApi';
import { ApiHealthStatus } from '../types/bus';

interface ApiSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSchemaModal: React.FC<ApiSchemaModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState<ApiHealthStatus | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setChecking(true);
    fetchApiHealth().then((res) => {
      if (active) {
        setHealth(res);
        setChecking(false);
      }
    });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      active = false;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="api-modal-title" className="font-display text-lg font-bold text-slate-900">
              LTA DataMall v3 Serverless Connection
            </h2>
            <p className="text-xs text-slate-500">
              Connected to <code className="font-mono">/api/health.ts</code> and{' '}
              <code className="font-mono">/api/busarrival.ts</code> at project root.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-5 text-sm text-slate-600">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
            <div className="font-semibold text-slate-900">Serverless Endpoint Status</div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-slate-600">
              <span>
                /api/health:{' '}
                {checking ? 'Checking...' : health?.status === 'ok' ? 'Reachable' : 'Unavailable'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                LTA_ACCOUNT_KEY:{' '}
                {checking
                  ? 'Checking...'
                  : health?.ltaConfigured
                  ? 'Configured (Live v3 active)'
                  : 'Not set (using simulated fallback)'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">
              1. Configure Your Key Safely
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Add <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">LTA_ACCOUNT_KEY</code> in your AI Studio Secrets panel or server <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">.env</code> file. It is read exclusively on the server inside <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">/api/busarrival.ts</code> and never sent to the browser.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">
              2. Serverless Endpoints
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600 font-mono">
              <li>GET /api/health → server &amp; key configuration status</li>
              <li>GET /api/busarrival?BusStopCode=04121 → all services at stop (v3, 20s refresh)</li>
              <li>GET /api/busarrival?BusStopCode=04121&amp;ServiceNo=7 → single service lookup</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">
              3. Upstream LTA DataMall Endpoint
            </h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
{`GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header: AccountKey: <process.env.LTA_ACCOUNT_KEY>`}
            </pre>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
