"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ta' : 'en');
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform">
                            7
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                            DailyNews
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 font-medium transition py-2 px-1 relative group-hover:after:w-full">
                            {t('Latest Updates')}
                        </Link>
                        <Link href="/admin" className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 font-medium transition">
                            {t('Admin Panel')}
                        </Link>

                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-2" />

                        <button onClick={toggleLang} className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-sm font-semibold transition border border-transparent hover:border-rose-200 dark:hover:border-rose-800">
                            <Globe size={16} className="text-rose-600" />
                            <span>{i18n.language === 'en' ? 'Tamil' : 'English'}</span>
                        </button>

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
                    >
                        <div className="px-4 py-4 space-y-4">
                            <Link href="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-700 dark:text-slate-200">{t('Latest Updates')}</Link>
                            <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-700 dark:text-slate-200">{t('Admin Panel')}</Link>
                            <button onClick={() => { toggleLang(); setIsOpen(false); }} className="w-full text-left font-medium text-rose-600">
                                {t('Switch Language')} ({i18n.language === 'en' ? 'TA' : 'EN'})
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
