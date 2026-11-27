import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ApiSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSchemaModal: React.FC<ApiSchemaModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
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
              LTA DataMall API Adapter Guide
            </h2>
            <p className="text-xs text-slate-500">
              Frontend data structures match Singapore LTA DataMall Bus Arrival v2/v3 responses.
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
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">
              1. Switch the Frontend Adapter
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Open <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">src/services/busApi.ts</code> and set{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">USE_LIVE_API: true</code> once your backend proxy route is ready.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">
              2. Example Server Proxy Route
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Keep your LTA <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800">AccountKey</code> strictly on the backend:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
{`app.get('/api/lta/bus-arrival', async (req, res) => {
  const code = String(req.query.BusStopCode || '');
  const response = await fetch(
    \`https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=\${encodeURIComponent(code)}\`,
    { headers: { AccountKey: process.env.LTA_ACCOUNT_KEY! } }
  );
  res.json(await response.json());
});`}
            </pre>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900">
              3. Expected Field Mapping
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              <li>
                <span className="font-mono font-semibold text-slate-800">Load:</span> SEA (Seats Available), SDA (Standing Available), LSD (Limited Standing)
              </li>
              <li>
                <span className="font-mono font-semibold text-slate-800">Type:</span> SD (Single Deck), DD (Double Deck), BD (Bendy)
              </li>
              <li>
                <span className="font-mono font-semibold text-slate-800">Feature:</span> WAB (Wheelchair Accessible Bus)
              </li>
            </ul>
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
