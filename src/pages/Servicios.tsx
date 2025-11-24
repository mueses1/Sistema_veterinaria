import Navbar from '../components/ui/Navbar';

const Servicios = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-100 text-gray-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="px-6">
          <div className="container mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300 mb-3">
              Nuestros servicios
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Todo lo que tu clínica necesita en un solo lugar
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-sm md:text-lg">
              Ofrecemos una atención integral para perros, gatos y pequeños animales: desde medicina preventiva hasta
              procedimientos quirúrgicos, siempre con un enfoque humano y cercano.
            </p>
          </div>

          <div className="container mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-lg border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Consulta general</h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-3">
                Evaluación completa del estado de salud de tu mascota, con revisión física detallada y orientación
                sobre cuidados en casa.
              </p>
              <ul className="text-xs md:text-sm text-slate-500 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Valoración clínica completa.</li>
                <li>Plan de vacunación y desparasitación.</li>
                <li>Recomendaciones nutricionales.</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-lg border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Medicina preventiva</h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-3">
                Prevenimos enfermedades antes de que aparezcan con esquemas de vacunación, chequeos periódicos y
                educación para la familia.
              </p>
              <ul className="text-xs md:text-sm text-slate-500 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Planes de vacunación por especie y edad.</li>
                <li>Revisión anual y control de peso.</li>
                <li>Consejos personalizados para cada etapa de vida.</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-lg border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Procedimientos y apoyo diagnóstico</h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-3">
                Contamos con herramientas para realizar procedimientos seguros y estudios que ayudan a llegar a un
                diagnóstico preciso.
              </p>
              <ul className="text-xs md:text-sm text-slate-500 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Cirugía general y procedimientos ambulatorios.</li>
                <li>Laboratorio clínico básico.</li>
                <li>Referencia para estudios especializados cuando se requiere.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Servicios;
