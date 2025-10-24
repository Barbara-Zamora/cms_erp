import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../providers/AuthProvider';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'alex@example.com', password: 'password' },
  });
  const { login } = useAuth();

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-500">Use your admin credentials to access the dashboard.</p>
      </div>
      <FormField label="Email" id="email" required error={form.formState.errors.email}>
        <Input id="email" type="email" {...form.register('email')} />
      </FormField>
      <FormField label="Password" id="password" required error={form.formState.errors.password}>
        <Input id="password" type="password" {...form.register('password')} />
      </FormField>
      <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
