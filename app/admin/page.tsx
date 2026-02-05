"use client";
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, Timestamp, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from '@/components/Navbar';
import { Loader2, Trash2, Upload, LogOut, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function Admin() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("World");
    const [lang, setLang] = useState("en");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // List State
    const [newsList, setNewsList] = useState<any[]>([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!auth.currentUser) return; // Only listen if we have a user in session (even if state not updated yet)

        // Safety: If no user, onAuthStateChanged handles it, but query might fail if rules require auth
        try {
            const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
            const unsub = onSnapshot(q, s => {
                setNewsList(s.docs.map(d => ({ id: d.id, ...d.data() })));
            }, err => console.error(err));
            return () => unsub();
        } catch (e) {
            console.error("Fetch Error", e);
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setLoginError(err.message);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploadError("");
        try {
            let imageUrl = "";
            if (image) {
                const storageRef = ref(storage, `news/${Date.now()}_${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
            }

            await addDoc(collection(db, "news"), {
                title,
                category,
                language: lang,
                imageUrl,
                timestamp: Timestamp.now(),
            });

            alert("News Published Successfully!");
            setTitle("");
            setImage(null);
            // Don't reset category/lang for easier bulk upload
        } catch (err: any) {
            console.error(err);
            setUploadError("Upload Failed. Check console or permissions. " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this news item?")) {
            await deleteDoc(doc(db, "news", id));
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-rose-600" size={48} /></div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="absolute top-0 w-full"><Navbar /></div>
                <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-slate-200 dark:border-slate-800">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Access</h1>
                        <p className="text-slate-500 mt-2">Secure Gateway to CMS</p>
                    </div>
                    {loginError && <div className="bg-red-100 text-red-600 p-3 rounded text-sm text-center">{loginError}</div>}
                    <div className="space-y-4">
                        <input type="email" placeholder="admin@7dailynews.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-rose-500" required />
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-rose-500" required />
                    </div>
                    <button type="submit" className="w-full p-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:opacity-90 transition transform hover:-translate-y-0.5">
                        Authenticate
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-600">Dashboard</h1>
                        <p className="text-slate-500 text-sm">Welcome back, {user.email}</p>
                    </div>
                    <button onClick={() => signOut(auth)} className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white"><Upload className="mr-2 text-rose-600" /> Publish News</h2>
                            {uploadError && <div className="bg-red-50 text-red-600 text-xs p-2 rounded mb-4">{uploadError}</div>}
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Headline</label>
                                    <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-rose-500 outline-none font-medium" required placeholder="Enter compelling title..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                                        <input value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-rose-500 outline-none" required placeholder="World" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Language</label>
                                        <select value={lang} onChange={e => setLang(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-rose-500 outline-none">
                                            <option value="en">English</option>
                                            <option value="ta">Tamil</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Media</label>
                                    <div className="relative">
                                        <input type="file" id="file-upload" onChange={e => setImage(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                                        <label htmlFor="file-upload" className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                            {image ? (
                                                <span className="text-rose-600 font-medium truncate px-2">{image.name}</span>
                                            ) : (
                                                <span className="text-slate-500 flex items-center"><ImageIcon size={18} className="mr-2" /> Upload Image</span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <button disabled={uploading} type="submit" className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition disabled:opacity-50 shadow-lg hover:shadow-xl mt-4">
                                    {uploading ? <Loader2 className="animate-spin mx-auto" /> : 'Publish Article'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* News List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Articles</h2>
                            <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">{newsList.length} Total</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="p-4">Content</th>
                                            <th className="p-4">Meta</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {newsList.map(news => (
                                            <tr key={news.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                                            {news.imageUrl && <Image src={news.imageUrl} alt="" fill className="object-cover" />}
                                                        </div>
                                                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px] md:max-w-xs">{news.title}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div className="flex flex-col space-y-1">
                                                        <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded text-xs font-bold w-fit">{news.category}</span>
                                                        <span className="text-slate-500 uppercase text-[10px]">{news.language === 'en' ? 'English' : 'Tamil'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDelete(news.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {newsList.length === 0 && (
                                <div className="p-12 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-3 text-slate-400">
                                        <Image src="/placeholder.svg" width={0} height={0} className="w-6 h-6 hidden" alt="" />
                                        <ImageIcon size={24} />
                                    </div>
                                    <p className="text-slate-500 font-medium">No articles found in database.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
