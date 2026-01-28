import type { Metadata } from 'next';
import { HomePageContent } from '@/modules/home/components/HomePageContent';

export const metadata: Metadata = {
  title: 'AJDREW - Tu Portal de Gaming y Comunidad',
  description: 'Descubre tutoriales pro, participa en sorteos mensuales y califica tus juegos favoritos en la comunidad de AJDREW.',
};

const HomePage = () => {
  return <HomePageContent />;
};

export default HomePage;
