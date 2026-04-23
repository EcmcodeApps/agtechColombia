import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp,
  DocumentData, collection, query, where, orderBy, getDocs,
} from "firebase/firestore";
import { db } from "./client";

/* ── UserProfile ─────────────────────────────────────────────────────────── */
export interface UserProfile {
  uid: string; email: string; displayName: string;
  photoURL?: string; createdAt?: unknown; onboardingCompleted: boolean;
}
export async function createUserProfile(uid: string, data: Omit<UserProfile,'uid'>) {
  await setDoc(doc(db,'users',uid), { ...data, createdAt: serverTimestamp() }, { merge: true });
}
export async function getUserProfile(uid: string): Promise<UserProfile|null> {
  const s = await getDoc(doc(db,'users',uid));
  return s.exists() ? { uid: s.id, ...s.data() } as UserProfile : null;
}
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db,'users',uid), data as DocumentData);
}
export async function markOnboardingComplete(uid: string) {
  await updateDoc(doc(db,'users',uid), { onboardingCompleted: true });
}
export async function getAllUsers(): Promise<UserProfile[]> {
  const s = await getDocs(collection(db,'users'));
  return s.docs.map(d => ({ uid: d.id, ...d.data() }) as UserProfile);
}

/* ── Company ─────────────────────────────────────────────────────────────── */
export interface CompanyStep1 {
  nombreComercial: string; razonSocial: string; nit: string; anioFundacion: string;
  categorias: string[]; departamento: string; ciudad: string;
  tamano: "1-10"|"11-50"|"51+"; sitioWeb?: string; logoUrl?: string; portadaUrl?: string;
}
export interface CompanyStep2 {
  nombre: string; cargo: string; linkedin?: string; correo: string;
  celular: string; whatsapp?: string; perfilPublico: boolean; fotoPerfilUrl?: string;
}
export interface CompanyStep3 {
  pitchCorto: string; descripcionCompleta?: string; cultivos: string[]; zonas: string[];
  redes?: { instagram?: string; facebook?: string; twitter?: string; youtube?: string; tiktok?: string };
}
export interface CompanyRecord {
  uid: string; ownerId?: string; status?: string; activa?: boolean; plan?: string;
  // flat fields (onboarding directo)
  nombreComercial?: string; razonSocial?: string; nit?: string; anioFundacion?: string;
  ciudad?: string; departamento?: string; tamano?: "1-10"|"11-50"|"51+";
  sitioWeb?: string; logoUrl?: string; portadaUrl?: string;
  categorias?: string[]; cultivos?: string[]; zonas?: string[];
  pitchCorto?: string; descripcionCompleta?: string;
  contacto?: { nombre?: string; cargo?: string; fotoUrl?: string; whatsapp?: string; correo?: string; linkedin?: string };
  redes?: { instagram?: string; facebook?: string; twitter?: string; youtube?: string };
  visitas?: number; descargas?: number; calificacion?: number;
  // legacy fields
  nombre?: string; descripcion?: string; telefono?: string;
  createdAt?: unknown; updatedAt?: unknown;
  // legacy step-based fields
  step1?: CompanyStep1; step2?: CompanyStep2; step3?: CompanyStep3;
}
export async function getCompany(uid: string): Promise<CompanyRecord|null> {
  const s = await getDoc(doc(db,'companies',uid));
  return s.exists() ? { uid: s.id, ...s.data() } as CompanyRecord : null;
}
export async function saveCompanyStep(uid: string, step: 'step1'|'step2'|'step3', data: CompanyStep1|CompanyStep2|CompanyStep3) {
  await setDoc(doc(db,'companies',uid), { [step]: data, ownerId: uid, updatedAt: serverTimestamp() }, { merge: true });
}
export async function activateCompany(uid: string, activa = true) {
  await setDoc(doc(db,'companies',uid), { activa, status: activa ? 'active' : 'draft', updatedAt: serverTimestamp() }, { merge: true });
}
export async function updateCompanyStatus(uid: string, status: 'draft'|'active') {
  await updateDoc(doc(db,'companies',uid), { status, updatedAt: serverTimestamp() });
}
export async function getAllCompanies(): Promise<CompanyRecord[]> {
  const s = await getDocs(collection(db,'companies'));
  return s.docs.map(d => ({ uid: d.id, ...d.data() }) as CompanyRecord);
}
export async function getActiveCompanies(): Promise<CompanyRecord[]> {
  const s = await getDocs(collection(db,'companies'));
  return s.docs.map(d => ({ uid: d.id, ...d.data() }) as CompanyRecord)
    .filter(c => c.activa === true || c.status === 'active');
}
export async function incrementarVisitas(uid: string) {
  try {
    const { increment } = await import('firebase/firestore');
    await updateDoc(doc(db,'companies',uid), { visitas: increment(1) });
  } catch { /* silent */ }
}

