import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

// GitHub API types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubLanguageStats {
  [language: string]: number;
}

// Create axios instance with default config
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  timeout: 10000,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
});

// Add GitHub token if available (for higher rate limits)
if (import.meta.env.VITE_GITHUB_TOKEN) {
  githubApi.defaults.headers.common['Authorization'] = 
    `token ${import.meta.env.VITE_GITHUB_TOKEN}`;
}

// API functions
export const githubService = {
  // Get user profile
  async getUser(username: string): Promise<GitHubUser> {
    const response = await githubApi.get<GitHubUser>(`/users/${username}`);
    return response.data;
  },

  // Get user repositories
  async getUserRepos(username: string, options?: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    type?: 'all' | 'owner' | 'member';
  }): Promise<GitHubRepo[]> {
    const params = new URLSearchParams();
    
    if (options?.sort) params.append('sort', options.sort);
    if (options?.direction) params.append('direction', options.direction);
    if (options?.per_page) params.append('per_page', options.per_page.toString());
    if (options?.type) params.append('type', options.type);

    const response = await githubApi.get<GitHubRepo[]>(
      `/users/${username}/repos?${params.toString()}`
    );
    return response.data;
  },

  // Get repository languages
  async getRepoLanguages(owner: string, repo: string): Promise<GitHubLanguageStats> {
    const response = await githubApi.get<GitHubLanguageStats>(
      `/repos/${owner}/${repo}/languages`
    );
    return response.data;
  },

  // Get multiple repositories by full names
  async getRepositories(repoNames: string[]): Promise<GitHubRepo[]> {
    const promises = repoNames.map(async (fullName) => {
      try {
        const response = await githubApi.get<GitHubRepo>(`/repos/${fullName}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch repo ${fullName}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((repo): repo is GitHubRepo => repo !== null);
  },

  // Get repository statistics
  async getRepoStats(owner: string, repo: string) {
    try {
      const [repoData, languages] = await Promise.all([
        githubApi.get<GitHubRepo>(`/repos/${owner}/${repo}`),
        githubApi.get<GitHubLanguageStats>(`/repos/${owner}/${repo}/languages`)
      ]);

      return {
        ...repoData.data,
        languages
      };
    } catch (error) {
      console.error(`Failed to fetch stats for ${owner}/${repo}:`, error);
      throw error;
    }
  }
};

// Rate limit handler
githubApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && 
        error.response?.headers['x-ratelimit-remaining'] === '0') {
      const resetTime = error.response.headers['x-ratelimit-reset'];
      const resetDate = new Date(parseInt(resetTime) * 1000);
      console.warn(`GitHub API rate limit exceeded. Resets at: ${resetDate.toLocaleTimeString()}`);
    }
    return Promise.reject(error);
  }
);

export default githubService;
