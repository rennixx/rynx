import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGitHubRepoStats } from '../../hooks/useGitHubData'
import type { Project } from '../../data/portfolioData'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [showCaseStudy, setShowCaseStudy] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const githubInfo = useMemo(() => {
    if (!project.githubUrl) return null
    const match = project.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    return match ? { owner: match[1], repo: match[2] } : null
  }, [project.githubUrl])

  const { data: repoStats } = useGitHubRepoStats(
    githubInfo?.owner ?? '',
    githubInfo?.repo ?? '',
    !!githubInfo,
  )

  const statusDot =
    project.status === 'completed'
      ? 'bg-success'
      : project.status === 'in-progress'
        ? 'bg-warning'
        : 'bg-text-tertiary'

  /* ──── Featured (large 2-col) card ──── */
  if (featured) {
    return (
      <article className="group col-span-1 md:col-span-2 glass rounded-2xl overflow-hidden transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-video md:aspect-auto overflow-hidden bg-surface-1">
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {/* Status + stats overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                {project.status === 'completed' ? 'Live' : 'In progress'}
              </span>
              {repoStats && (repoStats.stargazers_count > 0 || repoStats.forks_count > 0) && (
                <span className="inline-flex items-center gap-2 text-xs text-text-secondary bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                  {repoStats.stargazers_count > 0 && <span>★ {repoStats.stargazers_count}</span>}
                  {repoStats.forks_count > 0 && <span>⑂ {repoStats.forks_count}</span>}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-heading-3 text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                {project.title}
              </h3>
              <p className="text-body-sm text-text-secondary mb-5 leading-relaxed">
                {project.description}
              </p>

              {/* Case study */}
              {project.caseStudy && (
                <>
                  <button
                    onClick={() => setShowCaseStudy(!showCaseStudy)}
                    className="text-xs font-medium text-primary hover:text-primary-hover transition-colors mb-3"
                  >
                    {showCaseStudy ? '— Hide case study' : '+ View case study'}
                  </button>
                  <AnimatePresence>
                    {showCaseStudy && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="bg-surface-1 rounded-xl p-4 space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-warning">Challenge — </span>
                            <span className="text-text-secondary">{project.caseStudy.challenge}</span>
                          </div>
                          <div>
                            <span className="font-medium text-success">Solution — </span>
                            <span className="text-text-secondary">{project.caseStudy.solution}</span>
                          </div>
                          {project.caseStudy.results.length > 0 && (
                            <ul className="text-text-secondary space-y-1">
                              {project.caseStudy.results.map((r, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-success shrink-0">✓</span>
                                  {r}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 text-xs rounded-full bg-surface-2 text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Live demo
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
                >
                  Source
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

  /* ──── Standard (compact 1-col) card ──── */
  return (
    <article className="group glass rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col h-full">
      {/* Mini image */}
      {project.imageUrl && (
        <div className="relative aspect-[2/1] overflow-hidden bg-surface-1">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              {project.status === 'completed' ? 'Live' : 'In progress'}
            </span>
          </div>
          {repoStats && (repoStats.stargazers_count > 0 || repoStats.forks_count > 0) && (
            <div className="absolute bottom-2 right-2">
              <span className="inline-flex items-center gap-2 text-xs text-text-secondary bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                {repoStats.stargazers_count > 0 && <span>★ {repoStats.stargazers_count}</span>}
                {repoStats.forks_count > 0 && <span>⑂ {repoStats.forks_count}</span>}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-heading-3 text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200 text-base">
          {project.title}
        </h3>
        <p className="text-body-sm text-text-secondary mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-full bg-surface-2 text-text-tertiary"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-surface-2 text-text-tertiary">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links — reveal on hover */}
        <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              Live ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-text-secondary hover:text-foreground transition-colors"
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
