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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulamos autenticación
            const userData = {
                id: '1',
                name: 'Dr. Juan Pérez',
                email: formData.email,
                role: 'veterinario'
            };

            login(userData);
            navigate('/dashboard');
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

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                        >
                            Iniciar Sesión
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;