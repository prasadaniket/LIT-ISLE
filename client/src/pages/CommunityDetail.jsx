import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BookOpen, Users, Crown } from "lucide-react";

const COMMUNITY_MAP = {
  "lit-isle": {
    name: "LIT ISLE (Your Community)",
    category: "All-in-one",
    description:
      "LIT ISLE blends a digital library with interactive community features. Explore books, track progress, bookmark, highlight, take notes, and create shelves. Engage with reviews, paragraph-level comments, book clubs, and themed debates. Authors can upload, manage, and interact with readers. Planned features include AI summaries, challenges, and audiobooks.",
    members: 12000,
    online: 160,
    isOwner: true,
  },
  "librarything": {
    name: "LibraryThing",
    category: "Cataloging",
    description:
      "Catalog entire personal collections, connect with collectors, and join niche forums with swaps, author interviews, and community events.",
    members: 2500000,
    online: 320,
    isOwner: false,
  },
  "the-storygraph": {
    name: "The StoryGraph",
    category: "Tracking & Stats",
    description:
      "Mood and genre tracking, detailed reading stats, personalized recommendations, challenges and buddy reads.",
    members: 1800000,
    online: 410,
    isOwner: false,
  },
  "litsy": {
    name: "Litsy",
    category: "Social Sharing",
    description:
      "Post blurbs, reviews, photos and quotes to spark lively conversations. Discovery through peers.",
    members: 950000,
    online: 210,
    isOwner: false,
  },
  "onlinebookclub": {
    name: "OnlineBookClub",
    category: "Forums & Reviews",
    description:
      "Active forums, giveaways, professional reviews and discussions. Earn points and discover indie gems.",
    members: 3000000,
    online: 500,
    isOwner: false,
  },
  "goodreads": {
    name: "Goodreads",
    category: "Reading & Reviews",
    description:
      "Track reading, create shelves, write reviews, rate books, join groups and challenges.",
    members: 12000000,
    online: 1200,
    isOwner: false,
  },
};

const CommunityDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const community = useMemo(() => COMMUNITY_MAP[slug], [slug]);

  if (!community) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="h-16" />
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-2xl font-bold">Community not found</h1>
          <button onClick={() => navigate(-1)} className="text-[#0B6623] underline">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="h-12" />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <aside className="md:col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-xl bg-[#0B6B4D] flex items-center justify-center text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="mt-4 text-sm text-gray-600">{community.category}</div>
              {slug === 'lit-isle' && (
                <div className="mt-4 flex items-center gap-3 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" /> {community.members.toLocaleString()} members</span>
                  <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500" /> {community.online} online</span>
                </div>
              )}
              {community.isOwner && <div className="mt-3 inline-flex items-center gap-1 text-yellow-600 text-sm"><Crown className="w-4 h-4" /> You are an owner</div>}
            </div>
            <div className="mt-4 space-y-3">
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold transition-colors">Join / Joined</button>
              <button onClick={() => navigate('/community')} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition-colors">Back to Communities</button>
            </div>
          </aside>

          {/* Right column */}
          <main className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{community.name}</h1>
            <div className="text-gray-600 mt-1">{community.category}</div>

            <div className="mt-6 text-gray-700 leading-relaxed">
              <p>{community.description}</p>
            </div>

            {/* Placeholder for community feed / posts */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Latest discussions</h3>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
                Coming soon: community posts, threads, and announcements.
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityDetail;
