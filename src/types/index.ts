export interface NavItem {
  label: string;
  href: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'tool';
  yearsOfExperience: number;
  icon?: string;
  color?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
