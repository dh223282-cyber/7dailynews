"use client";

import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import NewsCard, { NewsItem } from "@/components/NewsCard";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NewsItem[];
        setNewsList(newsData);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        // Fallback for demo if no config or permission error
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Setup Error", e);
      setLoading(false);
    }
  }, []);

  const seed = async () => {
    // Seed data mainly for user demo
    const trending = [
      {
        title: "PM Modi Budget 2026: Key Highlights & Announcements",
        category: "Politics",
        timestamp: Timestamp.now(),
        imageUrl: "https://images.unsplash.com/photo-1557992260-ec58e38d363c?q=80&w=1000",
        isVideo: false
      },
      {
        title: "Gold Price Hits Historic ₹1.54 Lakh - Market Reaction",
        category: "Finance",
        timestamp: Timestamp.now(),
        imageUrl: "https://images.unsplash.com/photo-1610375460983-8f5c29267139?q=80&w=1000",
        isVideo: false
      },
      {
        title: "T20 World Cup: Pakistan Announces Boycott Decision",
        category: "Sports",
        timestamp: Timestamp.now(),
        imageUrl: "https://images.unsplash.com/photo-1531415074968-0ecc083f2e42?q=80&w=1000",
        isVideo: false
      },
      {
        title: "Chennai's New Metro Line 5 Inaugurated by CM",
        category: "Local",
        timestamp: Timestamp.now(),
        imageUrl: "https://images.unsplash.com/photo-1574612948682-1d57f0037f02?q=80&w=1000",
        isVideo: true
      }
    ];

    try {
      for (const item of trending) {
        await addDoc(collection(db, "news"), item);
      }
      alert("Seed Data Added!");
    } catch (e) {
      alert("Error seeding data (Check Firebase Config): " + e);
      // If firestore fails (e.g. no auth/config), we might manually set state for demo
      setNewsList(trending.map((t, i) => ({ id: `demo-${i}`, ...t })));
    }
  };

  return (
    <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Navbar />
      <div className="pt-4 pb-2">
        <Ticker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('Latest Updates')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Daily dose of global happenings.</p>
          </div>

          {/* Hidden Seed Button for Demo */}
          <button onClick={seed} className="text-xs text-slate-300 hover:text-rose-500 transition">
            + Seed
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={48} />
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-slate-500">No news found.</p>
            <button onClick={seed} className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-bold shadow-lg">
              Generate Trending Demo Content
            </button>
          </div>
        ) : (
          <>
            {/* Hero Layout - First item large */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="col-span-2">
                {newsList[0] && (
                  <div className="relative aspect-video md:aspect-auto md:h-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                    <img src={newsList[0].imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                      <span className="bg-rose-600 text-white px-3 py-1 text-sm font-bold rounded uppercase mb-3 inline-block">{newsList[0].category}</span>
                      <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-2 group-hover:text-rose-200 transition-colors">{newsList[0].title}</h2>
                      <p className="text-slate-300 line-clamp-2 md:text-lg">Full coverage of the event available now...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {newsList.slice(1, 3).map(news => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </div>

            {/* Remaining Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newsList.slice(3).map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
