// Portfolio Content Data
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'tool';
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  caseStudy?: {
    challenge: string;
    solution: string;
    results: string[];
    learnings: string[];
  };
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'tool';
  yearsOfExperience: number;
  icon?: string;
  color?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
  technologies: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  imageUrl?: string;
}

// Sample data - replace with your actual content
export const projects: Project[] = [
  {
    id: 'portfolio-website',
    title: 'Interactive Portfolio Website',
    description: 'Modern React portfolio with advanced animations and 3D effects',
    longDescription: 'A cutting-edge portfolio website built with React, TypeScript, and Framer Motion. Features include a 3D animated background with water sphere effects, typewriter animations, and a fully responsive design with dark theme.',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Canvas API'],
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.dev',
    imageUrl: '/images/portfolio-preview.jpg',
    featured: true,
    category: 'web',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-02-15',
    caseStudy: {
      challenge: 'Create a unique portfolio that stands out with advanced animations while maintaining performance',
      solution: 'Implemented a multi-phase development approach with optimized Canvas animations and motion design',
      results: [
        '60fps animations across all devices',
        '95+ performance score on Lighthouse',
        'Unique water sphere 3D effect'
      ],
      learnings: [
        'Advanced Canvas optimization techniques',
        'Complex animation orchestration with Framer Motion',
        'Performance-first animation development'
      ]
    }
  },
  {
    id: 'ecommerce-platform',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with React and Node.js',
    longDescription: 'A comprehensive e-commerce platform featuring user authentication, product management, shopping cart, payment integration, and admin dashboard. Built with modern technologies and best practices.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Redux'],
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveUrl: 'https://shop.yoursite.com',
    imageUrl: '/images/ecommerce-preview.jpg',
    featured: true,
    category: 'web',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2023-12-15'
  },
  {
    id: 'task-management-app',
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    longDescription: 'A productivity app that enables teams to collaborate on projects with real-time updates, drag-and-drop functionality, and advanced filtering options.',
    technologies: ['React', 'Socket.io', 'Node.js', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/yourusername/task-manager',
    imageUrl: '/images/taskmanager-preview.jpg',
    featured: false,
    category: 'web',
    status: 'in-progress',
    startDate: '2024-01-15'
  }
];

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 95, category: 'frontend', yearsOfExperience: 4, color: '#61DAFB' },
  { name: 'TypeScript', level: 90, category: 'frontend', yearsOfExperience: 3, color: '#3178C6' },
  { name: 'JavaScript', level: 95, category: 'frontend', yearsOfExperience: 5, color: '#F7DF1E' },
  { name: 'Next.js', level: 85, category: 'frontend', yearsOfExperience: 2, color: '#000000' },
  { name: 'Vue.js', level: 75, category: 'frontend', yearsOfExperience: 2, color: '#4FC08D' },
  { name: 'HTML/CSS', level: 98, category: 'frontend', yearsOfExperience: 6, color: '#E34F26' },
  { name: 'Tailwind CSS', level: 92, category: 'frontend', yearsOfExperience: 3, color: '#06B6D4' },
  { name: 'Framer Motion', level: 88, category: 'frontend', yearsOfExperience: 2, color: '#0055FF' },

  // Backend
  { name: 'Node.js', level: 88, category: 'backend', yearsOfExperience: 4, color: '#339933' },
  { name: 'Express.js', level: 85, category: 'backend', yearsOfExperience: 3, color: '#000000' },
  { name: 'Python', level: 80, category: 'backend', yearsOfExperience: 3, color: '#3776AB' },
  { name: 'Django', level: 75, category: 'backend', yearsOfExperience: 2, color: '#092E20' },
  { name: 'GraphQL', level: 70, category: 'backend', yearsOfExperience: 1, color: '#E10098' },

  // Database
  { name: 'MongoDB', level: 82, category: 'database', yearsOfExperience: 3, color: '#47A248' },
  { name: 'PostgreSQL', level: 78, category: 'database', yearsOfExperience: 2, color: '#336791' },
  { name: 'Redis', level: 65, category: 'database', yearsOfExperience: 1, color: '#DC382D' },

  // DevOps & Tools
  { name: 'Docker', level: 75, category: 'devops', yearsOfExperience: 2, color: '#2496ED' },
  { name: 'AWS', level: 70, category: 'devops', yearsOfExperience: 2, color: '#FF9900' },
  { name: 'Git', level: 95, category: 'tool', yearsOfExperience: 5, color: '#F05032' },
  { name: 'Figma', level: 85, category: 'design', yearsOfExperience: 3, color: '#F24E1E' }
];

