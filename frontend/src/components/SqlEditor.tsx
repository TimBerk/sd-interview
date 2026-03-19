import { useEffect, useRef, memo } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  darkTheme?: boolean;
}

export const SqlEditor = memo(function SqlEditor({ value, onChange, disabled, darkTheme = false }: SqlEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const readOnlyCompartment = useRef(new Compartment());
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      closeBrackets(),
      bracketMatching(),
      indentOnInput(),
      highlightSelectionMatches(),
      sql(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...closeBracketsKeymap,
        ...searchKeymap,
      ]),
      readOnlyCompartment.current.of(EditorState.readOnly.of(disabled)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !isExternalUpdate.current) {
          onChange(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-scroller': { overflow: 'auto', fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace' },
      }),
    ];

    if (darkTheme) {
      extensions.push(oneDark);
    } else {
      extensions.push(syntaxHighlighting(defaultHighlightStyle));
      extensions.push(EditorView.theme({
        '&': { background: '#ffffff', color: '#1f2937' },
        '.cm-content': { caretColor: '#2563eb' },
        '.cm-cursor': { borderLeftColor: '#2563eb' },
        '.cm-selectionBackground': { background: '#bfdbfe' },
        '&.cm-focused .cm-selectionBackground': { background: '#93c5fd' },
        '.cm-gutters': { background: '#f9fafb', borderRight: '1px solid #e5e7eb', color: '#9ca3af' },
        '.cm-activeLineGutter': { background: '#eff6ff' },
        '.cm-activeLine': { background: '#eff6ff' },
        '.cm-matchingBracket': { background: '#bbf7d0', color: '#166534 !important' },
        '&.cm-focused': { outline: 'none' },
        '.cm-line': { padding: '0 8px' },
      }));
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [darkTheme]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      isExternalUpdate.current = true;
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value },
      });
      isExternalUpdate.current = false;
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: readOnlyCompartment.current.reconfigure(EditorState.readOnly.of(disabled)),
    });
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${
        darkTheme
          ? 'rounded-2xl border border-gray-700'
          : 'rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
      } ${disabled ? 'opacity-75' : ''}`}
    />
  );
});
