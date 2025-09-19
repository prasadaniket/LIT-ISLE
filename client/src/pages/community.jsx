import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  MessageCircle, 
  Heart, 
  Bookmark, 
  MoreHorizontal,
  Plus,
  Users,
  Settings,
  Search,
  Filter,
  Crown,
  Shield,
  UserPlus,
  Hash,
  Pin,
  Volume2,
  VolumeX,
  Wand2,
  BookOpen,
  Rocket,
  Repeat2,
  CornerUpRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { booksData } from "./bookG/data";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { activityAPI } from "../services/api";

const Community = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Handle URL parameter for tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['feed', 'communities', 'my-communities'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Mock data for posts using real reviewer images and author names
  const posts = [
    {
      id: 1,
      author: {
        name: "Sonali",
        username: "@author_sonali",
        avatar: "/reviewer-img/author_sonali.jpg",
        verified: true,
        role: "author"
      },
      content: "Just finished writing the final chapter of my new fantasy novel! The journey has been incredible. What's your favorite fantasy element?",
      timestamp: "2h",
      likes: 124,
      comments: 23,
      bookMention: {
        title: "The Last Kingdom",
        cover: "/Books/covers/dracula.jpg"
      },
      liked: false,
      bookmarked: false
    },
    {
      id: 2,
      author: {
        name: "Bookly Reads",
        username: "@booklyreads",
        avatar: "/reviewer-img/booklyreads.jpg",
        verified: false,
        role: "user"
      },
      content: "Reading 'The Great Gatsby' for the third time and still finding new layers. Fitzgerald's prose is absolutely mesmerizing. Anyone else feel like they discover something new with each reread?",
      timestamp: "4h",
      likes: 67,
      comments: 12,
      bookMention: {
        title: "The Great Gatsby",
        cover: "/Books/covers/The-Great-Gatsby.jpg"
      },
      liked: true,
      bookmarked: false
    },
    {
      id: 3,
      author: {
        name: "Books Make Me Whole",
        username: "@booksmakemewhole",
        avatar: "/reviewer-img/booksmakemewhole.jpg",
        verified: true,
        role: "author"
      },
      content: "Book recommendation: If you loved 'Evelyn Hugo', try 'Malibu Rising'—family drama + Hollywood glamour done right.",
      timestamp: "6h",
      likes: 89,
      comments: 15,
      bookMention: {
        title: "Malibu Rising",
        cover: "/cover-img/cover3.jpeg"
      },
      liked: false,
      bookmarked: true
    },
    {
      id: 4,
      author: {
        name: "Nikita Navalkar",
        username: "@nikitanavalkar",
        avatar: "/reviewer-img/nikitanavalkar.jpg",
        verified: false,
        role: "user"
      },
      content: "Review: 'Dracula'—atmosphere holds up, pacing drags in the middle. Loved the letters format.",
      timestamp: "9h",
      likes: 22,
      comments: 0,
      liked: false,
      bookmarked: false
    },
    {
      id: 5,
      author: {
        name: "Learn with Jayy",
        username: "@learnwithjayy",
        avatar: "/reviewer-img/learnwithjayy.jpg",
        verified: true,
        role: "author"
      },
      content: "Author Q: Outlining my next mystery. Unreliable narrator or split timelines?",
      timestamp: "12h",
      likes: 58,
      comments: 3,
      bookMention: {
        title: "The Silent Lake",
        cover: "/cover-img/cover5.jpeg"
      },
      liked: false,
      bookmarked: false
    },
    {
      id: 6,
      author: {
        name: "Arthur Conan Doyle",
        username: "@acdoyle",
        avatar: "/Books/author img/Arthur Conan Doyle.jpg",
        verified: true,
        role: "author"
      },
      content: "New edition of my detective stories drops next month—annotated and illustrated!",
      timestamp: "14h",
      likes: 135,
      comments: 10,
      bookMention: {
        title: "Sherlock Holmes: Collected",
        cover: "/Books/covers/dracula.jpg"
      },
      liked: false,
      bookmarked: false
    },
    {
      id: 7,
      author: {
        name: "Megan the Book Worm Elf",
        username: "@megan.the.book.worm.elf",
        avatar: "/reviewer-img/megan.the.book.worm.elf.jpg",
        verified: true,
        role: "author"
      },
      content: "Beta readers: what makes feedback most helpful for you?",
      timestamp: "16h",
      likes: 41,
      comments: 4,
      liked: false,
      bookmarked: true,
      bookMention: {
        title: "Draft: Desert Winds",
        cover: "/cover-img/cover7.jpeg"
      }
    },
    {
      id: 8,
      author: {
        name: "Meg's Book Club",
        username: "@megsbookclub",
        avatar: "/reviewer-img/megsbookclub.jpg",
        verified: false,
        role: "user"
      },
      content: "Looking for sci-fi with hard science but great characters. Recs?",
      timestamp: "18h",
      likes: 18,
      comments: 2,
      liked: false,
      bookmarked: false
    },
    {
      id: 9,
      author: {
        name: "Muskan Jaiswal",
        username: "@talesofmusku",
        avatar: "/reviewer-img/talesofmusku.jpg",
        verified: true,
        role: "Original Founder of LIT ISLE"
      },
      content: "Annotating makes me love books more. Team tabs or no tabs?",
      timestamp: "20h",
      likes: 12,
      comments: 0,
      liked: false,
      bookmarked: false
    },
    {
      id: 10,
      author: {
        name: "Henry David Thoreau",
        username: "@thoreau",
        avatar: "/Books/author img/Henry David Thoreau.jpg",
        verified: false,
        role: "user"
      },
      content: "Re-reading 'Walden' in the park today. Peaceful and grounding.",
      timestamp: "1d",
      likes: 27,
      comments: 1,
      liked: false,
      bookmarked: false
    },
    {
      id: 11,
      author: {
        name: "Pantheon Books",
        username: "@pantheonbooks",
        avatar: "/reviewer-img/pantheonbooks.jpg",
        verified: true,
        role: "author"
      },
      content: "Cover reveal soon! Any guesses on the color palette?",
      timestamp: "1d",
      likes: 73,
      comments: 9,
      bookMention: {
        title: "Midnight Alleys",
        cover: "/cover-img/cover9.jpeg"
      },
      liked: false,
      bookmarked: false
    },
    {
      id: 12,
      author: {
        name: "Readers Wave",
        username: "@readers.wave",
        avatar: "/reviewer-img/readers.wave.jpg",
        verified: false,
        role: "user"
      },
      content: "Short story collections to binge this weekend? Loved pacing in 'Stories of Your Life'.",
      timestamp: "1d",
      likes: 11,
      comments: 0,
      liked: false,
      bookmarked: false
    },
    {
      id: 13,
      author: {
        name: "Secret Reading Life",
        username: "@secretreadinglife",
        avatar: "/reviewer-img/secretreadinglife.jpg",
        verified: false,
        role: "user"
      },
      content: "Finally got a library card again. The smell of books = bliss.",
      timestamp: "2d",
      likes: 44,
      comments: 5,
      liked: true,
      bookmarked: true
    },
    {
      id: 14,
      author: {
        name: "Penguin UK Books",
        username: "@penguinukbooks",
        avatar: "/reviewer-img/penguinukbooks.jpg",
        verified: false,
        role: "user"
      },
      content: "Review: Matched a fern-green bookmark to a forest fantasy—aesthetic: 10/10.",
      timestamp: "2d",
      likes: 16,
      comments: 1,
      liked: false,
      bookmarked: false
    },
    {
      id: 15,
      author: {
        name: "William Shakespeare",
        username: "@shakespeare",
        avatar: "/Books/author img/William Shakespeare.jpg",
        verified: false,
        role: "user"
      },
      content: "Poetry recs that are approachable for beginners?",
      timestamp: "2d",
      likes: 8,
      comments: 0,
      liked: false,
      bookmarked: false
    },
    {
      id: 16,
      author: {
        name: "Mary Shelley",
        username: "@maryshelley",
        avatar: "/Books/author img/Mary Shelley.jpeg",
        verified: true,
        role: "author"
      },
      content: "Writing sprint tonight—join me! 20 minutes on, 5 off, for 2 hours.",
      timestamp: "3d",
      likes: 91,
      comments: 12,
      bookMention: {
        title: "Sprinting the Pages",
        cover: "/cover-img/cover11.jpeg"
      },
      liked: false,
      bookmarked: false
    },
    {
      id: 17,
      author: {
        name: "H.P. Lovecraft",
        username: "@hplovecraft",
        avatar: "/Books/author img/H._P._Lovecraft.jpg",
        verified: false,
        role: "user"
      },
      content: "Switching from ebooks back to paper for focus. The tactile feel helps.",
      timestamp: "3d",
      likes: 19,
      comments: 2,
      liked: false,
      bookmarked: false
    },
    {
      id: 18,
      author: {
        name: "Lewis Carroll",
        username: "@lewiscarroll",
        avatar: "/Books/author img/Lewis Carroll.jpg",
        verified: false,
        role: "user"
      },
      content: "Graphic novels that hit hard emotionally?",
      timestamp: "4d",
      likes: 14,
      comments: 0,
      liked: false,
      bookmarked: false
    },
    {
      id: 19,
      author: {
        name: "Sun Tzu",
        username: "@suntzu",
        avatar: "/Books/author img/Sun Tzu.jpg",
        verified: false,
        role: "user"
      },
      content: "I keep recommending 'The Art of War' to entrepreneurs. Timeless.",
      timestamp: "4d",
      likes: 25,
      comments: 3,
      liked: false,
      bookmarked: true
    },
    {
      id: 20,
      author: {
        name: "Bram Stoker",
        username: "@bramstoker",
        avatar: "/Books/author img/Bram Stoker.jpg",
        verified: false,
        role: "user"
      },
      content: "Do you DNF books? Where's your threshold?",
      timestamp: "5d",
      likes: 31,
      comments: 6,
      liked: false,
      bookmarked: false
    },
    // Reposts and reply posts
    {
      id: 21,
      type: "repost",
      author: {
        name: "Bookly Reads",
        username: "@booklyreads",
        avatar: "/reviewer-img/booklyreads.jpg",
        verified: false,
        role: "user"
      },
      repostOf: 1,
      content: "Reposting Sonali's awesome milestone!",
      timestamp: "1d",
      likes: 12,
      comments: 0,
      liked: false,
      bookmarked: false
    },
    {
      id: 22,
      type: "repost",
      author: {
        name: "Muskan Jaiswal",
        username: "@talesofmusku",
        avatar: "/reviewer-img/talesofmusku.jpg",
        verified: true,
        role: "Original Founder of LIT ISLE"
      },
      repostOf: 5,
      content: "Signal boosting this author Q!",
      timestamp: "1d",
      likes: 9,
      comments: 1,
      liked: false,
      bookmarked: false
    },
    {
      id: 23,
      type: "reply",
      replyingTo: 2,
      author: {
        name: "Sonali",
        username: "@author_sonali",
        avatar: "/reviewer-img/author_sonali.jpg",
        verified: true,
        role: "author"
      },
      content: "Replying to @booklyreads — totally agree about Gatsby. The green light symbolism gets me every time.",
      timestamp: "1d",
      likes: 21,
      comments: 2,
      liked: false,
      bookmarked: false
    }
  ];

  // Mock data for communities (six specified platforms)
  const communities = [
    {
      id: 1,
      slug: "lit-isle",
      name: "LIT ISLE (Your Community)",
      description: "LIT ISLE blends a digital library with interactive community features. Explore books, track progress, bookmark, highlight, take notes, and create shelves. Engage with reviews, paragraph-level comments, book clubs, and themed debates. Authors can upload, manage, and interact with readers. Planned features include AI summaries, challenges, and audiobooks.",
      members: 12000,
      online: 160,
      icon: "rocket",
      category: "All-in-one",
      isJoined: true,
      isOwner: true,
      recentActivity: "New club launched"
    },
    {
      id: 2,
      slug: "librarything",
      name: "LibraryThing",
      description: "LibraryThing is built around cataloging and serious library organization. Catalog entire personal collections, connect with collectors, and join niche forums with swaps, author interviews, and community events—ideal for keeping a well-managed digital library.",
      members: 2500000,
      online: 320,
      icon: "book",
      category: "Cataloging",
      isJoined: false,
      isOwner: false,
      recentActivity: "New swap thread"
    },
    {
      id: 3,
      slug: "the-storygraph",
      name: "The StoryGraph",
      description: "The StoryGraph focuses on mood and genre tracking, detailed reading stats, and personalized recommendations. Readers can log books, review, and set up challenges and buddy reads—perfect for a data-driven reading journey.",
      members: 1800000,
      online: 410,
      icon: "book",
      category: "Tracking & Stats",
      isJoined: true,
      isOwner: false,
      recentActivity: "Buddy read formed"
    },
    {
      id: 4,
      slug: "litsy",
      name: "Litsy",
      description: "Litsy is the Instagram for readers—post short blurbs, reviews, photos, and quotes to spark lively conversations. Discovery comes through peers, creating a creative and social bookish environment.",
      members: 950000,
      online: 210,
      icon: "book",
      category: "Social Sharing",
      isJoined: false,
      isOwner: false,
      recentActivity: "Quote thread trending"
    },
    {
      id: 5,
      slug: "onlinebookclub",
      name: "OnlineBookClub",
      description: "OnlineBookClub offers active forums, giveaways, professional-level reviews, and discussions. Members earn points, join contests, and get free books for honest reviews—great for honing reviewing skills and discovering indie gems.",
      members: 3000000,
      online: 500,
      icon: "book",
      category: "Forums & Reviews",
      isJoined: false,
      isOwner: false,
      recentActivity: "Daily giveaway live"
    },
    {
      id: 6,
      slug: "goodreads",
      name: "Goodreads",
      description: "Goodreads is one of the largest online communities for readers and book lovers worldwide. It allows users to track their reading, create shelves, write reviews, and rate books. Join groups, take part in discussions, and see what friends are reading—great for discovery via recommendations, challenges, and curated lists.",
      members: 12000000,
      online: 1200,
      icon: "book",
      category: "Reading & Reviews",
      isJoined: true,
      isOwner: false,
      recentActivity: "Reading challenge started"
    }
  ];

  // Persist joined state per community in localStorage
  const joinedKey = 'community_joined_state_v1';
  const loadJoined = () => {
    try { const raw = localStorage.getItem(joinedKey); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  };
  const [joinedMap, setJoinedMap] = useState(loadJoined());
  const saveJoined = (m) => { try { localStorage.setItem(joinedKey, JSON.stringify(m)); } catch {} };
  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const PostCard = ({ post }) => {
    const [isLiked, setIsLiked] = useState(post.liked);
    const [isBookmarked, setIsBookmarked] = useState(post.bookmarked);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyTextById, setReplyTextById] = useState({});
    const [replyOpenById, setReplyOpenById] = useState({});

    // Load and persist comments per post via localStorage
    const storageKey = `community_post_${post.id}_comments`;
    const loadComments = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };
    const saveComments = (list) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch {}
    };

    // initialize comments on mount
    if (comments.length === 0) {
      const initial = loadComments();
      if (initial.length > 0) {
        // set once without causing extra renders
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // (not using useEffect to keep dependencies minimal)
        setComments(initial);
      }
    }

    const likeKey = `community_post_${post.id}_like`;
    const loadPostLike = () => {
      try { return JSON.parse(localStorage.getItem(likeKey) || 'null'); } catch { return null; }
    };
    const savePostLike = (liked) => {
      try { localStorage.setItem(likeKey, JSON.stringify(liked)); } catch {}
    };
    // initialize like state from storage
    if (loadPostLike() !== null && loadPostLike() !== isLiked) {
      setIsLiked(loadPostLike());
    }
    const handleLike = async () => {
      const willLike = !isLiked;
      setIsLiked(willLike);
      setLikeCount(prev => willLike ? prev + 1 : Math.max(0, prev - 1));
      savePostLike(willLike);
      try {
        const action = willLike ? 'community.like' : 'community.unlike';
        await activityAPI.create(action, { postId: post.id, postAuthor: post.author?.username, preview: post.content?.slice(0,120) });
      } catch (e) {
        // ignore activity failure
      }
    };

    const handleBookmark = () => {
      setIsBookmarked(!isBookmarked);
    };

    const handleAddComment = async () => {
      const text = commentText.trim();
      if (!text) return;
      const newComment = {
        id: Date.now(),
        author: {
          name: user?.name || "You",
          avatar: "/brand-img/reader1.jpeg"
        },
        text,
        likes: 0,
        liked: false,
        timestamp: "just now",
        replies: []
      };
      setComments(prev => {
        const next = [newComment, ...prev];
        saveComments(next);
        return next;
      });
      setCommentText("");
      try { await activityAPI.create('community.comment', { postId: post.id, preview: text.slice(0,120) }); } catch {}
    };

    const toggleLikeComment = (commentId) => {
      setComments(prev => {
        const next = prev.map(c => {
          if (c.id !== commentId) return c;
          const liked = !c.liked;
          return { ...c, liked, likes: liked ? c.likes + 1 : Math.max(0, c.likes - 1) };
        });
        saveComments(next);
        return next;
      });
    };

    const toggleReplyBox = (commentId) => {
      setReplyOpenById(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const handleAddReply = (commentId) => {
      const text = (replyTextById[commentId] || "").trim();
      if (!text) return;
      setComments(prev => {
        const next = prev.map(c => {
          if (c.id !== commentId) return c;
          const reply = {
            id: Date.now(),
            author: {
              name: user?.name || "You",
              avatar: "/brand-img/reader1.jpeg"
            },
            text,
            timestamp: "just now"
          };
          return { ...c, replies: [...c.replies, reply] };
        });
        saveComments(next);
        return next;
      });
      setReplyTextById(prev => ({ ...prev, [commentId]: "" }));
      setReplyOpenById(prev => ({ ...prev, [commentId]: false }));
    };

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                {post.author.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {post.author.role === "author" && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {post.type === 'reply' && <span className="text-[#0a5c3f]">Replying to {posts.find(p => p.id === post.replyingTo)?.author.username} · </span>}
                {post.author.username} · {post.timestamp}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed">{post.content}</p>
          {post.type === 'repost' && post.repostOf && (
            <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Repeat2 className="w-4 h-4" />
                <span>Reposted from {posts.find(p => p.id === post.repostOf)?.author.username}</span>
              </div>
              <div className="flex items-start space-x-3">
                <img 
                  src={posts.find(p => p.id === post.repostOf)?.author.avatar || ''}
                  alt="Original author"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{posts.find(p => p.id === post.repostOf)?.content}</p>
                  {posts.find(p => p.id === post.repostOf)?.bookMention && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={posts.find(p => p.id === post.repostOf)?.bookMention.cover}
                          alt={posts.find(p => p.id === post.repostOf)?.bookMention.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{posts.find(p => p.id === post.repostOf)?.bookMention.title}</h4>
                          <p className="text-xs text-gray-600">Book mentioned in original post</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Book Mention */}
        {post.bookMention && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={post.bookMention.cover} 
                alt={post.bookMention.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div>
                <h4 className="font-medium text-gray-900">{post.bookMention.title}</h4>
                <p className="text-sm text-gray-600">Book mentioned in this post</p>
              </div>
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors text-gray-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.length}</span>
            </button>
          </div>
          
          <button 
            onClick={handleBookmark}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
              isBookmarked ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="/brand-img/reader1.jpeg" 
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                    />
                    <button onClick={handleAddComment} className="bg-[#004225] text-white px-4 py-2 rounded-full hover:bg-[#0a5c3f] transition-colors">Send</button>
                  </div>
                </div>
              </div>
              
              {/* Live Comments */}
              <div className="space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={c.author.avatar}
                        alt={c.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-900"><span className="font-medium">{c.author.name}</span> {c.text}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                            <span>{c.timestamp}</span>
                            <button onClick={() => toggleLikeComment(c.id)} className={`flex items-center space-x-1 ${c.liked ? 'text-red-600' : ''}`}>
                              <Heart className={`w-3 h-3 ${c.liked ? 'fill-current' : ''}`} />
                              <span>{c.likes}</span>
                            </button>
                            <button onClick={() => toggleReplyBox(c.id)} className="hover:underline">Reply</button>
                          </div>
                        </div>
                        {/* Replies */}
                        {c.replies.length > 0 && (
                          <div className="mt-2 ml-6 space-y-2">
                            {c.replies.map((r) => (
                              <div key={r.id} className="flex items-start space-x-3">
                                <img 
                                  src={r.author.avatar}
                                  alt={r.author.name}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-900"><span className="font-medium">{r.author.name}</span> {r.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{r.timestamp}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Reply box */}
                        {replyOpenById[c.id] && (
                          <div className="mt-2 ml-6 flex items-center space-x-2">
                            <input
                              type="text"
                              value={replyTextById[c.id] || ''}
                              onChange={(e) => setReplyTextById(prev => ({ ...prev, [c.id]: e.target.value }))}
                              placeholder="Write a reply..."
                              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                            />
                            <button onClick={() => handleAddReply(c.id)} className="bg-[#004225] text-white px-3 py-1.5 rounded-full hover:bg-[#0a5c3f] transition-colors">Send</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CommunityCard = ({ community }) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004225] to-[#0B6B4D] text-white flex items-center justify-center">
            {community.icon === 'wand' && <Wand2 className="w-6 h-6" />}
            {community.icon === 'book' && <BookOpen className="w-6 h-6" />}
            {community.icon === 'rocket' && <Rocket className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
              {community.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
            </div>
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
              {community.category}
            </div>
          </div>
        </div>
        {community.isOwner && (
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mt-4">
        {community.description && community.description.length > 160
          ? community.description.slice(0, 160) + '…'
          : community.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        {community.slug === 'lit-isle' ? (
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" /> {community.members.toLocaleString()} members</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> {community.online} online</span>
          </div>
        ) : (
          <div />
        )}
        <span className="whitespace-nowrap">{community.recentActivity}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {community.slug === 'lit-isle' ? (
          <button className="col-span-1 py-2 px-4 rounded-lg bg-[#004225] text-white cursor-default">Joined</button>
        ) : (
          <button onClick={() => alert('Joining communities is coming soon.')} className="col-span-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Join Community</button>
        )}
        <button onClick={() => navigate(`/community/${community.slug}`)} className="col-span-1 py-2 px-4 rounded-lg bg-[#0B6B4D] text-white hover:bg-[#0a5c3f]">View Community</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: "#004225" }}>Community</h1>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts and communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                />
              </div>
              
              {/* Create Post Button */}
              {isAuthenticated && (
                <button className="bg-[#004225] text-white px-4 py-2 rounded-lg hover:bg-[#0a5c3f] transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-4">
            <button
              onClick={() => {
                setActiveTab("feed");
                setSearchParams({});
              }}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "feed"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => {
                setActiveTab("communities");
                setSearchParams({ tab: "communities" });
              }}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "communities"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Communities
            </button>
            <button
              onClick={() => {
                setActiveTab("my-communities");
                setSearchParams({ tab: "my-communities" });
              }}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "my-communities"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              My Communities
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex-1">
        {activeTab === "feed" && (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {activeTab === "communities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}

        {activeTab === "my-communities" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Communities</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-6 rounded-lg">
              <p className="font-medium">Coming soon</p>
              <p className="text-sm mt-1">Create, manage, and discover your personal community spaces right here.</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Community;
