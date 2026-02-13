import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { sendContactEmail } from '../../services/emailService'
import { personalInfo } from '../../data/portfolioData'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { MailIcon, GitHubIcon } from '../icons'
import { fadeUp, motionElements } from '../../utils/motion'
import type { ContactForm } from '../../types'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const Contact: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()
  const animated = !prefersReducedMotion

  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<ContactForm>>({})
  const [formState, setFormState] = useState<FormState>('idle')

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const e: Partial<ContactForm> = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Enter a valid email'
    if (!formData.subject.trim()) e.subject = 'Subject is required'
    if (!formData.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setFormState('loading')
    try {
      await sendContactEmail(formData)
      setFormState('success')
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFormState('idle')
      }, 3000)
    } catch {
      setFormState('error')
      setTimeout(() => setFormState('idle'), 3000)
    }
  }

  const { Wrapper, Item, wrapperProps } = motionElements(animated)

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <Wrapper className="max-w-2xl mx-auto" {...wrapperProps}>
          {/* Header */}
          <Item {...(animated ? { variants: fadeUp } : {})}>
            <div className="text-center mb-10">
              <p className="text-overline text-primary mb-3">Contact</p>
              <h2 className="text-heading-1 text-foreground mb-4">
                Let&rsquo;s work together
              </h2>
              <p className="text-body text-text-secondary text-balance">
                Looking for a developer? I&rsquo;m available for full-time roles
                and select freelance projects.
              </p>
            </div>
          </Item>

          {/* Quick contact cards */}
          <Item {...(animated ? { variants: fadeUp } : {})}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <a
                href={`mailto:${personalInfo.email}`}
                className="glass rounded-2xl p-5 flex items-center gap-4 group transition-colors duration-200"
                aria-label="Send email"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-caption text-text-tertiary">Email</div>
                  <div className="text-sm text-foreground">{personalInfo.email}</div>
                </div>
              </a>
              <a
                href={personalInfo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-5 flex items-center gap-4 group transition-colors duration-200"
                aria-label="GitHub profile"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  <GitHubIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-caption text-text-tertiary">GitHub</div>
                  <div className="text-sm text-foreground">
                    github.com/{personalInfo.githubUsername}
                  </div>
                </div>
              </a>
            </div>
          </Item>

          {/* Form */}
          <Item {...(animated ? { variants: fadeUp } : {})}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FloatingField
                    id="name"
                    label="Name"
                    value={formData.name}
                    error={errors.name}
                    onChange={(v) => handleChange('name', v)}
                  />
                  <FloatingField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    error={errors.email}
                    onChange={(v) => handleChange('email', v)}
                  />
                </div>

                <FloatingField
                  id="subject"
                  label="Subject"
                  value={formData.subject}
                  error={errors.subject}
                  onChange={(v) => handleChange('subject', v)}
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    placeholder="Tell me about your project…"
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <SubmitButton state={formState} />

                {/* Screen reader status */}
                <div className="sr-only" role="status" aria-live="polite">
                  {formState === 'loading' && 'Sending your message…'}
                  {formState === 'success' && 'Message sent successfully!'}
                  {formState === 'error' && 'Failed to send. Please try again.'}
                </div>
              </form>
            </div>
          </Item>
        </Wrapper>
      </div>
    </section>
  )
}

/* ──── Floating label field ──── */
function FloatingField({
  id,
  label,
  type = 'text',
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  type?: string
  value: string
  error?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        {label} <span className="text-destructive">*</span>
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className={error ? 'border-destructive' : ''}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/* ──── Submit button with state ──── */
function SubmitButton({ state }: { state: FormState }) {
  const cls =
    state === 'idle'
      ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
      : state === 'loading'
        ? 'bg-primary/20 border border-primary/40 text-primary'
        : state === 'success'
          ? 'bg-success/20 border border-success/40 text-success'
          : 'bg-destructive/20 border border-destructive/40 text-destructive'

  return (
    <motion.button
      type="submit"
      disabled={state !== 'idle'}
      className={`w-full py-3.5 px-8 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${cls}`}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            Send Message
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Sending…
          </motion.div>
        )}
        {state === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            ✓ Message Sent
          </motion.span>
        )}
        {state === 'error' && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            Failed — Try Again
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default Contact
