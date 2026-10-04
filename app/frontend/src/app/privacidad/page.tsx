import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y cookies de AJDREW.',
};

export default function PrivacidadPage() {
  const lastUpdated = '4 de octubre de 2026';

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2 uppercase italic">
          Política de Privacidad
        </h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: {lastUpdated}</p>

        <div className="space-y-8 text-white/70 leading-relaxed text-sm">

          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Responsable</h2>
            <p>
              AJDREW es una plataforma de comunidad de videojuegos. El responsable del
              tratamiento de los datos es el titular del sitio web{' '}
              <strong className="text-white">ajdrew.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Datos que recopilamos</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Dirección IP y datos de uso anónimos mediante cookies técnicas.</li>
              <li>Correo electrónico y nombre cuando te registras (usuarios admin/editor).</li>
              <li>Identificador de dispositivo anónimo para registrar tus calificaciones.</li>
              <li>Participación en sorteos (nombre o alias si decides participar).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Finalidad del tratamiento</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Ofrecerte las funciones de la plataforma (rankings, votaciones, sorteos).</li>
              <li>Recordar tus preferencias de tema y calificaciones.</li>
              <li>Gestión interna de contenido por parte del equipo editor.</li>
              <li>Estadísticas de uso agregadas y anónimas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. Cookies</h2>
            <p className="mb-2">Utilizamos los siguientes tipos de cookies:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 pr-4 text-white font-semibold">Cookie</th>
                    <th className="py-2 pr-4 text-white font-semibold">Tipo</th>
                    <th className="py-2 text-white font-semibold">Finalidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 pr-4 font-mono">ajdrew_cookie_consent</td>
                    <td className="py-2 pr-4">Técnica</td>
                    <td className="py-2">Guarda tu elección de consentimiento</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">token</td>
                    <td className="py-2 pr-4">Técnica</td>
                    <td className="py-2">Sesión de usuario autenticado (admin)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">next-auth.session-token</td>
                    <td className="py-2 pr-4">Técnica</td>
                    <td className="py-2">Autenticación OAuth (si aplica)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              <strong className="text-white">Cookies de publicidad:</strong> Actualmente no
              utilizamos cookies publicitarias de terceros. Si en el futuro activamos anuncios
              de Google AdSense, lo indicaremos explícitamente en este documento y solicitaremos
              tu consentimiento previo.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Compartición de datos</h2>
            <p>
              No vendemos ni cedemos tus datos a terceros. Los servicios externos que
              utilizamos (Cloudinary para imágenes, Supabase/PostgreSQL para datos) actúan
              como encargados del tratamiento bajo sus propias políticas de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Tus derechos</h2>
            <p>
              Tienes derecho a acceder, rectificar y suprimir tus datos. Para ejercer
              cualquier derecho o solicitar más información, contáctanos a través de nuestro
              canal de YouTube o redes sociales oficiales de AJDREW.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Menores de edad</h2>
            <p>
              Esta plataforma no está dirigida a menores de 13 años. No recopilamos
              conscientemente datos de menores de edad.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Cambios a esta política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. La fecha de última
              actualización siempre se indicará al inicio de esta página.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
