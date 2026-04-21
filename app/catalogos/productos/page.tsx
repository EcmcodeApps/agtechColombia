"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getProductos, saveProducto, updateProducto, deleteProducto,
  getUserPlan, PRODUCTO_LIMITS,
  type ProductoRecord, type ProductoTipo, type ProductoEstado,
} from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TIPOS: ProductoTipo[] = ["hardware", "software", "servicio", "otro"];
const TIPO_COLOR: Record<string, string> = {
  hardware: "bg-orange-100 text-orange-700",
  software: "bg-blue-100  text-blue-700",
  servicio: "bg-purple-100 text-purple-700",
  otro:     "bg-surface-container text-on-surface-variant",
};

const BLANK: Omit<ProductoRecord, "id"|"uid"|"createdAt"|"updatedAt"> = {
  nombre: "", descripcion: "", precio: 0, moneda: "COP",
  tipo: "hardware", estado: "activo", destacado: false,
  imagenUrl: "", cultivos: [],
};

const PER_PAGE = 6;

export default function ProductosPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<ProductoRecord[]>([]);
  const [plan,      setPlan]      = useState("gratuito");
  const [loading,   setLoading]   = useState(true);
  const [show,      setShow]      = useState(false);
  const [form,      setForm]      = useState({ ...BLANK });
  const [editId,    setEditId]    = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [imgFile,   setImgFile]   = useState<File | null>(null);
  const [preview,   setPreview]   = useState("");
  const [filterCat, setFilterCat] = useState("todos");
  const [page,      setPage]      = useState(1);
  const [cultivoInput, setCultivoInput] = useState("");
  const imgRef = useRef<HTMLInputElement>(null);

  const MAX = PRODUCTO_LIMITS[plan] ?? 3;

  useEffect(() => {
    if (!user) return;
    getUserPlan(user.uid).then(p => setPlan(p ?? "gratuito"));
    getProductos(user.uid).then(p => { setProductos(p); setLoading(false); });
  }, [user]);

  function openNew() {
    setForm({ ...BLANK }); setEditId(null);
    setImgFile(null); setPreview(""); setCultivoInput(""); setShow(true);
  }
  function openEdit(p: ProductoRecord) {
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio,
      moneda: p.moneda, tipo: p.tipo, estado: p.estado, destacado: p.destacado,
      imagenUrl: p.imagenUrl ?? "", cultivos: p.cultivos ?? [] });
    setEditId(p.id!); setImgFile(null); setPreview(p.imagenUrl ?? "");
    setCultivoInput((p.cultivos ?? []).join(", ")); setShow(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let imagenUrl = form.imagenUrl;
      if (imgFile) {
        const r = ref(storage, `productos/${user.uid}/${Date.now()}_${imgFile.name}`);
        await uploadBytes(r, imgFile);
        imagenUrl = await getDownloadURL(r);
      }
      const cultivos = cultivoInput.split(",").map(x => x.trim()).filter(Boolean);
      const data = { ...form, imagenUrl, cultivos, uid: user.uid };
      if (editId) {
        await updateProducto(editId, data);
        setProductos(prev => prev.map(p => p.id === editId ? { ...p, ...data } : p));
      } else {
        const id = await saveProducto(data);
        setProductos(prev => [{ ...data, id, createdAt: null, updatedAt: null }, ...prev]);
      }
      setShow(false);
    } finally { setSaving(false); }
  }

  async function toggleEstado(p: ProductoRecord) {
    const estado: ProductoEstado = p.estado === "activo" ? "oculto" : "activo";
    await updateProducto(p.id!, { estado });
    setProductos(prev => prev.map(x => x.id === p.id ? { ...x, estado } : x));
  }

  async function handleDelete(id: string) {
    await deleteProducto(id);
    setProductos(prev => prev.filter(p => p.id !== id));
  }

  const filtered  = filterCat === "todos" ? productos : productos.filter(p => p.tipo === filterCat);
  const pages     = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">

      {/* ── Banner exclusividad ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-emerald-700 p-6 text-on-primary">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-yellow-400 px-3 py-0.5 text-xs font-black text-yellow-900 uppercase tracking-wide">⭐ Destacado</span>
              <span className="text-xs font-medium opacity-80">Exclusivo</span>
            </div>
            <h2 className="text-lg font-bold">¿Quieres aparecer primero en el directorio?</h2>
            <p className="text-sm opacity-80 mt-0.5">
              Destaca tus productos con el badge <strong>DESTACADO</strong> y aparece en la portada del directorio AgTech Colombia.
              Solo <strong>5 cupos disponibles</strong> por mes.
            </p>
          </div>
          <a href="mailto:destacados@agtech-colombia.com?subject=Quiero%20destacar%20mi%20producto"
            className="shrink-0 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-primary hover:bg-primary-container transition-colors whitespace-nowrap">
            Ver planes desde $49.000 →
          </a>
        </div>
        {/* decorative blobs */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 h-20 w-20 rounded-full bg-white/5" />
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-on-surface font-headline">Productos y servicios</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="rounded-full bg-primary-container px-3 py-0.5 text-xs font-semibold text-on-primary-container">
              {productos.length} de {MAX} productos
            </span>
            <span className="rounded-full bg-surface-container border border-outline-variant px-3 py-0.5 text-xs font-medium text-on-surface-variant capitalize">
              Plan {plan}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}
            className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary">
            <option value="todos">Todas las categorías</option>
            {TIPOS.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
          <button onClick={openNew} disabled={productos.length >= MAX}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity">
            <span className="text-lg leading-none">+</span> Agregar producto
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(p => (
              <ProductCard key={p.id} producto={p}
                onEdit={() => openEdit(p)}
                onToggle={() => toggleEstado(p)}
                onDelete={() => handleDelete(p.id!)} />
            ))}

            {/* Create new card */}
            {productos.length < MAX && (
              <button onClick={openNew}
                className="rounded-3xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 p-8 hover:bg-surface-container transition-colors min-h-[260px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-outline-variant text-2xl text-on-surface-variant">+</div>
                <p className="font-semibold text-on-surface text-sm">Crear nuevo producto</p>
                <p className="text-xs text-on-surface-variant text-center">Amplía tu catálogo y llega a más agricultores colombianos.</p>
              </button>
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                Mostrando <strong>{paginated.length}</strong> productos de <strong>{filtered.length}</strong> disponibles en tu plan.
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="rounded-xl border border-outline-variant px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container disabled:opacity-40">‹</button>
                {Array.from({ length: pages }, (_, i) => i+1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${page === n ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}
                  className="rounded-xl border border-outline-variant px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container disabled:opacity-40">›</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Modal ── */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-surface shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant">
              <h2 className="font-bold text-on-surface font-headline">{editId ? "Editar" : "Nuevo"} producto</h2>
              <button onClick={() => setShow(false)} className="rounded-full p-2 hover:bg-surface-container transition-colors text-on-surface-variant">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Imagen */}
              <button type="button" onClick={() => imgRef.current?.click()}
                className="relative w-full h-36 rounded-2xl border-2 border-dashed border-outline-variant overflow-hidden hover:bg-surface-container transition-colors">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <div className="flex flex-col items-center justify-center h-full gap-2 text-on-surface-variant">
                      <span className="text-3xl">🖼️</span><span className="text-xs">Click para subir imagen</span>
                    </div>
                }
              </button>
              <input ref={imgRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)); } }} />

              {[
                { label: "Nombre del producto", key: "nombre", type: "text", required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">{f.label}</label>
                  <input required={f.required} value={(form as never)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Descripción</label>
                <textarea value={form.descripcion} rows={3} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Precio</label>
                  <input type="number" min={0} value={form.precio}
                    onChange={e => setForm(p => ({ ...p, precio: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Moneda</label>
                  <select value={form.moneda} onChange={e => setForm(p => ({ ...p, moneda: e.target.value as "COP"|"USD" }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary">
                    <option>COP</option><option>USD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as ProductoTipo }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary capitalize">
                    {TIPOS.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Estado</label>
                  <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as ProductoEstado }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary">
                    <option value="activo">Activo</option>
                    <option value="oculto">Oculto</option>
                    <option value="borrador">Borrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                  Cultivos relacionados <span className="normal-case font-normal">(separados por coma)</span>
                </label>
                <input value={cultivoInput} onChange={e => setCultivoInput(e.target.value)}
                  placeholder="Café, Cacao, Aguacate…"
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-outline-variant p-3 hover:bg-surface-container transition-colors">
                <input type="checkbox" checked={form.destacado} onChange={e => setForm(p => ({ ...p, destacado: e.target.checked }))}
                  className="h-4 w-4 accent-primary" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">⭐ Producto destacado</p>
                  <p className="text-xs text-on-surface-variant">Requiere plan Destacado activo</p>
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShow(false)}
                  className="flex-1 rounded-xl border border-outline-variant py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {saving ? "Guardando…" : "Guardar producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ producto: p, onEdit, onToggle, onDelete }:{
  producto: ProductoRecord;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const TIPO_COLOR: Record<string, string> = {
    hardware: "bg-orange-100 text-orange-700",
    software: "bg-blue-100 text-blue-700",
    servicio: "bg-purple-100 text-purple-700",
    otro:     "bg-surface-container text-on-surface-variant",
  };
  const ESTADO_DOT: Record<string, string> = {
    activo:   "bg-green-500",
    oculto:   "bg-orange-400",
    borrador: "bg-surface-container-highest",
  };

  return (
    <div className="rounded-3xl border border-outline-variant bg-surface-container-low overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-surface-container overflow-hidden">
        {p.imagenUrl
          ? <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-5xl text-on-surface-variant/20">
              {p.tipo === "hardware" ? "🔧" : p.tipo === "software" ? "💻" : "🤝"}
            </div>
        }
        {p.destacado && (
          <span className="absolute top-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-yellow-900 shadow">
            ⭐ DESTACADO
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${TIPO_COLOR[p.tipo] ?? ""}`}>
            {p.tipo}
          </span>
          <span className="font-extrabold text-primary text-sm">
            ${p.precio.toLocaleString("es-CO")} {p.moneda}
          </span>
        </div>

        <h3 className="font-bold text-on-surface text-sm leading-snug">{p.nombre}</h3>
        <p className="text-xs text-on-surface-variant line-clamp-2">{p.descripcion}</p>

        {(p.cultivos ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {(p.cultivos ?? []).slice(0, 3).map(c => (
              <span key={c} className="rounded-full bg-primary-container px-2.5 py-0.5 text-xs text-on-primary-container">{c}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${ESTADO_DOT[p.estado]}`} />
            <span className="text-xs capitalize text-on-surface-variant">{p.estado}</span>
          </div>
          <div className="flex gap-1">
            <IconBtn onClick={onEdit}    title="Editar">✏️</IconBtn>
            <IconBtn onClick={onToggle}  title={p.estado === "activo" ? "Ocultar" : "Activar"}>
              {p.estado === "activo" ? "👁️" : "🙈"}
            </IconBtn>
            <IconBtn onClick={onDelete}  title="Eliminar" danger>🗑️</IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, danger, children }: {
  onClick: () => void; title: string; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} title={title}
      className={`rounded-xl p-1.5 text-sm transition-colors ${danger ? "hover:bg-error-container" : "hover:bg-surface-container"}`}>
      {children}
    </button>
  );
}
