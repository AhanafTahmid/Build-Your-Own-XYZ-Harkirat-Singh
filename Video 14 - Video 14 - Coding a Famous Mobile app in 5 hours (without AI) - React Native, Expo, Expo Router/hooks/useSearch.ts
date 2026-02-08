import { useState, useCallback, useRef } from 'react';
//@ts-ignore
import { ClarifaiService } from '@/services/searching';

interface SearchResult {
  url: string;
  score: number;
  concepts?: string[];
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  const currentPage = useRef(1);
  const currentQuery = useRef('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchByText = useCallback(async (query: string, append: boolean = false) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (!append) {
      currentPage.current = 1;
      currentQuery.current = query;
    }

    setLoading(true);
    setError(null);

    try {
        //console.log(2343434343);
      const response = await ClarifaiService.searchByText(query, currentPage.current);
      
      setResults(prev => append ? [...prev, ...response.results] : response.results);
      setHasMore(!!response.nextPage);
      
      if (response.nextPage) {
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
      searchByText(query);
    }, 500);
  }, [searchByText]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && currentQuery.current) {
      searchByText(currentQuery.current, true);
    }
  }, [loading, hasMore, searchByText]);

  const searchByImage = useCallback(async (imageUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ClarifaiService.searchByImage(imageUrl);
      setResults(response.results);
      setHasMore(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Visual search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    currentPage.current = 1;
    currentQuery.current = '';
  }, []);

  return {
    results,
    loading,
    error,
    hasMore,
    searchByText,
    debouncedSearch,
    searchByImage,
    loadMore,
    clear,
  };
};