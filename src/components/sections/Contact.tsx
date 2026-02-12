import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendContactEmail } from '../../services/emailService';
import { personalInfo } from '../../data/portfolioData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MailIcon, GitHubIcon } from '../icons';
import type { ContactForm } from '../../types';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const quickLinks = [
  {
    label: 'Email me directly',
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    icon: <MailIcon className="w-5 h-5" />,
  },
  {
    label: 'GitHub',
    value: `github.com/${personalInfo.githubUsername}`,
    href: `https://github.com/${personalInfo.githubUsername}`,
    icon: <GitHubIcon className="w-5 h-5" />,
  },
] as const;

const Contact: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [formState, setFormState] = useState<FormState>('idle');

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState('loading');
    try {
      await sendContactEmail(formData);
      setFormState('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFormState('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  const buttonCls =
    formState === 'idle'
      ? 'bg-foreground text-background hover:opacity-90'
      : formState === 'loading'
        ? 'bg-info/20 border border-info text-info'
        : formState === 'success'
          ? 'bg-success/20 border border-success text-success'
          : 'bg-destructive/20 border border-destructive text-destructive';

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Let&rsquo;s Work Together
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto text-balance">
              Looking for a developer? I&rsquo;m currently available for full-time
              roles and select freelance projects.
            </p>
          </div>

          {/* Quick links row */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-default bg-surface-1 text-text-secondary hover:text-foreground hover:border-border-strong transition-colors text-sm"
                aria-label={link.label}
              >
                {link.icon}
                {link.value}
              </a>
            ))}
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border-default bg-surface-1 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-text-secondary">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive" role="alert">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-text-secondary">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive" role="alert">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-medium text-text-secondary">
                  Subject <span className="text-destructive">*</span>
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What's this about?"
                  className={errors.subject ? 'border-destructive' : ''}
                />
                {errors.subject && <p className="text-sm text-destructive" role="alert">{errors.subject}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-text-secondary">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={5}
                  placeholder="Tell me about your project or idea..."
                  className={errors.message ? 'border-destructive' : ''}
                />
                {errors.message && <p className="text-sm text-destructive" role="alert">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={formState !== 'idle'}
                className={`w-full py-3.5 px-8 rounded-lg font-medium text-base transition-all duration-300 cursor-pointer ${buttonCls}`}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {formState === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      Send Message
                    </motion.span>
                  )}
                  {formState === 'loading' && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Sending...
                    </motion.div>
                  )}
                  {formState === 'success' && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Message Sent!
                    </motion.span>
                  )}
                  {formState === 'error' && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      Failed to Send — Try Again
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Screen reader status announcements */}
              <div className="sr-only" role="status" aria-live="polite">
                {formState === 'loading' && 'Sending your message...'}
                {formState === 'success' && 'Message sent successfully!'}
                {formState === 'error' && 'Failed to send message. Please try again.'}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
