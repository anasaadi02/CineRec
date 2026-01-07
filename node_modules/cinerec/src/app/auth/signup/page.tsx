'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signUp(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password strength
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value)
      });
    }
  };

  const isPasswordMatch = formData.password === formData.passwordConfirm;
  const isFormValid = formData.name && formData.email && formData.password && isPasswordMatch && 
                     Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-400 hover:text-red-400 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-red-500 mb-2 block">
            CineRec
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-gray-400">Join CineRec to start rating and reviewing movies</p>
        </div>

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="bg-gray-800 rounded-lg p-3 space-y-2">
              <p className="text-sm text-gray-300 font-medium">Password requirements:</p>
              <div className="space-y-1">
                <div className={`flex items-center text-sm ${passwordStrength.length ? 'text-green-400' : 'text-gray-500'}`}>
                  <Check className={`h-4 w-4 mr-2 ${passwordStrength.length ? 'text-green-400' : 'text-gray-600'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center text-sm ${passwordStrength.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                  <Check className={`h-4 w-4 mr-2 ${passwordStrength.uppercase ? 'text-green-400' : 'text-gray-600'}`} />
                  One uppercase letter
                </div>
                <div className={`flex items-center text-sm ${passwordStrength.lowercase ? 'text-green-400' : 'text-gray-500'}`}>
                  <Check className={`h-4 w-4 mr-2 ${passwordStrength.lowercase ? 'text-green-400' : 'text-gray-600'}`} />
                  One lowercase letter
                </div>
                <div className={`flex items-center text-sm ${passwordStrength.number ? 'text-green-400' : 'text-gray-500'}`}>
                  <Check className={`h-4 w-4 mr-2 ${passwordStrength.number ? 'text-green-400' : 'text-gray-600'}`} />
                  One number
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="passwordConfirm"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  formData.passwordConfirm 
                    ? (isPasswordMatch ? 'border-green-600' : 'border-red-600') 
                    : 'border-gray-700'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.passwordConfirm && (
              <div className={`text-sm ${isPasswordMatch ? 'text-green-400' : 'text-red-400'}`}>
                {isPasswordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-800 mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              I agree to the{' '}
              <Link href="/terms" className="text-red-400 hover:text-red-300 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-red-400 hover:text-red-300 transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 transform ${
              isFormValid && !isSubmitting
                ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:scale-[1.02]' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
              window.location.href = `${apiUrl}/auth/google`;
            }}
            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
