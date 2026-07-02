import Link from "next/link";

/* ── Datos del responsable ───────────────────────────────────────────────── */
const RESP = {
  empresa:   "TalentoYa S.A.S.",
  nit:       "901.234.567-8",
  direccion: "Carrera 7 No. 71-21, Oficina 801, Bogotá D.C.",
  email:     "datos@TalentoYa.co",
  soporte:   "soporte@TalentoYa.co",
  telefono:  "+57 (601) 123-4567",
  vigencia:  "26 de mayo de 2026",
};

/* ── Secciones del índice ────────────────────────────────────────────────── */
const TOC = [
  { id: "responsable",      label: "1. Responsable del Tratamiento" },
  { id: "marco-legal",      label: "2. Marco Legal" },
  { id: "definiciones",     label: "3. Definiciones" },
  { id: "datos-recolectados", label: "4. Datos Recolectados" },
  { id: "finalidades",      label: "5. Finalidades del Tratamiento" },
  { id: "conservacion",     label: "6. Conservación y Supresión" },
  { id: "derechos",         label: "7. Derechos del Titular" },
  { id: "procedimiento",    label: "8. Procedimiento de Solicitudes" },
  { id: "seguridad",        label: "9. Seguridad de la Información" },
  { id: "transferencias",   label: "10. Transferencias Internacionales" },
  { id: "sensibles",        label: "11. Datos Sensibles" },
  { id: "menores",          label: "12. Datos de Menores" },
  { id: "cookies",          label: "13. Cookies y Rastreo" },
  { id: "modificaciones",   label: "14. Modificaciones" },
  { id: "vigencia",         label: "15. Vigencia y Contacto" },
];

