// modules/calificaciones/components/templates/CalificarCardTemplate.tsx
import Image from 'next/image';
import { Users } from 'lucide-react';
import './CalificarCardTemplate.css'; 
import RatingStars from './RatingStars';

export interface CalificarCardTemplateProps {
  nombre: string;
  imagen: string;
  promedio: number;
  votos: number;
  valorVisual: number;
  onStarClick: (star: number) => void;
  className?: string;
}

const CalificarCardTemplate: React.FC<CalificarCardTemplateProps> = ({
  nombre,
  imagen,
  promedio,
  votos,
  valorVisual,
  onStarClick,
  className = '',
}) => (
  <div className={`calificar-card-min bg-[var(--color-card)] p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 flex flex-col h-60 ${className}`}>
    <div className="relative w-full h-2/3 overflow-hidden mb-2">
      {imagen ? (
        <Image
          src={imagen}
          alt={nombre}
          width={200}
          height={200}
          className="w-full h-full object-contain rounded-md"
        />
      ) : (
        <div className="w-full h-full bg-[var(--color-background)] flex items-center justify-center">
          <span className="text-[var(--color-text-secondary)] text-xs">Sin imagen</span>
        </div>
      )}
      {promedio > 0 && (
        <div className="absolute top-1 right-1 bg-yellow-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <span>{promedio.toFixed(1)}</span>
        </div>
      )}
    </div>
    
    <div className="flex flex-col flex-1 justify-between w-full">
      <h3 className="font-bold text-sm text-[var(--color-text)] text-center line-clamp-2">{nombre}</h3>
      
      {votos > 0 && (
        <div className="flex items-center justify-center gap-1 text-xs text-[var(--color-text-secondary)] mt-1">
          <Users className="w-4 h-4" />
          <span>{votos}</span>
        </div>
      )}

      <div className="mt-auto w-full flex justify-center scale-90 transition-transform">
        <RatingStars 
          rating={valorVisual}
          onRatingChange={onStarClick}
        />
      </div>
    </div>
  </div>
);

export default CalificarCardTemplate;
