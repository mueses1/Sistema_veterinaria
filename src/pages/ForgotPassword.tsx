import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            Swal.fire('Error', 'Por favor ingresa tu correo electrónico', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch('http://localhost:8000/api/v1/auth/password-recovery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // El backend siempre retorna 200 OK por seguridad, incluso si el email no existe
            if (response.ok) {
                Swal.fire({
                    title: 'Correo enviado',
                    text: 'Si el correo existe en nuestro sistema, recibirás un código de verificación. Ingrésalo en la siguiente pantalla.',
                    icon: 'success',
                    confirmButtonText: 'Ingresar Código'
                }).then(() => {
                    navigate('/reset-password');
                });
            } else {
                Swal.fire('Error', 'Hubo un problema al procesar tu solicitud. Intenta nuevamente.', 'error');
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <Card title="Recuperar Contraseña" className="shadow-lg">
                    <p className="text-gray-600 mb-6 text-sm">
                        Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            error=""
                        />

                        <div className="space-y-3 mt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Código'}
                            </Button>

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/reset-password')}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    ¿Ya tienes un código? Ingrésalo aquí
                                </button>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/login')}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;