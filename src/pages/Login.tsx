import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const Login = () => {

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setApiError(null);

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setApiError('Credenciales inválidas');
                } else {
                    setApiError('Ocurrió un error al iniciar sesión. Intenta de nuevo.');
                }
                return;
            }

            const data = await response.json();

            const userData = {
                id: data.user_id,
                name: data.name,
                email: data.email,
                role: data.role,
                token: data.access_token,
            };

            login(userData);

            if (userData.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/cliente-dashboard');
            }
        } catch (error) {
            setApiError('No se pudo conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <Card title="Iniciar Sesión" className="shadow-lg">
                    <form onSubmit={handleSubmit}>

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="doctor@veterinaria.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                        />

                        <div className="flex justify-end -mt-2 mb-4">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {apiError && (
                            <p className="text-red-500 text-sm mb-4">{apiError}</p>
                        )}

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/')}
                            >
                                Volver a la página principal
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;