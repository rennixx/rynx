import { personalInfo } from '../../data/portfolioData';
import { GitHubIcon, XIcon } from '../icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      href: `https://github.com/${personalInfo.githubUsername}`,
      icon: <GitHubIcon className="h-5 w-5" />,
    },
    {
      name: 'X',
      href: 'https://x.com/vrynyx',
      icon: <XIcon className="h-5 w-5" />,
    },
  ];

  return (
    <footer className="bg-background border-t border-border-subtle" aria-label="Site footer">
      <div className="container section-padding">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1"
                aria-label={`Visit ${item.name} profile`}
              >
                {item.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © {currentYear} RYNX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
