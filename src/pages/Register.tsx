import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, errorCode, errorMsg } from "../api";
import { Field, inputCls, btnCls } from "../componentes";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    const errs: Record<string, string> = {};
    if (name.trim() === "" || name.trim().length > 100) errs.name = "Nombre obligatorio, máximo 100 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Correo inválido";
    if (!/^[\x00-\x7F]{8,72}$/.test(password)) errs.password = "De 8 a 72 caracteres ASCII";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await api.post("/auth/register", { name: name.trim(), email, password });
      navigate("/login");
    } catch (err) {
      setApiError(errorCode(err) ? errorMsg(err) : "No se pudo registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        <Field label="Nombre" error={errors.name}>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Correo" error={errors.email}>
          <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Contraseña" error={errors.password}>
          <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {apiError && <p className="text-red-600 mb-2">{apiError}</p>}
        <button className={btnCls + " w-full"}>Registrarme</button>
        <p className="mt-3 text-sm">¿Ya tienes cuenta? <Link className="text-blue-600" to="/login">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
