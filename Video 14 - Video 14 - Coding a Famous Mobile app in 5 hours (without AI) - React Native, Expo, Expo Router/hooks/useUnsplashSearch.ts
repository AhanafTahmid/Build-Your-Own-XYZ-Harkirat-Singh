import { useState, useCallback, useRef } from 'react';
import { UnsplashService } from '@/services/unsplash';

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

export const useUnsplashSearch = () => {
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  const currentPage = useRef(1);
  const currentQuery = useRef('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchPhotos = useCallback(async (query: string, append: boolean = false) => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    if (!append) {
      currentPage.current = 1;
      currentQuery.current = query;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await UnsplashService.searchPhotos(query, currentPage.current, 20);
      
      setResults(prev => append ? [...prev, ...response.results] : response.results);
      setTotalResults(response.total);
      setHasMore(currentPage.current < response.total_pages);
      
      if (currentPage.current < response.total_pages) {
        currentPage.current++;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchPhotos(query);
    }, 500);
  }, [searchPhotos]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && currentQuery.current) {
      searchPhotos(currentQuery.current, true);
    }
  }, [loading, hasMore, searchPhotos]);

  const loadRandomPhotos = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const photos = await UnsplashService.getRandomPhotos(20, query);
      setResults(photos);
      setHasMore(false);
      setTotalResults(photos.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setTotalResults(0);
    currentPage.current = 1;
    currentQuery.current = '';
    setHasMore(false);
  }, []);

  return {
    results,
    loading,
    error,
    hasMore,
    totalResults,
    searchPhotos,
    debouncedSearch,
    loadRandomPhotos,
    loadMore,
    clear,
  };
};
