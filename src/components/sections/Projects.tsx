import { useMemo } from 'react'
import ProjectCard from '../ui/ProjectCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { personalInfo, projects as sampleProjects } from '../../data/portfolioData'
import { useGitHubRepos } from '../../hooks/useGitHubData'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GitHubIcon } from '../icons'
import { fadeUp, motionElements } from '../../utils/motion'

function GitHubLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={personalInfo.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors inline-flex ${className}`}
    >
      <GitHubIcon />
      View all on GitHub
    </a>
  )
}

const Projects: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()

  const { data: githubRepos, isLoading, error } = useGitHubRepos({
    username: personalInfo.githubUsername,
    enabled: !!personalInfo.githubUsername,
  })

  const displayedProjects = useMemo(() => {
    const result = [...sampleProjects]

    if (githubRepos) {
      for (const repo of githubRepos) {
        if (repo.fork) continue
        if (sampleProjects.some((p) => p.githubUrl?.includes(repo.full_name))) continue

        result.push({
          id: `github-${repo.id}`,
          title: repo.name
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: repo.description || `A ${repo.language || 'software'} project`,
          longDescription: repo.description || '',
          technologies: repo.language ? [repo.language, 'Git'] : ['Git'],
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || undefined,
          imageUrl: `https://opengraph.githubassets.com/1/${repo.full_name}`,
          featured: false,
          category: 'web' as const,
          status: repo.archived ? 'completed' as const : 'in-progress' as const,
          startDate: repo.created_at,
          endDate: repo.archived ? repo.updated_at : undefined,
        })
      }
    }

    return result.slice(0, 6)
  }, [githubRepos])

  const featured = displayedProjects.filter((p) => p.featured)
  const rest = displayedProjects.filter((p) => !p.featured)

  const { Wrapper, Item, wrapperProps } = motionElements(!prefersReducedMotion)

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <Wrapper className="max-w-6xl mx-auto" {...wrapperProps}>
          {/* Header */}
          <Item {...(prefersReducedMotion ? {} : { variants: fadeUp })}>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-overline text-primary mb-3">Portfolio</p>
                <h2 className="text-heading-1 text-foreground">Selected Work</h2>
              </div>
              <GitHubLink className="hidden sm:inline-flex" />
            </div>
          </Item>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-16">
              <LoadingSpinner size="lg" />
              <p className="text-text-tertiary mt-4 text-sm">Fetching projects…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive text-sm">Could not load projects.</p>
            </div>
          )}

          {/* Bento Grid */}
          {!isLoading && !error && displayedProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Featured cards (span 2 cols) */}
              {featured.map((project) => (
                <Item
                  key={project.id}
                  className="md:col-span-2"
                  {...(prefersReducedMotion ? {} : { variants: fadeUp })}
                >
                  <ProjectCard project={project} featured />
                </Item>
              ))}

              {/* Standard cards */}
              {rest.map((project) => (
                <Item
                  key={project.id}
                  {...(prefersReducedMotion ? {} : { variants: fadeUp })}
                >
                  <ProjectCard project={project} />
                </Item>
              ))}
            </div>
          )}

          {/* Mobile GitHub link */}
          <div className="mt-8 text-center sm:hidden">
            <GitHubLink />
          </div>
        </Wrapper>
      </div>
    </section>
  )
}

export default Projects
