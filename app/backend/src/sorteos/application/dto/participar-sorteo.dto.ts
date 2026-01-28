export class ParticiparSorteoDto {
    // Opción 1: Usuario registrado
    usuarioId?: string;

    // Opción 2: Usuario anónimo
    email?: string;
    nombre?: string;

    // Tracking
    deviceId?: string;
    trafficSource?: string;

    // Tareas completadas
    tareas: {
        taskId: string;
        evidenciaUrl?: string;
        evidenciaTexto?: string;
    }[];
}
