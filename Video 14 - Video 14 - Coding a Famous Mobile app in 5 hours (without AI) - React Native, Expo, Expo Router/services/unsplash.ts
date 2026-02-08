const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.error('⚠️ UNSPLASH_ACCESS_KEY is not set in .env file!');
} else {
  console.log('✅ Unsplash key loaded:', UNSPLASH_ACCESS_KEY.substring(0, 10) + '...');
}

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  description: string | null;
  alt_description: string | null;
  likes: number;
  width: number;
  height: number;
}

interface SearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

export class UnsplashService {
  private static baseUrl = 'https://api.unsplash.com';
  
  private static async makeRequest(endpoint: string) {
    console.log('🔍 Making request to:', `${this.baseUrl}${endpoint}`);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Unsplash API error:', response.status, errorText);
      
      let errorMessage = 'Unsplash API error';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.errors?.[0] || error.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || `HTTP ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async searchPhotos(query: string, page: number = 1, perPage: number = 20): Promise<SearchResponse> {
    try {
      const response = await this.makeRequest(
        `/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=portrait`
      );

      return {
        results: response.results || [],
        total: response.total || 0,
        total_pages: response.total_pages || 0,
      };
    } catch (error) {
      console.error('Unsplash search error:', error);
      throw error;
    }
  }

  static async getRandomPhotos(count: number = 10, query?: string): Promise<UnsplashImage[]> {
    try {
      const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';
      const response = await this.makeRequest(
        `/photos/random?count=${count}${queryParam}&orientation=portrait`
      );

      return Array.isArray(response) ? response : [response];
    } catch (error) {
      console.error('Unsplash random photos error:', error);
      throw error;
    }
  }

  static async getPhotoById(id: string): Promise<UnsplashImage> {
    try {
      return await this.makeRequest(`/photos/${id}`);
    } catch (error) {
      console.error('Unsplash get photo error:', error);
      throw error;
    }
  }

  // Trigger a download (required by Unsplash API guidelines)
  static async trackDownload(downloadLocation: string): Promise<void> {
    try {
      await fetch(downloadLocation);
    } catch (error) {
      console.error('Download tracking error:', error);
    }
  }
}
