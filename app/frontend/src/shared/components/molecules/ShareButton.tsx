'use client';

import React, { useState } from 'react';
import { Share2, X, Link as LinkIcon } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
    variant?: 'icon' | 'full' | 'minimal';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    text,
    url,
    className = '',
    variant = 'full'
}) => {
    const [showFallback, setShowFallback] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: `${text}\n\n`,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            setShowFallback(true);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${text} ${shareUrl}`);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#152015',
                color: '#fff',
                iconColor: '#22c55e'
            });
            Toast.fire({
                icon: 'success',
                title: 'Enlace copiado al portapapeles'
            });
            setShowFallback(false);
        } catch (err) {
            console.error('Failed to copy matches', err);
        }
    };

    const socialLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    };

    return (
        <>
            <button
                onClick={handleShare}
                className={`group flex items-center justify-center gap-2 transition-all active:scale-95 ${className} ${variant === 'icon'
                        ? 'p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white'
                        : variant === 'minimal'
                            ? 'text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg'
                    }`}
            >
                <Share2 size={variant === 'minimal' ? 14 : 18} />
                {variant !== 'icon' && <span>Compartir</span>}
            </button>

            {/* Fallback Modal for Desktop */}
            {showFallback && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowFallback(false)}
                            className="absolute top-4 right-4 p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-primary)]/20">
                                <Share2 size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">Compartir</h3>
                            <p className="text-xs text-white/50 font-medium">Elige dónde compartir este contenido</p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <a
                                href={socialLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center border border-[#25D366]/20 group-hover:bg-[#25D366] group-hover:text-black transition-all">
                                    <FaWhatsapp size={24} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white transition-colors">WhatsApp</span>
                            </a>

                            <a
                                href={socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl flex items-center justify-center border border-[#1877F2]/20 group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                                    <FaFacebookF size={24} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white transition-colors">Facebook</span>
                            </a>

                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-2xl flex items-center justify-center border border-[#1DA1F2]/20 group-hover:bg-[#1DA1F2] group-hover:text-white transition-all">
                                    <FaTwitter size={24} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white transition-colors">X / Twitter</span>
                            </a>

                            <button
                                onClick={copyToClipboard}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 bg-white/5 text-white/70 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                                    <LinkIcon size={24} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white transition-colors">Copiar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
