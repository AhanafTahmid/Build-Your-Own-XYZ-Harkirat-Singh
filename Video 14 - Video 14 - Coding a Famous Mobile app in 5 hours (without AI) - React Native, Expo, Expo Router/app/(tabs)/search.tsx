import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useUnsplashSearch } from '@/hooks/useUnsplashSearch';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    results, 
    loading, 
    error, 
    hasMore, 
    totalResults,
    debouncedSearch, 
    loadRandomPhotos,
    loadMore, 
    clear 
  } = useUnsplashSearch();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  // Load random wallpapers on mount
  useEffect(() => {
    loadRandomPhotos('wallpaper');
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      debouncedSearch(text);
    } else {
      clear();
      loadRandomPhotos('wallpaper');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.imageContainer}>
      <Image
        source={{ uri: item.urls.regular }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.photographerText}>📸 {item.user.name}</Text>
      </View>
      {item.likes > 0 && (
        <View style={styles.likesContainer}>
          <Text style={styles.likesText}>
            ❤️ {item.likes}
          </Text>
        </View>
      )}
      
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={textColor} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
        </View>
      );
    }

    if (searchQuery && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText>No results found for "{searchQuery}"</ThemedText>
        </View>
      );
    }

    if (results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.placeholderText}>
            🔍 Search wallpapers from Unsplash
          </ThemedText>
          <ThemedText style={styles.subText}>
            Try "nature", "abstract", "city" or any keyword
          </ThemedText>
        </View>
      );
    }

    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.searchBar, { borderColor }]}>
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search wallpapers with AI..."
          placeholderTextColor={`${textColor}80`}
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange('')}>
            <ThemedText style={styles.clearButton}>✕</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    fontSize: 20,
    paddingLeft: 12,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.5,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  photographerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  likesContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  likesText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  placeholderText: {
    fontSize: 18,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorText: {
    color: 'red',
  },
  footer: {
    paddingVertical: 20,
  },
});