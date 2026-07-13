import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();

  const onSubmit = (data: ForgotForm) => {
    setEmail(data.email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-sky-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PetCare+</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 animate-checkmark">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h1 className="mt-5 text-2xl font-semibold text-gray-900">Check your inbox!</h1>
              <p className="mt-3 text-sm text-gray-600">
                We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
              </p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 text-center">Forgot password?</h1>
              <p className="text-sm text-gray-500 text-center mt-2">
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />
                <Button type="submit" variant="primary" fullWidth>
                  Send Reset Link
                </Button>
              </form>

              <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