/* ── Componentes de maquetado ────────────────────────────────────────────── */
function Section({ id, num, title, children }: { id: string; num: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-2xl">
      <div className="flex items-start gap-md mb-lg">
        <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary-container text-primary text-label-md font-bold flex items-center justify-center">
          {num}
        </span>
        <h2 className="text-headline-md text-primary leading-tight">{title}</h2>
      </div>
      <div className="pl-[3.25rem] space-y-md text-body-md text-on-surface-variant leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function InfoBox({ icon, title, children, variant = "blue" }: {
  icon: string; title: string; children: React.ReactNode; variant?: "blue" | "green" | "orange" | "red";
}) {
  const colors = {
    blue:   "bg-primary-container/40 border-primary/20 text-primary",
    green:  "bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#2e7d32]",
    orange: "bg-energy-orange/10 border-energy-orange/30 text-energy-orange",
    red:    "bg-error-container border-error/20 text-error",
  }[variant];
  return (
    <div className={`rounded-xl border p-lg ${colors} mt-md`}>
      <div className="flex items-center gap-sm mb-sm">
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <span className="text-label-md font-bold">{title}</span>
      </div>
      <div className="text-body-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mt-md">
      <table className="w-full text-body-sm border border-outline-variant rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-surface-container-high">
            {headers.map(h => (
              <th key={h} className="text-left px-md py-sm text-label-sm text-on-surface uppercase tracking-wider border-b border-outline-variant">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-surface-container-low transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`px-md py-sm align-top ${j === 0 ? "font-semibold text-on-surface" : "text-on-surface-variant"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter py-xl">
          <Link href="/" className="inline-flex items-center gap-sm text-white/70 hover:text-white text-label-sm mb-lg transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver al inicio
          </Link>
          <div className="flex items-start gap-lg flex-wrap">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>privacy_tip</span>
            </div>
            <div>
              <h1 className="text-headline-lg font-bold mb-xs">Política de Privacidad y Tratamiento de Datos</h1>
              <p className="text-white/80 text-body-md">
                {RESP.empresa} · NIT {RESP.nit}
              </p>
              <div className="flex flex-wrap gap-md mt-md">
                <span className="bg-white/10 text-white text-label-sm px-md py-xs rounded-full">
                  Ley 1581 de 2012
                </span>
                <span className="bg-white/10 text-white text-label-sm px-md py-xs rounded-full">
                  Decreto 1377 de 2013
                </span>
                <span className="bg-white/10 text-white text-label-sm px-md py-xs rounded-full">
                  Actualizado: {RESP.vigencia}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter py-xl">
        <div className="flex gap-gutter items-start">

          {/* ── Índice lateral (desktop) ──────────────────────────────── */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0 sticky top-6">
            <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-lg">
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-md font-bold">Contenido</p>
              <nav className="space-y-xs">
                {TOC.map(({ id, label }) => (
                  <a key={id} href={`#${id}`}
                    className="block text-body-sm text-on-surface-variant hover:text-primary hover:bg-primary-fixed px-sm py-xs rounded-lg transition-all leading-snug">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Contenido principal ───────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Aviso destacado */}
            <div className="bg-primary-container rounded-2xl p-lg mb-2xl border border-primary/10">
              <div className="flex gap-md items-start">
                <span className="material-symbols-outlined text-primary text-[24px] flex-shrink-0 mt-xs" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <div>
                  <p className="text-label-md text-primary font-bold mb-xs">Aviso de Privacidad</p>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Al registrarse y usar <strong className="text-on-surface">TalentoYa</strong>, usted autoriza el tratamiento de sus datos personales conforme a esta política, en cumplimiento de la <strong className="text-on-surface">Ley 1581 de 2012</strong> (Habeas Data) y el <strong className="text-on-surface">Decreto 1377 de 2013</strong>. Puede revocar esta autorización en cualquier momento.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 1. Responsable ────────────────────────────────────── */}
            <Section id="responsable" num={1} title="Responsable del Tratamiento de Datos Personales">
              <p>
                De conformidad con el artículo 17 de la Ley 1581 de 2012, el Responsable del Tratamiento es:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-md not-prose">
                {[
                  { icon: "business",       label: "Empresa",    val: RESP.empresa },
                  { icon: "badge",          label: "NIT",        val: RESP.nit },
                  { icon: "location_on",    label: "Dirección",  val: RESP.direccion },
                  { icon: "mail",           label: "Datos",      val: RESP.email },
                  { icon: "support_agent",  label: "Soporte",    val: RESP.soporte },
                  { icon: "phone",          label: "Teléfono",   val: RESP.telefono },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-start gap-sm bg-white border border-outline-variant rounded-xl p-md">
                    <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-[2px]">{icon}</span>
                    <div>
                      <p className="text-label-sm text-on-surface-variant">{label}</p>
                      <p className="text-label-md text-on-surface">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 2. Marco Legal ────────────────────────────────────── */}
            <Section id="marco-legal" num={2} title="Marco Legal Aplicable">
              <p>
                Esta política se fundamenta en las siguientes normas colombianas:
              </p>
              <ul className="list-disc list-inside space-y-xs text-body-sm">
                <li><strong className="text-on-surface">Constitución Política de Colombia, Art. 15</strong> — Derecho a la intimidad y al habeas data.</li>
                <li><strong className="text-on-surface">Ley 1266 de 2008</strong> — Habeas data financiero, crediticio y comercial.</li>
                <li><strong className="text-on-surface">Ley 1581 de 2012</strong> — Régimen General de Protección de Datos Personales.</li>
                <li><strong className="text-on-surface">Decreto 1377 de 2013</strong> — Reglamentación parcial de la Ley 1581 de 2012.</li>
                <li><strong className="text-on-surface">Decreto 1074 de 2015</strong> — Decreto Único Reglamentario del Sector Comercio.</li>
                <li><strong className="text-on-surface">Código de Comercio, Art. 60</strong> — Deber de conservar libros y papeles del comerciante (10 años).</li>
                <li><strong className="text-on-surface">Estatuto Tributario, Art. 632</strong> — Conservación de documentos (5 años).</li>
                <li><strong className="text-on-surface">Resolución 001 de 2021 (SIC)</strong> — Instrucciones sobre medidas de seguridad.</li>
              </ul>
            </Section>

            {/* ── 3. Definiciones ───────────────────────────────────── */}
            <Section id="definiciones" num={3} title="Definiciones">
              <Table
                headers={["Término", "Definición (Ley 1581 de 2012)"]}
                rows={[
                  ["Dato Personal", "Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables."],
                  ["Dato Sensible", "Datos que afectan la intimidad del titular o cuyo uso indebido puede generar discriminación: origen racial, salud, vida sexual, datos biométricos, etc."],
                  ["Titular", "Persona natural cuyos datos personales son objeto de tratamiento."],
                  ["Responsable", "Persona jurídica que decide sobre la base de datos y/o el tratamiento de los datos (TalentoYa S.A.S.)."],
                  ["Encargado", "Persona natural o jurídica que realiza el tratamiento por cuenta del responsable."],
                  ["Tratamiento", "Cualquier operación sobre datos personales: recolección, almacenamiento, uso, circulación, supresión."],
                  ["Autorización", "Consentimiento previo, expreso e informado del titular para el tratamiento."],
                  ["Habeas Data", "Derecho del titular a conocer, actualizar y rectificar sus datos personales."],
                  ["Supresión", "Eliminación total o parcial de datos personales de las bases de datos."],
                ]}
              />
            </Section>

            {/* ── 4. Datos Recolectados ─────────────────────────────── */}
            <Section id="datos-recolectados" num={4} title="Datos Personales Recolectados">
              <p>Según el tipo de usuario, recolectamos las siguientes categorías de datos:</p>

              <div className="space-y-md mt-md not-prose">
                <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden">
                  <div className="bg-primary-fixed px-lg py-md">
                    <p className="text-label-md text-primary font-bold flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                      Candidatos
                    </p>
                  </div>
                  <div className="p-lg">
                    <Table
                      headers={["Categoría", "Datos específicos", "Obligatorio"]}
                      rows={[
                        ["Identificación", "Nombre completo, número de cédula (opcional), foto de perfil", "Sí"],
                        ["Contacto", "Correo electrónico, teléfono celular, ciudad de residencia", "Sí"],
                        ["Perfil profesional", "Hoja de vida, experiencia laboral, formación académica, habilidades, idiomas", "Sí"],
                        ["Preferencias laborales", "Sector, cargo, rango salarial, modalidad (remoto/presencial/híbrido)", "No"],
                        ["Datos de acceso", "Contraseña cifrada, fecha de último acceso, dirección IP", "Sí"],
                        ["Interacciones", "Postulaciones, mensajes enviados, vacantes vistas, resultados de matching IA", "Automático"],
                      ]}
                    />
                  </div>
                </div>

                <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden">
                  <div className="bg-secondary-container/40 px-lg py-md">
                    <p className="text-label-md text-secondary font-bold flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>business</span>
                      Empresas (PYMES)
                    </p>
                  </div>
                  <div className="p-lg">
                    <Table
                      headers={["Categoría", "Datos específicos", "Obligatorio"]}
                      rows={[
                        ["Identificación empresa", "Razón social, NIT, cámara de comercio, sector económico", "Sí"],
                        ["Representante / admin", "Nombre, cargo, correo corporativo, teléfono", "Sí"],
                        ["Facturación", "Datos de tarjeta de crédito/débito (tokenizados), dirección de facturación", "Sí"],
                        ["Vacantes publicadas", "Descripción del cargo, requisitos, salario, ubicación, fecha", "Sí"],
                        ["Interacciones", "Candidatos contactados, entrevistas agendadas, mensajes enviados", "Automático"],
                      ]}
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* ── 5. Finalidades ────────────────────────────────────── */}
            <Section id="finalidades" num={5} title="Finalidades del Tratamiento">
              <p>
                Los datos personales serán tratados única y exclusivamente para las siguientes finalidades, conforme al artículo 13 de la Ley 1581 de 2012:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-md not-prose">
                {[
                  { icon: "work",           title: "Intermediación Laboral",    desc: "Facilitar la conexión entre candidatos y empresas mediante el algoritmo de matching con IA." },
                  { icon: "notifications",  title: "Comunicaciones",            desc: "Enviar notificaciones sobre vacantes, postulaciones, mensajes y actualizaciones de la plataforma." },
                  { icon: "insights",       title: "Mejora del Servicio",       desc: "Analizar patrones de uso para optimizar la plataforma y el motor de recomendaciones." },
                  { icon: "receipt_long",   title: "Facturación y Pagos",       desc: "Procesar pagos de suscripción y emitir facturas electrónicas conforme a la normativa tributaria." },
                  { icon: "security",       title: "Seguridad y Prevención",    desc: "Detectar fraudes, accesos no autorizados y cumplir con obligaciones de seguridad digital." },
                  { icon: "gavel",          title: "Obligaciones Legales",      desc: "Dar cumplimiento a requerimientos de autoridades judiciales, administrativas o de control." },
                  { icon: "support_agent",  title: "Soporte al Usuario",        desc: "Atender solicitudes, quejas, reclamos y sugerencias (PQRS) de los usuarios." },
                  { icon: "campaign",       title: "Mercadeo (con consentimiento)", desc: "Enviar comunicaciones comerciales sobre nuevas funcionalidades o planes de suscripción." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-sm bg-white border border-outline-variant rounded-xl p-md hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-[2px]">{icon}</span>
                    <div>
                      <p className="text-label-md text-on-surface font-semibold">{title}</p>
                      <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 6. Conservación ───────────────────────────────────── */}
            <Section id="conservacion" num={6} title="Conservación y Supresión de Datos">
              <p>
                En cumplimiento del artículo 12 de la Ley 1581 de 2012, los datos personales serán conservados únicamente
                durante el tiempo necesario para cumplir la finalidad que justificó su recolección, o durante el tiempo
                que establezcan las obligaciones legales y contractuales vigentes.
              </p>

              <InfoBox icon="schedule" title="Principio de Conservación" variant="blue">
                Los datos no podrán ser conservados indefinidamente. Una vez cumplida la finalidad del tratamiento
                y vencidos los plazos legales de conservación, procederá la supresión definitiva de los datos del
                sistema, salvo que exista obligación legal expresa que lo impida.
              </InfoBox>

              <p className="mt-md font-semibold text-on-surface">Plazos de conservación por tipo de dato:</p>

              <Table
                headers={["Tipo de Dato", "Plazo de Conservación", "Fundamento Legal"]}
                rows={[
                  ["Perfil activo (candidato/empresa)", "Mientras la cuenta esté activa", "Finalidad del tratamiento"],
                  ["Datos tras eliminación de cuenta", "2 años desde la solicitud de supresión", "Art. 12, Ley 1581 de 2012"],
                  ["Historial de postulaciones y matching", "3 años desde la última postulación", "Finalidad estadística y de auditoría"],
                  ["Mensajes y comunicaciones en plataforma", "2 años desde el último mensaje", "Finalidad contractual"],
                  ["Datos de facturación y transacciones", "10 años desde la factura", "Art. 60, Código de Comercio"],
                  ["Documentos soporte tributarios", "5 años desde el período fiscal", "Art. 632, Estatuto Tributario"],
                  ["Registros de acceso y logs de seguridad", "1 año desde el registro", "Resolución SIC 001 de 2021"],
                  ["Datos de candidatos no seleccionados (proceso activo)", "1 año desde el cierre de la vacante", "Finalidad del tratamiento"],
                  ["Datos para procesos judiciales o administrativos", "Hasta resolución definitiva del proceso + 5 años", "Código de Procedimiento Civil"],
                  ["Autorizaciones de tratamiento (consentimiento)", "Vigencia del contrato + 20 años", "Art. 9, Ley 1581 de 2012"],
                ]}
              />

              <InfoBox icon="delete_forever" title="Procedimiento de Supresión" variant="orange">
                Cumplidos los plazos indicados, TalentoYa procederá a la <strong>anonimización irreversible</strong> o
                <strong> eliminación definitiva</strong> de los datos personales de todas las bases de datos activas,
                de respaldo y de archivo. El proceso de supresión se realizará dentro de los <strong>15 días hábiles</strong>
                siguientes al vencimiento del plazo aplicable.
              </InfoBox>

              <InfoBox icon="lock" title="Excepciones a la Supresión" variant="red">
                No procederá la supresión cuando los datos sean necesarios para: (i) cumplir una obligación legal o
                contractual del titular; (ii) respetar el término mínimo de conservación impuesto por la ley;
                (iii) atender un proceso judicial, administrativo o arbitral en curso; o (iv) preservar la integridad
                de información de interés histórico, estadístico o científico debidamente justificado.
              </InfoBox>
            </Section>

            {/* ── 7. Derechos ───────────────────────────────────────── */}
            <Section id="derechos" num={7} title="Derechos del Titular">
              <p>
                Conforme al artículo 8 de la Ley 1581 de 2012, el titular de los datos tiene los siguientes derechos,
                que podrá ejercer de forma gratuita:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-md not-prose">
                {[
                  { icon: "search",          color: "text-primary",        title: "Conocer",        desc: "Acceder gratuitamente a sus datos personales que sean objeto de tratamiento." },
                  { icon: "edit",            color: "text-secondary",      title: "Actualizar",     desc: "Actualizar sus datos cuando sean parciales, inexactos, incompletos, fraccionados o que induzcan a error." },
                  { icon: "verified_user",   color: "text-[#4CAF50]",      title: "Rectificar",     desc: "Corregir datos que resulten incorrectos o que no correspondan a la realidad." },
                  { icon: "delete",          color: "text-error",          title: "Suprimir",       desc: "Solicitar la eliminación de sus datos cuando no sean necesarios para la finalidad o cuando haya revocado la autorización." },
                  { icon: "block",           color: "text-energy-orange",  title: "Revocar",        desc: "Retirar en cualquier momento la autorización dada para el tratamiento, siempre que no exista impedimento legal." },
                  { icon: "gavel",           color: "text-primary",        title: "Reclamar",       desc: "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) cuando se vulneren sus derechos." },
                  { icon: "visibility_off",  color: "text-on-surface",     title: "No ser tratado como dato sensible", desc: "Negarse a ser objeto de decisiones automatizadas basadas exclusivamente en datos sensibles." },
                  { icon: "notifications_off", color: "text-secondary",   title: "Oponerse",       desc: "Oponerse al tratamiento de sus datos para fines de mercadeo o publicidad directa." },
                ].map(({ icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-sm bg-white border border-outline-variant rounded-xl p-md">
                    <span className={`material-symbols-outlined ${color} text-[22px] flex-shrink-0`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <div>
                      <p className="text-label-md text-on-surface font-bold">Derecho a {title}</p>
                      <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 8. Procedimiento ──────────────────────────────────── */}
            <Section id="procedimiento" num={8} title="Procedimiento para el Ejercicio de Derechos">
              <p>
                Para ejercer sus derechos de habeas data, el titular deberá enviar una solicitud escrita a través
                de los canales habilitados, siguiendo el procedimiento establecido en los artículos 14 y 22
                de la Ley 1581 de 2012:
              </p>

              <div className="space-y-sm mt-md not-prose">
                {[
                  { step: "01", title: "Envíe su solicitud", desc: `Remita un correo a ${RESP.email} con asunto "SOLICITUD HABEAS DATA", indicando: nombre completo, tipo y número de documento, datos de contacto, descripción detallada de la solicitud y documentos de soporte (si aplica).` },
                  { step: "02", title: "Verificación de identidad", desc: "TalentoYa verificará la identidad del solicitante dentro de los 2 días hábiles siguientes a la recepción. Si la solicitud es incompleta, se requerirá al titular para que subsane en un plazo de 5 días hábiles." },
                  { step: "03", title: "Atención de la solicitud", desc: "Las consultas serán atendidas en un plazo máximo de 10 días hábiles. Los reclamos de actualización, corrección o supresión serán atendidos en máximo 15 días hábiles, prorrogables 8 días hábiles adicionales con notificación previa." },
                  { step: "04", title: "Respuesta y seguimiento", desc: "Se enviará respuesta escrita al correo registrado. Si la solicitud es negada, se informará el motivo. El titular podrá escalar ante la Superintendencia de Industria y Comercio (SIC) si considera vulnerados sus derechos." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-md bg-white border border-outline-variant rounded-xl p-lg">
                    <span className="w-10 h-10 rounded-xl bg-primary-container text-primary text-label-md font-bold flex items-center justify-center flex-shrink-0">
                      {step}
                    </span>
                    <div>
                      <p className="text-label-md text-on-surface font-semibold mb-xs">{title}</p>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <InfoBox icon="contact_support" title="Canales de Atención Habilitados" variant="green">
                <ul className="space-y-xs mt-xs">
                  <li>📧 <strong>Correo electrónico:</strong> {RESP.email}</li>
                  <li>📞 <strong>Teléfono:</strong> {RESP.telefono} (lunes a viernes, 8:00 a.m. – 6:00 p.m.)</li>
                  <li>📍 <strong>Presencial:</strong> {RESP.direccion}</li>
                  <li>🌐 <strong>Formulario web:</strong> Sección "Mi Perfil &gt; Centro de Ayuda &gt; Exportar mis datos"</li>
                </ul>
              </InfoBox>
            </Section>

            {/* ── 9. Seguridad ──────────────────────────────────────── */}
            <Section id="seguridad" num={9} title="Seguridad de la Información">
              <p>
                En cumplimiento del principio de seguridad (Art. 4, literal g, Ley 1581 de 2012) y la Resolución 001
                de 2021 de la SIC, TalentoYa adopta las siguientes medidas técnicas, humanas y administrativas:
              </p>
              <Table
                headers={["Medida", "Descripción"]}
                rows={[
                  ["Cifrado en tránsito", "Todas las comunicaciones utilizan TLS 1.3 (HTTPS). Certificado SSL de grado bancario con validez extendida (EV)."],
                  ["Cifrado en reposo", "Los datos almacenados en base de datos están cifrados con AES-256. Las contraseñas se almacenan con bcrypt (salt rounds ≥ 12)."],
                  ["Autenticación multifactor (2FA)", "Disponible para todos los usuarios. Obligatorio para cuentas con acceso administrativo."],
                  ["Control de acceso", "Principio de mínimo privilegio. Acceso segmentado por roles con revisión semestral."],
                  ["Copias de seguridad", "Backups cifrados automáticos diarios con retención de 30 días y mensual de 12 meses."],
                  ["Monitoreo continuo", "Sistema de detección de intrusiones (IDS), alertas de acceso inusual y registros de auditoría inmutables."],
                  ["Gestión de vulnerabilidades", "Escaneos de seguridad mensuales y pruebas de penetración anuales por terceros certificados."],
                  ["Capacitación del personal", "Formación semestral obligatoria en protección de datos y ciberseguridad para todos los colaboradores con acceso a datos."],
                ]}
              />
              <p className="mt-md">
                En caso de incidente de seguridad que afecte datos personales, TalentoYa notificará a la
                <strong className="text-on-surface"> Superintendencia de Industria y Comercio (SIC)</strong> y a los
                titulares afectados dentro de los <strong className="text-on-surface">15 días hábiles</strong> siguientes
                a la detección, conforme al artículo 17, literal f de la Ley 1581 de 2012.
              </p>
            </Section>

            {/* ── 10. Transferencias ────────────────────────────────── */}
            <Section id="transferencias" num={10} title="Transferencia y Transmisión Internacional de Datos">
              <p>
                TalentoYa utiliza proveedores de servicios en la nube que pueden implicar el tratamiento de datos
                fuera del territorio colombiano. Conforme al artículo 26 de la Ley 1581 de 2012, se garantiza que
                dichos países o proveedores ofrecen niveles adecuados de protección:
              </p>
              <Table
                headers={["Proveedor", "País / Región", "Finalidad", "Garantía"]}
                rows={[
                  ["Google Firebase", "Estados Unidos / Global", "Base de datos, autenticación, almacenamiento, funciones serverless", "Cláusulas Contractuales Tipo (SCC) · GDPR Compliance"],
                  ["Google Cloud", "Estados Unidos / Latinoamérica", "Infraestructura de cómputo y hosting", "SCC · ISO 27001 · SOC 2 Type II"],
                  ["Stripe / Wompi", "Estados Unidos / Colombia", "Procesamiento de pagos (datos tokenizados, nunca datos crudos de tarjeta)", "PCI DSS Level 1 · Tokenización"],
                  ["SendGrid / Resend", "Estados Unidos", "Envío de correos transaccionales y notificaciones", "SCC · Datos mínimos necesarios"],
                ]}
              />
              <InfoBox icon="public" title="Garantías para Transferencias Internacionales" variant="blue">
                Para toda transferencia internacional, TalentoYa exige contractualmente a los encargados que:
                (i) implementen medidas de seguridad equivalentes; (ii) traten los datos solo para la finalidad
                autorizada; (iii) no realicen subtratamiento sin autorización; y (iv) notifiquen cualquier incidente
                de seguridad de forma inmediata.
              </InfoBox>
            </Section>

            {/* ── 11. Datos Sensibles ───────────────────────────────── */}
            <Section id="sensibles" num={11} title="Datos Sensibles">
              <p>
                Conforme al artículo 5 de la Ley 1581 de 2012, son datos sensibles aquellos que afectan la intimidad
                del titular. TalentoYa <strong className="text-on-surface">no solicita ni recopila datos sensibles</strong> de
                forma activa. Sin embargo, el titular podría incluirlos voluntariamente en su hoja de vida
                (ej.: condición de discapacidad, afiliación sindical).
              </p>
              <InfoBox icon="warning" title="Tratamiento de Datos Sensibles" variant="orange">
                Si un candidato incluye datos sensibles en su perfil, dicha información será tratada con las
                siguientes garantías adicionales: (i) acceso restringido solo al candidato y a las empresas
                a las que expresamente se postule; (ii) no será objeto de análisis estadístico ni entrenamiento
                del modelo IA; (iii) podrá ser eliminada en cualquier momento sin que esto afecte el servicio
                principal; (iv) nunca será vendida ni cedida a terceros.
              </InfoBox>
            </Section>

            {/* ── 12. Menores ───────────────────────────────────────── */}
            <Section id="menores" num={12} title="Tratamiento de Datos de Menores de Edad">
              <p>
                TalentoYa es una plataforma destinada exclusivamente a personas mayores de <strong className="text-on-surface">18 años</strong>.
                Conforme al artículo 7 de la Ley 1581 de 2012 y el artículo 2.2.2.25.2.1 del Decreto 1074 de 2015,
                el tratamiento de datos de menores de edad queda expresamente <strong className="text-on-surface">prohibido</strong>.
              </p>
              <InfoBox icon="child_care" title="Protección de Menores" variant="red">
                Si se detecta que un titular es menor de 18 años, sus datos serán eliminados de forma inmediata
                y la cuenta será suspendida. Los padres o tutores legales podrán solicitar la eliminación de
                datos de un menor escribiendo a {RESP.email}, adjuntando documento de identidad y registro
                civil o sentencia de guarda.
              </InfoBox>
            </Section>

            {/* ── 13. Cookies ───────────────────────────────────────── */}
            <Section id="cookies" num={13} title="Cookies y Tecnologías de Rastreo">
              <p>
                TalentoYa utiliza cookies y tecnologías similares para mejorar la experiencia del usuario.
              </p>
              <Table
                headers={["Tipo", "Finalidad", "Duración", "Requerida"]}
                rows={[
                  ["Sesión (auth)", "Mantener la sesión iniciada del usuario de forma segura", "Duración de la sesión", "Sí"],
                  ["Preferencias", "Recordar configuraciones de idioma, tema y filtros aplicados", "12 meses", "No"],
                  ["Analíticas (anonimizadas)", "Medir el rendimiento de la plataforma y mejorar la UX", "24 meses", "No"],
                  ["Seguridad (CSRF token)", "Prevenir ataques de falsificación de solicitudes entre sitios", "Duración de la sesión", "Sí"],
                ]}
              />
              <p className="mt-md">
                El usuario puede gestionar las cookies desde la configuración de su navegador o desde la sección
                <strong className="text-on-surface"> Configuración &gt; Preferencias</strong> de la plataforma.
                Deshabilitar cookies no esenciales no afectará las funciones principales del servicio.
              </p>
            </Section>

            {/* ── 14. Modificaciones ────────────────────────────────── */}
            <Section id="modificaciones" num={14} title="Modificaciones a Esta Política">
              <p>
                TalentoYa se reserva el derecho de modificar esta política en cualquier momento para adaptarla
                a cambios legislativos, tecnológicos o del negocio. Las modificaciones serán notificadas mediante:
              </p>
              <ul className="list-disc list-inside space-y-xs text-body-sm">
                <li>Correo electrónico al correo registrado en la plataforma, con al menos <strong className="text-on-surface">10 días hábiles</strong> de anticipación.</li>
                <li>Aviso destacado en la pantalla de inicio de sesión durante <strong className="text-on-surface">30 días calendario</strong>.</li>
                <li>Publicación en la página web <strong className="text-on-surface">www.TalentoYa.co/politica-privacidad</strong>.</li>
              </ul>
              <p className="mt-md">
                El uso continuado de la plataforma después de la entrada en vigor de los cambios constituye
                aceptación de la política modificada. Si no está de acuerdo con los cambios, el titular
                tiene derecho a solicitar la eliminación de su cuenta y datos.
              </p>
            </Section>

            {/* ── 15. Vigencia y Contacto ───────────────────────────── */}
            <Section id="vigencia" num={15} title="Vigencia y Contacto">
              <p>
                Esta política entra en vigor a partir del <strong className="text-on-surface">{RESP.vigencia}</strong> y
                deroga cualquier versión anterior. Estará vigente mientras {RESP.empresa} opere la plataforma TalentoYa
                o hasta que sea modificada o derogada conforme al procedimiento establecido en la sección 14.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-sm mt-lg not-prose">
                <a href={`mailto:${RESP.email}`}
                  className="flex flex-col items-center gap-sm bg-white border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-md transition-all text-center">
                  <span className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">mail</span>
                  </span>
                  <p className="text-label-md text-on-surface font-semibold">Correo de Datos</p>
                  <p className="text-body-sm text-primary">{RESP.email}</p>
                </a>
                <a href={`tel:${RESP.telefono.replace(/\s/g, "")}`}
                  className="flex flex-col items-center gap-sm bg-white border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-md transition-all text-center">
                  <span className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[24px]">phone</span>
                  </span>
                  <p className="text-label-md text-on-surface font-semibold">Línea de Atención</p>
                  <p className="text-body-sm text-primary">{RESP.telefono}</p>
                </a>
                <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-sm bg-white border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-md transition-all text-center">
                  <span className="w-12 h-12 bg-error-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[24px]">gavel</span>
                  </span>
                  <p className="text-label-md text-on-surface font-semibold">Ente de Control</p>
                  <p className="text-body-sm text-primary">SIC · www.sic.gov.co</p>
                </a>
              </div>
            </Section>

            {/* Footer de la política */}
            <div className="border-t border-outline-variant pt-xl mt-2xl">
              <div className="flex flex-wrap items-center justify-between gap-md">
                <div>
                  <p className="text-label-md text-on-surface font-bold">{RESP.empresa}</p>
                  <p className="text-body-sm text-on-surface-variant">NIT {RESP.nit} · {RESP.direccion}</p>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-outline text-[16px]">update</span>
                  <p className="text-label-sm text-on-surface-variant">Última actualización: {RESP.vigencia}</p>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
