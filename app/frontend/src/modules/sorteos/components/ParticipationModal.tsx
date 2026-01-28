'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';
import { Bt } from '@/shared/components/atoms/Button';
import Swal from 'sweetalert2';
import { getOrCreateDeviceId } from '@/shared/utils/deviceId';
import { storeParticipanteId } from '@/shared/utils/entryTracking';

interface Task {
    id: string;
    tipo: string;
    plataforma: string;
    obligatorio: boolean;
    url?: string;
    descripcion?: string;
}

interface ParticipationModalProps {
    sorteo: {
        id: string;
        titulo: string;
        premio: string;
        tareas: Task[];
    };
    onClose: () => void;
    onSuccess: () => void;
}

const PLATAFORMA_ICONS: Record<string, string> = {
    YOUTUBE: '📺',
    INSTAGRAM: '📸',
    FACEBOOK: '👥',
    TIKTOK: '🎵',
    TWITTER: '🐦'
};

const TIPO_LABELS: Record<string, string> = {
    SEGUIR: 'Seguir cuenta',
    COMENTAR: 'Comentar',
    COMPARTIR: 'Compartir',
    LIKE: 'Dar like',
    SUSCRIBIR: 'Suscribirse'
};

export const ParticipationModal: React.FC<ParticipationModalProps> = ({ sorteo, onClose, onSuccess }) => {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [completedTasks, setCompletedTasks] = useState<Record<string, { evidenciaUrl?: string; evidenciaTexto?: string }>>({});
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        // Ensure deviceId is generated on mount
        getOrCreateDeviceId();
    }, []);

    const tareasObligatorias = sorteo.tareas?.filter(t => t.obligatorio) || [];
    const tareasOpcionales = sorteo.tareas?.filter(t => !t.obligatorio) || [];
    const hasTareas = sorteo.tareas && sorteo.tareas.length > 0;

    const handleToggleTask = (taskId: string) => {
        setCompletedTasks(prev => {
            const newState = { ...prev };
            if (newState[taskId]) {
                delete newState[taskId];
            } else {
                // Auto-fill username in evidenciaTexto for tasks that need it
                const task = sorteo.tareas?.find(t => t.id === taskId);
                newState[taskId] = {
                    evidenciaTexto: (task?.tipo === 'COMENTAR' || task?.tipo === 'SEGUIR' || task?.tipo === 'SUSCRIBIR')
                        ? username
                        : undefined
                };
            }
            return newState;
        });
    };

    const handleEvidencia = (taskId: string, field: 'evidenciaUrl' | 'evidenciaTexto', value: string) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskId]: { ...prev[taskId], [field]: value }
        }));
    };

    const handleSubmit = async () => {
        // Validar identificador del usuario anónimo
        if (!user && !username.trim()) {
            Swal.fire('Username requerido', 'Por favor ingresa tu @ de redes sociales.', 'warning');
            return;
        }

        // Validar que todas las obligatorias estén completadas
        const faltantes = tareasObligatorias.filter(t => !completedTasks[t.id]);
        if (faltantes.length > 0) {
            Swal.fire('Tareas pendientes', 'Debes completar todas las tareas obligatorias.', 'warning');
            return;
        }

        setLoading(true);

        try {
            console.log('🚀 Iniciando participación en:', sorteo.titulo);
            // Get traffic source from URL params
            const urlParams = new URLSearchParams(window.location.search);
            const trafficSource = urlParams.get('ref') || undefined;

            const payload: any = {
                email: user ? null : `${username.replace('@', '')}@social.temp`,
                nombre: user ? null : username.trim(),
                deviceId: user ? null : getOrCreateDeviceId(), // Only for anonymous users
                trafficSource,
                tareas: Object.entries(completedTasks).map(([taskId, evidencia]) => ({
                    taskId,
                    ...evidencia
                }))
            };

            const isIdValid = (id: any) => id && typeof id === 'string' && id !== 'undefined' && id !== 'null' && id !== '[object Object]';

            if (isIdValid(user?.id)) {
                payload.usuarioId = user.id;
            }

            console.log('📦 Payload:', payload);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            console.log('🔗 API URL:', apiUrl);

            const response = await fetch(`${apiUrl}/sorteos/${sorteo.id}/participar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Éxito:', result);

                // Store participante ID for future entry tracking
                if (result.id) {
                    storeParticipanteId(sorteo.id, result.id);
                }

                Swal.fire({
                    title: '¡Participación registrada!',
                    text: '¡Mucha suerte! Te notificaremos si eres el ganador.',
                    icon: 'success'
                });
                onSuccess();
                onClose();
            } else {
                const data = await response.json();
                console.warn('⚠️ Respuesta no OK:', data);

                // Handle specific error cases
                if (response.status === 409 || data.message?.includes('Ya estás participando')) {
                    Swal.fire({
                        title: '¡Ya participas!',
                        text: 'Ya estás registrado en este sorteo. ¡Mucha suerte!',
                        icon: 'info'
                    });
                    onSuccess(); // Mark as participating
                    onClose();
                } else if (response.status === 401 || data.message?.includes('Sesión inválida')) {
                    Swal.fire({
                        title: 'Sesión expirada',
                        text: 'Tu sesión ya no es válida. Se cerrará automáticamente para que puedas reingresar.',
                        icon: 'warning'
                    }).then(() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        window.location.reload();
                    });
                } else {
                    throw new Error(data.message || 'Error al participar');
                }
            }
        } catch (error: any) {
            console.error('❌ Error en participación:', error);
            Swal.fire('Error', error.message || 'No se pudo procesar tu participación.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-[var(--color-card)] border border-yellow-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-black text-yellow-400 uppercase italic mb-2">{sorteo.titulo}</h2>
                        <p className="text-white/70">Premio: <span className="text-white font-bold">{sorteo.premio}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <X size={24} className="text-white/50" />
                    </button>
                </div>

                {/* Username (if anonymous) */}
                {!user && (
                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm font-bold text-yellow-400 mb-2">Tu usuario de redes sociales</p>
                        <input
                            type="text"
                            placeholder="@tuusuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-yellow-500 outline-none"
                        />
                        <p className="text-xs text-white/40 mt-2">
                            {hasTareas
                                ? "Este @ se usará automáticamente en todas las tareas"
                                : "Ingresa tu @ para identificarte"
                            }
                        </p>
                    </div>
                )}

                {/* Tareas Obligatorias */}
                {tareasObligatorias.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-white uppercase mb-3">✅ Tareas Obligatorias</h3>
                        <div className="space-y-3">
                            {tareasObligatorias.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    completed={!!completedTasks[task.id]}
                                    onToggle={() => handleToggleTask(task.id)}
                                    onEvidencia={(field, value) => handleEvidencia(task.id, field, value)}
                                    evidencia={completedTasks[task.id]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tareas Opcionales */}
                {tareasOpcionales.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-white/70 uppercase mb-3">⭐ Tareas Bonus (Opcionales)</h3>
                        <div className="space-y-3">
                            {tareasOpcionales.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    completed={!!completedTasks[task.id]}
                                    onToggle={() => handleToggleTask(task.id)}
                                    onEvidencia={(field, value) => handleEvidencia(task.id, field, value)}
                                    evidencia={completedTasks[task.id]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* No tasks */}
                {!hasTareas && (
                    <div className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                        <p className="text-green-400 font-bold">🎉 Participación libre</p>
                        <p className="text-white/50 text-sm">No hay tareas requeridas para este sorteo</p>
                    </div>
                )}

                {/* Submit */}
                <Bt
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    className="w-full py-4 text-lg font-black"
                >
                    Participar Ahora
                </Bt>
            </div>
        </div>
    );
};

// Task Item Component
const TaskItem: React.FC<{
    task: Task;
    completed: boolean;
    onToggle: () => void;
    onEvidencia: (field: 'evidenciaUrl' | 'evidenciaTexto', value: string) => void;
    evidencia?: { evidenciaUrl?: string; evidenciaTexto?: string };
}> = ({ task, completed, onToggle, onEvidencia, evidencia }) => {
    return (
        <div className={`p-4 rounded-xl border transition-all ${completed ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'
            }`}>
            <div className="flex items-start gap-3 mb-3">
                <button onClick={onToggle} className="mt-1">
                    {completed ? (
                        <CheckSquare size={20} className="text-yellow-500" />
                    ) : (
                        <Square size={20} className="text-white/30" />
                    )}
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{PLATAFORMA_ICONS[task.plataforma]}</span>
                        <span className="font-bold text-white">{TIPO_LABELS[task.tipo]}</span>
                        <span className="text-xs text-white/50">en {task.plataforma}</span>
                    </div>
                    {task.descripcion && <p className="text-sm text-white/60">{task.descripcion}</p>}
                    {task.url && (
                        <a href={task.url} target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-500 hover:underline flex items-center gap-1 mt-1">
                            Ir al enlace →
                        </a>
                    )}
                </div>
            </div>

            {/* Evidence field based on task type */}
            {completed && (
                <>
                    {(task.tipo === 'COMPARTIR') && (
                        <input
                            type="url"
                            placeholder="Pega el link de tu publicación"
                            value={evidencia?.evidenciaUrl || ''}
                            onChange={(e) => onEvidencia('evidenciaUrl', e.target.value)}
                            className="w-full h-10 bg-black/20 border border-white/10 rounded-lg px-3 text-sm text-white focus:border-yellow-500 outline-none"
                        />
                    )}

                    {(task.tipo === 'COMENTAR' || task.tipo === 'SEGUIR' || task.tipo === 'SUSCRIBIR') && (
                        <div>
                            <input
                                type="text"
                                placeholder="Tu @ en esta red social"
                                value={evidencia?.evidenciaTexto || ''}
                                onChange={(e) => onEvidencia('evidenciaTexto', e.target.value)}
                                className="w-full h-10 bg-black/20 border border-white/10 rounded-lg px-3 text-sm text-white focus:border-yellow-500 outline-none"
                            />
                            <p className="text-[10px] text-white/30 mt-1 italic">
                                ✓ Auto-rellenado desde tu @ principal
                            </p>
                        </div>
                    )}

                    {task.tipo === 'LIKE' && (
                        <div className="text-xs text-white/50 italic">
                            Solo confirma que le diste like ✓
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
