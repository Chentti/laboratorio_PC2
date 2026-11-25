import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMsg } from "../api";
import type { PageResp } from "../api";
import { Card, Pagination, btnCls } from "../componentes";

type Workshop = { id: number; name: string; discipline: string; date: string; vacancies: number };

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PageResp<Workshop> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<PageResp<Workshop>>(`/activities?page=${page}&size=5`);
      setData(res.data);
    } catch (e) {
      setData(null);
      setError(errorMsg(e));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Actividades</h1>
      {loading && <p>Cargando...</p>}
      {!loading && error && (
        <div>
          <p className="text-red-600 mb-2">{error}</p>
          <button className={btnCls} onClick={load}>Reintentar</button>
        </div>
      )}
      {!loading && !error && data?.items.length === 0 && <p>No hay actividades.</p>}
      {!loading && !error && data?.items.map((w) => (
        <Card key={w.id}>
          <Link to={`/activities/${w.id}`} className="text-lg font-semibold text-blue-600">{w.name}</Link>
          <p>Disciplina: {w.discipline}</p>
          <p>Fecha: {w.date}</p>
          <p>Vacantes: {w.vacancies}</p>
        </Card>
      ))}
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
    </div>
  );
}
