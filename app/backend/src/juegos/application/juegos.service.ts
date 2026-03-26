import { Injectable, ConflictException } from '@nestjs/common';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';
import { JuegoRepository } from '../infrastructure/persistence/juego.repository';
import { CategoriasService } from '../../categorias/application/categorias.service';
import { CalificacionRepository } from '../../calificaciones/infrastructure/persistence/calificacion.repository';

@Injectable()
export class JuegosService {
  constructor(
    private readonly juegoRepository: JuegoRepository,
    private readonly categoriasService: CategoriasService,
    private readonly calificacionRepository: CalificacionRepository,
  ) {}

  async create(createJuegoDto: CreateJuegoDto) {
    // Verificar si ya existe un juego con ese slug
    const existing = await this.juegoRepository.findOne(createJuegoDto.slug);
    if (existing) {
      throw new ConflictException(
        `Ya existe un juego con el slug "${createJuegoDto.slug}"`,
      );
    }
    return this.juegoRepository.create(createJuegoDto);
  }

  findAll() {
    return this.juegoRepository.findAll();
  }

  async findOne(idOrSlug: string) {
    const juego = await this.juegoRepository.findOne(idOrSlug);
    if (!juego) return null;

    // Obtener categorías globales (sin juegoId)
    const globalCategorias = await this.categoriasService.findAll(
      null as any,
      true,
    );

    // Combinar categorías del juego y globales
    // Usamos un Map para evitar duplicados
    const categoriesMap = new Map();

    (juego as any).categorias.forEach((cat) => categoriesMap.set(cat.id, cat));
    globalCategorias.forEach((cat: any) => {
      if (!categoriesMap.has(cat.id)) {
        categoriesMap.set(cat.id, cat);
      }
    });

    const sortedCategories = Array.from(categoriesMap.values());

    // Populate items sorted by ranking for each category
    for (const cat of sortedCategories) {
      // Fetch top 6 ranked items
      const rankedItems = await this.calificacionRepository.getRanking(
        cat.id,
        6,
      );

      // Transform back to simple item structure expected by frontend
      cat.items = rankedItems.map((r) => ({
        id: r.itemId,
        nombre: r.itemName,
        image: r.itemImage,
        averageRating: r.averageRating,
      }));
    }

    return {
      ...juego,
      categorias: sortedCategories,
      tutoriales: (juego as any).tutoriales || [],
    };
  }

  async update(id: string, updateJuegoDto: UpdateJuegoDto) {
    if (updateJuegoDto.slug) {
      const existing = await this.juegoRepository.findOne(updateJuegoDto.slug);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Ya existe otro juego con el slug "${updateJuegoDto.slug}"`,
        );
      }
    }
    return this.juegoRepository.update(id, updateJuegoDto);
  }

  remove(id: string) {
    return this.juegoRepository.remove(id);
  }
}
