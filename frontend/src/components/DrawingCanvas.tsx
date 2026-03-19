import { Suspense, lazy } from 'react';

const ExcalidrawCanvas = lazy(() => import('./ExcalidrawCanvas').then((m) => ({ default: m.ExcalidrawCanvas })));

interface DrawingCanvasProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function DrawingCanvas({ value, onChange, disabled }: DrawingCanvasProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      }
    >
      <ExcalidrawCanvas value={value} onChange={onChange} disabled={disabled} />
    </Suspense>
  );
}
