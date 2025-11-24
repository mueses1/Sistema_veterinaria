import { useState } from 'react';
import Navbar from '../components/ui/Navbar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Contacto = () => {
  const [isAgendarOpen, setIsAgendarOpen] = useState(false);
  const [sending, setSending] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-100 text-gray-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="px-6">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Columna información de contacto */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300 mb-3">
                Contáctanos
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Hablemos de la salud de tu mascota
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-lg mb-5 max-w-xl">
                Si tienes dudas, necesitas una cita o quieres conocer más sobre nuestros servicios, escríbenos o agenda
                una cita y te responderemos lo antes posible.
              </p>

              <div className="mb-7">
                <Button
                  variant="primary"
                  size="md"
                  className="px-6 py-3 text-sm md:text-base"
                  onClick={() => setIsAgendarOpen(true)}
                >
                  Agendar cita ahora
                </Button>
              </div>

              <div className="space-y-4 text-sm md:text-base">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Dirección</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Av. Colombia, Mocoa-Putumayo
                    <br />
                    Calle 11 # 2-37
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Teléfono / WhatsApp</span>
                  <span className="text-slate-600 dark:text-slate-300">(+57) 313 452 2822</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Horario de atención</span>
                  <span className="text-slate-600 dark:text-slate-300">Lunes a Sábado · 8:00am - 5:00pm</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Correo electrónico</span>
                  <span className="text-slate-600 dark:text-slate-300">info@vetclinicpro.com</span>
                </div>
              </div>
            </div>

            {/* Columna recomendaciones / ayuda */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-7 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Antes de tu cita
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-3">
                  Para poder ayudarte mejor el día de la consulta, ten en cuenta estas recomendaciones:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-slate-600 dark:text-slate-300 space-y-1">
                  <li>Llega 10 minutos antes para registrar a tu mascota con calma.</li>
                  <li>Si está en tratamiento, trae los medicamentos o fórmulas actuales.</li>
                  <li>Para ayunos o cirugías, sigue las indicaciones que te daremos por teléfono.</li>
                </ul>
              </div>

              <div className="bg-slate-900 text-slate-50 rounded-3xl shadow-lg border border-slate-800 p-7 md:p-8">
                <h3 className="text-lg md:text-xl font-semibold mb-2">¿Tienes una urgencia?</h3>
                <p className="text-sm md:text-base mb-3 text-slate-100">
                  Si tu mascota presenta vómitos constantes, dificultad para respirar, sangrados o dolor intenso,
                  comunícate de inmediato para darte prioridad en la atención.
                </p>
                <p className="text-sm md:text-base font-semibold text-teal-200">
                  Urgencias: (+57) 313 452 2822
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Modal
        isOpen={isAgendarOpen}
        onClose={() => setIsAgendarOpen(false)}
        title="Agendar cita"
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (sending) return;
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            const payload = {
              nombrePropietario: (formData.get('cita-nombre') as string) || '',
              nombreMascota: (formData.get('cita-mascota') as string) || '',
              email: (formData.get('cita-email') as string) || '',
              telefono: (formData.get('cita-telefono') as string) || '',
              motivo: (formData.get('cita-motivo') as string) || '',
            };

            setSending(true);
            try {
              const res = await fetch('http://localhost:8000/api/v1/appointment-requests/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

              if (!res.ok) {
                alert('Hubo un problema al enviar la solicitud de cita. Intenta de nuevo.');
                return;
              }

              alert('Solicitud de cita enviada. Te contactaremos para confirmar la hora.');
              form.reset();
              setIsAgendarOpen(false);
            } catch (error) {
              console.error('Error enviando solicitud de cita', error);
              alert('Hubo un problema al enviar la solicitud de cita. Intenta de nuevo.');
            } finally {
              setSending(false);
            }
          }}
        >
          <div>
            <label htmlFor="cita-nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del propietario
            </label>
            <input
              id="cita-nombre"
              name="cita-nombre"
              type="text"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="cita-mascota" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la mascota
            </label>
            <input
              id="cita-mascota"
              name="cita-mascota"
              type="text"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="cita-email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="cita-email"
                name="cita-email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="cita-telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Celular de contacto
              </label>
              <input
                id="cita-telefono"
                name="cita-telefono"
                type="tel"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                placeholder="Ej: 3134522822"
              />
            </div>
          </div>
          <div>
            <label htmlFor="cita-motivo" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de la consulta
            </label>
            <textarea
              id="cita-motivo"
              name="cita-motivo"
              rows={3}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
              placeholder="Por ejemplo: vacunación, control, malestar, cirugía, etc."
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAgendarOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={sending}>
              {sending ? 'Enviando...' : 'Confirmar solicitud'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Contacto;
