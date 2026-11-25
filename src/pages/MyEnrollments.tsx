import { useCallback, useEffect, useState } from "react";
import { api, errorCode, errorMsg } from "../api";
import { Card, btnCls } from "../componentes";

type Enrollment = {
  id: number;
  resourceId: number;
  resourceName: string;
  experienceLevel: string;
  status: "ACTIVE" | "WITHDRAWN";
};

const levelLabels: Record<string, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export default function MyEnrollments() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await api.get<Enrollment[]>("/me/enrollments");
      setItems(res.data);
    } catch (e) {
      setItems([]);
      setError(errorMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withdraw = async (item: Enrollment) => {
    if (!window.confirm(`¿Retirar tu inscripción en "${item.resourceName}"?`)) return;
    setActionError("");
    setSuccess("");
    setWithdrawingId(item.id);
    try {
      await api.patch(`/enrollments/${item.id}/withdraw`);
      setSuccess("Inscripción retirada");
    } catch (e) {
      if (errorCode(e) === "INVALID_STATE") setActionError("El registro cambió y ya no puede retirarse.");
      else setActionError(errorMsg(e));
    } finally {
      setWithdrawingId(null);
    }
    await load(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis inscripciones</h1>
      {actionError && <p className="text-red-600 mb-2">{actionError}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {loading && <p>Cargando...</p>}
      {!loading && error && (
        <div>
          <p className="text-red-600 mb-2">{error}</p>
          <button className={btnCls} onClick={() => load()}>Reintentar</button>
        </div>
      )}
      {!loading && !error && items.length === 0 && <p>No tienes inscripciones.</p>}
      {!loading && !error && items.map((it) => (
        <Card key={it.id}>
          <p className="text-sm text-gray-500">Inscripción #{it.id}</p>
          <p className="text-lg font-semibold">{it.resourceName}</p>
          <p>Nivel: {levelLabels[it.experienceLevel] ?? it.experienceLevel}</p>
          <p>Estado: {it.status}</p>
          {it.status === "ACTIVE" && (
            <button
              className="mt-2 border border-red-600 text-red-600 px-3 py-1 rounded disabled:opacity-50"
              disabled={withdrawingId === it.id}
              onClick={() => withdraw(it)}
            >
              {withdrawingId === it.id ? "Retirando..." : "Retirar inscripción"}
            </button>
          )}
        </Card>
      ))}
    </div>
  );
}
