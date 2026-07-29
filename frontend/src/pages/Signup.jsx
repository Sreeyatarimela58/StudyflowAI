import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create account.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)] px-4 py-[64px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Link to="/" className="flex items-center gap-3 mb-[64px]">
          <div className="bg-[var(--color-lime)] p-3 rounded-[16px] shadow-[var(--shadow-premium)]">
            <BookOpen className="h-8 w-8 text-[var(--color-charcoal)]" />
          </div>
          <span className="font-display font-bold text-headline-md tracking-tight">StudyFlowAI</span>
        </Link>
      </motion.div>
      
      <motion.div variants={itemVariants} className="w-full max-w-md">
        <Card className="w-full p-[40px] md:p-[48px]">
          <h1 className="text-headline-lg font-display font-bold mb-3">Create an account</h1>
          <p className="text-body-lg text-[var(--color-gray)] mb-[40px]">Start your learning journey today.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
          <div>
            <label className="block text-label-sm font-bold uppercase tracking-widest mb-3" htmlFor="name">Full Name</label>
            <Input 
              id="name" 
              placeholder="Jane Doe"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
          </div>

          <div>
            <label className="block text-label-sm font-bold uppercase tracking-widest mb-3" htmlFor="email">Email address</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
              })}
              error={errors.email?.message}
            />
          </div>
          
          <div>
            <label className="block text-label-sm font-bold uppercase tracking-widest mb-3" htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain uppercase, lowercase, number, and special character'
                }
              })}
              error={errors.password?.message}
            />
          </div>

          <div>
            <label className="block text-label-sm font-bold uppercase tracking-widest mb-3" htmlFor="confirmPassword">Confirm Password</label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />
          </div>
          
          <Button type="submit" className="w-full mt-[32px]" isLoading={isSubmitting}>
            Sign Up
          </Button>
        </form>
        
        <p className="mt-[32px] text-center text-[var(--color-gray)] text-body-md">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-charcoal)] hover:underline">
            Log in
          </Link>
        </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
