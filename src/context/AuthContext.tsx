import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    // Propiedades adicionales para el perfil
    nombre?: string;
    telefono?: string;
    especialidad?: string;
    licencia?: string;
    direccion?: string;
    biografia?: string;
    rol?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};