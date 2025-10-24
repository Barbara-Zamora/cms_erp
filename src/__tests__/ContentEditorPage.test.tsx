import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContentEditorPage } from '../modules/content/pages/ContentEditorPage';

jest.mock('../hooks/useApiResource', () => ({
  useApiResource: () => ({ data: undefined, loading: false, mutate: jest.fn(), setData: jest.fn() }),
}));

const apiFetch = jest.fn();
jest.mock('../services/api/client', () => ({
  apiFetch: (path: string, options?: unknown) => apiFetch(path, options),
}));

jest.mock('../providers/ToastProvider', () => ({
  useToast: () => ({ pushToast: jest.fn() }),
}));

describe('ContentEditorPage', () => {
  beforeEach(() => apiFetch.mockReset());

  it('validates required fields', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/content/page/new' }]}> 
        <Routes>
          <Route path="/admin/content/:type/new" element={<ContentEditorPage mode="create" />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/at least 3/i).length).toBeGreaterThan(0);
    });
  });

  it('submits and calls api', async () => {
    apiFetch.mockResolvedValueOnce({ id: '10', type: 'page' });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/content/page/new' }]}> 
        <Routes>
          <Route path="/admin/content/:type/new" element={<ContentEditorPage mode="create" />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText(/slug/i), { target: { value: 'hello' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: '<p>Hi</p>' } });
    fireEvent.change(screen.getByLabelText(/seo title/i), { target: { value: 'SEO' } });

    fireEvent.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalled();
    });
  });
});
