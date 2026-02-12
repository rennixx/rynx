import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import { useGitHubRepoStats } from '../../hooks/useGitHubData';
import type { Project } from '../../data/portfolioData';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Extract GitHub repo info from URL
  const githubInfo = React.useMemo(() => {
    if (!project.githubUrl) return null;
    const match = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
  }, [project.githubUrl]);

  // Fetch GitHub stats if available
  const { data: repoStats, isLoading: statsLoading } = useGitHubRepoStats(
    githubInfo?.owner || '',
    githubInfo?.repo || '',
    !!githubInfo
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30';
      case 'in-progress':
        return 'bg-info/20 text-info border-info/30';
      case 'planned':
        return 'bg-muted text-text-secondary border-border-default';
      default:
        return 'bg-muted text-text-secondary border-border-default';
    }
  };

  const getCategoryIcon = (category: Project['category']) => {
    const iconClass = "w-4 h-4";
    switch (category) {
      case 'web':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9 9m9 9c0-5 4-9 9-9z" />
          </svg>
        );
      case 'mobile':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
          </svg>
        );
      case 'desktop':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'api':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'tool':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      className="group"
    >
      <div className="bg-surface-1 rounded-2xl overflow-hidden shadow-lg h-full border border-border-default hover:border-border-strong transition-all duration-300">
        {/* Project Image */}
        <div className="aspect-video bg-surface-2 flex items-center justify-center relative overflow-hidden">
          {project.imageUrl ? (
            <>
              <img
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-text-tertiary">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">Project Screenshot</p>
            </div>
          )}
          
          {/* Project Status & Category Overlay */}
          <div className="absolute top-3 left-3 flex gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </div>
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
              {getCategoryIcon(project.category)}
              {project.category}
            </div>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-3 right-3 bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-2 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
              ⭐ Featured
            </div>
          )}

          {/* GitHub Stats Overlay */}
          {repoStats && !statsLoading && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  ⭐ {repoStats.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  🍴 {repoStats.forks_count}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h3>
            {project.caseStudy && (
              <button
                onClick={() => setShowCaseStudy(!showCaseStudy)}
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                {showCaseStudy ? 'Hide' : 'Case Study'}
              </button>
            )}
          </div>
          
          <p className="text-text-secondary mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Case Study Expandable */}
          <AnimatePresence>
            {showCaseStudy && project.caseStudy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-surface-2 rounded-lg p-4 mb-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-warning mb-1">Challenge</h4>
                    <p className="text-text-secondary text-sm">{project.caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-success mb-1">Solution</h4>
                    <p className="text-text-secondary text-sm">{project.caseStudy.solution}</p>
                  </div>
                  {project.caseStudy.results.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-info mb-1">Results</h4>
                      <ul className="text-text-secondary text-sm space-y-1">
                        {project.caseStudy.results.map((result, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-success mt-1">•</span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, techIndex) => (
              <motion.span
                key={tech}
                className="px-3 py-1 bg-surface-2 text-text-secondary text-sm rounded-full hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: techIndex * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Project Timeline */}
          {(project.startDate || project.endDate) && (
            <div className="text-xs text-text-tertiary mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}`}
            </div>
          )}

          {/* Project Links */}
          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/80 px-4 py-2 text-sm"
              >
                Live Demo
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background active:bg-foreground/90 px-4 py-2 text-sm"
              >
                View Code
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
