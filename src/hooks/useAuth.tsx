import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: { message: string } }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    // Simulação de autenticação
    if (email && password) {
      const fakeUser: User = { id: "1", name: "Paulo", email, isAdmin: true };
      setUser(fakeUser);
      return {};
    }
    return { error: { message: "E-mail ou senha inválidos." } };
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulação de cadastro
    if (email && password && name) {
      // Aqui você poderia criar o usuário
      return {};
    }
    return { error: { message: "Preencha todos os campos." } };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;}