"use client";
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function Ticker() {
    const { t } = useTranslation();
    const breakingNews = [
        "Gold price hits record ₹1.54 Lakh/10g",
        "India announces ambitious Space Station 2035 plan",
        "PM Modi to address the nation on Budget 2026 tonight",
        "Pak boycott T20 World Cup over venue dispute",
        "Chennai Metro Phase 3 project approved"
    ];

    return (
        <div className="bg-rose-600 dark:bg-rose-700 text-white h-10 overflow-hidden flex items-center relative z-40 shadow-md">
            <div className="bg-rose-800 dark:bg-rose-900 px-4 h-full z-10 flex items-center space-x-2 font-bold uppercase text-xs md:text-sm tracking-widest absolute left-0 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
                <TrendingUp size={16} className="text-yellow-400" />
                <span className="hidden md:inline">{t('Breaking News')}</span>
                <span className="md:hidden">NEWS</span>
            </div>
            <div className="w-full inline-block whitespace-nowrap overflow-hidden">
                <div className="animate-ticker inline-block pl-[140px] md:pl-[180px]">
                    {breakingNews.map((news, i) => (
                        <span key={i} className="mx-6 text-sm md:text-base font-medium inline-flex items-center">
                            <span className="w-1.5 h-1.5 bg-rose-200 rounded-full mr-3"></span>
                            {news}
                        </span>
                    ))}
                    {breakingNews.map((news, i) => (
                        <span key={`dup-${i}`} className="mx-6 text-sm md:text-base font-medium inline-flex items-center">
                            <span className="w-1.5 h-1.5 bg-rose-200 rounded-full mr-3"></span>
                            {news}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
