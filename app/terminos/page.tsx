import Link from "next/link";

/* ── Metadata del documento ──────────────────────────────────────────────── */
const META = {
  empresa:   "TalentoYa S.A.S.",
  nit:       "901.234.567-8",
  direccion: "Carrera 7 No. 71-21, Oficina 801, Bogotá D.C.",
  email:     "legal@talentoya.co",
  soporte:   "soporte@talentoya.co",
  vigencia:  "28 de junio de 2026",
  version:   "1.2",
};

/* ── Índice ──────────────────────────────────────────────────────────────── */
const TOC = [
  { id: "objeto",         label: "1. Objeto y Ámbito" },
  { id: "definiciones",   label: "2. Definiciones" },
  { id: "registro",       label: "3. Registro y Cuenta" },
  { id: "planes",         label: "4. Planes y Pagos" },
  { id: "uso-aceptable",  label: "5. Uso Aceptable" },
  { id: "contenido",      label: "6. Contenido del Usuario" },
  { id: "ia",             label: "7. Motor de IA y Matches" },
  { id: "propiedad",      label: "8. Propiedad Intelectual" },
  { id: "privacidad",     label: "9. Privacidad y Datos" },
  { id: "responsabilidad",label: "10. Limitación de Responsabilidad" },
  { id: "suspension",     label: "11. Suspensión y Terminación" },
  { id: "disputas",       label: "12. Resolución de Disputas" },
  { id: "modificaciones", label: "13. Modificaciones" },
  { id: "ley",            label: "14. Ley Aplicable" },
  { id: "contacto",       label: "15. Contacto" },
];

