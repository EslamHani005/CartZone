import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../services/cartZoneApi';
import { useAppDispatch } from '../hooks/redux';
import { setCredentials } from '../store';
import { Button, Input } from '../components/ui';
import { ROUTES } from '../constants';
import { getErrorMessage } from '../utils';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const registerSchema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, 'At least 6 characters'),
  phoneNumber: z.string().optional(),
});

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const user = await login(data).unwrap();
    dispatch(setCredentials(user));
    navigate(ROUTES.HOME);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="text-[var(--muted)] mt-2 text-sm">Sign in to your CartZone account</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
            {error && <p className="text-ruby text-sm text-center">{getErrorMessage(error)}</p>}
            <Button type="submit" loading={isLoading} className="w-full justify-center mt-2">Sign In</Button>
          </form>
          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-gold hover:underline font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register_, { isLoading, error }] = useRegisterMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    const user = await register_(data).unwrap();
    dispatch(setCredentials(user));
    navigate(ROUTES.HOME);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Create account</h1>
          <p className="text-[var(--muted)] mt-2 text-sm">Join CartZone and start shopping</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input label="Display Name" placeholder="Your name" {...register('displayName')} error={errors.displayName?.message} />
            <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" placeholder="Min. 6 characters" {...register('password')} error={errors.password?.message} />
            <Input label="Phone (optional)" type="tel" placeholder="+20 xxx xxx xxxx" {...register('phoneNumber')} />
            {error && <p className="text-ruby text-sm text-center">{getErrorMessage(error)}</p>}
            <Button type="submit" loading={isLoading} className="w-full justify-center mt-2">Create Account</Button>
          </form>
          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-gold hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
