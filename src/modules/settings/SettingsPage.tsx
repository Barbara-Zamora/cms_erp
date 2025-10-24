import { useState } from 'react';
import { useApiResource } from '../../hooks/useApiResource';
import { Setting } from '../../types/models';
import { Tabs } from '../../components/ui/Tabs';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiFetch } from '../../services/api/client';
import { useToast } from '../../providers/ToastProvider';

export function SettingsPage() {
  const { data } = useApiResource<Setting>({ key: 'settings', endpoint: '/settings' });
  const [values, setValues] = useState<Setting | null>(null);
  const { pushToast } = useToast();

  const setting = values ?? data;

  const updateField = <K extends keyof Setting>(key: K, value: Setting[K]) => {
    setValues((prev) => ({ ...(prev ?? (data as Setting)), [key]: value }));
  };

  const save = async () => {
    if (!setting) return;
    await apiFetch('/settings', { method: 'PUT', body: JSON.stringify(setting) });
    pushToast({ title: 'Settings saved', tone: 'success' });
  };

  if (!setting) {
    return <div className="rounded border border-slate-200 bg-white p-6">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Tabs
        value="general"
        onValueChange={() => undefined}
        items={[
          {
            value: 'general',
            label: 'General',
            content: (
              <div className="space-y-4 rounded border border-slate-200 p-4 dark:border-slate-800">
                <FormField label="Site name" id="siteName">
                  <Input
                    value={setting.siteName}
                    onChange={(event) => updateField('siteName', event.target.value)}
                  />
                </FormField>
                <FormField label="Default locale" id="defaultLocale">
                  <Input
                    value={setting.defaultLocale}
                    onChange={(event) => updateField('defaultLocale', event.target.value)}
                  />
                </FormField>
                <FormField label="Timezone" id="timezone">
                  <Input
                    value={setting.timezone}
                    onChange={(event) => updateField('timezone', event.target.value)}
                  />
                </FormField>
                <Button onClick={save}>Save changes</Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