export const experiences: Experience[] = [
  {
    id: 'senior-frontend-dev',
    company: 'Freelance',
    position: 'Full-Stack Developer',
    startDate: '2023-06-01',
    description: 'Full-Stack Developer',
    achievements: [
      'Full-Stack Developer',
      'Full-Stack Developer',
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Jest', 'Cypress'],
    location: 'Remote',
    type: 'full-time'
  },
  {
    id: 'frontend-dev',
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    startDate: '2021-01-15',
    endDate: '2022-05-30',
    description: 'Developed and maintained multiple React applications, collaborated with design team to implement pixel-perfect UIs.',
    achievements: [
      'Built 3 major features from concept to production',
      'Reduced bundle size by 35% through code optimization',
      'Implemented responsive design system used across 5 products'
    ],
    technologies: ['React', 'JavaScript', 'Sass', 'Webpack', 'Redux'],
    location: 'San Francisco, CA',
    type: 'full-time'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Johnson',
    position: 'Product Manager',
    company: 'TechCorp',
    content: 'Working with this developer was exceptional. Their attention to detail and ability to implement complex animations while maintaining performance is outstanding.',
    rating: 5,
    avatar: '/images/testimonial-sarah.jpg',
    date: '2024-01-15'
  },
  {
    id: 'testimonial-2',
    name: 'Mike Chen',
    position: 'CTO',
    company: 'StartupXYZ',
    content: 'One of the most skilled frontend developers I\'ve worked with. Consistently delivers high-quality code and brings innovative solutions to complex problems.',
    rating: 5,
    avatar: '/images/testimonial-mike.jpg',
    date: '2023-12-10'
  },
  {
    id: 'testimonial-3',
    name: 'Emily Rodriguez',
    position: 'Design Lead',
    company: 'CreativeAgency',
    content: 'Incredible ability to bring designs to life with smooth animations and interactions. Always goes above and beyond to ensure the final product exceeds expectations.',
    rating: 5,
    avatar: '/images/testimonial-emily.jpg',
    date: '2023-11-22'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'react-performance-optimization',
    title: 'Advanced React Performance Optimization Techniques',
    excerpt: 'Deep dive into React performance optimization strategies including memoization, code splitting, and advanced patterns.',
    content: '# Advanced React Performance Optimization\n\nIn this article, we\'ll explore...',
    publishDate: '2024-01-20',
    tags: ['React', 'Performance', 'JavaScript', 'Web Development'],
    readTime: 8,
    featured: true,
    imageUrl: '/images/blog-react-performance.jpg'
  },
  {
    id: 'animation-best-practices',
    title: 'Creating Smooth Web Animations: Best Practices',
    excerpt: 'Learn how to create performant, smooth animations that enhance user experience without compromising performance.',
    content: '# Creating Smooth Web Animations\n\nAnimations can make or break...',
    publishDate: '2024-01-10',
    tags: ['Animation', 'CSS', 'JavaScript', 'UX'],
    readTime: 6,
    featured: false,
    imageUrl: '/images/blog-animations.jpg'
  }
];

// Personal information
export const personalInfo = {
  name: 'Ren',
  title: 'Full-Stack Developer',
  email: 'vrynyx@gmail.com',
  phone: '+964 7704457696',
  location: 'Erbil, Kurdistan',
  githubUsername: 'rennixx',
  linkedIn: 'https://linkedin.com/in/yourprofile',
  twitter: 'https://twitter.com/yourhandle',
  website: 'https://yourwebsite.com',
  bio: 'Passionate full-stack developer with expertise in modern web technologies. I love creating beautiful, performant applications that solve real-world problems.',
  
};
