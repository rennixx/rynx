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
    title: 'RYNX Portfolio',
    description: 'Modern interactive portfolio with 3D animations and advanced effects',
    longDescription: 'A cutting-edge portfolio website showcasing my skills and projects. Features custom 3D water sphere animations, smooth transitions, and a fully responsive design optimized for performance.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Canvas API'],
    githubUrl: 'https://github.com/rennixx/rynx',
    liveUrl: 'https://www.rynx.dev/',
    imageUrl: 'https://opengraph.githubassets.com/1/rennixx/rynx',
    featured: true,
    category: 'web',
    status: 'completed',
    startDate: '2024-08-01',
    endDate: '2025-01-15'
  },
  {
    id: 'mamcenter2012',
    title: 'Mamcenter2012',
    description: 'Educational platform for learning and development resources',
    longDescription: 'An educational platform providing comprehensive learning resources and development tools for students and educators, featuring interactive content management and user engagement features.',
    technologies: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'CSS'],
    githubUrl: 'https://github.com/rennixx/mamcenter2012',
    liveUrl: 'https://mamcenter.netlify.app/',
    imageUrl: 'https://opengraph.githubassets.com/1/rennixx/mamcenter2012',
    featured: true,
    category: 'web',
    status: 'completed',
    startDate: '2024-06-01',
    endDate: '2024-10-15'
  },
  {
    id: 'lis',
    title: 'LIS',
    description: 'Library Information System for managing library operations',
    longDescription: 'A comprehensive library information system designed to streamline library operations, including book management, user tracking, and administrative functions with modern web technologies.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    githubUrl: 'https://github.com/rennixx/LIS',
    imageUrl: 'https://opengraph.githubassets.com/1/rennixx/LIS',
    featured: false,
    category: 'web',
    status: 'completed',
    startDate: '2025-01-01',
    endDate: '2025-03-01'
  }
];

export const skills: Skill[] = [
  // Frontend - Core Strengths
  { name: 'React', level: 90, category: 'frontend', yearsOfExperience: 3, color: '#61DAFB' },
  { name: 'TypeScript', level: 85, category: 'frontend', yearsOfExperience: 2, color: '#3178C6' },
  { name: 'JavaScript', level: 95, category: 'frontend', yearsOfExperience: 4, color: '#F7DF1E' },
  { name: 'HTML/CSS', level: 95, category: 'frontend', yearsOfExperience: 4, color: '#E34F26' },
  { name: 'Tailwind CSS', level: 88, category: 'frontend', yearsOfExperience: 2, color: '#06B6D4' },
  { name: 'Framer Motion', level: 80, category: 'frontend', yearsOfExperience: 1, color: '#0055FF' },
  { name: 'Three.js', level: 75, category: 'frontend', yearsOfExperience: 1, color: '#000000' },

  // Backend
  { name: 'Node.js', level: 82, category: 'backend', yearsOfExperience: 2, color: '#339933' },
  { name: 'Express.js', level: 78, category: 'backend', yearsOfExperience: 2, color: '#000000' },
  { name: 'Python', level: 70, category: 'backend', yearsOfExperience: 1, color: '#3776AB' },
  { name: 'REST APIs', level: 85, category: 'backend', yearsOfExperience: 2, color: '#FF6B6B' },

  // Database
  { name: 'MongoDB', level: 75, category: 'database', yearsOfExperience: 1, color: '#47A248' },
  { name: 'PostgreSQL', level: 70, category: 'database', yearsOfExperience: 1, color: '#336791' },

  // DevOps & Tools
  { name: 'Git', level: 90, category: 'tool', yearsOfExperience: 3, color: '#F05032' },
  { name: 'Vite', level: 85, category: 'tool', yearsOfExperience: 2, color: '#646CFF' },
  { name: 'Vercel', level: 80, category: 'devops', yearsOfExperience: 1, color: '#000000' },
  { name: 'Docker', level: 65, category: 'devops', yearsOfExperience: 1, color: '#2496ED' },

  // Design
  { name: 'Figma', level: 70, category: 'design', yearsOfExperience: 1, color: '#F24E1E' }
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
