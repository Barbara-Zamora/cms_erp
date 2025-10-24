import { ChangeEvent, DragEvent, useRef, useState } from 'react';

interface FileDropzoneProps {
  onFiles: (files: FileList) => void;
  accept?: string;
}

export function FileDropzone({ onFiles, accept }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files) onFiles(files);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 px-6 py-12 text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isDragging ? 'bg-primary/10' : 'bg-white dark:bg-slate-900'
      }`}
    >
      <p className="font-medium">Drop files to upload</p>
      <p className="text-xs text-slate-500">or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept={accept}
        onChange={onChange}
      />
    </div>
  );
}
