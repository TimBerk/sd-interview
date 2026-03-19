import { useState, useEffect, useRef, memo } from 'react';
import type { RoomAnswer, Section, UserRole } from '../types';
import { DrawingCanvas } from './DrawingCanvas';
import { SqlEditor } from './SqlEditor';

interface EditorPanelProps {
  answer: RoomAnswer & { section: Section };
  role: UserRole;
  onAnswerChange: (text: string) => void;
}

export const EditorPanel = memo(function EditorPanel({ answer, role, onAnswerChange }: EditorPanelProps) {
  const [text, setText] = useState(answer?.candidate_answer || '');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(answer?.candidate_answer || '');
  }, [answer?.id, answer?.candidate_answer]);

  const handleChange = (newText: string) => {
    setText(newText);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onAnswerChange(newText);
    }, 1000);
  };

  const isReadOnly = role === 'reviewer';
  const isDrawingSection = answer?.section?.type === 'HLD' || answer?.section?.type === 'LLD';
  const isSqlSection = answer?.section?.type === 'DATA_MODEL';

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {isDrawingSection ? (
        <DrawingCanvas
          value={text}
          onChange={handleChange}
          disabled={isReadOnly}
        />
      ) : isSqlSection ? (
        <SqlEditor
          value={text}
          onChange={handleChange}
          disabled={isReadOnly}
          darkTheme={true}
        />
      ) : (
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={isReadOnly}
          placeholder={
            isReadOnly
              ? 'Waiting for candidate response...'
              : 'Type your answer here...'
          }
          className={`w-full h-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 font-mono text-sm resize-none ${
            isReadOnly ? 'cursor-default' : ''
          }`}
        />
      )}
    </div>
  );
});
