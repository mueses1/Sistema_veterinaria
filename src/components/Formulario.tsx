// Importacion de los Hooks al formulario
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import Swal from 'sweetalert2'
import Error from './Error'
import { Paciente } from '../types/Index.ts'
import { usePacientesStore } from '../store/pacientesStore'

interface FormularioProps {
    paciente: Partial<Paciente>;
    setPaciente: (paciente: Partial<Paciente>) => void;
    onClose?: () => void;
}

// Creamos nuestro functional component
const Formulario = ({ paciente, setPaciente, onClose }: FormularioProps) => {
    const addPaciente = usePacientesStore((state) => state.addPaciente);
    const updatePaciente = usePacientesStore((state) => state.updatePaciente);

    /**
     * Como buena practica el State debe ser declarado en la parte
     * superior de nuestra funcion antes del return 
     * Es importante declarar los states en el orden en el que 
     * se van usando.
     */
    const [nombre, setNombre] = useState('');
    const [propietario, setPropietario] = useState('');
    const [email, setEmail] = useState('');
    const [fecha, setFecha] = useState('');
    const [sintomas, setSintomas] = useState('');

    // Datos del tutor
    const [tutorNombre, setTutorNombre] = useState('');
    const [tutorApellido, setTutorApellido] = useState('');
    const [tutorTipoDocumento, setTutorTipoDocumento] = useState('');
    const [tutorNumeroDocumento, setTutorNumeroDocumento] = useState('');
    const [tutorTelefonoPrincipal, setTutorTelefonoPrincipal] = useState('');
    const [tutorTelefonoSecundario, setTutorTelefonoSecundario] = useState('');
    const [tutorEmail, setTutorEmail] = useState('');
    const [tutorDireccion, setTutorDireccion] = useState('');
    const [tutorComoNosConocio, setTutorComoNosConocio] = useState('');

    // Datos de la mascota
    const [mascotaNombre, setMascotaNombre] = useState('');
    const [mascotaEspecie, setMascotaEspecie] = useState('');
    const [mascotaEspecieOtro, setMascotaEspecieOtro] = useState('');
    const [mascotaRaza, setMascotaRaza] = useState('');
    const [mascotaRazaOtro, setMascotaRazaOtro] = useState('');
    const [mascotaSexo, setMascotaSexo] = useState('');
    const [mascotaCastrado, setMascotaCastrado] = useState('');
    const [mascotaFechaNacimiento, setMascotaFechaNacimiento] = useState('');
    const [mascotaEdadAnios, setMascotaEdadAnios] = useState('');
    const [mascotaEdadMeses, setMascotaEdadMeses] = useState('');
    const [mascotaColor, setMascotaColor] = useState('');
    const [mascotaPesoKg, setMascotaPesoKg] = useState('');
    const [mascotaTieneMicrochip, setMascotaTieneMicrochip] = useState('');
    const [mascotaNumeroMicrochip, setMascotaNumeroMicrochip] = useState('');

    // Información médica
    const [enfermedadCronica, setEnfermedadCronica] = useState('');
    const [medicacionPermanente, setMedicacionPermanente] = useState('');
    const [alergias, setAlergias] = useState('');
    const [tieneSeguroMedico, setTieneSeguroMedico] = useState('');
    const [nombreAseguradora, setNombreAseguradora] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const [error, setError] = useState(false)

    useEffect(() => {
        if (Object.keys(paciente).length > 0) {
            setNombre(paciente.nombre || '')
            setPropietario(paciente.propietario || '')
            setEmail(paciente.email || '')
            setFecha(paciente.fecha || '')
            setSintomas(paciente.sintomas || '')

            setTutorNombre(paciente.tutor_nombre || '')
            setTutorApellido(paciente.tutor_apellido || '')
            setTutorTipoDocumento(paciente.tutor_tipo_documento || '')
            setTutorNumeroDocumento(paciente.tutor_numero_documento || '')
            setTutorTelefonoPrincipal(paciente.tutor_telefono_principal || '')
            setTutorTelefonoSecundario(paciente.tutor_telefono_secundario || '')
            setTutorEmail(paciente.tutor_email || '')
            setTutorDireccion(paciente.tutor_direccion || '')
            setTutorComoNosConocio(paciente.tutor_como_nos_conocio || '')

            setMascotaNombre(paciente.mascota_nombre || '')
            setMascotaEspecie(paciente.mascota_especie || '')
            setMascotaEspecieOtro(paciente.mascota_especie_otro || '')
            setMascotaRaza(paciente.mascota_raza || '')
            setMascotaRazaOtro(paciente.mascota_raza_otro || '')
            setMascotaSexo(paciente.mascota_sexo || '')
            setMascotaCastrado(paciente.mascota_castrado || '')
            setMascotaFechaNacimiento(paciente.mascota_fecha_nacimiento || '')
            setMascotaEdadAnios(
                paciente.mascota_edad_aproximada_anios !== undefined
                    ? String(paciente.mascota_edad_aproximada_anios)
                    : ''
            )
            setMascotaEdadMeses(
                paciente.mascota_edad_aproximada_meses !== undefined
                    ? String(paciente.mascota_edad_aproximada_meses)
                    : ''
            )
            setMascotaColor(paciente.mascota_color || '')
            setMascotaPesoKg(
                paciente.mascota_peso_kg !== undefined
                    ? String(paciente.mascota_peso_kg)
                    : ''
            )
            setMascotaTieneMicrochip(
                paciente.mascota_tiene_microchip === true
                    ? 'si'
                    : paciente.mascota_tiene_microchip === false
                        ? 'no'
                        : ''
            )
            setMascotaNumeroMicrochip(paciente.mascota_numero_microchip || '')

            setEnfermedadCronica(paciente.enfermedad_cronica || '')
            setMedicacionPermanente(paciente.medicacion_permanente || '')
            setAlergias(paciente.alergias || '')
            setTieneSeguroMedico(
                paciente.tiene_seguro_medico === true
                    ? 'si'
                    : paciente.tiene_seguro_medico === false
                        ? 'no'
                        : ''
            )
            setNombreAseguradora(paciente.nombre_aseguradora || '')
            setObservaciones(paciente.observaciones || '')
        }
    }, [paciente])

    /** Funcion para generar id unico */
    const generarId = () => {

        const random = Math.random().toString(36).substr(2);
        const fecha = Date.now().toString(36);

        return random + fecha
    }
    /** Funcion handleSubmit */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validacion básica: algunos campos clave requeridos
        if ([tutorNombre, tutorApellido, tutorTelefonoPrincipal, mascotaNombre].includes('')) {
            console.log('Hay al menos un campo vacio')

            setError(true)

            return;
        }

        setError(false)

        // Rellenar campos legacy a partir de los nuevos cuando sea posible
        const nombreCompletoTutor = `${tutorNombre} ${tutorApellido}`.trim();
        const nombreMascota = mascotaNombre || nombre;

        const objetoPaciente: Paciente = {
            id: '', // Se asignará después
            nombre: nombreMascota,
            propietario: nombreCompletoTutor || propietario,
            email: tutorEmail || email,
            fecha,
            sintomas,

            tutor_nombre: tutorNombre,
            tutor_apellido: tutorApellido,
            tutor_tipo_documento: tutorTipoDocumento,
            tutor_numero_documento: tutorNumeroDocumento,
            tutor_telefono_principal: tutorTelefonoPrincipal,
            tutor_telefono_secundario: tutorTelefonoSecundario || undefined,
            tutor_email: tutorEmail || undefined,
            tutor_direccion: tutorDireccion || undefined,
            tutor_como_nos_conocio: tutorComoNosConocio || undefined,

            mascota_nombre: nombreMascota,
            mascota_especie: mascotaEspecie || undefined,
            mascota_especie_otro: mascotaEspecieOtro || undefined,
            mascota_raza: mascotaRaza || undefined,
            mascota_raza_otro: mascotaRazaOtro || undefined,
            mascota_sexo: mascotaSexo || undefined,
            mascota_castrado: mascotaCastrado || undefined,
            mascota_fecha_nacimiento: mascotaFechaNacimiento || undefined,
            mascota_edad_aproximada_anios: mascotaEdadAnios ? Number(mascotaEdadAnios) : undefined,
            mascota_edad_aproximada_meses: mascotaEdadMeses ? Number(mascotaEdadMeses) : undefined,
            mascota_color: mascotaColor || undefined,
            mascota_peso_kg: mascotaPesoKg ? Number(mascotaPesoKg) : undefined,
            mascota_tiene_microchip:
                mascotaTieneMicrochip === 'si'
                    ? true
                    : mascotaTieneMicrochip === 'no'
                        ? false
                        : undefined,
            mascota_numero_microchip: mascotaNumeroMicrochip || undefined,

            enfermedad_cronica: enfermedadCronica || undefined,
            medicacion_permanente: medicacionPermanente || undefined,
            alergias: alergias || undefined,
            tiene_seguro_medico:
                tieneSeguroMedico === 'si'
                    ? true
                    : tieneSeguroMedico === 'no'
                        ? false
                        : undefined,
            nombre_aseguradora: nombreAseguradora || undefined,
            observaciones: observaciones || undefined,
        }

        //Validacion para editar paciente
        if (paciente.id) {
            // Editando el resgistro
            objetoPaciente.id = paciente.id
            updatePaciente(paciente.id, objetoPaciente as Paciente)
            setPaciente({})

            // Alerta de éxito para edición de paciente
            Swal.fire({
                icon: 'success',
                title: 'Paciente actualizado',
                text: `Se actualizaron los datos de ${objetoPaciente.mascota_nombre || objetoPaciente.nombre}.`,
                confirmButtonColor: '#2563eb',
            })

        } else {
            // Generacion de Id
            objetoPaciente.id = generarId();
            // Nuevo registro
            addPaciente(objetoPaciente as Paciente)

            // Alerta de éxito para nuevo paciente
            Swal.fire({
                icon: 'success',
                title: 'Nuevo paciente registrado',
                text: `Se registró al paciente ${objetoPaciente.mascota_nombre || objetoPaciente.nombre}.`,
                confirmButtonColor: '#2563eb',
            })
        }

        //Reinicio del formulario
        setNombre('')
        setPropietario('')
        setEmail('')
        setFecha('')
        setSintomas('')

        setTutorNombre('')
        setTutorApellido('')
        setTutorTipoDocumento('')
        setTutorNumeroDocumento('')
        setTutorTelefonoPrincipal('')
        setTutorTelefonoSecundario('')
        setTutorEmail('')
        setTutorDireccion('')
        setTutorComoNosConocio('')

        setMascotaNombre('')
        setMascotaEspecie('')
        setMascotaEspecieOtro('')
        setMascotaRaza('')
        setMascotaRazaOtro('')
        setMascotaSexo('')
        setMascotaCastrado('')
        setMascotaFechaNacimiento('')
        setMascotaEdadAnios('')
        setMascotaEdadMeses('')
        setMascotaColor('')
        setMascotaPesoKg('')
        setMascotaTieneMicrochip('')
        setMascotaNumeroMicrochip('')

        setEnfermedadCronica('')
        setMedicacionPermanente('')
        setAlergias('')
        setTieneSeguroMedico('')
        setNombreAseguradora('')
        setObservaciones('')

        // Cerrar modal si existe la función
        if (onClose) {
            onClose();
        }
    }
    return (
        <div className={onClose ? "" : "md:w-1/2 lg:w-2/5 mx-5"}>
            {!onClose && (
                <>
                    <h2 className="font-black text-3xl text-center">Registro de nuevo paciente</h2>

                    <p className="text-lg mt-5 text-center mb-10">
                        Registra los datos del tutor y de la mascota para {''}
                        <span className="text-red-500 font-bold">un mejor seguimiento clínico</span>
                    </p>
                </>
            )}

            {/** Formulario para el ingreso de los pacientes */}
            <form
                onSubmit={handleSubmit}
                className={onClose ? "" : "bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl rounded-lg py-10 px-5 mb-10 border border-gray-200 dark:border-gray-700"}
            >
                {/** error es = true entonces imprimo el mensaje en formulario */}
                {error && <Error><p>Los campos obligatorios marcados con * son requeridos</p></Error>}

                {/* Datos del tutor */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">Datos del Tutor (Dueño)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            placeholder="Nombre del tutor"
                            value={tutorNombre}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorNombre(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            placeholder="Apellido del tutor"
                            value={tutorApellido}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorApellido(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Tipo de documento
                        </label>
                        <select
                            className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                            value={tutorTipoDocumento}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTutorTipoDocumento(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="dni">DNI</option>
                            <option value="cedula">Cédula</option>
                            <option value="pasaporte">Pasaporte</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Número de documento
                        </label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            value={tutorNumeroDocumento}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorNumeroDocumento(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Teléfono principal *
                        </label>
                        <input
                            type="tel"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            value={tutorTelefonoPrincipal}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorTelefonoPrincipal(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Teléfono secundario
                        </label>
                        <input
                            type="tel"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            value={tutorTelefonoSecundario}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorTelefonoSecundario(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                        value={tutorEmail}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                        Dirección completa
                    </label>
                    <input
                        type="text"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                        placeholder="Calle, número, barrio, ciudad"
                        value={tutorDireccion}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTutorDireccion(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                        ¿Cómo nos conoció?
                    </label>
                    <select
                        className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                        value={tutorComoNosConocio}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTutorComoNosConocio(e.target.value)}
                    >
                        <option value="">Seleccionar</option>
                        <option value="redes">Redes sociales</option>
                        <option value="recomendacion">Recomendación</option>
                        <option value="google">Google</option>
                        <option value="paseaba">Paseaba por aquí</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                {/* Datos del paciente (mascota) */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">Datos del Paciente (Mascota)</h3>

                <div className="mb-4">
                    <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                        Nombre de la mascota *
                    </label>
                    <input
                        type="text"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                        value={mascotaNombre}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotaNombre(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Especie
                        </label>
                        <select
                            className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                            value={mascotaEspecie}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setMascotaEspecie(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="perro">Perro</option>
                            <option value="gato">Gato</option>
                            <option value="ave">Ave</option>
                            <option value="roedor">Roedor</option>
                            <option value="reptil">Reptil</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Raza
                        </label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            value={mascotaRaza}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotaRaza(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                            Raza (otro)
                        </label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            value={mascotaRazaOtro}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotaRazaOtro(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">Sexo</label>
                        <select
                            className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                            value={mascotaSexo}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setMascotaSexo(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="macho">Macho</option>
                            <option value="hembra">Hembra</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">Castrado / esterilizado</label>
                        <select
                            className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                            value={mascotaCastrado}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setMascotaCastrado(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                            <option value="no_sabe">No sabe</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">Edad aproximada (años)</label>
                        <input
                            type="number"
                            min="0"
                            className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                            value={mascotaEdadAnios}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotaEdadAnios(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">Color</label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                            value={mascotaColor}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotaColor(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">Peso aproximado (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="border-2 w-full p-2 mt-1 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"

                        value={mascotaPesoKg}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotaPesoKg(e.target.value)}
                    />
                </div>

                {/* Información médica importante */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">Información médica importante</h3>

                {/* Motivo principal de la consulta / síntomas */}
                <div className="mb-4">
                    <label className="block text-gray-800 dark:text-gray-100 uppercase font-bold text-sm">
                        Motivo principal de la consulta / síntomas
                    </label>
                    <textarea
                        className="border-2 w-full p-2 mt-1 rounded-md placeholder-gray-400 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"

                        placeholder="Ej: vómitos desde hace 2 días, cojera en pata trasera, revisión general, etc."
                        value={sintomas}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSintomas(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 uppercase font-bold text-sm">
                        Enfermedad crónica
                    </label>
                    <textarea
                        className="border-2 w-full p-2 mt-1 rounded-md placeholder-gray-400"
                        placeholder="Ej: diabetes, epilepsia, insuficiencia renal, etc."
                        value={enfermedadCronica}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEnfermedadCronica(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 uppercase font-bold text-sm">
                        Medicación permanente
                    </label>
                    <textarea
                        className="border-2 w-full p-2 mt-1 rounded-md placeholder-gray-400"
                        value={medicacionPermanente}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMedicacionPermanente(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 uppercase font-bold text-sm">
                        Alergias conocidas
                    </label>
                    <textarea
                        className="border-2 w-full p-2 mt-1 rounded-md placeholder-gray-400"
                        value={alergias}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAlergias(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-800 uppercase font-bold text-sm">
                            ¿Tiene seguro médico para mascotas?
                        </label>
                        <select
                            className="border-2 w-full p-2 mt-1 rounded-md"
                            value={tieneSeguroMedico}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTieneSeguroMedico(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-800 uppercase font-bold text-sm">
                            Nombre de la aseguradora
                        </label>
                        <input
                            type="text"
                            className="border-2 w-full p-2 mt-1 rounded-md"
                            value={nombreAseguradora}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombreAseguradora(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-800 uppercase font-bold text-sm">
                        Observaciones adicionales
                    </label>
                    <textarea
                        className="border-2 w-full p-2 mt-1 rounded-md placeholder-gray-400"
                        placeholder="Carácter, miedos, agresividad, preferencias, etc."
                        value={observaciones}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setObservaciones(e.target.value)}
                    />
                </div>

                {/** Boton de agregar paciente */}
                <input
                    type="submit"
                    className="bg-red-500 w-full p-3 text-white uppercase font-bold hover:bg-red-700 cursor-pointer transition-all"
                    value={paciente.id ? 'Editar Paciente' : 'Agregar Paciente'}
                />
            </form>
        </div>
    );
}

// Importamos nuestro functional component
export default Formulario;