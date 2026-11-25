import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { Field, inputCls, btnCls } from "../componentes";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post<{ token: string }>("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <Field label="Correo">
          <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Contraseña">
          <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button className={btnCls + " w-full"}>Entrar</button>
        <p className="mt-3 text-sm">¿No tienes cuenta? <Link className="text-blue-600" to="/register">Regístrate</Link></p>
      </form>
    </div>
  );
}
