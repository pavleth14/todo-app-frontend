import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Globalno omogućava slanje cookies sa svakim zahtevom
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ CSRF zaštita – dobijanje XSRF-TOKEN cookie-ja
  const getCsrfToken = async () => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
    } catch (error) {
      console.error('Greška pri dobijanju CSRF tokena:', error);
    }
  };

  // ✅ Provera da li je korisnik već ulogovan kad se app pokrene
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCsrfToken(); // mora pre svakog pokušaja autentikacije
        const res = await axios.get('http://localhost:8000/api/user');
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login funkcija
  const login = async (email, password) => {
    try {
      await getCsrfToken();
      const res = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      console.error('Login greška:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Neuspešan login.'
      };
    }
  };

  // ✅ Register funkcija
  const register = async (name, email, password, password_confirmation) => {
    try {
      await getCsrfToken();
      const res = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
        password_confirmation
      });
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      console.error('Register greška:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registracija neuspešna.'
      };
    }
  };

  // ✅ Logout funkcija
  const logout = async () => {
    try {
      await getCsrfToken();
      await axios.post('http://localhost:8000/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout greška:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
