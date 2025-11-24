import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { BlogPost } from '@/data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative overflow-hidden rounded-t-lg aspect-video">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[var(--theme-primary)] transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          {/* Excerpt */}
          <p className="text-gray-600 line-clamp-3">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {post.author && (
            <>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
