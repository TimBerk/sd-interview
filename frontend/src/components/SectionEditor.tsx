import { Save } from 'lucide-react';
import type { RoomAnswer, Section } from '../types';
import { SqlEditor } from './SqlEditor';

interface SectionEditorProps {
  answer: RoomAnswer & { section: Section };
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
}

export function SectionEditor({
  answer,
  value,
  onChange,
  onSave,
  saving,
  disabled,
}: SectionEditorProps) {
  const isSqlSection = answer?.section?.type === 'DATA_MODEL';

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        {isSqlSection ? (
          <div style={{ height: '360px' }}>
            <SqlEditor
              value={value}
              onChange={onChange}
              disabled={disabled}
              darkTheme={false}
            />
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
            placeholder="Write your answer here..."
          />
        )}
      </div>

      {!disabled && (
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Answer'}
        </button>
      )}
    </div>
  );
}
