import { useQuery } from '@tanstack/react-query';
import { githubService } from '../services/githubApi';
import type { GitHubRepo } from '../services/githubApi';

interface UseGitHubReposOptions {
  username?: string;
  repoNames?: string[];
  enabled?: boolean;
}

export const useGitHubRepos = ({ 
  username, 
  repoNames, 
  enabled = true 
}: UseGitHubReposOptions = {}) => {
  return useQuery({
    queryKey: ['github-repos', username, repoNames],
    queryFn: async (): Promise<GitHubRepo[]> => {
      if (repoNames && repoNames.length > 0) {
        return githubService.getRepositories(repoNames);
      } else if (username) {
        return githubService.getUserRepos(username, {
          sort: 'updated',
          direction: 'desc',
          per_page: 10,
          type: 'owner'
        });
      }
      return [];
    },
    enabled: enabled && (!!username || (!!repoNames && repoNames.length > 0)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useGitHubUser = (username?: string) => {
  return useQuery({
    queryKey: ['github-user', username],
    queryFn: () => githubService.getUser(username!),
    enabled: !!username,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useGitHubRepoStats = (owner: string, repo: string, enabled = true) => {
  return useQuery({
    queryKey: ['github-repo-stats', owner, repo],
    queryFn: () => githubService.getRepoStats(owner, repo),
    enabled: enabled && !!owner && !!repo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