/* ── Pagos ───────────────────────────────────────────────────────────────── */
export interface PagoRecord {
  id?: string; uid: string; plan: string; monto?: number;
  estado: 'pendiente'|'aprobado'|'rechazado';
  comprobante?: string; companyName?: string; createdAt?: unknown; updatedAt?: unknown;
}
export async function savePago(data: Omit<PagoRecord,'id'>): Promise<string> {
  const r = doc(collection(db,'pagos'));
  await setDoc(r, { ...data, createdAt: serverTimestamp() });
  return r.id;
}
export async function getUserPagos(uid: string): Promise<(PagoRecord&{id:string})[]> {
  const s = await getDocs(query(collection(db,'pagos'), where('uid','==',uid), orderBy('createdAt','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as PagoRecord&{id:string});
}
export async function getAllPagos(): Promise<(PagoRecord&{id:string})[]> {
  const s = await getDocs(query(collection(db,'pagos'), orderBy('createdAt','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as PagoRecord&{id:string});
}
export async function updatePagoEstado(pagoId: string, estado: 'aprobado'|'rechazado') {
  await updateDoc(doc(db,'pagos',pagoId), { estado, updatedAt: serverTimestamp() });
}

/* ── Plan ────────────────────────────────────────────────────────────────── */
export type PlanTipo = 'basico'|'pro'|'premium';
export const PLAN_LIMITS: Record<PlanTipo,number> = { basico:3, pro:10, premium:50 };
export async function getUserPlan(uid: string): Promise<PlanTipo> {
  const s = await getDocs(query(collection(db,'pagos'), where('uid','==',uid), where('estado','==','aprobado')));
  if (s.empty) return 'basico';
  const orden: Record<string,number> = { basico:0, pro:1, premium:2 };
  let mejor: PlanTipo = 'basico';
  s.docs.forEach(d => { const p = d.data().plan as PlanTipo; if ((orden[p]??0)>(orden[mejor]??0)) mejor=p; });
  return mejor;
}

/* ── Catálogos PDF ───────────────────────────────────────────────────────── */
export interface CatalogoRecord {
  id: string; uid: string; title: string; language: string;
  fileUrl: string; fileName: string; fileSize: number;
  visible: boolean; downloads: number; orden?: number; createdAt: unknown; updatedAt: unknown;
}
export async function getCatalogos(uid: string): Promise<CatalogoRecord[]> {
  const s = await getDocs(query(collection(db,'catalogos'), where('uid','==',uid), orderBy('createdAt','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as CatalogoRecord);
}
export async function saveCatalogo(data: Omit<CatalogoRecord,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'catalogos'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}
export async function updateCatalogo(catId: string, data: Partial<Omit<CatalogoRecord,'id'|'uid'|'createdAt'>>) {
  await updateDoc(doc(db,'catalogos',catId), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteCatalogo(catId: string) { await deleteDoc(doc(db,'catalogos',catId)); }
export async function incrementarDescargas(catId: string, actual: number) {
  await updateDoc(doc(db,'catalogos',catId), { downloads: actual+1 });
}

/* ── Representantes ──────────────────────────────────────────────────────── */
export const REP_LIMITS: Record<PlanTipo,number> = { basico:1, pro:3, premium:10 };
export interface RepresentanteRecord {
  id: string; uid: string; nombre: string; cargo: string;
  tipo: 'principal'|'comercial'|'tecnico'|'otro';
  whatsapp?: string; email?: string; linkedin?: string; fotoUrl?: string;
  visible: boolean; orden: number; createdAt: unknown; updatedAt: unknown;
}
export async function getRepresentantes(uid: string): Promise<RepresentanteRecord[]> {
  const s = await getDocs(query(collection(db,'representantes'), where('uid','==',uid), orderBy('orden','asc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as RepresentanteRecord);
}
export async function saveRepresentante(data: Omit<RepresentanteRecord,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'representantes'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}
export async function updateRepresentante(repId: string, data: Partial<Omit<RepresentanteRecord,'id'|'uid'|'createdAt'>>) {
  await updateDoc(doc(db,'representantes',repId), { ...data, updatedAt: serverTimestamp() });
}
export async function updateRepresentanteVisibilidad(repId: string, visible: boolean) {
  await updateDoc(doc(db,'representantes',repId), { visible, updatedAt: serverTimestamp() });
}
export async function deleteRepresentante(repId: string) { await deleteDoc(doc(db,'representantes',repId)); }

/* ── Galería ─────────────────────────────────────────────────────────────── */
export const GALERIA_LIMITS: Record<PlanTipo,{fotos:number;videos:number}> = {
  basico:{fotos:10,videos:0}, pro:{fotos:30,videos:5}, premium:{fotos:100,videos:20},
};
export interface GaleriaFotoRecord {
  id: string; uid: string; url: string; fileName: string; fileSize: number;
  titulo?: string; esPrincipal: boolean; album?: string; createdAt: unknown;
}
export interface GaleriaVideoRecord {
  id: string; uid: string; videoUrl: string; titulo: string;
  plataforma: 'youtube'|'vimeo'; videoId: string; thumbnailUrl: string;
  estado: 'live'|'borrador'; createdAt: unknown; updatedAt: unknown;
}
export async function getGaleriaFotos(uid: string): Promise<GaleriaFotoRecord[]> {
  const s = await getDocs(query(collection(db,'galeriaFotos'), where('uid','==',uid), orderBy('createdAt','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as GaleriaFotoRecord);
}
export async function saveGaleriaFoto(data: Omit<GaleriaFotoRecord,'id'|'createdAt'>): Promise<string> {
  const r = doc(collection(db,'galeriaFotos'));
  await setDoc(r, { ...data, createdAt: serverTimestamp() });
  return r.id;
}
export async function setFotoPrincipal(uid: string, fotoId: string) {
  const s = await getDocs(query(collection(db,'galeriaFotos'), where('uid','==',uid), where('esPrincipal','==',true)));
  await Promise.all([...s.docs.map(d => updateDoc(d.ref,{esPrincipal:false})), updateDoc(doc(db,'galeriaFotos',fotoId),{esPrincipal:true})]);
}
export async function deleteGaleriaFoto(fotoId: string) { await deleteDoc(doc(db,'galeriaFotos',fotoId)); }
export async function getGaleriaVideos(uid: string): Promise<GaleriaVideoRecord[]> {
  const s = await getDocs(query(collection(db,'galeriaVideos'), where('uid','==',uid), orderBy('createdAt','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as GaleriaVideoRecord);
}
export async function saveGaleriaVideo(data: Omit<GaleriaVideoRecord,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'galeriaVideos'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}
export async function updateVideoEstado(videoId: string, estado: 'live'|'borrador') {
  await updateDoc(doc(db,'galeriaVideos',videoId), { estado, updatedAt: serverTimestamp() });
}
export async function deleteGaleriaVideo(videoId: string) { await deleteDoc(doc(db,'galeriaVideos',videoId)); }

/* ── Categorías AgTech ───────────────────────────────────────────────────── */
export interface CategoriaRecord {
  id: string; nombre: string; slug: string; descripcion: string;
  icono: string; color: string; activa: boolean; archivada: boolean;
  orden: number; createdAt: unknown; updatedAt: unknown;
}
export async function getCategorias(): Promise<CategoriaRecord[]> {
  const s = await getDocs(query(collection(db,'categoriasAgtech'), orderBy('orden','asc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as CategoriaRecord);
}
export async function getCategoriasActivas(): Promise<CategoriaRecord[]> {
  const s = await getDocs(query(collection(db,'categoriasAgtech'), orderBy('orden','asc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as CategoriaRecord)
    .filter(c => c.activa && !c.archivada);
}
export async function saveCategoria(data: Omit<CategoriaRecord,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'categoriasAgtech'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}
export async function updateCategoria(catId: string, data: Partial<Omit<CategoriaRecord,'id'|'createdAt'>>) {
  await updateDoc(doc(db,'categoriasAgtech',catId), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteCategoria(catId: string) {
  await deleteDoc(doc(db,'categoriasAgtech',catId));
}
export async function getConteoPorCategoria(): Promise<Record<string,number>> {
  const s = await getDocs(query(collection(db,'companies'), where('status','==','active')));
  const conteo: Record<string,number> = {};
  s.docs.forEach(d => { (d.data().step1?.categorias??[]).forEach((c:string) => { conteo[c]=(conteo[c]??0)+1; }); });
  return conteo;
}
export const CATEGORIAS_SEED: Omit<CategoriaRecord,'id'|'createdAt'|'updatedAt'>[] = [
  { nombre:"Agricultura de Precisión",         slug:"agricultura-precision",  descripcion:"Imágenes satelitales, drones, sensores IoT y análisis de datos para gestión localizada de cultivos.", icono:"🌾", color:"#22c55e", activa:true, archivada:false, orden:0 },
  { nombre:"Biotecnología Agrícola",           slug:"biotecnologia-agricola", descripcion:"Mejoramiento genético, control biológico de plagas e inoculantes para climas tropicales.", icono:"🧬", color:"#ec4899", activa:true, archivada:false, orden:1 },
  { nombre:"Logística & Cadena de Suministro", slug:"logistica",              descripcion:"Entrega de última milla en zonas rurales, cadenas de frío y conectividad de marketplace.", icono:"🚛", color:"#14b8a6", activa:true, archivada:false, orden:2 },
  { nombre:"Agri-Finanzas",                   slug:"agri-finanzas",          descripcion:"Modelos de crédito para agricultores, seguros de cosecha y finanzas descentralizadas.", icono:"🏦", color:"#3b82f6", activa:true, archivada:false, orden:3 },
  { nombre:"Ambiente Controlado",             slug:"ambiente-controlado",    descripcion:"Agricultura vertical, hidroponía y automatización de invernaderos para producción urbana.", icono:"🏗️", color:"#8b5cf6", activa:true, archivada:false, orden:4 },
  { nombre:"Software de Gestión",             slug:"software-gestion",       descripcion:"Sistemas ERP para ganadería, caficultura, fruticultura y palma.", icono:"💼", color:"#6b7280", activa:true, archivada:false, orden:5 },
  { nombre:"Trazabilidad Alimentaria",        slug:"trazabilidad",           descripcion:"Blockchain, QR y sensores para rastrear productos del campo al consumidor.", icono:"📦", color:"#f59e0b", activa:true, archivada:false, orden:6 },
  { nombre:"Gestión del Agua",               slug:"gestion-agua",           descripcion:"Riego inteligente, monitoreo de cuencas y tecnologías de captura de lluvia.", icono:"💧", color:"#0ea5e9", activa:true, archivada:false, orden:7 },
  { nombre:"Post-Cosecha Tech",              slug:"post-cosecha",           descripcion:"Almacenamiento, procesamiento mínimo y vida útil extendida para reducir pérdidas.", icono:"🌡️", color:"#ef4444", activa:true, archivada:false, orden:8 },
];

export async function seedCategorias(): Promise<void> {
  const existing = await getDocs(collection(db,'categoriasAgtech'));
  if (existing.size > 0) return; // ya sembradas
  await Promise.all(CATEGORIAS_SEED.map(c => saveCategoria(c)));
}

/* ── Noticias & Eventos ──────────────────────────────────────────────────── */
export interface NoticiaRecord {
  id: string; titulo: string; tipo: 'noticia'|'evento'; fecha: unknown;
  estado: 'publicado'|'borrador'; autor: string; categoria: string;
  subCategoria?: string; imagenUrl?: string; contenido?: string;
  vistas: number; createdAt: unknown; updatedAt: unknown;
}
export async function getNoticias(): Promise<NoticiaRecord[]> {
  const s = await getDocs(query(collection(db,'noticias'), orderBy('fecha','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as NoticiaRecord);
}
export async function getNoticiasPublicadas(): Promise<NoticiaRecord[]> {
  const s = await getDocs(query(collection(db,'noticias'), where('estado','==','publicado'), orderBy('fecha','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as NoticiaRecord);
}
export async function saveNoticia(data: Omit<NoticiaRecord,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'noticias'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}
export async function updateNoticia(noticiaId: string, data: Partial<Omit<NoticiaRecord,'id'|'createdAt'>>) {
  await updateDoc(doc(db,'noticias',noticiaId), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteNoticia(noticiaId: string) { await deleteDoc(doc(db,'noticias',noticiaId)); }

/* ── Productos & Servicios ───────────────────────────────────────────────── */
export type ProductoTipo   = "hardware"|"software"|"servicio"|"otro";
export type ProductoEstado = "activo"|"oculto"|"borrador";

export interface ProductoRecord {
  id?:          string;
  uid:          string;
  nombre:       string;
  descripcion:  string;
  precio:       number;
  moneda:       "COP"|"USD";
  tipo:         ProductoTipo;
  estado:       ProductoEstado;
  destacado:    boolean;
  imagenUrl?:   string;
  cultivos?:    string[];
  createdAt?:   unknown;
  updatedAt?:   unknown;
}

export const PRODUCTO_LIMITS: Record<string, number> = {
  gratuito:    3,
  basico:      10,
  profesional: 20,
  empresa:     999,
};

export async function getProductos(uid: string): Promise<ProductoRecord[]> {
  const s = await getDocs(query(collection(db,'productos'), where('uid','==',uid), orderBy('createdAt','desc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as ProductoRecord);
}

export async function getProductosActivos(uid: string): Promise<ProductoRecord[]> {
  const s = await getDocs(query(collection(db,'productos'), where('uid','==',uid), where('estado','==','activo')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as ProductoRecord);
}

export async function getAllProductosDestacados(): Promise<ProductoRecord[]> {
  const s = await getDocs(query(collection(db,'productos'), where('destacado','==',true), where('estado','==','activo')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as ProductoRecord);
}

export async function saveProducto(data: Omit<ProductoRecord,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'productos'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}

export async function updateProducto(id: string, data: Partial<Omit<ProductoRecord,'id'|'createdAt'>>) {
  await updateDoc(doc(db,'productos',id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProducto(id: string) { await deleteDoc(doc(db,'productos',id)); }

/* ── Foro ────────────────────────────────────────────────────────────────── */
export type ForoCategoria = 'tecnologia'|'cultivos'|'maquinaria'|'mercados'|'financiamiento'|'general';

export interface ForoPost {
  id?:               string;
  uid:               string;
  autorNombre:       string;
  autorFotoUrl?:     string;
  titulo:            string;
  cuerpo:            string;
  imagenUrl?:        string;
  categoria:         ForoCategoria;
  likes:             number;
  likedBy?:          string[];
  comentariosCount:  number;
  calificacion:      number;
  estado:            'publicado'|'borrador';
  destacado?:        boolean;
  createdAt?:        unknown;
  updatedAt?:        unknown;
}

export interface ForoComentario {
  id?:           string;
  postId:        string;
  uid:           string;
  autorNombre:   string;
  autorFotoUrl?: string;
  texto:         string;
  likes:         number;
  likedBy?:      string[];
  createdAt?:    unknown;
}

export async function getForoPosts(categoria?: ForoCategoria): Promise<ForoPost[]> {
  const base = collection(db, 'foro');
  const q = categoria
    ? query(base, where('estado','==','publicado'), where('categoria','==',categoria), orderBy('createdAt','desc'))
    : query(base, where('estado','==','publicado'), orderBy('createdAt','desc'));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as ForoPost);
}

export async function getForoPost(id: string): Promise<ForoPost|null> {
  const s = await getDoc(doc(db,'foro',id));
  return s.exists() ? { id: s.id, ...s.data() } as ForoPost : null;
}

export async function saveForoPost(data: Omit<ForoPost,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const r = doc(collection(db,'foro'));
  await setDoc(r, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
}

export async function updateForoPost(id: string, data: Partial<Omit<ForoPost,'id'|'createdAt'>>) {
  await updateDoc(doc(db,'foro',id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteForoPost(id: string) { await deleteDoc(doc(db,'foro',id)); }

export async function toggleLikePost(postId: string, uid: string, liked: boolean) {
  const { arrayUnion, arrayRemove, increment } = await import('firebase/firestore');
  await updateDoc(doc(db,'foro',postId), {
    likedBy: liked ? arrayUnion(uid) : arrayRemove(uid),
    likes:   increment(liked ? 1 : -1),
  });
}

export async function getForoComentarios(postId: string): Promise<ForoComentario[]> {
  const s = await getDocs(query(collection(db,'foroComentarios'), where('postId','==',postId), orderBy('createdAt','asc')));
  return s.docs.map(d => ({ id: d.id, ...d.data() }) as ForoComentario);
}

export async function saveForoComentario(data: Omit<ForoComentario,'id'|'createdAt'>): Promise<string> {
  const { increment } = await import('firebase/firestore');
  const r = doc(collection(db,'foroComentarios'));
  await setDoc(r, { ...data, createdAt: serverTimestamp() });
  await updateDoc(doc(db,'foro',data.postId), { comentariosCount: increment(1) });
  return r.id;
}

export async function deleteForoComentario(id: string, postId: string) {
  const { increment } = await import('firebase/firestore');
  await deleteDoc(doc(db,'foroComentarios',id));
  await updateDoc(doc(db,'foro',postId), { comentariosCount: increment(-1) });
}
