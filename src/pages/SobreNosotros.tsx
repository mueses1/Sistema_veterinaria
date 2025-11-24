import Navbar from '../components/ui/Navbar';

const SobreNosotros = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-100 text-gray-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* HERO */}
        <section className="px-6">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300 mb-3">
                Sobre nuestra clínica
              </p>
              <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">
                Cuidamos la salud de tus mascotas
                <span className="text-teal-600 dark:text-teal-300"> como si fueran de nuestra familia</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-xl">
                Somos una clínica veterinaria en Mocoa, Putumayo, especializada en medicina preventiva,
                diagnósticos avanzados y atención cercana a cada peludo que entra por nuestra puerta.
                Combinamos tecnología con un trato humano y cálido para que tu mascota siempre esté en buenas manos.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm md:text-base">
                <div className="bg-white/80 dark:bg-slate-900/60 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-3xl font-black text-teal-600 mb-1">10+</p>
                  <p className="text-slate-500 dark:text-slate-300">Años de experiencia</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-3xl font-black text-teal-600 mb-1">3K+</p>
                  <p className="text-slate-500 dark:text-slate-300">Pacientes atendidos</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-3xl font-black text-teal-600 mb-1">4.9★</p>
                  <p className="text-slate-500 dark:text-slate-300">Satisfacción de clientes</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-teal-500/10 blur-3xl rounded-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-5 h-40 flex flex-col justify-between border border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-teal-600">Urgencias 24/7</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      Siempre listos para atender situaciones críticas cuando más lo necesitas.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-5 h-40 flex flex-col justify-between border border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-teal-600">Tecnología moderna</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      Ecografía, laboratorio clínico y equipos actualizados para diagnósticos precisos.
                    </p>
                  </div>
                </div>
                <div className="space-y-4 translate-y-6">
                  <div className="bg-teal-600 text-white rounded-3xl shadow-2xl p-5 h-44 flex flex-col justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-100">Misión</p>
                    <p className="text-sm leading-relaxed text-teal-50">
                      Brindar atención veterinaria integral, cálida y confiable que mejore la calidad de vida de las mascotas
                      y la tranquilidad de sus familias.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-5 h-40 flex flex-col justify-between border border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-teal-600">Visión</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      Ser la clínica veterinaria de referencia en la región, reconocida por su calidad humana y profesional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="mt-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 text-center">
              Nuestros pilares de trabajo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-center mb-12">
              Cada decisión que tomamos está guiada por valores que ponemos en práctica todos los días en la clínica.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-lg border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Empatía real</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sabemos que tu mascota es parte de tu familia. Escuchamos, acompañamos y explicamos cada paso del proceso
                  para que siempre te sientas tranquilo.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-lg border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Calidad médica</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Actualizamos constantemente nuestros protocolos y formación para ofrecer diagnósticos y tratamientos
                  respaldados por la mejor evidencia científica.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-lg border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Transparencia</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Te explicamos con claridad el estado de tu mascota, las opciones de tratamiento y los costos antes de
                  tomar cualquier decisión.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EQUIPO Y UBICACIÓN RESUMIDA */}
        <section className="mt-20 px-6">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
                Un equipo comprometido con cada historia
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-4">
                Nuestro equipo está conformado por médicos veterinarios, auxiliares y personal de apoyo que comparten
                el mismo propósito: dar a cada mascota una atención respetuosa, paciente y profesional.
              </p>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-4">
                Desde una vacuna hasta una cirugía compleja, nos tomamos el tiempo para explicar diagnósticos,
                tratamientos y cuidados en casa.
              </p>
              <ul className="mt-2 space-y-2 text-sm md:text-base text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Atención preventiva y planes de vacunación personalizados.</li>
                <li>Cirugía general y procedimientos de mediana complejidad.</li>
                <li>Laboratorio clínico y apoyo diagnóstico.</li>
                <li>Acompañamiento cercano en casos crónicos o de cuidado prolongado.</li>
              </ul>
            </div>

            <div className="bg-slate-900 text-slate-50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-teal-700/30 to-slate-900 opacity-80" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-black mb-4">Estamos en Mocoa, Putumayo</h2>
                <p className="text-sm md:text-base text-teal-50 mb-4">
                  Te esperamos en nuestra sede principal:
                </p>
                <p className="font-semibold text-lg mb-2">Av. Colombia, Mocoa-Putumayo</p>
                <p className="text-sm mb-4">Calle 11 # 2-37</p>
                <p className="text-sm mb-1">Teléfono: (+57) 313 452 2822</p>
                <p className="text-sm mb-6">Horario: Lun - Sáb · 8:00am - 5:00pm</p>
                <p className="text-xs text-teal-100/90">
                  Puedes agendar tu cita con anticipación o acercarte a nuestra recepción para recibir orientación.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SobreNosotros;
