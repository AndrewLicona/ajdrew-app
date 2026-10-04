'use client';

import React, { useState, useRef } from 'react';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Upload, Loader2, X, FileImage, CheckCircle, Edit2 } from 'lucide-react';

interface Game {
    id: string;
    nombre: string;
}

interface ItemFormData {
    nombre: string;
    image: string;
    juegoId?: string;
    version?: string;
    grl?: number;
}

interface BulkItemFormProps {
    games: Game[];
    onSubmit: (data: ItemFormData[]) => Promise<void>;
    onCancel: () => void;
}

interface FileItem {
    file: File;
    name: string;
    version?: string;
    grl?: number;
}

export const BulkItemForm: React.FC<BulkItemFormProps> = ({
    games,
    onSubmit,
    onCancel
}) => {
    const [selectedJuegoId, setSelectedJuegoId] = useState('');
    const [fileItems, setFileItems] = useState<FileItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => {
                let name = file.name.split('.').slice(0, -1).join('.'); // Remove extension
                name = name.replace(/[-_]/g, ' '); // Replace dashes/underscores with spaces
                return { file, name };
            });
            setFileItems(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFileItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleNameChange = (index: number, newName: string) => {
        setFileItems(prev => prev.map((item, i) => i === index ? { ...item, name: newName } : item));
    };

    const handleVersionChange = (index: number, newVersion: string) => {
        setFileItems(prev => prev.map((item, i) => i === index ? { ...item, version: newVersion || undefined } : item));
    };

    const handleGrlChange = (index: number, newGrl: string) => {
        setFileItems(prev => prev.map((item, i) => i === index ? { ...item, grl: newGrl ? parseInt(newGrl, 10) : undefined } : item));
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload?folder=items`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.url || null;
        } catch (err) {
            console.error('Error uploading file', file.name, err);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (fileItems.length === 0) {
            setError('Debes seleccionar al menos una imagen.');
            return;
        }

        setUploading(true);
        setProgress(0);
        
        const uploadedItems: ItemFormData[] = [];
        let completed = 0;

        for (const item of fileItems) {
            const url = await uploadFile(item.file);
            if (url) {
                uploadedItems.push({
                    nombre: item.name,
                    image: url,
                    juegoId: selectedJuegoId || undefined,
                    version: item.version || undefined,
                    grl: item.grl || undefined,
                });
            }
            completed++;
            setProgress(Math.round((completed / fileItems.length) * 100));
        }

        if (uploadedItems.length > 0) {
            try {
                await onSubmit(uploadedItems);
            } catch (err: any) {
                setError(err.message || 'Error al guardar el lote.');
            }
        } else {
            setError('Falló la subida de todas las imágenes.');
        }

        setUploading(false);
    };

    return (
        <FormTemplate
            title="Subida Masiva de Ítems"
            onSubmit={handleSubmit}
            error={error}
            className="w-full max-w-2xl shadow-2xl border border-white/5"
            actions={
                <>
                    <Bt variant="secondary" onClick={onCancel} disabled={uploading} type="button">
                        Cancelar
                    </Bt>
                    <Bt type="submit" loading={uploading} disabled={fileItems.length === 0}>
                        Subir Lote ({fileItems.length})
                    </Bt>
                </>
            }
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="bulkJuegoId">Juego a asignar (Opcional)</Label>
                        <select
                            id="bulkJuegoId"
                            value={selectedJuegoId}
                            onChange={(e) => setSelectedJuegoId(e.target.value)}
                            className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-sm"
                            disabled={uploading}
                        >
                            <option value="">Ningún Juego...</option>
                            {games.map(game => (
                                <option key={game.id} value={game.id} className="bg-gray-900">{game.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <Label>Imágenes ({fileItems.length} seleccionadas)</Label>
                    <div 
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${uploading ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/40 pointer-events-none' : 'border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40'}`}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center w-full px-8">
                                <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-3" />
                                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-xs text-[var(--color-primary)] font-bold mt-2">Subiendo e insertando en DB... {progress}%</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-white/30 group-hover:text-[var(--color-primary)] transition-colors mb-3" />
                                <p className="mb-2 text-sm text-white/60"><span className="font-bold text-white">Haz clic para seleccionar multiples</span> imágenes</p>
                                <p className="text-xs text-white/30">PNG, JPG, WEBP</p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </div>
                </div>

                {fileItems.length > 0 && !uploading && (
                    <div className="max-h-80 overflow-y-auto pr-2 space-y-2 custom-scrollbar border border-white/5 bg-black/20 rounded-xl p-2">
                        {fileItems.map((item, i) => (
                            <div key={i} className="flex flex-col p-3 gap-2 bg-black/40 border border-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                        <img src={URL.createObjectURL(item.file)} className="w-full h-full object-cover" alt="preview" />
                                    </div>
                                    <div className="flex-1 relative">
                                        <Edit2 size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 z-10" />
                                        <Input
                                            value={item.name}
                                            onChange={(e: any) => handleNameChange(i, e.target.value)}
                                            className="h-8 pl-8 text-xs bg-black/50 border-white/10 focus:border-[var(--color-primary)]/50 focus:bg-black w-full"
                                            placeholder="Nombre del ítem"
                                        />
                                    </div>
                                    <button type="button" onClick={() => removeFile(i)} className="p-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg text-white/40 transition-colors shrink-0">
                                        <X size={16} />
                                    </button>
                                </div>
                                {/* Versión y GRL opcionales — útil para FC Mobile / eFootball */}
                                <div className="flex gap-2 pl-13">
                                    <Input
                                        value={item.version || ''}
                                        onChange={(e: any) => handleVersionChange(i, e.target.value)}
                                        className="h-7 text-[11px] bg-black/50 border-white/10 flex-1"
                                        placeholder="Versión (ej: TOTY, Base)"
                                    />
                                    <Input
                                        type="number"
                                        value={item.grl ?? ''}
                                        onChange={(e: any) => handleGrlChange(i, e.target.value)}
                                        className="h-7 text-[11px] bg-black/50 border-white/10 w-20"
                                        placeholder="GRL"
                                        min={1}
                                        max={200}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FormTemplate>
    );
};
