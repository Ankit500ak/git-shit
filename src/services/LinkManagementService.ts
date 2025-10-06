import { Repository, User } from '../App';

export interface SharedLink {
  id: string;
  userId: string;
  username: string;
  repositories: Repository[];
  includePrivate: boolean;
  expiresAt: Date;
  createdAt: Date;
  accessCount: number;
  lastAccessed?: Date;
  isActive: boolean;
}

export interface CreateLinkOptions {
  repositories: Repository[];
  user: User;
  includePrivate: boolean;
  expirationHours: number;
}

export interface LinkValidationResult {
  isValid: boolean;
  link?: SharedLink;
  error?: string;
  timeRemaining?: number;
}

export class LinkManagementService {
  private static readonly STORAGE_KEY = 'sharedRepositoryLinks';
  private static readonly USER_LINKS_KEY = 'userSharedLinks';
  private static readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  private static initialized = false;

  /**
   * Initialize the service if not already initialized
   */
  private static initialize(): void {
    if (!this.initialized) {
      this.startPeriodicCleanup();
      this.initialized = true;
    }
  }

  /**
   * Generate a secure, unique link ID
   */
  private static generateLinkId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const extraRandom = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomPart}-${extraRandom}`;
  }

  /**
   * Create a new shared link
   */
  static createLink(options: CreateLinkOptions): string {
    this.initialize();
    const linkId = this.generateLinkId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (options.expirationHours * 60 * 60 * 1000));

    // Filter repositories based on privacy setting
    const filteredRepos = options.includePrivate 
      ? options.repositories 
      : options.repositories.filter(repo => !repo.private);

    const sharedLink: SharedLink = {
      id: linkId,
      userId: options.user.login,
      username: options.user.login,
      repositories: filteredRepos,
      includePrivate: options.includePrivate,
      expiresAt,
      createdAt: now,
      accessCount: 0,
      isActive: true
    };

    // Store the link
    this.storeLink(sharedLink);
    
    // Track user's links
    this.trackUserLink(options.user.login, linkId);

    // Generate the shareable URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${linkId}`;
  }

  /**
   * Store a link in localStorage
   */
  private static storeLink(link: SharedLink): void {
    try {
      const existingLinks = this.getAllStoredLinks();
      existingLinks[link.id] = {
        ...link,
        expiresAt: link.expiresAt.toISOString(),
        createdAt: link.createdAt.toISOString(),
        lastAccessed: link.lastAccessed?.toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingLinks));
    } catch (error) {
      console.error('Failed to store link:', error);
      throw new Error('Failed to save shared link');
    }
  }

  /**
   * Track a link for a specific user
   */
  private static trackUserLink(userId: string, linkId: string): void {
    try {
      const userLinks = JSON.parse(localStorage.getItem(this.USER_LINKS_KEY) || '{}');
      if (!userLinks[userId]) {
        userLinks[userId] = [];
      }
      userLinks[userId].push({
        linkId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(this.USER_LINKS_KEY, JSON.stringify(userLinks));
    } catch (error) {
      console.error('Failed to track user link:', error);
    }
  }

  /**
   * Get all stored links (raw format)
   */
  private static getAllStoredLinks(): any {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    } catch (error) {
      console.error('Failed to load stored links:', error);
      return {};
    }
  }

  /**
   * Validate and retrieve a shared link
   */
  static validateLink(linkId: string): LinkValidationResult {
    this.initialize();
    try {
      const storedLinks = this.getAllStoredLinks();
      const linkData = storedLinks[linkId];

      if (!linkData) {
        return {
          isValid: false,
          error: 'Link not found or has been removed'
        };
      }

      const link: SharedLink = {
        ...linkData,
        expiresAt: new Date(linkData.expiresAt),
        createdAt: new Date(linkData.createdAt),
        lastAccessed: linkData.lastAccessed ? new Date(linkData.lastAccessed) : undefined
      };

      // Check if link is active
      if (!link.isActive) {
        return {
          isValid: false,
          error: 'This link has been deactivated by the owner'
        };
      }

      const now = new Date();
      const timeRemaining = link.expiresAt.getTime() - now.getTime();

      // Check if link has expired
      if (timeRemaining <= 0) {
        // Mark as inactive and clean up
        this.deactivateLink(linkId);
        return {
          isValid: false,
          error: 'This link has expired',
          timeRemaining: 0
        };
      }

      // Update access tracking
      this.trackAccess(linkId);

      return {
        isValid: true,
        link,
        timeRemaining
      };
    } catch (error) {
      console.error('Failed to validate link:', error);
      return {
        isValid: false,
        error: 'Failed to validate link'
      };
    }
  }

  /**
   * Track when a link is accessed
   */
  private static trackAccess(linkId: string): void {
    try {
      const storedLinks = this.getAllStoredLinks();
      if (storedLinks[linkId]) {
        storedLinks[linkId].accessCount = (storedLinks[linkId].accessCount || 0) + 1;
        storedLinks[linkId].lastAccessed = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedLinks));
      }
    } catch (error) {
      console.error('Failed to track access:', error);
    }
  }

  /**
   * Deactivate a specific link
   */
  static deactivateLink(linkId: string): boolean {
    this.initialize();
    try {
      const storedLinks = this.getAllStoredLinks();
      if (storedLinks[linkId]) {
        storedLinks[linkId].isActive = false;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedLinks));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to deactivate link:', error);
      return false;
    }
  }

  /**
   * Delete a link completely
   */
  static deleteLink(linkId: string, userId?: string): boolean {
    this.initialize();
    try {
      const storedLinks = this.getAllStoredLinks();
      
      // Verify ownership if userId is provided
      if (userId && storedLinks[linkId] && storedLinks[linkId].userId !== userId) {
        return false;
      }

      if (storedLinks[linkId]) {
        delete storedLinks[linkId];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedLinks));
        
        // Remove from user tracking
        if (userId) {
          this.removeFromUserTracking(userId, linkId);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete link:', error);
      return false;
    }
  }

  /**
   * Remove link from user tracking
   */
  private static removeFromUserTracking(userId: string, linkId: string): void {
    try {
      const userLinks = JSON.parse(localStorage.getItem(this.USER_LINKS_KEY) || '{}');
      if (userLinks[userId]) {
        userLinks[userId] = userLinks[userId].filter((link: any) => link.linkId !== linkId);
        localStorage.setItem(this.USER_LINKS_KEY, JSON.stringify(userLinks));
      }
    } catch (error) {
      console.error('Failed to remove from user tracking:', error);
    }
  }

  /**
   * Get all active links for a user
   */
  static getUserLinks(userId: string): SharedLink[] {
    this.initialize();
    try {
      const storedLinks = this.getAllStoredLinks();
      const userLinks = JSON.parse(localStorage.getItem(this.USER_LINKS_KEY) || '{}');
      const userLinkIds = userLinks[userId] || [];

      return userLinkIds
        .map((item: any) => {
          const linkData = storedLinks[item.linkId];
          if (!linkData) return null;

          return {
            ...linkData,
            expiresAt: new Date(linkData.expiresAt),
            createdAt: new Date(linkData.createdAt),
            lastAccessed: linkData.lastAccessed ? new Date(linkData.lastAccessed) : undefined
          };
        })
        .filter(Boolean)
        .filter((link: SharedLink) => link.isActive)
        .sort((a: SharedLink, b: SharedLink) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Failed to get user links:', error);
      return [];
    }
  }

  /**
   * Clean up expired links
   */
  static cleanupExpiredLinks(): number {
    this.initialize();
    try {
      const storedLinks = this.getAllStoredLinks();
      const now = new Date();
      let cleanedCount = 0;

      const activeLinks: any = {};
      
      Object.entries(storedLinks).forEach(([linkId, linkData]: [string, any]) => {
        const expiresAt = new Date(linkData.expiresAt);
        
        if (expiresAt > now && linkData.isActive) {
          // Keep active, non-expired links
          activeLinks[linkId] = linkData;
        } else {
          // Count cleaned links
          cleanedCount++;
        }
      });

      // Update storage with only active links
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activeLinks));

      // Clean up user tracking as well
      this.cleanupUserTracking(Object.keys(activeLinks));

      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup expired links:', error);
      return 0;
    }
  }

  /**
   * Clean up user tracking for deleted links
   */
  private static cleanupUserTracking(activeLinkIds: string[]): void {
    try {
      const userLinks = JSON.parse(localStorage.getItem(this.USER_LINKS_KEY) || '{}');
      
      Object.keys(userLinks).forEach(userId => {
        userLinks[userId] = userLinks[userId].filter((item: any) => 
          activeLinkIds.includes(item.linkId)
        );
      });

      localStorage.setItem(this.USER_LINKS_KEY, JSON.stringify(userLinks));
    } catch (error) {
      console.error('Failed to cleanup user tracking:', error);
    }
  }

  /**
   * Start periodic cleanup of expired links
   */
  private static startPeriodicCleanup(): void {
    // Run cleanup immediately
    this.cleanupExpiredLinks();

    // Set up periodic cleanup
    setInterval(() => {
      const cleaned = this.cleanupExpiredLinks();
      if (cleaned > 0) {
        console.log(`Cleaned up ${cleaned} expired links`);
      }
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Get link statistics
   */
  static getLinkStats(linkId: string): { accessCount: number; timeRemaining: number; isActive: boolean } | null {
    this.initialize();
    try {
      const validation = this.validateLink(linkId);
      if (!validation.isValid || !validation.link) {
        return null;
      }

      return {
        accessCount: validation.link.accessCount,
        timeRemaining: validation.timeRemaining || 0,
        isActive: validation.link.isActive
      };
    } catch (error) {
      console.error('Failed to get link stats:', error);
      return null;
    }
  }

  /**
   * Extend link expiration
   */
  static extendLinkExpiration(linkId: string, additionalHours: number, userId?: string): boolean {
    this.initialize();
    try {
      const storedLinks = this.getAllStoredLinks();
      const linkData = storedLinks[linkId];

      if (!linkData) return false;

      // Verify ownership if userId is provided
      if (userId && linkData.userId !== userId) {
        return false;
      }

      const currentExpiry = new Date(linkData.expiresAt);
      const newExpiry = new Date(currentExpiry.getTime() + (additionalHours * 60 * 60 * 1000));

      storedLinks[linkId].expiresAt = newExpiry.toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedLinks));

      return true;
    } catch (error) {
      console.error('Failed to extend link expiration:', error);
      return false;
    }
  }

  /**
   * Get system-wide statistics
   */
  static getSystemStats(): {
    totalLinks: number;
    activeLinks: number;
    expiredLinks: number;
    totalAccesses: number;
  } {
    try {
      const storedLinks = this.getAllStoredLinks();
      const now = new Date();
      
      let totalLinks = 0;
      let activeLinks = 0;
      let expiredLinks = 0;
      let totalAccesses = 0;

      Object.values(storedLinks).forEach((linkData: any) => {
        totalLinks++;
        totalAccesses += linkData.accessCount || 0;
        
        const expiresAt = new Date(linkData.expiresAt);
        if (expiresAt > now && linkData.isActive) {
          activeLinks++;
        } else {
          expiredLinks++;
        }
      });

      return {
        totalLinks,
        activeLinks,
        expiredLinks,
        totalAccesses
      };
    } catch (error) {
      console.error('Failed to get system stats:', error);
      return {
        totalLinks: 0,
        activeLinks: 0,
        expiredLinks: 0,
        totalAccesses: 0
      };
    }
  }
}

export default LinkManagementService;