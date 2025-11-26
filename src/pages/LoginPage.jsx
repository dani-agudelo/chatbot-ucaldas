import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Sesión iniciada correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/metrics');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.detail || 'Credenciales incorrectas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-sm w-full">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-xl bg-primary/20 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">lock</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Panel de Administración
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Ingresa tus credenciales
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Verificando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-white/10"></div>

          {/* Back to chat */}
          <Link 
            to="/chat" 
            className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver al chat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
