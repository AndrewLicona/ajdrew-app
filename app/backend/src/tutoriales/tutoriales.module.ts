import { Module } from '@nestjs/common';
import { TutorialesService } from './tutoriales.service';
import { TutorialesController } from './interfaces/tutoriales.controller';
import { TutorialRepository } from './infrastructure/persistence/tutorial.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TutorialesController],
    providers: [TutorialesService, TutorialRepository],
    exports: [TutorialesService],
})
export class TutorialesModule { }
