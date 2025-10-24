import { useState } from 'react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const toolbarButtons = [
  { label: 'H1', markdown: '# ' },
  { label: 'H2', markdown: '## ' },
  { label: 'Bold', markdown: '**bold**' },
  { label: 'Link', markdown: '[text](url)' },
  { label: 'Code', markdown: '`code`' },
];

export function RichTextEditor({ value, onChange, id }: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {toolbarButtons.map((button) => (
          <Button
            key={button.label}
            type="button"
            variant="secondary"
            onClick={() => onChange(`${value}\n${button.markdown}`)}
          >
            {button.label}
          </Button>
        ))}
        <Button type="button" variant="ghost" onClick={() => setPreview((prev) => !prev)}>
          {preview ? 'Edit' : 'Preview'}
        </Button>
      </div>
      {preview ? (
        <div
          className="max-w-none rounded-md border border-slate-200 bg-white p-4 text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <Textarea
          id={id}
          rows={12}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
