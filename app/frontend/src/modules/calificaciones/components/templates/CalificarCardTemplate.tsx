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
  <div className={`calificar-card-min bg-[var(--color-card)] p-2 md:p-3 rounded-[1rem] md:rounded-[1.5rem] shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/5 hover:border-[var(--color-primary)]/30 flex flex-col h-auto min-h-[10rem] md:min-h-[12rem] group/vote ${className}`}>
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
        <div className="absolute top-0.5 right-0.5 bg-yellow-500/90 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
          <span>{promedio.toFixed(1)}</span>
        </div>
      )}
    </div>

    <div className="flex flex-col flex-1 justify-between w-full">
      <h3 className="font-black text-[9px] md:text-xs text-white text-center line-clamp-2 uppercase italic tracking-tighter group-hover/vote:text-[var(--color-primary)] transition-colors leading-tight">{nombre}</h3>

      {votos > 0 && (
        <div className="flex items-center justify-center gap-1 text-[8px] md:text-[10px] text-[var(--color-text-secondary)] mt-0.5">
          <Users className="w-3 h-3" />
          <span>{votos}</span>
        </div>
      )}

      <div className="mt-auto w-full flex justify-center scale-[0.65] md:scale-[0.85] transition-transform origin-bottom">
        <RatingStars
          rating={valorVisual}
          onRatingChange={onStarClick}
        />
      </div>
    </div>
  </div>
);

export default CalificarCardTemplate;
