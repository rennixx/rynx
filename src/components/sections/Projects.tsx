import React from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../ui/AnimatedButton';
import ProjectCard from '../ui/ProjectCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { personalInfo, projects as sampleProjects } from '../../data/portfolioData';
import { useGitHubRepos } from '../../hooks/useGitHubData';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const Projects: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  // Fetch GitHub repos for the user
  const { data: githubRepos, isLoading, error } = useGitHubRepos({
    username: personalInfo.githubUsername,
    enabled: !!personalInfo.githubUsername
  });

  // Combine sample projects with GitHub repos
  const displayedProjects = React.useMemo(() => {
    const projects = [...sampleProjects];

    // Add GitHub repos as projects
    if (githubRepos) {
      githubRepos.forEach((repo) => {
        // Skip if it's already in sample projects or if it's a fork
        if (sampleProjects.some(p => p.githubUrl?.includes(repo.full_name)) || repo.fork) {
          return;
        }

        const repoProject = {
          id: `github-${repo.id}`,
          title: repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: repo.description || `A ${repo.language || 'software'} project`,
          longDescription: repo.description || `A ${repo.language || 'software'} project with ${repo.stargazers_count} stars and ${repo.forks_count} forks.`,
          technologies: repo.language ? [repo.language, 'JavaScript', 'Git'] : ['JavaScript', 'Git'],
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || undefined,
          imageUrl: `https://opengraph.githubassets.com/1/${repo.full_name}`,
          featured: repo.stargazers_count > 0,
          category: 'web' as const,
          status: (repo.archived ? 'completed' as const : 'in-progress' as const),
          startDate: repo.created_at,
          endDate: repo.archived ? repo.updated_at : undefined
        };

        projects.push(repoProject);
      });
    }

    // Limit to 3 projects total
    return projects.slice(0, 3);
  }, [githubRepos]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (prefersReducedMotion) {
    return (
      <section id="projects" className="section-padding bg-black">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
                Here are some of my recent projects that showcase my skills and passion for development.
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Loading projects from GitHub...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400">Error loading projects: {error.message}</p>
              </div>
            )}

            {/* Projects Grid */}
            {!isLoading && !error && displayedProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {displayedProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}

            {/* GitHub Button */}
            <div className="text-center">
              <AnimatedButton
                effect="magnetic"
                size="lg"
                onClick={() => window.open(`https://github.com/${personalInfo.githubUsername}`, '_blank')}
              >
                View All on GitHub
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-black">
      <div className="container">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
              Here are some of my recent projects that showcase my skills and passion for development.
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
            >
              <LoadingSpinner size="lg" />
              <p className="text-gray-400 mt-4">Loading projects from GitHub...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
            >
              <p className="text-red-400">Error loading projects: {error.message}</p>
            </motion.div>
          )}

          {/* Projects Grid */}
          {!isLoading && !error && displayedProjects.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              variants={itemVariants}
            >
              {displayedProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}

          {/* GitHub Button */}
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <AnimatedButton
              effect="magnetic"
              size="lg"
              onClick={() => window.open(`https://github.com/${personalInfo.githubUsername}`, '_blank')}
            >
              View All on GitHub
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
