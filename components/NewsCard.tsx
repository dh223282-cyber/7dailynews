"use client";
import React from 'react';
import Image from 'next/image';
import { Clock, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface NewsItem {
    id: string;
    title: string;
    category: string;
    timestamp: any;
    imageUrl: string;
    isVideo?: boolean;
}

export default function NewsCard({ news }: { news: NewsItem }) {
    // Handle timestamp if it's a Firestore timestamp (has .toDate) or string/number
    const date = news.timestamp?.toDate ? news.timestamp.toDate() : new Date(news.timestamp || Date.now());

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800/50">
            <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                {news.imageUrl ? (
                    <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">7DailyNews</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {news.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                        <PlayCircle className="text-white w-14 h-14 drop-shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                )}

                <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/90 backdrop-blur text-[10px] font-bold px-2.5 py-1 rounded-full text-rose-600 uppercase tracking-widest shadow-sm">
                    {news.category}
                </div>
            </div>

            <div className="p-5 space-y-3">
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-medium space-x-1.5">
                    <Clock size={14} />
                    <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2">
                    {news.title}
                </h3>
            </div>
        </div>
    );
}
