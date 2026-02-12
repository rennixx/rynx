import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendContactEmail } from '../../services/emailService';
import { personalInfo } from '../../data/portfolioData';
import type { ContactForm } from '../../types';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const quickLinks = [
  {
    label: 'Email me directly',
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: `github.com/${personalInfo.githubUsername}`,
    href: `https://github.com/${personalInfo.githubUsername}`,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
] as const;

const Contact: React.FC = () => {
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
        <div className="max-w-4xl mx-auto">
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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
