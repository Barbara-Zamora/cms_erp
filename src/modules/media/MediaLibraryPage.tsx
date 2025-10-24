import { useState } from 'react';
import { useApiResource } from '../../hooks/useApiResource';
import { MediaItem } from '../../types/models';
import { FileDropzone } from '../../components/forms/FileDropzone';
import { ImagePreview } from '../../components/data-display/ImagePreview';
import { Button } from '../../components/ui/Button';
import { apiFetch } from '../../services/api/client';
import { useToast } from '../../providers/ToastProvider';

interface MediaResponse {
  data: MediaItem[];
  pagination: { page: number; pageSize: number; total: number };
}

export function MediaLibraryPage() {
  const { data, mutate } = useApiResource<MediaResponse>({ key: 'media', endpoint: '/media' });
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const { pushToast } = useToast();

  const onUpload = async (files: FileList) => {
    const file = files.item(0);
    if (!file) return;
    const created = await apiFetch<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify({ filename: file.name, size: file.size, mime: file.type }),
    });
    pushToast({ title: 'Media uploaded', tone: 'success' });
    mutate(
      (previous) => {
        const response =
          previous ?? ({ data: [], pagination: { page: 1, pageSize: 20, total: 0 } } as MediaResponse);
        return {
          ...response,
          data: [created, ...response.data],
          pagination: {
            ...response.pagination,
            total: response.pagination.total + 1,
          },
        };
      },
      true,
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <FileDropzone onFiles={onUpload} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {(data?.data ?? []).map((item) => (
              <button
                key={item.id}
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700"
                onClick={() => setSelected(item)}
              >
                <img src={item.url} alt={item.alt} className="h-32 w-full rounded-md object-cover" />
                <p className="mt-2 text-sm font-medium">{item.filename}</p>
                <p className="text-xs text-slate-500">{Math.round(item.size / 1024)} KB</p>
              </button>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {selected ? (
            <div className="space-y-3 text-sm">
              <ImagePreview src={selected.url} alt={selected.alt} />
              <div>
                <p className="font-semibold">Filename</p>
                <p>{selected.filename}</p>
              </div>
              <div>
                <p className="font-semibold">ALT text</p>
                <label className="sr-only" htmlFor="altText">
                  Alternative text
                </label>
                <input
                  id="altText"
                  className="w-full rounded border border-slate-300 px-2 py-1"
                  value={selected.alt}
                  onChange={(event) =>
                    setSelected({ ...selected, alt: event.target.value })
                  }
                />
                <Button
                  className="mt-2"
                  onClick={async () => {
                    await apiFetch(`/media/${selected.id}`, {
                      method: 'PUT',
                      body: JSON.stringify({ alt: selected.alt }),
                    });
                    pushToast({ title: 'Metadata saved', tone: 'success' });
                    mutate(
                      (previous) => {
                        const response = previous ?? {
                          data: [],
                          pagination: { page: 1, pageSize: 20, total: 0 },
                        };
                        return {
                          ...response,
                          data: response.data.map((item) =>
                            item.id === selected.id ? { ...item, alt: selected.alt } : item,
                          ),
                        };
                      },
                      true,
                    );
                  }}
                >
                  Save ALT
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select a media item to edit metadata.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