/* ── Componentes ─────────────────────────────────────────────────────────── */
function Section({ id, num, title, children }: {
  id: string; num: number; title: string; children: React.ReactNode;
}) {
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
  icon: string; title: string; children: React.ReactNode;
  variant?: "blue" | "green" | "orange" | "red";
}) {
  const cls = {
    blue:   "bg-primary/5 border-primary/20 text-primary",
    green:  "bg-brand-green/10 border-brand-green/30 text-brand-green",
    orange: "bg-energy-orange/10 border-energy-orange/30 text-energy-orange",
    red:    "bg-error/10 border-error/20 text-error",
  }[variant];
  return (
    <div className={`rounded-xl border p-lg ${cls} mt-md`}>
      <div className="flex items-center gap-sm mb-sm">
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <p className="text-label-md font-semibold">{title}</p>
      </div>
      <div className="text-on-surface-variant text-body-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-xs">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-sm">
          <span className="material-symbols-outlined text-primary text-[16px] mt-[2px] flex-shrink-0">arrow_right</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant shadow-sm">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-sm text-primary font-black text-headline-md tracking-tight">
            <span className="material-symbols-outlined text-energy-orange" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            TalentoYa
          </Link>
          <div className="flex items-center gap-md">
            <span className="hidden sm:block text-label-sm text-on-surface-variant">Versión {META.version} · {META.vigencia}</span>
            <Link href="/" className="px-md py-xs border border-outline-variant text-on-surface-variant rounded-xl text-label-sm hover:bg-surface-container transition-colors">
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter py-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl">

          {/* ── Sidebar TOC ────────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-md px-sm">Contenido</p>
              <nav className="space-y-[2px]">
                {TOC.map(({ id, label }) => (
                  <a key={id} href={`#${id}`}
                    className="block px-sm py-xs rounded-lg text-body-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors leading-snug">
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-xl pt-lg border-t border-outline-variant space-y-sm">
                <Link href="/politica-privacidad"
                  className="flex items-center gap-xs text-body-sm text-primary hover:underline">
                  <span className="material-symbols-outlined text-[16px]">privacy_tip</span>
                  Política de Privacidad
                </Link>
                <a href={`mailto:${META.email}`}
                  className="flex items-center gap-xs text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  {META.email}
                </a>
              </div>
            </div>
          </aside>

          {/* ── Contenido principal ────────────────────────────────────── */}
          <main className="lg:col-span-9">

            {/* Hero del documento */}
            <div className="mb-2xl">
              <div className="flex items-center gap-sm mb-lg">
                <span className="material-symbols-outlined text-energy-orange text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                <div>
                  <h1 className="text-display-sm font-black text-on-surface">Términos y Condiciones</h1>
                  <p className="text-body-sm text-on-surface-variant">de Uso de la Plataforma TalentoYa</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-md mb-lg">
                <span className="flex items-center gap-xs px-md py-xs bg-primary/10 text-primary rounded-full text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Vigente desde {META.vigencia}
                </span>
                <span className="flex items-center gap-xs px-md py-xs bg-surface-container-high text-on-surface-variant rounded-full text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  Versión {META.version}
                </span>
                <span className="flex items-center gap-xs px-md py-xs bg-surface-container-high text-on-surface-variant rounded-full text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  Colombia
                </span>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-lg">
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Al acceder o utilizar la plataforma <strong className="text-on-surface">TalentoYa</strong>, usted acepta
                  quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna de las disposiciones
                  aquí contenidas, deberá abstenerse de utilizar nuestros servicios. Le recomendamos leer este documento
                  en su totalidad antes de registrarse.
                </p>
              </div>
            </div>

            {/* ── Secciones ──────────────────────────────────────────────── */}

            <Section id="objeto" num={1} title="Objeto y Ámbito de Aplicación">
              <p>
                Los presentes Términos y Condiciones (en adelante, "Términos") regulan el acceso y uso de la
                plataforma digital <strong className="text-on-surface">TalentoYa</strong>, operada por{" "}
                <strong className="text-on-surface">{META.empresa}</strong>, NIT {META.nit}, empresa legalmente
                constituida en Colombia, con domicilio en {META.direccion}.
              </p>
              <p>
                TalentoYa es una plataforma de intermediación laboral que conecta empresas y personas naturales
                en busca de oportunidades de empleo en Colombia, a través de tecnología de inteligencia artificial
                para el análisis de compatibilidad entre ofertas y candidatos.
              </p>
              <p>
                Estos Términos aplican a todos los usuarios de la plataforma, sin distinción de su rol
                (Empresa o Candidato) y de cualquier dispositivo desde el cual accedan al servicio.
              </p>
              <InfoBox icon="info" title="Ámbito territorial">
                TalentoYa opera exclusivamente en el territorio colombiano. Los servicios están dirigidos a personas
                naturales y jurídicas con domicilio o actividad en Colombia. El uso desde el exterior no implica
                disponibilidad del servicio ni adaptación a regulaciones extranjeras.
              </InfoBox>
            </Section>

            <Section id="definiciones" num={2} title="Definiciones">
              <p>Para efectos de estos Términos, se entenderá por:</p>
              <div className="space-y-sm mt-md">
                {[
                  { term: "Plataforma",    def: "El sitio web talentoya.co y sus aplicaciones móviles asociadas." },
                  { term: "Usuario",       def: "Toda persona natural o jurídica que acceda o utilice la Plataforma, ya sea como Empresa o como Candidato." },
                  { term: "Empresa",       def: "Persona jurídica o natural con actividad empresarial registrada en la Plataforma para publicar vacantes y gestionar procesos de selección." },
                  { term: "Candidato",     def: "Persona natural registrada en la Plataforma en búsqueda de oportunidades de empleo." },
                  { term: "Vacante",       def: "Oferta de empleo publicada por una Empresa en la Plataforma." },
                  { term: "Match de IA",   def: "Resultado del análisis automático de compatibilidad entre un Candidato y una Vacante, expresado en un porcentaje de 0 a 100." },
                  { term: "Plan",          def: "Modalidad de suscripción contratada por una Empresa para acceder a funcionalidades específicas de la Plataforma." },
                  { term: "Contenido",     def: "Toda información, texto, imagen, dato o archivo que el Usuario cargue, publique o transmita a través de la Plataforma." },
                ].map(({ term, def }) => (
                  <div key={term} className="flex gap-md p-md bg-surface-container-low rounded-xl">
                    <span className="text-label-md text-primary font-bold flex-shrink-0 w-28">{term}</span>
                    <span className="text-body-sm">{def}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="registro" num={3} title="Registro y Cuenta de Usuario">
              <p>
                El uso de las funcionalidades principales de TalentoYa requiere el registro previo de una
                cuenta de usuario. Al registrarse, el Usuario garantiza que:
              </p>
              <Ul items={[
                "La información suministrada es veraz, completa y actualizada.",
                "Es mayor de 18 años o cuenta con capacidad legal para contratar.",
                "Tiene autorización para actuar en nombre de la empresa que representa, si aplica.",
                "No tiene una cuenta previamente suspendida o cancelada por incumplimiento de estos Términos.",
              ]} />
              <p className="mt-md">
                El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.
                Cualquier actividad realizada desde su cuenta se entenderá efectuada por el propio Usuario.
                En caso de acceso no autorizado, deberá notificarlo inmediatamente a {META.soporte}.
              </p>
              <InfoBox icon="security" title="Seguridad de la cuenta" variant="orange">
                TalentoYa nunca solicitará su contraseña por correo electrónico, WhatsApp o llamada telefónica.
                Active la verificación en dos pasos desde Configuración → Seguridad para mayor protección.
              </InfoBox>
            </Section>

            <Section id="planes" num={4} title="Planes de Suscripción y Condiciones de Pago">
              <p>
                TalentoYa ofrece distintos planes de acceso para Empresas. Los precios, funcionalidades y
                condiciones de cada plan se detallan en la sección de Precios de la Plataforma y pueden
                actualizarse con previo aviso de 30 días.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mt-md">
                {[
                  { plan: "Gratis",  price: "$0/mes",       feat: "2 vacantes · 50 candidatos · Matches básicos"  },
                  { plan: "Pro",     price: "$129.000/mes",  feat: "10 vacantes · 500 candidatos · IA avanzada"    },
                  { plan: "Empresa", price: "$349.000/mes",  feat: "Vacantes ilimitadas · API · SLA garantizado"   },
                ].map(({ plan, price, feat }) => (
                  <div key={plan} className="bg-surface-container-low rounded-xl p-md border border-outline-variant/50">
                    <p className="text-label-md text-primary font-bold">{plan}</p>
                    <p className="text-headline-sm font-black text-on-surface">{price}</p>
                    <p className="text-body-sm text-on-surface-variant mt-xs">{feat}</p>
                  </div>
                ))}
              </div>
              <p className="mt-md">
                Los pagos se procesan mensualmente de forma automática. Los precios incluyen IVA cuando
                corresponda según la normativa tributaria colombiana vigente. La factura electrónica será
                enviada al correo registrado en los datos de facturación.
              </p>
              <p>
                El reembolso de pagos no procede, salvo en caso de error de cobro comprobado o
                incumplimiento imputable a TalentoYa. Para solicitudes de reembolso, escriba a {META.email}
                dentro de los 5 días hábiles siguientes al cargo.
              </p>
              <InfoBox icon="credit_card" title="Pagos seguros">
                Todos los pagos son procesados mediante pasarelas certificadas PCI-DSS. TalentoYa no almacena
                datos de tarjetas de crédito en sus servidores.
              </InfoBox>
            </Section>

            <Section id="uso-aceptable" num={5} title="Uso Aceptable de la Plataforma">
              <p>El Usuario se compromete a utilizar TalentoYa de forma lícita y acorde con su finalidad. Queda expresamente prohibido:</p>
              <div className="space-y-sm mt-md">
                {[
                  { icon: "block",          label: "Publicar ofertas de empleo falsas, engañosas o ilegales." },
                  { icon: "warning",        label: "Solicitar a candidatos pagos, depósitos o compra de productos como requisito para un empleo." },
                  { icon: "person_off",     label: "Crear cuentas falsas, suplantar la identidad de personas o empresas." },
                  { icon: "code_off",       label: "Realizar scraping, crawling automatizado o cualquier extracción masiva de datos sin autorización escrita." },
                  { icon: "bug_report",     label: "Intentar vulnerar la seguridad de la plataforma o acceder a cuentas ajenas." },
                  { icon: "content_copy",   label: "Reproducir, vender o explotar comercialmente el contenido de TalentoYa sin licencia." },
                  { icon: "gavel",          label: "Utilizar la plataforma para actividades contrarias al ordenamiento jurídico colombiano." },
                  { icon: "group_off",      label: "Discriminar candidatos por razón de raza, género, orientación sexual, religión o condición de salud." },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-start gap-md p-sm bg-error/5 border border-error/10 rounded-xl">
                    <span className="material-symbols-outlined text-error text-[18px] flex-shrink-0 mt-[1px]">{icon}</span>
                    <span className="text-body-sm text-on-surface-variant">{label}</span>
                  </div>
                ))}
              </div>
              <InfoBox icon="balance" title="Marco legal colombiano" variant="blue">
                El uso de TalentoYa para procesos de selección está sujeto al Código Sustantivo del Trabajo,
                la Ley 1010 de 2006 (acoso laboral), la Ley 1482 de 2011 (no discriminación) y demás normas
                laborales vigentes en Colombia.
              </InfoBox>
            </Section>

            <Section id="contenido" num={6} title="Contenido del Usuario">
              <p>
                El Usuario conserva la titularidad de los derechos sobre el Contenido que publique en la
                Plataforma. Al publicarlo, otorga a TalentoYa una licencia no exclusiva, mundial, libre de
                regalías para almacenar, mostrar, indexar y procesar dicho Contenido exclusivamente con el
                fin de prestar el servicio.
              </p>
              <p>
                El Usuario garantiza que el Contenido publicado no infringe derechos de terceros, no contiene
                información falsa, difamatoria, obscena, ilegal, o que vulnere la privacidad de personas naturales.
              </p>
              <Ul items={[
                "Las vacantes publicadas deben corresponder a necesidades reales de la empresa.",
                "Los perfiles de candidatos deben contener información auténtica y actualizada.",
                "Las imágenes, logos y materiales subidos deben contar con los derechos necesarios para su uso.",
                "TalentoYa puede remover Contenido que viole estos Términos sin previo aviso.",
              ]} />
            </Section>

            <Section id="ia" num={7} title="Motor de IA y Sistema de Matches">
              <p>
                TalentoYa utiliza modelos de inteligencia artificial para analizar la compatibilidad entre
                candidatos y vacantes. El porcentaje de match es un indicador orientativo y <strong className="text-on-surface">no constituye
                una garantía de contratación ni una evaluación definitiva de las competencias</strong> del candidato.
              </p>
              <p>
                Las decisiones finales de contratación son responsabilidad exclusiva de la Empresa. TalentoYa
                no interviene ni es parte en la relación laboral que pueda surgir entre Empresa y Candidato.
              </p>
              <InfoBox icon="psychology" title="Transparencia algorítmica" variant="green">
                El sistema de IA de TalentoYa no utiliza datos de raza, género, religión, orientación sexual
                ni condición de salud para calcular el match. Los factores considerados son: experiencia
                laboral, habilidades, nivel educativo, ubicación geográfica y preferencias declaradas.
              </InfoBox>
              <p className="mt-md">
                TalentoYa se reserva el derecho de ajustar, mejorar o modificar el modelo de IA sin previo
                aviso. Los resultados pueden variar en el tiempo. Si considera que un resultado de IA contiene
                un sesgo, puede reportarlo a {META.email}.
              </p>
            </Section>

            <Section id="propiedad" num={8} title="Propiedad Intelectual">
              <p>
                La Plataforma, incluyendo su código fuente, diseño, marca, logotipos, textos, modelos de IA
                y demás elementos, son propiedad exclusiva de <strong className="text-on-surface">{META.empresa}</strong> o
                de sus licenciantes, y están protegidos por las leyes de propiedad intelectual colombianas
                e internacionales.
              </p>
              <p>
                Queda prohibida su reproducción, modificación, distribución o uso comercial sin autorización
                escrita de TalentoYa. La marca "TalentoYa" y su logotipo son marcas registradas ante la
                Superintendencia de Industria y Comercio de Colombia.
              </p>
            </Section>

            <Section id="privacidad" num={9} title="Privacidad y Tratamiento de Datos">
              <p>
                El tratamiento de datos personales se rige por la{" "}
                <strong className="text-on-surface">Ley 1581 de 2012</strong> (Habeas Data) y el{" "}
                <strong className="text-on-surface">Decreto 1377 de 2013</strong>. Al aceptar estos Términos,
                el Usuario autoriza el tratamiento de sus datos personales conforme a nuestra{" "}
                <Link href="/politica-privacidad" className="text-primary hover:underline font-semibold">
                  Política de Privacidad
                </Link>
                , que forma parte integral de este documento.
              </p>
              <Ul items={[
                "Los datos de candidatos solo serán visibles para las empresas a las que se postulen.",
                "Las empresas no podrán exportar ni compartir datos de candidatos con terceros sin su consentimiento.",
                "Los datos serán conservados mientras la cuenta esté activa y hasta 2 años después de su cierre.",
                "El titular puede ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) escribiendo a " + META.email + ".",
              ]} />
            </Section>

            <Section id="responsabilidad" num={10} title="Limitación de Responsabilidad">
              <p>
                TalentoYa actúa como plataforma de intermediación tecnológica y <strong className="text-on-surface">no es empleador,
                agencia de empleo ni parte en los contratos laborales</strong> que se celebren como resultado
                del uso de la Plataforma.
              </p>
              <p>TalentoYa no será responsable por:</p>
              <Ul items={[
                "La veracidad de la información publicada por Empresas o Candidatos.",
                "El resultado de los procesos de selección ni la idoneidad de los candidatos.",
                "Daños derivados de interrupciones del servicio por mantenimiento, fuerza mayor o causas ajenas.",
                "El contenido de sitios web de terceros enlazados desde la Plataforma.",
                "Pérdidas indirectas, lucro cesante o daño emergente derivados del uso o imposibilidad de uso de la Plataforma.",
              ]} />
              <p className="mt-md">
                En ningún caso la responsabilidad de TalentoYa superará el valor pagado por el Usuario en
                los 3 meses anteriores al evento que genera la reclamación.
              </p>
              <InfoBox icon="warning" title="Aviso importante" variant="red">
                Si una vacante le solicita pagar por el proceso de selección, comprar uniformes, kits de trabajo
                o realizar depósitos de dinero, reporte de inmediato a {META.soporte}. Esto constituye una
                práctica fraudulenta que TalentoYa persigue activamente.
              </InfoBox>
            </Section>

            <Section id="suspension" num={11} title="Suspensión y Terminación del Servicio">
              <p>
                TalentoYa podrá suspender o cancelar el acceso de un Usuario, de forma temporal o permanente,
                en los siguientes casos:
              </p>
              <Ul items={[
                "Incumplimiento de estos Términos o de la Política de Privacidad.",
                "Publicación de contenido fraudulento, engañoso o ilegal.",
                "Falta de pago de las sumas adeudadas por plan de suscripción.",
                "Uso de la Plataforma para actividades contrarias a la ley colombiana.",
                "Requerimiento de autoridad judicial o administrativa competente.",
              ]} />
              <p className="mt-md">
                La cancelación voluntaria de una cuenta puede realizarse desde{" "}
                <strong className="text-on-surface">Configuración → Seguridad → Eliminar cuenta</strong>.
                Los datos serán anonimizados en un plazo máximo de 30 días, salvo que la ley exija su conservación.
              </p>
            </Section>

            <Section id="disputas" num={12} title="Resolución de Disputas">
              <p>
                Ante cualquier controversia derivada del uso de la Plataforma, el Usuario deberá
                contactar primero al equipo de soporte en {META.soporte} para buscar una solución amistosa.
              </p>
              <p>
                Si no se logra acuerdo en un plazo de 15 días hábiles, las partes acuerdan someter la
                disputa a la <strong className="text-on-surface">Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá</strong>,
                de conformidad con la Ley 1563 de 2012, con sede en Bogotá D.C., en idioma español.
              </p>
              <p>
                Lo anterior no obsta para que el Usuario presente reclamaciones ante la{" "}
                <strong className="text-on-surface">Superintendencia de Industria y Comercio (SIC)</strong> en
                materia de protección al consumidor y datos personales.
              </p>
            </Section>

            <Section id="modificaciones" num={13} title="Modificaciones a los Términos">
              <p>
                TalentoYa se reserva el derecho de modificar estos Términos en cualquier momento. Las
                modificaciones serán notificadas con al menos <strong className="text-on-surface">15 días de anticipación</strong>{" "}
                mediante correo electrónico al usuario registrado y mediante aviso destacado en la Plataforma.
              </p>
              <p>
                El uso continuado de la Plataforma después de la fecha de entrada en vigencia de los nuevos
                Términos constituirá aceptación de los mismos. Si el Usuario no está de acuerdo, deberá
                cesar el uso y cancelar su cuenta antes de la fecha de vigencia.
              </p>
            </Section>

            <Section id="ley" num={14} title="Ley Aplicable">
              <p>
                Estos Términos se rigen e interpretan de conformidad con las leyes de la República de Colombia,
                incluyendo, pero sin limitarse a:
              </p>
              <Ul items={[
                "Ley 527 de 1999 — Comercio electrónico y firmas digitales.",
                "Ley 1480 de 2011 — Estatuto del Consumidor.",
                "Ley 1581 de 2012 — Protección de datos personales.",
                "Código Sustantivo del Trabajo y normas laborales concordantes.",
                "Ley 1563 de 2012 — Arbitraje nacional e internacional.",
              ]} />
            </Section>

            <Section id="contacto" num={15} title="Contacto">
              <p>Para cualquier consulta, reclamación o ejercicio de derechos relacionados con estos Términos:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-md">
                {[
                  { icon: "apartment",   label: "Razón social", value: META.empresa     },
                  { icon: "pin",         label: "NIT",          value: META.nit         },
                  { icon: "location_on", label: "Dirección",    value: META.direccion   },
                  { icon: "mail",        label: "Email legal",  value: META.email       },
                  { icon: "headset_mic", label: "Soporte",      value: META.soporte     },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-md p-md bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-label-sm text-on-surface-variant">{label}</p>
                      <p className="text-label-md text-on-surface">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Footer del documento */}
            <div className="mt-2xl pt-xl border-t border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
              <div>
                <p className="text-label-sm text-on-surface-variant">
                  Versión {META.version} · Última actualización: {META.vigencia}
                </p>
                <p className="text-label-sm text-on-surface-variant">
                  © 2026 {META.empresa} · Todos los derechos reservados.
                </p>
              </div>
              <div className="flex gap-md">
                <Link href="/politica-privacidad" className="text-primary text-label-sm hover:underline flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">privacy_tip</span>
                  Política de Privacidad
                </Link>
                <Link href="/" className="text-on-surface-variant text-label-sm hover:text-primary transition-colors flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  Inicio
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
