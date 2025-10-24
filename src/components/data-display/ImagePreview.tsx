interface ImagePreviewProps {
  src: string;
  alt?: string;
  caption?: string;
}

export function ImagePreview({ src, alt, caption }: ImagePreviewProps) {
  return (
    <figure className="space-y-2">
      <img src={src} alt={alt} className="h-48 w-full rounded-md object-cover" />
      {caption ? <figcaption className="text-xs text-slate-500">{caption}</figcaption> : null}
    </figure>
  );
}
