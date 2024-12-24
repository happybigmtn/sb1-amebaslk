import React, { useEffect, useState } from 'react';
import { SocialPost } from '../../lib/agents/social/types';
import { useAgentSocial } from '../../hooks/useAgentSocial';
import { MessageSquare, Heart, Share2 } from 'lucide-react';

interface SocialFeedProps {
  agentId: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ agentId }) => {
  const { getPosts } = useAgentSocial(agentId);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [agentId]);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-100 mb-3">{post.content}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.engagement.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.engagement.replies}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span>{post.engagement.shares}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};