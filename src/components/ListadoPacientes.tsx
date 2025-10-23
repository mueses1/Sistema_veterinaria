// Importamos el listado de pacientes
//import { useEffect } from "react";
import Paciente from "./Paciente";
import { Paciente as PacienteType } from '../types';

interface ListadoPacientesProps {
  pacientes: PacienteType[];
  setPaciente: (paciente: Partial<PacienteType>) => void;
  eliminarPaciente: (id: string) => void;
}

// Creamos nuestro functional component
const ListadoPacientes = ({ pacientes, setPaciente, eliminarPaciente }: ListadoPacientesProps) => {

    /** Imprimimos un console.log siempre que el listado de 
     * pacientes tenga un paciente registrado 
     * */
    // useEffect(() => {
        
    //     if(pacientes.length > 0){
    //     console.log('Nuevo paciente registrado')
    //     }

    // }, [ pacientes ])

    return (
        <div className="md:w-1/2 lg:w-3/5 md:h-screen overflow-y-scroll">
            {/** Si no hay pacientes mostrar el siguiente mensaje*/}
            {pacientes && pacientes.length ? (
                <>
                    <h2 className="font-black text-3xl text-center">Listado de pacientes</h2>
                    <p className="text-xl mt-5 mb-10 text-center">Administra tus {''}
                        <span className="text-red-500 font-bold">Pacientes y Turnos</span>
                    </p>
        
                    {/** Mapeo de pacientes ordenados por fecha más reciente */}
                    { pacientes
                        .sort((a: PacienteType, b: PacienteType) => {
                            // Ordenar por ID (más reciente primero) como fallback si no hay fecha
                            const fechaA = new Date(a.fecha || 0);
                            const fechaB = new Date(b.fecha || 0);
                            
                            // Si las fechas son iguales, ordenar por ID (más reciente primero)
                            if (fechaA.getTime() === fechaB.getTime()) {
                                return b.id.localeCompare(a.id);
                            }
                            
                            // Ordenar por fecha más reciente primero
                            return fechaB.getTime() - fechaA.getTime();
                        })
                        .map( (paciente: PacienteType) => 
                            /** El return esta implicito */
                            /** Mostramos el listado de pacientes en pantalla */
                            <Paciente 
                                key = {paciente.id}
                                paciente = {paciente}
                                setPaciente = {setPaciente}
                                eliminarPaciente ={eliminarPaciente}
                            />
                        )}
                </>
            ) : (
                <>
                    <h2 className="font-black text-3xl text-center">No hay pacientes</h2>
                    <p className="text-xl mt-5 mb-10 text-center">Agrega a tus pacientes {''}
                        <span className="text-red-500 font-bold">y apareceran aqui</span>
                    </p>
                </>
            )}
        </div>
    );
}

// Importamos nuestro functional component
export default ListadoPacientes;