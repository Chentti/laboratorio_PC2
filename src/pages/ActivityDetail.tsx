import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { api, errorCode, errorMsg } from "../api";
import { Card, Field, inputCls, btnCls } from "../componentes";

type Activity = {
  id: number;
  name: string;
  discipline: string;
  date: string;
  vacancies: number;
  description: string;
  location: string;
};

const levels = [
  { value: "BEGINNER", label: "Principiante" },
  { value: "INTERMEDIATE", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzado" },
];

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [level, setLevel] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      const res = await api.get<Activity>(`/activities/${id}`);
      setActivity(res.data);
    } catch (e) {
      setActivity(null);
      setLoadError(errorCode(e) === "NOT_FOUND" ? "La actividad no existe." : errorMsg(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => load(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    const errs: Record<string, string> = {};
    if (!levels.some((l) => l.value === level)) errs.level = "Selecciona un nivel de experiencia";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await api.post(`/activities/${id}/enrollments`, { experienceLevel: level });
      setSuccess("Inscripción realizada");
      setLevel("");
      await refresh();
    } catch (err) {
      setApiError(errorMsg(err));
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link to="/dashboard" className="text-blue-600">← Volver al dashboard</Link>
      {loading && <p className="mt-3">Cargando...</p>}
      {!loading && loadError && <p className="text-red-600 mt-3">{loadError}</p>}
      {!loading && activity && (
        <>
          <div className="mt-3">
            <Card>
              <h1 className="text-2xl font-bold mb-2">{activity.name}</h1>
              <p>{activity.description}</p>
              <p>Fecha: {activity.date}</p>
              <p>Ubicación: {activity.location}</p>
              <p>Vacantes: {activity.vacancies}</p>
            </Card>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
              <Field label="Nivel de experiencia" error={errors.level}>
                <select className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </Field>
              {apiError && <p className="text-red-600 mb-2">{apiError}</p>}
              {success && <p className="text-green-600 mb-2">{success}</p>}
              <button className={btnCls} disabled={submitting}>{submitting ? "Enviando..." : "Inscribirme"}</button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
