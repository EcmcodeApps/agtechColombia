"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCompany, getRepresentantes, getCatalogos, getGaleriaFotos, type CompanyRecord, type RepresentanteRecord, type CatalogoRecord, type GaleriaFotoRecord } from "@/lib/firebase/firestore";
import Link from "next/link";

export default function PerfilPublicoPage() {
  const { uid }    = useParams<{ uid: string }>();
  const { user }   = useAuth();
  const router     = useRouter();

  const [company, setCompany]   = useState<CompanyRecord | null>(null);
  const [reps,    setReps]      = useState<RepresentanteRecord[]>([]);
  const [cats,    setCats]      = useState<CatalogoRecord[]>([]);
  const [fotos,   setFotos]     = useState<GaleriaFotoRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab,     setTab]       = useState<"info"|"catalogs"|"gallery">("info");

  const isOwner = user?.uid === uid;

  useEffect(() => {
    if (!uid) return;
    Promise.all([
      getCompany(uid),
      getRepresentantes(uid).catch(() => []),
      getCatalogos(uid).catch(() => []),
      getGaleriaFotos(uid).catch(() => []),
    ]).then(([c, r, cat, f]) => {
      setCompany(c);
      setReps(r);
      setCats(cat);
      setFotos(f);
      setLoading(false);
    });
  }, [uid]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  if (!company) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface gap-4">
      <p className="text-4xl">🌾</p>
      <p className="font-semibold text-on-surface">Empresa no encontrada</p>
      <Link href="/catalogos/directorio" className="text-sm text-primary hover:underline">← Volver al directorio</Link>
    </div>
  );

  const cultivosList = Array.isArray(company.cultivos)
    ? (company.cultivos as string[])
    : typeof company.cultivos === "string"
      ? (company.cultivos as string).split(",").map(x => x.trim()).filter(Boolean)
      : [];

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between bg-surface/90 backdrop-blur border-b border-outline-variant px-4 md:px-8 py-3">
        <Link href="/catalogos/directorio" className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface">
          <span>←</span> <span className="hidden sm:inline">Directorio</span>
        </Link>
        <span className="font-bold text-primary font-headline text-base">AgTech Colombia</span>
        {isOwner
          ? <Link href="/dashboard/perfil" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:opacity-90">Editar perfil</Link>
          : <button className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:opacity-90">Conectar</button>
        }
      </nav>

      {/* ── Hero: portada + logo ── */}
      <div className="relative">
        <div className="h-48 sm:h-64 md:h-80 w-full bg-primary-container overflow-hidden">
          {company.portadaUrl
            ? <img src={company.portadaUrl} alt="portada" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-primary-container to-surface-container-highest flex items-center justify-center text-6xl opacity-30">🌿</div>
          }
        </div>

        {/* Logo floating */}
        <div className="absolute -bottom-10 left-4 md:left-8 h-20 w-20 md:h-24 md:w-24 rounded-2xl border-4 border-surface bg-surface overflow-hidden shadow-lg">
          {company.logoUrl
            ? <img src={company.logoUrl} alt={company.nombreComercial ?? company.nombre} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-primary-container flex items-center justify-center text-3xl">🏢</div>
          }
        </div>
      </div>

      {/* ── Company header ── */}
      <div className="px-4 md:px-8 pt-14 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">
                {company.nombreComercial ?? company.nombre ?? "Sin nombre"}
              </h1>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                ✓ VERIFICADO
              </span>
            </div>
            {company.categoriaLabel && (
              <p className="text-sm font-bold text-primary uppercase tracking-wide mt-1">
                {company.categoriaLabel}
              </p>
            )}
            {company.pitchCorto && (
              <p className="text-sm text-on-surface-variant italic mt-1">
                "{company.pitchCorto}"
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-3">
              {(company.ciudad || company.departamento) && (
                <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                  📍 {[company.ciudad, company.departamento].filter(Boolean).join(", ")}
                </span>
              )}
              {company.nit && (
                <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                  🪪 NIT: {company.nit}
                </span>
              )}
              {company.anioFundacion && (
                <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                  📅 Desde {company.anioFundacion}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            {company.sitioWeb && (
              <a href={company.sitioWeb} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                🌐 Web
              </a>
            )}
            <button className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary hover:opacity-90 transition-opacity">
              Conectar
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-outline-variant px-4 md:px-8">
        <div className="flex gap-0 -mb-px">
          {([
            { key: "info",     label: "Información",  count: null },
            { key: "catalogs", label: "Catálogos",    count: cats.length },
            { key: "gallery",  label: "Galería",      count: fotos.length },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                tab === t.key ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}>
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === t.key ? "bg-primary-container text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 md:px-8 py-6">

        {/* INFO TAB */}
        {tab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: description + cultivos */}
            <div className="lg:col-span-2 space-y-6">

              {company.descripcionCompleta && (
                <Card title="Sobre nosotros">
                  <p className="text-sm text-on-surface leading-relaxed">{company.descripcionCompleta}</p>
                </Card>
              )}

              {cultivosList.length > 0 && (
                <Card title="Impacto en cultivos">
                  <div className="flex flex-wrap gap-2">
                    {cultivosList.map(c => (
                      <span key={c} className="rounded-full bg-primary-container px-4 py-1.5 text-sm font-medium text-on-primary-container">
                        {c}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Representantes */}
              {reps.length > 0 && (
                <Card title="Equipo comercial">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reps.map(r => (
                      <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-outline-variant p-4">
                        {r.fotoUrl
                          ? <img src={r.fotoUrl} alt={r.nombre} className="h-12 w-12 rounded-full object-cover shrink-0 border border-outline-variant" />
                          : <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center text-xl shrink-0">👤</div>
                        }
                        <div className="min-w-0">
                          <p className="font-semibold text-on-surface text-sm truncate">{r.nombre}</p>
                          <p className="text-xs text-on-surface-variant">{r.cargo}</p>
                          {r.email && <p className="text-xs text-primary mt-0.5 truncate">{r.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right: info card */}
            <div className="space-y-4">
              <Card title="Información general">
                <dl className="space-y-3">
                  {[
                    { label: "Nombre comercial", value: company.nombreComercial ?? company.nombre },
                    { label: "Razón social",      value: company.razonSocial },
                    { label: "NIT",               value: company.nit },
                    { label: "Año fundación",     value: company.anioFundacion },
                    { label: "Ciudad",            value: company.ciudad },
                    { label: "Departamento",      value: company.departamento },
                    { label: "Tamaño",            value: company.tamano ? `${company.tamano} empleados` : null },
                  ].filter(x => x.value).map(x => (
                    <div key={x.label}>
                      <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">{x.label}</dt>
                      <dd className="text-sm text-on-surface mt-0.5">{x.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              {company.sitioWeb && (
                <Card title="Contacto">
                  <a href={company.sitioWeb} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    🌐 {company.sitioWeb}
                  </a>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* CATALOGS TAB */}
        {tab === "catalogs" && (
          cats.length === 0
            ? <Empty icon="📄" msg="Esta empresa aún no ha publicado catálogos." />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cats.map(c => (
                  <a key={c.id} href={c.url} target="_blank" rel="noreferrer"
                    className="group rounded-2xl border border-outline-variant bg-surface-container-low p-5 flex flex-col gap-3 hover:bg-surface-container transition-colors">
                    <span className="text-4xl">📄</span>
                    <p className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">{c.nombre}</p>
                    <p className="text-xs text-on-surface-variant">{c.descargas ?? 0} descargas</p>
                    <span className="mt-auto text-xs font-medium text-primary">Ver catálogo →</span>
                  </a>
                ))}
              </div>
        )}

        {/* GALLERY TAB */}
        {tab === "gallery" && (
          fotos.length === 0
            ? <Empty icon="🖼️" msg="Esta empresa aún no ha publicado fotos." />
            : <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {fotos.map(f => (
                  <div key={f.id} className="break-inside-avoid rounded-2xl overflow-hidden border border-outline-variant">
                    <img src={f.url} alt={f.titulo} className="w-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-outline-variant bg-surface-container-low p-5 space-y-4">
      <h3 className="font-bold text-on-surface text-sm uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <p className="text-5xl">{icon}</p>
      <p className="text-sm text-on-surface-variant">{msg}</p>
    </div>
  );
}
