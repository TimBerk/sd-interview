import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
import { useEffect, useRef, useState } from 'react';

interface ExcalidrawCanvasProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function ExcalidrawCanvas({ value, onChange, disabled }: ExcalidrawCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const initialDataLoaded = useRef(false);

  useEffect(() => {
    if (excalidrawAPI && value && !initialDataLoaded.current) {
      try {
        const data = JSON.parse(value);
        excalidrawAPI.updateScene(data);
        initialDataLoaded.current = true;
      } catch (e) {
        console.error('Failed to parse drawing data:', e);
      }
    }
  }, [excalidrawAPI, value]);

  const handleChange = (elements: readonly any[], appState: any) => {
    if (disabled) return;

    const sceneData = {
      elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        currentItemStrokeColor: appState.currentItemStrokeColor,
        currentItemBackgroundColor: appState.currentItemBackgroundColor,
        currentItemFillStyle: appState.currentItemFillStyle,
        currentItemStrokeWidth: appState.currentItemStrokeWidth,
        currentItemRoughness: appState.currentItemRoughness,
        currentItemOpacity: appState.currentItemOpacity,
      },
    };
    onChange(JSON.stringify(sceneData));
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        viewModeEnabled={disabled}
        zenModeEnabled={false}
        gridModeEnabled={false}
      />
    </div>
  );
}
