import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, Trash2, Eye } from 'lucide-react';
import { Button } from './Shared';

interface MediaItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    name: string;
}

const STORAGE_KEY = 'portfolio_media';

export function MediaUploader() {
    const [media, setMedia] = useState<MediaItem[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach((file: File) => {
            const reader = new FileReader();
            const fileType = file.type.startsWith('image/') ? 'image' : 'video';

            reader.onload = (event) => {
                const newMedia: MediaItem = {
                    id: Date.now().toString() + Math.random().toString(36),
                    url: event.target?.result as string,
                    type: fileType,
                    name: file.name
                };

                setMedia((prev) => {
                    const updated = [...prev, newMedia];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                    window.dispatchEvent(new Event('mediaUpdated'));
                    return updated;
                });
            };

            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const deleteMedia = (id: string) => {
        setMedia((prev) => {
            const updated = prev.filter((item) => item.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            window.dispatchEvent(new Event('mediaUpdated'));
            return updated;
        });
    };

    const exportMedia = () => {
        const dataStr = JSON.stringify(media, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio-media.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-serif text-white mb-2">Portfolio Manager</h3>
                        <p className="text-gray-400 text-sm">Upload and manage your images and videos</p>
                    </div>
                    {media.length > 0 && (
                        <button
                            onClick={exportMedia}
                            className="px-4 py-2 bg-gold-400/10 border border-gold-400/30 text-gold-400 rounded-lg hover:bg-gold-400/20 transition-colors text-sm"
                        >
                            Export Data
                        </button>
                    )}
                </div>

                {/* Upload Button */}
                <div className="relative">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-gold-400/50 hover:bg-white/5 transition-all duration-300"
                    >
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-300 text-lg mb-2">Click to upload images or videos</p>
                        <p className="text-gray-500 text-sm">Supports: JPG, PNG, GIF, MP4, WebM</p>
                    </label>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gold-400" />
                        <span>Images: {media.filter(m => m.type === 'image').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-gold-400" />
                        <span>Videos: {media.filter(m => m.type === 'video').length}</span>
                    </div>
                    <div className="ml-auto text-gold-400">
                        Total: {media.length} items
                    </div>
                </div>
            </div>

            {/* Media Grid */}
            {media.length > 0 && (
                <div>
                    <h4 className="text-xl font-serif text-white mb-6">Your Portfolio Media</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className="group relative aspect-square rounded-lg overflow-hidden bg-surface/50 border border-white/10"
                            >
                                {item.type === 'image' ? (
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        className="w-full h-full object-cover"
                                        muted
                                    />
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setPreviewUrl(item.url)}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                        title="Preview"
                                    >
                                        <Eye className="w-5 h-5 text-white" />
                                    </button>
                                    <button
                                        onClick={() => deleteMedia(item.id)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </button>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                                    {item.type === 'image' ? (
                                        <ImageIcon className="w-3 h-3" />
                                    ) : (
                                        <Video className="w-3 h-3" />
                                    )}
                                    <span>{item.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setPreviewUrl(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                        {previewUrl.startsWith('data:image') ? (
                            <img src={previewUrl} alt="Preview" className="max-h-[90vh] max-w-full object-contain" />
                        ) : (
                            <video src={previewUrl} controls className="max-h-[90vh] max-w-full" />
                        )}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-6">
                <h5 className="text-gold-400 font-semibold mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    How to Use
                </h5>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Click the upload area to select images or videos from your device</li>
                    <li>• Your media is stored locally in your browser (no server upload)</li>
                    <li>• Click the eye icon to preview, trash icon to delete</li>
                    <li>• Export your data to backup or transfer to another device</li>
                    <li>• Uploaded media will appear in your portfolio gallery</li>
                </ul>
            </div>
        </div>
    );
}

// Helper function to get stored media for use in portfolio
export function getStoredMedia(): MediaItem[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}
