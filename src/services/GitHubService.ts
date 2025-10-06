import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private static TOKEN_KEY = 'github_access_token';
  
  // Simple authentication method - ask for token directly
  static async authenticateWithToken(token: string): Promise<boolean> {
    if (!token || !token.trim()) {
      throw new Error('Token is required');
    }

    try {
      // Test the token by making an authenticated request
      const response = await axios.get(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `token ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (response.data) {
        // Test token permissions by checking what we can access
        console.log('Testing token permissions...');
        
        try {
          // Test private repo access
          const privateTest = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
            headers: {
              Authorization: `token ${token.trim()}`,
              Accept: 'application/vnd.github.v3+json',
            },
            params: {
              visibility: 'private',
              per_page: 5
            }
          });
          console.log(`Token can access ${privateTest.data.length} private repositories`);
        } catch (repoError) {
          if (axios.isAxiosError(repoError)) {
            if (repoError.response?.status === 403) {
              console.warn('Token does not have repo scope - only public repositories will be visible');
            } else if (repoError.response?.status === 422) {
              console.log('Private repo parameter not supported, will try alternative method');
            }
          }
        }
        
        // Test general repo access and check for private repos
        try {
          const generalTest = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
            headers: {
              Authorization: `token ${token.trim()}`,
              Accept: 'application/vnd.github.v3+json',
            },
            params: {
              per_page: 10
            }
          });
          
          const totalRepos = generalTest.data.length;
          const privateRepos = generalTest.data.filter((repo: any) => repo.private).length;
          const publicRepos = totalRepos - privateRepos;
          
          console.log(`🔍 Authentication test results:`);
          console.log(`   Total repositories accessible: ${totalRepos}`);
          console.log(`   Private repositories: ${privateRepos}`);
          console.log(`   Public repositories: ${publicRepos}`);
          
          if (totalRepos > 0 && privateRepos === 0) {
            console.warn('⚠️ WARNING: Token appears to only have access to public repositories!');
            console.warn('   Make sure your token has the "repo" scope selected.');
          } else if (privateRepos > 0) {
            console.log('✅ Token has access to private repositories!');
          }
          
        } catch (generalError) {
          console.warn('General repository access test failed:', generalError);
        }
        
        this.setToken(token.trim());
        return true;
      }
      
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid token. Please check your Personal Access Token and try again.');
        }
        if (error.response?.status === 403) {
          throw new Error('Token does not have required permissions. Please ensure your token has "repo", "user", and "read:org" scopes.');
        }
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to authenticate with the provided token');
    }
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.get(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token is invalid, clear it
          this.logout();
          throw new Error('Authentication expired. Please login again.');
        }
      }
      throw new Error('Failed to fetch user data from GitHub');
    }
  }

  static async getUserRepositories(page = 1, perPage = 100) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      // Fetch all repositories (public and private)
      const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          page,
          per_page: perPage,
          sort: 'updated',
          direction: 'desc',
          affiliation: 'owner,collaborator,organization_member'
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.logout();
          throw new Error('Authentication expired. Please login again.');
        }
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions. Please ensure your token has "repo" scope to access private repositories.');
        }
        if (error.response?.status === 422) {
          // Try with minimal parameters
          console.warn('GitHub API returned 422, trying with minimal parameters');
          const simpleResponse = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
            params: {
              page,
              per_page: perPage,
              sort: 'updated'
            },
          });
          return simpleResponse.data;
        }
        
        console.error('GitHub API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }

  // Fetch repositories with comprehensive approach - gets ALL repos including private
  static async getAllUserRepositories() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    console.log('Starting comprehensive repository fetch...');

    try {
      // First try the standard approach that should get ALL repositories
      const allRepos: any[] = [];
      let page = 1;
      const perPage = 100;
      let hasMore = true;

      console.log('Fetching all repositories using standard method...');

      while (hasMore) {
        const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            page,
            per_page: perPage,
            sort: 'updated',
            direction: 'desc',
            affiliation: 'owner,collaborator,organization_member'
          },
        });

        const repos = response.data;
        console.log(`Page ${page}: Found ${repos.length} repositories`);
        console.log(`Page ${page} breakdown:`, {
          private: repos.filter((r: any) => r.private).length,
          public: repos.filter((r: any) => !r.private).length,
          sample_private: repos.filter((r: any) => r.private).map((r: any) => r.name).slice(0, 3)
        });
        
        allRepos.push(...repos);
        
        // Check if we got less than perPage, meaning we're done
        hasMore = repos.length === perPage;
        page++;
        
        // Safety check to prevent infinite loops
        if (page > 50) {
          console.warn('Hit safety limit of 50 pages');
          break;
        }
      }

      // Sort by updated date
      allRepos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      const privateCount = allRepos.filter(r => r.private).length;
      const publicCount = allRepos.filter(r => !r.private).length;

      console.log(`✅ Successfully fetched ${allRepos.length} total repositories:`);
      console.log(`   🔒 Private: ${privateCount}`);
      console.log(`   🌐 Public: ${publicCount}`);
      
      if (privateCount === 0) {
        console.warn('⚠️ No private repositories found. This could mean:');
        console.warn('   1. You have no private repositories');
        console.warn('   2. Your token lacks the "repo" scope');
        console.warn('   3. There\'s an API permission issue');
        
        // Let's test token permissions explicitly
        await this.testTokenPermissions();
      }
      
      // Show a sample of repository names for debugging
      console.log('Sample repositories:', allRepos.slice(0, 5).map(r => ({
        name: r.name,
        private: r.private,
        owner: r.owner.login
      })));
      
      return allRepos;
    } catch (error) {
      console.error('❌ Standard fetch failed:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.logout();
          throw new Error('Authentication expired. Please login again.');
        }
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions. Please ensure your token has "repo" scope to access private repositories.');
        }
        
        console.error('GitHub API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      
      // Fallback to simple method
      console.warn('🔄 Falling back to simple repository fetch');
      return this.getSimpleUserRepositories();
    }
  }

  // Test token permissions explicitly
  static async testTokenPermissions() {
    const token = this.getToken();
    if (!token) return;

    console.log('🔍 Testing token permissions...');

    try {
      // Test 1: Can we access user info?
      const userResponse = await axios.get(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        }
      });
      console.log('✅ User info accessible:', userResponse.data.login);

      // Test 2: What scopes does our token have?
      const scopeResponse = await axios.get(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        }
      });
      
      // Check response headers for OAuth scopes
      console.log('Token scopes (from headers):', scopeResponse.headers['x-oauth-scopes']);

      // Test 3: Try to fetch a specific private repo (if any exist)
      try {
        const privateTestResponse = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            per_page: 5,
            type: 'private'
          }
        });
        console.log('✅ Private repositories test:', privateTestResponse.data.length, 'found');
      } catch (privateError) {
        if (axios.isAxiosError(privateError)) {
          console.error('❌ Private repositories test failed:', privateError.response?.status, privateError.response?.statusText);
        }
      }

    } catch (testError) {
      console.error('❌ Token permission test failed:', testError);
    }
  }

  // Fallback method with minimal parameters
  static async getSimpleUserRepositories() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    console.log('🔄 Using simple/fallback repository fetch method...');

    try {
      const allRepos: any[] = [];
      let page = 1;
      const perPage = 100;
      let hasMore = true;

      while (hasMore) {
        console.log(`Fetching page ${page} with simple method...`);
        
        const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            page,
            per_page: perPage,
            sort: 'updated'
            // Minimal parameters to avoid conflicts
          },
        });

        const repos = response.data;
        console.log(`Simple method page ${page}:`, {
          total: repos.length,
          private: repos.filter((r: any) => r.private).length,
          public: repos.filter((r: any) => !r.private).length
        });
        
        allRepos.push(...repos);
        
        // Check if we got less than perPage, meaning we're done
        hasMore = repos.length === perPage;
        page++;
        
        // Safety check to prevent infinite loops
        if (page > 50) {
          console.warn('Simple method hit safety limit of 50 pages');
          break;
        }
      }

      const privateCount = allRepos.filter(r => r.private).length;
      const publicCount = allRepos.filter(r => !r.private).length;
      
      console.log(`🔄 Simple fetch completed: ${allRepos.length} repositories (${privateCount} private, ${publicCount} public)`);
      
      if (privateCount === 0 && allRepos.length > 0) {
        console.error('⚠️ ISSUE: Simple method found repositories but NO private ones!');
        console.error('This suggests a token permissions problem.');
        console.log('Sample repos from simple fetch:', allRepos.slice(0, 3).map(r => ({
          name: r.name,
          private: r.private,
          permissions: r.permissions
        })));
      }
      
      return allRepos;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.logout();
          throw new Error('Authentication expired. Please login again.');
        }
        console.error('Simple GitHub API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }

  static async searchRepositories(query: string, sort = 'updated') {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const user = await this.getCurrentUser();
      const response = await axios.get(`${GITHUB_API_BASE}/search/repositories`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          q: `${query} user:${user.login}`,
          sort,
          order: 'desc',
        },
      });

      return response.data.items;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logout();
        throw new Error('Authentication expired. Please login again.');
      }
      throw new Error('Failed to search repositories');
    }
  }

  static async getCurrentUserLogin(): Promise<string> {
    const user = await this.getCurrentUser();
    return user.login;
  }
}