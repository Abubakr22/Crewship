
import React, { useState } from 'react';
import { Card, Tag, Button, Modal } from '../components/UI';
import { MOCK_ANNOUNCEMENTS, CATEGORIES } from '../constants';
import { Announcement, UserProfile } from '../types';

interface AnnouncementsProps {
  currentUser: UserProfile;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ currentUser }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Announcement | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    category: CATEGORIES[0],
    customCategory: '',
    description: '',
    timing: ''
  });

  const filtered = selectedCategory 
    ? announcements.filter(a => a.category === selectedCategory)
    : announcements;

  const handleShare = async (post: Announcement) => {
    const shareData = {
      title: post.title,
      text: `Check out this ${post.category} on Crewships: ${post.description}`,
      url: `${window.location.origin}/announcement/${post.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleLike = (postId: string) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    setLikedPosts(newLikedPosts);
    setAnnouncements(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + (isLiked ? -1 : 1) };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.description.trim()) {
      alert("Please fill in both a title and description.");
      return;
    }

    const finalCategory = isCustomCategory ? newPost.customCategory.trim() : newPost.category;
    if (!finalCategory) {
      alert("Please provide a category.");
      return;
    }

    const post: Announcement = {
      id: Date.now().toString(),
      title: newPost.title,
      category: finalCategory,
      description: newPost.description,
      postedBy: {
        name: currentUser.firstName,
        avatar: currentUser.photoUrl || 'https://picsum.photos/seed/user/100/100'
      },
      timestamp: 'Just now',
      timing: newPost.timing.trim() || undefined,
      likes: 0
    };

    setAnnouncements([post, ...announcements]);
    setNewPost({ title: '', category: CATEGORIES[0], customCategory: '', description: '', timing: '' });
    setIsCreateModalOpen(false);
    setIsCustomCategory(false);
  };

  const handleJoinCrew = (post: Announcement) => {
    alert(`Request sent to join ${post.postedBy.name}'s crew for "${post.title}"!`);
    setSelectedPost(null);
  };

  return (
    <div className="p-6 relative min-h-full">
      {/* Toast Notification */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Link copied to clipboard
        </div>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">The Board</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Find opportunities to collaborate.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <Tag label="All" active={selectedCategory === null} onClick={() => setSelectedCategory(null)} />
        {CATEGORIES.map(cat => (
          <Tag 
            key={cat} 
            label={cat} 
            active={selectedCategory === cat} 
            onClick={() => setSelectedCategory(cat)} 
          />
        ))}
      </div>

      <div className="space-y-4 pb-20">
        {filtered.length > 0 ? filtered.map(post => (
          <Card key={post.id} className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <span className="w-fit px-2 py-1 bg-brand/10 text-brand dark:text-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {post.category}
                </span>
                {post.timing && (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    When: {post.timing}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-400 font-medium">{post.timestamp}</span>
            </div>
            
            <div onClick={() => setSelectedPost(post)} className="cursor-pointer">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{post.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{post.description}</p>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={post.postedBy.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{post.postedBy.name}</span>
              </div>
              <div className="flex gap-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 min-w-0 h-10 w-10 text-slate-400 hover:text-brand"
                  onClick={() => handleShare(post)}
                  title="Share Announcement"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center transition-all duration-300 ${likedPosts.has(post.id) ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' : 'text-slate-400 hover:text-rose-500'} font-bold`}
                  onClick={() => handleLike(post.id)}
                >
                  <svg 
                    className={`w-4 h-4 mr-1.5 transition-transform ${likedPosts.has(post.id) ? 'scale-125' : ''}`} 
                    fill={likedPosts.has(post.id) ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  {post.likes}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="font-black px-4"
                  onClick={() => setSelectedPost(post)}
                >
                  Details
                </Button>
              </div>
            </div>
          </Card>
        )) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold">No posts in this category yet.</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-brand text-white rounded-full shadow-xl shadow-brand/40 flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6" />
        </svg>
      </button>

      {/* Post Details Modal */}
      <Modal 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)}
        title="Details"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest w-fit">
                  {selectedPost.category}
                </span>
                {selectedPost.timing && (
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Scheduled: {selectedPost.timing}
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-400">{selectedPost.timestamp}</span>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {selectedPost.title}
            </h2>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">
                {selectedPost.description}
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 border-y border-slate-100 dark:border-slate-800">
              <img src={selectedPost.postedBy.avatar} className="w-12 h-12 rounded-full border-2 border-brand shadow-sm" alt="" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posted by</p>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">{selectedPost.postedBy.name}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setSelectedPost(null)}>Close</Button>
              <Button fullWidth onClick={() => handleJoinCrew(selectedPost)}>Join Crew</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Post Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Post to the Board"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post Title</label>
            <input 
              type="text" 
              placeholder="e.g. Need a Python tutor"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand dark:text-white"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setNewPost({...newPost, category: cat});
                    setIsCustomCategory(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                    !isCustomCategory && newPost.category === cat 
                      ? 'bg-brand text-white border-brand shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setIsCustomCategory(true)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                  isCustomCategory 
                    ? 'bg-brand text-white border-brand shadow-md' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'
                }`}
              >
                Other...
              </button>
            </div>
            
            {isCustomCategory && (
              <input 
                type="text" 
                placeholder="Enter custom category..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand dark:text-white animate-in slide-in-from-top-2"
                value={newPost.customCategory}
                onChange={(e) => setNewPost({...newPost, customCategory: e.target.value})}
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">When? (Timing or Date)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="e.g. This Saturday, Flexible, Weekly"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:ring-2 focus:ring-brand dark:text-white"
                value={newPost.timing}
                onChange={(e) => setNewPost({...newPost, timing: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea 
              placeholder="What are you looking for? Be specific about your project or study goals."
              className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand dark:text-white resize-none"
              value={newPost.description}
              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <Button variant="secondary" fullWidth onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button fullWidth onClick={handleCreatePost}>Post to Board</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
