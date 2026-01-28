'use client';

import React, { useState } from 'react';
import { X, Plus, Globe } from 'lucide-react';
import { Bt } from '@/shared/components/atoms/Button';
import { Label } from '@/shared/components/atoms/Label';

interface TaskConfig {
    id?: string;
    tipo: string;
    plataforma: string;
    obligatorio: boolean;
    url?: string;
    descripcion?: string;
}

interface TaskManagerProps {
    tasks: TaskConfig[];
    onChange: (tasks: TaskConfig[]) => void;
}

const TIPOS_TAREA = [
    { value: 'SEGUIR', label: 'Seguir cuenta', icon: '👥' },
    { value: 'COMENTAR', label: 'Comentar', icon: '💬' },
    { value: 'COMPARTIR', label: 'Compartir', icon: '🔄' },
    { value: 'LIKE', label: 'Dar like', icon: '❤️' },
    { value: 'SUSCRIBIR', label: 'Suscribirse', icon: '🔔' }
];

const PLATAFORMAS = [
    { value: 'YOUTUBE', label: 'YouTube', color: '#FF0000' },
    { value: 'INSTAGRAM', label: 'Instagram', color: '#E1306C' },
    { value: 'FACEBOOK', label: 'Facebook', color: '#1877F2' },
    { value: 'TIKTOK', label: 'TikTok', color: '#000000' },
    { value: 'TWITTER', label: 'Twitter/X', color: '#1DA1F2' }
];

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onChange }) => {
    const [editingTask, setEditingTask] = useState<TaskConfig | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleAddTask = () => {
        setEditingTask({
            tipo: 'SEGUIR',
            plataforma: 'YOUTUBE',
            obligatorio: true,
            url: '',
            descripcion: ''
        });
        setShowForm(true);
    };

    const handleSaveTask = () => {
        if (!editingTask) return;

        if (editingTask.id) {
            // Edit existing
            onChange(tasks.map(t => t.id === editingTask.id ? editingTask : t));
        } else {
            // Add new (with temporary ID for UI only)
            let id;
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                id = crypto.randomUUID();
            } else {
                id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            const newTask = { ...editingTask, id };
            onChange([...tasks, newTask]);
        }

        setEditingTask(null);
        setShowForm(false);
    };

    const handleDeleteTask = (id: string) => {
        onChange(tasks.filter(t => t.id !== id));
    };

    const getTipoLabel = (tipo: string) => TIPOS_TAREA.find(t => t.value === tipo);
    const getPlataforma = (plat: string) => PLATAFORMAS.find(p => p.value === plat);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label>📋 Tareas para Participar</Label>
                    <p className="text-xs text-white/50 mt-1">Define qué acciones deben realizar los usuarios</p>
                </div>
                <Bt variant="secondary" onClick={handleAddTask} icon={<Plus size={16} />} type="button">
                    Agregar Tarea
                </Bt>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {tasks.map(task => {
                    const tipo = getTipoLabel(task.tipo);
                    const plataforma = getPlataforma(task.plataforma);

                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex-1 flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                    style={{ backgroundColor: `${plataforma?.color}20` }}
                                >
                                    {tipo?.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-white">{tipo?.label}</span>
                                        <span className="text-xs text-white/50">en {plataforma?.label}</span>
                                        {task.obligatorio && (
                                            <span className="text-[9px] font-black uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                                                Obligatoria
                                            </span>
                                        )}
                                    </div>
                                    {task.descripcion && (
                                        <p className="text-xs text-white/40 line-clamp-1">{task.descripcion}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteTask(task.id!)}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                            >
                                <X size={16} className="text-red-400" />
                            </button>
                        </div>
                    );
                })}

                {tasks.length === 0 && (
                    <div className="text-center py-8 text-white/30 text-sm italic">
                        No se han agregado tareas. Los usuarios podrán participar libremente.
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            {showForm && editingTask && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[var(--color-card)] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Configurar Tarea</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div>
                            <Label>Tipo de Tarea</Label>
                            <select
                                value={editingTask.tipo}
                                onChange={(e) => setEditingTask({ ...editingTask, tipo: e.target.value })}
                                className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] outline-none"
                            >
                                {TIPOS_TAREA.map(t => (
                                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>Plataforma</Label>
                            <select
                                value={editingTask.plataforma}
                                onChange={(e) => setEditingTask({ ...editingTask, plataforma: e.target.value })}
                                className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] outline-none"
                            >
                                {PLATAFORMAS.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>URL (Opcional)</Label>
                            <input
                                type="url"
                                value={editingTask.url}
                                onChange={(e) => setEditingTask({ ...editingTask, url: e.target.value })}
                                placeholder="https://youtube.com/@tucanal"
                                className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] outline-none"
                            />
                        </div>

                        <div>
                            <Label>Descripción (Opcional)</Label>
                            <textarea
                                value={editingTask.descripcion}
                                onChange={(e) => setEditingTask({ ...editingTask, descripcion: e.target.value })}
                                placeholder="Ej: Comenta qué personaje es tu favorito"
                                rows={2}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--color-primary)] outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <input
                                type="checkbox"
                                checked={editingTask.obligatorio}
                                onChange={(e) => setEditingTask({ ...editingTask, obligatorio: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <div>
                                <Label className="mb-0">Tarea Obligatoria</Label>
                                <p className="text-xs text-white/50">Los usuarios DEBEN completar esta tarea para participar</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Bt variant="secondary" onClick={() => setShowForm(false)} className="flex-1" type="button">
                                Cancelar
                            </Bt>
                            <Bt onClick={handleSaveTask} className="flex-1" type="button">
                                Guardar Tarea
                            </Bt>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
