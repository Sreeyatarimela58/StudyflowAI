import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Textarea } from '../components/Textarea';
import { Input } from '../components/Input';
import { useStudy } from '../contexts/StudyContext';
import { motion } from 'framer-motion';

export function NewStudy() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // In a real implementation, we would call the API here.
    // For now, we simulate transitioning to the Processing state.
    
    // We pass the payload in the state
    navigate('/dashboard/processing', { 
      state: { 
        title: data.title || 'Untitled Study', 
        content: data.content 
      } 
    });
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
      className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-6 py-[64px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full mb-[80px] text-center max-w-3xl mx-auto">
        <h1 className="text-headline-xl font-display font-bold mb-4 italic">What are we learning today?</h1>
        <p className="text-body-lg text-[var(--color-gray)] mx-auto">
          Paste your notes, syllabus, or just a topic. Our AI will structure it into a comprehensive study session.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full max-w-4xl mx-auto">
        <Card className="w-full p-[40px] md:p-[64px] border-2 border-[#7B1E2B]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
          
          <div>
            <label className="flex items-center text-headline-lg font-display font-bold mb-4" htmlFor="title">
              <FileText className="mr-3 h-6 w-6 text-[var(--color-gray)]" />
              Session Title (Optional)
            </label>
            <Input 
              id="title" 
              placeholder="e.g. Introduction to Cellular Biology"
              {...register('title')}
              className="py-5 text-body-lg border-2 border-black bg-white text-black placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="flex items-center text-headline-lg font-display font-bold mb-4" htmlFor="content">
              <Sparkles className="mr-3 h-6 w-6 text-[var(--color-lime-hover)]" />
              Study Material
            </label>
            <p className="text-[var(--color-gray)] mb-6 text-body-md">
              Paste your raw notes, definitions, or an entire article here. Minimum 50 characters for best results.
            </p>
            <Textarea 
              id="content" 
              placeholder="Paste your notes here..."
              className="min-h-[250px] text-lg border-2 border-black bg-white text-black placeholder:text-gray-500"
              {...register('content', { 
                required: 'Please provide some material to study',
                minLength: { value: 20, message: 'Please provide at least 20 characters of material.' }
              })}
              error={errors.content?.message}
            />
          </div>

          <div className="flex justify-end pt-8 border-t border-[var(--color-charcoal)]/10">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto"
              isLoading={isSubmitting}
            >
              Generate Study Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
