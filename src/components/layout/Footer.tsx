import { personalInfo } from '../../data/portfolioData'
import { GitHubIcon, XIcon } from '../icons'

const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  const links = [
    {
      name: 'GitHub',
      href: personalInfo.githubUrl,
      icon: <GitHubIcon className="h-4 w-4" />,
    },
    {
      name: 'X',
      href: 'https://x.com/vrynyx',
      icon: <XIcon className="h-4 w-4" />,
    },
  ]

  return (
    <footer
      className="border-t border-border-subtle py-8"
      aria-label="Site footer"
    >
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-tertiary">
        {/* Copyright */}
        <p>© {year} RYNX</p>

        {/* Built with */}
        <p className="text-caption">
          Built with React & TypeScript
        </p>

        {/* Social links */}
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-foreground transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${link.name} profile`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
