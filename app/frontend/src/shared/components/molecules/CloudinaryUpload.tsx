'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Bt } from '../atoms/Button';
import { Label } from '../atoms/Label';

interface CloudinaryUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    folder?: string;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
    value,
    onChange,
    label = "Imagen",
    folder = "general"
}) => {
    const [uploading, setUploading] = useState(false);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "ml_default"; // Fallback typical preset or I might need to ask

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/media/upload?folder=${folder}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error) {
            console.error('Error uploading to internal API:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            {value ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-primary)]/20 bg-black/20 group">
                    <Image
                        src={value}
                        alt="Preview"
                        fill
                        className="object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Bt
                            variant="danger"
                            size="sm"
                            onClick={() => onChange('')}
                            icon={<X size={14} />}
                        >
                            Eliminar
                        </Bt>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--color-primary)]/20 rounded-xl cursor-pointer hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-3" />
                        ) : (
                            <Upload className="w-10 h-10 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors mb-3" />
                        )}
                        <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
                            <span className="font-bold">Haz clic para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] opacity-60">PNG, JPG o WEBP (MAX. 2MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}

            <div className="flex items-center gap-2 mt-2">
                <ImageIcon size={14} className="text-[var(--color-text-secondary)]" />
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="O pega la URL de la imagen aquí..."
                    className="flex-1 bg-transparent border-none text-[10px] text-[var(--color-text-secondary)] focus:ring-0 placeholder:opacity-50"
                />
            </div>
        </div>
    );
};
