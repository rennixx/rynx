import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, TextArea } from '../ui';
import { sendContactEmail } from '../../services/emailService';
import type { ContactForm } from '../../types';

type FormState = 'idle' | 'loading' | 'success' | 'error';

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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormState('loading');

    try {
      // Send real email using EmailJS
      await sendContactEmail(formData);
      
      setFormState('success');
      
      // Reset form after success animation
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setFormState('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setFormState('error');
      
      // Reset to idle after error display
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'vrynyx@gmail.com',
      href: 'mailto:vrynyx@gmail.com',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Phone',
      value: '+964 770 445 7696',
      href: 'tel:+9647704457696',
    },
  ];

  return (
    <section id="contact" className="section-padding bg-black">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
              Have a project in mind or just want to chat? I'd love to hear from you. 
              Let's work together to bring your ideas to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Let's Connect
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you're a company looking to hire, or you're someone with an 
                  idea you'd like to discuss, feel free to reach out.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {item.label}
                      </div>
                      <div className="text-white font-medium">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-black p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    error={errors.name}
                    required
                    placeholder="Your name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    error={errors.email}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <Input
                  label="Subject"
                  type="text"
                  value={formData.subject}
                  onChange={(value) => handleInputChange('subject', value)}
                  error={errors.subject}
                  required
                  placeholder="What's this about?"
                />

                <TextArea
                  label="Message"
                  value={formData.message}
                  onChange={(value) => handleInputChange('message', value)}
                  error={errors.message}
                  required
                  rows={6}
                  placeholder="Tell me about your project or idea..."
                />

                <motion.button
                  type="submit"
                  disabled={formState !== 'idle'}
                  className={`w-full py-4 px-8 rounded-full font-medium text-lg transition-all duration-300 relative overflow-hidden border-2 ${
                    formState === 'idle' 
                      ? 'bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm' 
                      : formState === 'loading'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-300 backdrop-blur-sm'
                      : formState === 'success'
                      ? 'bg-green-500/20 border-green-400 text-green-300 backdrop-blur-sm'
                      : 'bg-red-500/20 border-red-400 text-red-300 backdrop-blur-sm'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  whileHover={formState === 'idle' ? { 
                    scale: 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.6)'
                  } : {}}
                >
                  <AnimatePresence mode="wait">
                    {formState === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        Send Message
                      </motion.span>
                    )}
                    
                    {formState === 'loading' && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </motion.div>
                    )}
                    
                    {formState === 'success' && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <motion.svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                        Message Sent!
                      </motion.div>
                    )}
                    
                    {formState === 'error' && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Failed to Send
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
