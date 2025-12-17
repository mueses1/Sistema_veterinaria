import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Estado para el token, inicalizado con el del URL si existe
    const [token, setToken] = useState(searchParams.get('token') || '');

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        token: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'token') {
            setToken(value);
            if (errors.token) setErrors(prev => ({ ...prev, token: '' }));
        } else {
            setPasswords(prev => ({ ...prev, [name]: value }));
            if (errors[name as keyof typeof errors]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const validate = () => {
        const newErrors = { token: '', newPassword: '', confirmPassword: '' };
        let isValid = true;

        if (!token) {
            newErrors.token = 'El código es requerido';
            isValid = false;
        }

        if (passwords.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    new_password: passwords.newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu contraseña ha sido actualizada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Iniciar Sesión'
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire('Error', data.detail || 'No se pudo restablecer la contraseña', 'error');
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <Card title="Restablecer Contraseña" className="shadow-lg">
                    <p className="text-gray-600 mb-6 text-sm">
                        Ingresa el código que recibiste en tu correo y tu nueva contraseña.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Código de Verificación"
                            type="text"
                            name="token"
                            placeholder="Ej. abc-123-xyz"
                            value={token}
                            onChange={handleChange}
                            error={errors.token}
                            required
                        />

                        <Input
                            label="Nueva Contraseña"
                            type="password"
                            name="newPassword"
                            placeholder="••••••••"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                            required
                        />

                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            required
                        />

                        <div className="space-y-3 mt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Actualizando...' : 'Cambiar Contraseña'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;