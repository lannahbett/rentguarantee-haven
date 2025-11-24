import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/blog/BlogCard';
import { blogPosts } from '@/data/blogPosts';
import SEOHelmet from '@/components/seo/SEOHelmet';

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);

  // Extract unique tags from all blog posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return ['all', ...Array.from(tags).sort()];
  }, []);

  // Filter posts by selected tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === 'all') return blogPosts;
    return blogPosts.filter(post => post.tags.includes(selectedTag));
  }, [selectedTag]);

  // Get posts to display based on display count
  const displayedPosts = filteredPosts.slice(0, displayCount);
  const hasMore = displayCount < filteredPosts.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + POSTS_PER_PAGE);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    setDisplayCount(POSTS_PER_PAGE);
  };

  return (
    <>
      <SEOHelmet
        title="Blog - Property Management Insights | Propico"
        description="Read the latest insights on property management, rental strategies, and real estate investment from Propico's expert team."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-primary-dark)] text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Propico Blog
              </h1>
              <p className="text-xl text-white/90">
                Expert insights on property management, rental strategies, and real estate investment
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="text-gray-700">
              Showing <span className="font-semibold">{displayedPosts.length}</span> of{' '}
              <span className="font-semibold">{filteredPosts.length}</span> posts
            </div>
            
            <div className="flex items-center gap-3">
              <label htmlFor="tag-filter" className="text-gray-700 font-medium">
                Filter by tag:
              </label>
              <Select value={selectedTag} onValueChange={handleTagChange}>
                <SelectTrigger id="tag-filter" className="w-[200px]">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag === 'all' ? 'All Posts' : tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {displayedPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    variant="secondary"
                    className="min-w-[200px]"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No blog posts found for the selected tag.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Blog;
