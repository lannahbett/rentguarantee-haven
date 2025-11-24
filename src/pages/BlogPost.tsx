import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import SEOHelmet from '@/components/seo/SEOHelmet';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you are looking for does not exist.</p>
          <Link to="/blog">
            <Button variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title={`${post.title} | Propico Blog`}
        description={post.excerpt}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Featured Image */}
        <section className="relative bg-gray-900 text-white">
          {post.featuredImage && (
            <div className="absolute inset-0 opacity-30">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <Link to="/blog">
              <Button variant="ghost" className="text-white hover:text-white/80 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="max-w-4xl">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                {post.author && (
                  <>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-12">
          <article className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 lg:p-16">
              <div 
                className="blog-content prose prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-6 prose-headings:mt-10
                  prose-h2:text-3xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                  prose-h3:text-2xl prose-h3:mt-8
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                  prose-a:text-[var(--theme-primary)] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:space-y-3 prose-ul:text-gray-700
                  prose-ol:my-6 prose-ol:space-y-3 prose-ol:text-gray-700
                  prose-li:text-lg prose-li:leading-relaxed
                  first:prose-p:text-xl first:prose-p:font-medium first:prose-p:text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Back to Blog Button */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button variant="secondary" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Posts
                </Button>
              </Link>
            </div>
          </article>
        </section>
      </div>
    </>
  );
};

export default BlogPost;
