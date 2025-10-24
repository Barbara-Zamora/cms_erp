import { useMemo } from 'react';
import { useApiResource } from '../../../hooks/useApiResource';
import { ContentNode } from '../../../types/models';
import { DataTable } from '../../../components/data-display/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartTooltip } from 'recharts';

interface DashboardResponse {
  data: ContentNode[];
  pagination: { page: number; pageSize: number; total: number };
}

export function DashboardPage() {
  const { data } = useApiResource<DashboardResponse>({
    key: 'content-dashboard',
    endpoint: '/content',
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((item) => ({
        name: new Date(item.createdAt).toLocaleDateString(),
        value: item.status === 'published' ? 1 : 0,
      })),
    [data],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Pending drafts" value={(data?.data ?? []).filter((item) => item.status === 'draft').length} />
        <StatCard title="Published today" value={(data?.data ?? []).filter((item) => item.status === 'published').length} />
        <StatCard title="Scheduled" value={(data?.data ?? []).filter((item) => item.status === 'scheduled').length} />
      </div>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h2 className="text-lg font-semibold">Publications this week</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} width={20} />
                <RechartTooltip />
                <Area type="monotone" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Button className="w-full" onClick={() => navigate('/admin/content/page/new')}>
              + {t('content')} Page
            </Button>
            <Button className="w-full" onClick={() => navigate('/admin/content/post/new')}>
              + {t('content')} Post
            </Button>
            <Button className="w-full" onClick={() => navigate('/admin/media')}>
              + {t('media')}
            </Button>
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Recent updates</h2>
        <DataTable
          data={(data?.data ?? []).slice(0, 5)}
          columns={[
            {
              id: 'title',
              header: 'Title',
              accessor: (row) => row.title,
              filter: (row, term) => row.title.toLowerCase().includes(term),
              sortable: true,
            },
            {
              id: 'status',
              header: 'Status',
              accessor: (row) => <Badge variant={row.status === 'published' ? 'success' : 'warning'}>{row.status}</Badge>,
            },
            {
              id: 'updated',
              header: 'Updated',
              accessor: (row) => new Date(row.updatedAt).toLocaleString(),
              sortable: true,
            },
          ]}
          renderActions={(row) => (
            <Button variant="ghost" onClick={() => navigate(`/admin/content/${row.type}/${row.id}`)}>
              Edit
            </Button>
          )}
        />
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-sm text-slate-500">{title}</dt>
      <dd className="text-2xl font-semibold">{value}</dd>
    </div>
  );
}
