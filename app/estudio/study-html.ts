const STUDY_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TalentoYA — Estudio de Mercado 2026</title>
<style>
  :root {
    --navy:    #0A1628;
    --navy2:   #1A2A42;
    --orange:  #FF6200;
    --green:   #00A676;
    --amber:   #F59E0B;
    --red:     #E53935;
    --purple:  #7C3AED;
    --bg:      #F5F7FA;
    --surface: #FFFFFF;
    --border:  #E2E8F0;
    --text:    #0F172A;
    --muted:   #64748B;
    --light:   #F1F5F9;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.6;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg:      #0F172A;
      --surface: #1E293B;
      --border:  #334155;
      --text:    #F1F5F9;
      --muted:   #94A3B8;
      --light:   #1E293B;
    }
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); }
  .top-bar {
    position: sticky; top: 0; z-index: 100;
    background: var(--navy); color: white;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 56px;
    box-shadow: 0 2px 12px rgba(0,0,0,.25);
  }
  .top-bar .logo { font-weight: 800; font-size: 18px; letter-spacing: -.5px; }
  .top-bar .logo span { color: var(--orange); }
  .top-bar .meta { font-size: 12px; opacity: .6; }
  .top-bar .pill {
    background: var(--orange); color: white;
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
  }
  .layout { display: grid; grid-template-columns: 220px 1fr; gap: 0; max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
  @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
  .sidebar { position: sticky; top: 72px; height: fit-content; padding-right: 24px; }
  .sidebar ul { list-style: none; }
  .sidebar li a {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 8px;
    color: var(--muted); font-size: 13px; font-weight: 500;
    text-decoration: none; transition: all .15s;
  }
  .sidebar li a:hover { background: var(--light); color: var(--text); }
  .sidebar li a.active { background: var(--orange); color: white; }
  .sidebar li a .num {
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(255,98,0,.15); color: var(--orange);
    font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sidebar li a.active .num { background: rgba(255,255,255,.25); color: white; }
  .sidebar-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); padding: 16px 12px 4px; }
  @media (max-width: 860px) { .sidebar { display: none; } }
  .content { min-width: 0; }
  section { margin-bottom: 48px; scroll-margin-top: 72px; }
  .cover {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 60%, #0F3460 100%);
    border-radius: 20px; padding: 48px 40px; color: white; margin-bottom: 48px;
    position: relative; overflow: hidden;
  }
  .cover::after {
    content: ''; position: absolute; right: -60px; top: -60px;
    width: 280px; height: 280px; border-radius: 50%;
    border: 60px solid rgba(255,98,0,.12);
  }
  .cover .tag { display: inline-block; background: var(--orange); color: white; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 20px; }
  .cover h1 { font-size: clamp(28px, 5vw, 44px); font-weight: 900; line-height: 1.1; margin-bottom: 12px; }
  .cover h1 span { color: var(--orange); }
  .cover .subtitle { font-size: 16px; opacity: .75; margin-bottom: 32px; }
  .cover-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 600px) { .cover-stats { grid-template-columns: 1fr 1fr; } .cover { padding: 32px 24px; } }
  .cover-stat { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 16px; }
  .cover-stat .val { font-size: 26px; font-weight: 900; color: var(--orange); }
  .cover-stat .lbl { font-size: 12px; opacity: .65; margin-top: 2px; }
  .section-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .section-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
  .card-sm { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  @media (max-width: 700px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
  .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
  .kpi .k-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .kpi .k-val { font-size: 28px; font-weight: 900; line-height: 1; }
  .kpi .k-lbl { font-size: 13px; font-weight: 600; color: var(--text); }
  .kpi .k-sub { font-size: 12px; color: var(--muted); }
  .kpi.accent { border-left: 4px solid var(--orange); }
  .highlight { border-left: 4px solid var(--orange); background: rgba(255,98,0,.06); border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 20px 0; }
  .highlight p { font-size: 15px; line-height: 1.6; }
  .highlight strong { color: var(--orange); }
  .alert { border-radius: 12px; padding: 16px 20px; font-size: 14px; margin: 12px 0; }
  .alert-green { background: rgba(0,166,118,.08); border: 1px solid rgba(0,166,118,.25); color: var(--green); }
  .alert-orange { background: rgba(255,98,0,.08); border: 1px solid rgba(255,98,0,.25); color: var(--orange); }
  .alert-red { background: rgba(229,57,53,.08); border: 1px solid rgba(229,57,53,.25); color: var(--red); }
  .alert-navy { background: rgba(10,22,40,.06); border: 1px solid var(--border); color: var(--text); }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { background: var(--navy); color: white; font-weight: 700; font-size: 12px; text-align: left; padding: 10px 14px; }
  th:first-child { border-radius: 8px 0 0 8px; }
  th:last-child { border-radius: 0 8px 8px 0; }
  td { padding: 11px 14px; border-bottom: 1px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--light); }
  .tag-chip { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .chip-green { background: rgba(0,166,118,.15); color: var(--green); }
  .chip-orange { background: rgba(255,98,0,.15); color: var(--orange); }
  .chip-red { background: rgba(229,57,53,.15); color: var(--red); }
  .chip-navy { background: rgba(10,22,40,.1); color: var(--navy); }
  .chip-purple { background: rgba(124,58,237,.12); color: var(--purple); }
  .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .bar-row .bar-label { font-size: 13px; width: 130px; flex-shrink: 0; color: var(--text); font-weight: 500; }
  .bar-track { flex: 1; height: 10px; background: var(--light); border-radius: 99px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 99px; }
  .bar-row .bar-val { font-size: 13px; font-weight: 700; width: 80px; text-align: right; color: var(--text); }
  .tam-visual { display: flex; flex-direction: column; align-items: center; gap: 0; }
  .tam-ring { border-radius: 16px; display: flex; align-items: center; padding: 24px; gap: 20px; width: 100%; margin-bottom: 8px; }
  .tam-ring .tam-num { font-size: 30px; font-weight: 900; }
  .tam-ring .tam-lbl { font-weight: 700; font-size: 15px; }
  .tam-ring .tam-desc { font-size: 13px; opacity: .75; margin-top: 2px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
  .rev-table td:not(:first-child) { text-align: right; font-variant-numeric: tabular-nums; }
  .rev-table .total-row td { font-weight: 800; background: var(--light); }
  .rev-table .green { color: var(--green); font-weight: 700; }
  .matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: var(--border); border-radius: 12px; overflow: hidden; }
  .matrix-cell { padding: 20px; background: var(--surface); }
  .matrix-cell.highlight-cell { background: rgba(255,98,0,.07); }
  .matrix-cell .cell-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin-bottom: 8px; }
  .matrix-cell .cell-names { font-size: 13px; line-height: 1.7; }
  .matrix-axis-h { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 4px; padding: 0 4px; }
  .matrix-axis-v-label { writing-mode: vertical-lr; transform: rotate(180deg); font-size: 11px; color: var(--muted); flex-shrink: 0; }
  .verdict { border-radius: 20px; padding: 40px; text-align: center; background: linear-gradient(135deg, #0A1628, #0F3460); color: white; }
  .verdict .verdict-icon { font-size: 56px; margin-bottom: 16px; }
  .verdict h2 { font-size: 32px; font-weight: 900; margin-bottom: 12px; }
  .verdict p { font-size: 16px; opacity: .8; max-width: 600px; margin: 0 auto 24px; }
  .verdict-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 700px; margin: 0 auto; }
  .verdict-item { background: rgba(255,255,255,.08); border-radius: 12px; padding: 16px; }
  .verdict-item .vi-icon { font-size: 24px; margin-bottom: 6px; }
  .verdict-item .vi-lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; opacity: .65; }
  .verdict-item .vi-val { font-size: 16px; font-weight: 800; color: #4ADE80; margin-top: 2px; }
  @media (max-width: 600px) { .verdict-grid { grid-template-columns: 1fr; } .verdict { padding: 28px 20px; } }
  .comp-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
  .comp-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .comp-card .comp-price { font-size: 20px; font-weight: 900; color: var(--navy); margin: 8px 0; }
  .comp-card .comp-pros, .comp-card .comp-cons { font-size: 13px; margin-top: 8px; }
  .comp-card .comp-pros li::before { content: '\\2713 '; color: var(--green); font-weight: 700; }
  .comp-card .comp-cons li::before { content: '\\2717 '; color: var(--red); font-weight: 700; }
  .comp-card ul { list-style: none; line-height: 1.8; }
  .talentoya-card { border: 2px solid var(--orange); background: rgba(255,98,0,.04); }
  .talentoya-card .comp-price { color: var(--orange); }
  .score-bar { display: flex; gap: 4px; margin-top: 8px; }
  .score-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); }
  .score-dot.filled { background: var(--orange); }
  .score-dot.filled.green { background: var(--green); }
  .sources { font-size: 11px; color: var(--muted); border-top: 1px solid var(--border); padding-top: 16px; margin-top: 32px; line-height: 1.8; }
  .sources a { color: var(--muted); }
</style>
</head>
<body>

<div class="top-bar">
  <div class="logo">Talento<span>YA</span> &nbsp;<span style="opacity:.4;font-weight:400">|</span>&nbsp; Estudio de Mercado</div>
  <span class="pill">Julio 2026</span>
  <div class="meta">Documento estratégico &middot; Confidencial</div>
</div>

<div style="max-width:1200px;margin:0 auto;padding:24px 24px 0;">
<div class="cover">
  <div class="tag">Estudio de Mercado &middot; Colombia &middot; 2026</div>
  <h1>&iquest;Estamos en el<br><span>mercado correcto?</span></h1>
  <p class="subtitle">An&aacute;lisis completo de mercado, competidores, modelo de negocio e ingresos para TalentoYA &mdash; la plataforma de empleo con IA para PyMEs colombianas.</p>
  <div class="cover-stats">
    <div class="cover-stat"><div class="val">23.8M</div><div class="lbl">Ocupados en Colombia</div></div>
    <div class="cover-stat"><div class="val">1.53M</div><div class="lbl">Empresas formales activas</div></div>
    <div class="cover-stat"><div class="val">$1.25B</div><div class="lbl">HR Tech LATAM 2025</div></div>
    <div class="cover-stat"><div class="val">55.3%</div><div class="lbl">Informalidad laboral</div></div>
    <div class="cover-stat"><div class="val">99%</div><div class="lbl">Son PyMEs del tejido empresarial</div></div>
    <div class="cover-stat"><div class="val">17%</div><div class="lbl">Desempleo juvenil &mdash; el pain point</div></div>
  </div>
</div>
</div>

<div class="layout">
<aside class="sidebar">
  <div class="sidebar-label">Contenido</div>
  <ul>
    <li><a href="#que-es"><span class="num">1</span>Qu&eacute; es TalentoYA</a></li>
    <li><a href="#problema"><span class="num">2</span>El Problema</a></li>
    <li><a href="#mercado"><span class="num">3</span>El Mercado</a></li>
    <li><a href="#tam"><span class="num">4</span>TAM / SAM / SOM</a></li>
    <li><a href="#competidores"><span class="num">5</span>Competidores</a></li>
    <li><a href="#modelo"><span class="num">6</span>Modelo de Negocio</a></li>
    <li><a href="#proyecciones"><span class="num">7</span>Proyecciones</a></li>
    <li><a href="#costos"><span class="num">8</span>Costos Operativos</a></li>
    <li><a href="#veredicto"><span class="num">&#9733;</span>Veredicto Final</a></li>
  </ul>
</aside>

<div class="content">

<section id="que-es">
  <div class="section-title">01 &middot; &iquest;Qu&eacute; es TalentoYA?</div>
  <div class="section-sub">El elevator pitch del producto</div>
  <div class="card" style="border-left:4px solid var(--orange)">
    <p style="font-size:18px;font-weight:700;line-height:1.5;color:var(--text)">
      TalentoYA es una plataforma SaaS de empleo con inteligencia artificial dise&ntilde;ada para las <strong style="color:var(--orange)">PyMEs colombianas</strong> que necesitan contratar r&aacute;pido, sin un departamento de RRHH sofisticado y sin pagar agencias de reclutamiento costosas.
    </p>
  </div>
  <div style="height:16px"></div>
  <div class="grid-3">
    <div class="card-sm"><div style="font-size:28px;margin-bottom:8px">&#127962;</div><div style="font-weight:700;margin-bottom:4px">Para Empresas</div><div style="font-size:13px;color:var(--muted)">PyMEs que publican vacantes, reciben candidatos rankeados por IA, gestionan postulaciones y contratan sin intermediarios.</div></div>
    <div class="card-sm"><div style="font-size:28px;margin-bottom:8px">&#128100;</div><div style="font-weight:700;margin-bottom:4px">Para Candidatos</div><div style="font-size:13px;color:var(--muted)">Colombianos que crean perfil completo, son matcheados con vacantes afines por IA y se postulan con un clic.</div></div>
    <div class="card-sm"><div style="font-size:28px;margin-bottom:8px">&#129302;</div><div style="font-weight:700;margin-bottom:4px">La IA como diferencial</div><div style="font-size:13px;color:var(--muted)">Motor de matching que punta compatibilidad candidato-vacante (0-100%) usando Claude AI, eliminando el filtrado manual.</div></div>
  </div>
  <div class="highlight"><p><strong>Propuesta de valor central:</strong> Una PyME en Colombia puede publicar una vacante, recibir candidatos pre-filtrados por IA con score de compatibilidad, contactarlos por chat y contratarlos &mdash; todo en una sola plataforma, a una fracci&oacute;n del costo de una agencia o portal tradicional.</p></div>
  <div class="grid-2" style="margin-top:16px">
    <div class="card-sm">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:12px">Stack tecnol&oacute;gico</div>
      <div style="font-size:13px;line-height:2">
        &#127824; <strong>Frontend:</strong> Next.js 16 + Tailwind v4<br>
        &#128309; <strong>Backend/DB:</strong> Firebase Firestore<br>
        &#128994; <strong>Auth:</strong> Firebase Authentication<br>
        &#128308; <strong>Storage:</strong> Firebase Storage<br>
        &#129302; <strong>IA:</strong> Claude AI (Anthropic) &mdash; Haiku<br>
        &#9925; <strong>Hosting:</strong> Vercel (auto-deploy)
      </div>
    </div>
    <div class="card-sm">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:12px">Estado actual</div>
      <div style="font-size:13px;line-height:2">
        &#9989; Portal empresa (vacantes, postulaciones, mensajes)<br>
        &#9989; Portal candidato (perfil completo, vacantes, chat)<br>
        &#9989; Motor de matching IA operativo<br>
        &#9989; Deploy en producci&oacute;n (Vercel)<br>
        &#9989; Firebase instajob-680ba configurado<br>
        &#128679; Monetizaci&oacute;n &mdash; pendiente activar
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<section id="problema">
  <div class="section-title">02 &middot; El Problema que Resuelve</div>
  <div class="section-sub">Los dolores reales del mercado colombiano</div>
  <div class="grid-2">
    <div class="card">
      <div style="font-size:20px;margin-bottom:12px">&#128308; Dolor del Empleador (PyME)</div>
      <ul style="list-style:none;font-size:14px;line-height:2.2">
        <li>&#128204; Reciben 200+ CVs para 1 vacante y no tienen tiempo para filtrar</li>
        <li>&#128204; Agencias de reclutamiento cobran 1-3 salarios mensuales del cargo</li>
        <li>&#128204; Computrabajo/LinkedIn no fueron dise&ntilde;ados para la PyME informal colombiana</li>
        <li>&#128204; No tienen &aacute;rea de RRHH &mdash; el due&ntilde;o contrata directamente</li>
        <li>&#128204; Alta rotaci&oacute;n: contratan mal y vuelven a empezar en 3-6 meses</li>
        <li>&#128204; Proceso de selecci&oacute;n sin estructura ni seguimiento digital</li>
      </ul>
    </div>
    <div class="card">
      <div style="font-size:20px;margin-bottom:12px">&#128308; Dolor del Candidato</div>
      <ul style="list-style:none;font-size:14px;line-height:2.2">
        <li>&#128204; 17% de desempleo juvenil &mdash; mercado saturado</li>
        <li>&#128204; Mandan CVs y no reciben respuesta (black hole)</li>
        <li>&#128204; LinkedIn es en ingl&eacute;s y orientado a perfiles universitarios</li>
        <li>&#128204; Computrabajo los invisibiliza entre miles de candidatos</li>
        <li>&#128204; 55.3% de informalidad &mdash; los contratan "de palabra"</li>
        <li>&#128204; No saben qu&eacute; tan compatibles son con una vacante</li>
      </ul>
    </div>
  </div>
  <div class="alert alert-orange" style="margin-top:20px"><strong>El gap de mercado:</strong> Existe una zona desatendida entre "publicar un aviso gratis en Computrabajo" y "contratar una agencia costosa". La PyME colombiana necesita algo en el medio: herramienta digital + inteligente + accesible en precio. Eso es TalentoYA.</div>
  <div style="height:16px"></div>
  <div class="card">
    <div style="font-weight:700;margin-bottom:16px">Costo real del problema para una PyME</div>
    <div class="bar-row"><div class="bar-label">Agencia reclutamiento</div><div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--red)"></div></div><div class="bar-val" style="color:var(--red)">$3&ndash;8M COP</div></div>
    <div class="bar-row"><div class="bar-label">LinkedIn Recruiter</div><div class="bar-track"><div class="bar-fill" style="width:75%;background:var(--amber)"></div></div><div class="bar-val" style="color:var(--amber)">$1.2M COP/mes</div></div>
    <div class="bar-row"><div class="bar-label">Computrabajo pago</div><div class="bar-track"><div class="bar-fill" style="width:35%;background:var(--muted)"></div></div><div class="bar-val">$400K COP</div></div>
    <div class="bar-row"><div class="bar-label" style="color:var(--orange);font-weight:700">TalentoYA Pro</div><div class="bar-track"><div class="bar-fill" style="width:14%;background:var(--orange)"></div></div><div class="bar-val" style="color:var(--orange);font-weight:700">$120K COP/mes</div></div>
    <div style="font-size:12px;color:var(--muted);margin-top:8px">* Costo objetivo. Precio de agencia = 1 mes de salario del cargo contratado (base: t&eacute;cnico $2.5M)</div>
  </div>
</section>

<hr class="divider">

<section id="mercado">
  <div class="section-title">03 &middot; El Mercado Colombiano</div>
  <div class="section-sub">Datos reales DANE, ANIF, Confec&aacute;maras &mdash; 2025/2026</div>
  <div class="grid-4">
    <div class="kpi accent"><div class="k-icon" style="background:rgba(10,22,40,.08)">&#127963;</div><div class="k-val">23.8M</div><div class="k-lbl">Ocupados Colombia</div><div class="k-sub">+3.2M en 2 a&ntilde;os (DANE 2025)</div></div>
    <div class="kpi accent"><div class="k-icon" style="background:rgba(255,98,0,.08)">&#128201;</div><div class="k-val">8.9%</div><div class="k-lbl">Desempleo 2025</div><div class="k-sub">El m&aacute;s bajo desde 2001</div></div>
    <div class="kpi accent"><div class="k-icon" style="background:rgba(229,57,53,.08)">&#9888;</div><div class="k-val">55.3%</div><div class="k-lbl">Informalidad laboral</div><div class="k-sub">83% en zonas rurales</div></div>
    <div class="kpi accent"><div class="k-icon" style="background:rgba(245,158,11,.08)">&#128118;</div><div class="k-val">17%</div><div class="k-lbl">Desempleo juvenil</div><div class="k-sub">El doble del promedio nacional</div></div>
  </div>
  <div style="height:20px"></div>
  <div class="card">
    <div style="font-weight:700;font-size:16px;margin-bottom:16px">Las PyMEs &mdash; el coraz&oacute;n del mercado de TalentoYA</div>
    <div class="grid-3">
      <div style="text-align:center;padding:16px 0"><div style="font-size:36px;font-weight:900;color:var(--orange)">99%</div><div style="font-size:13px;color:var(--muted)">del tejido empresarial colombiano son MiPyMEs</div></div>
      <div style="text-align:center;padding:16px 0;border-left:1px solid var(--border);border-right:1px solid var(--border)"><div style="font-size:36px;font-weight:900;color:var(--navy)">79%</div><div style="font-size:13px;color:var(--muted)">del empleo formal generado por PyMEs</div></div>
      <div style="text-align:center;padding:16px 0"><div style="font-size:36px;font-weight:900;color:var(--green)">40%</div><div style="font-size:13px;color:var(--muted)">del PIB nacional aportan las PyMEs</div></div>
    </div>
  </div>
  <div style="height:16px"></div>
  <div class="grid-2">
    <div class="card-sm">
      <div style="font-weight:700;margin-bottom:12px">Empresas formales activas (2025)</div>
      <div class="bar-row"><div class="bar-label">Microempresas</div><div class="bar-track"><div class="bar-fill" style="width:88%;background:var(--navy)"></div></div><div class="bar-val">~1.3M</div></div>
      <div class="bar-row"><div class="bar-label">Peque&ntilde;as (10-49)</div><div class="bar-track"><div class="bar-fill" style="width:30%;background:var(--orange)"></div></div><div class="bar-val">~145K</div></div>
      <div class="bar-row"><div class="bar-label">Medianas (50-199)</div><div class="bar-track"><div class="bar-fill" style="width:8%;background:var(--green)"></div></div><div class="bar-val">~22K</div></div>
      <div class="bar-row"><div class="bar-label">Grandes (200+)</div><div class="bar-track"><div class="bar-fill" style="width:3%;background:var(--muted)"></div></div><div class="bar-val">~4K</div></div>
    </div>
    <div class="card-sm">
      <div style="font-weight:700;margin-bottom:12px">Sectores con mayor contrataci&oacute;n</div>
      <div class="bar-row"><div class="bar-label">Servicios</div><div class="bar-track"><div class="bar-fill" style="width:90%;background:var(--navy)"></div></div><div class="bar-val">35.9%</div></div>
      <div class="bar-row"><div class="bar-label">Comercio</div><div class="bar-track"><div class="bar-fill" style="width:72%;background:var(--orange)"></div></div><div class="bar-val">28.6%</div></div>
      <div class="bar-row"><div class="bar-label">Manufactura</div><div class="bar-track"><div class="bar-fill" style="width:40%;background:var(--green)"></div></div><div class="bar-val">16.1%</div></div>
      <div class="bar-row"><div class="bar-label">Construcci&oacute;n</div><div class="bar-track"><div class="bar-fill" style="width:27%;background:var(--amber)"></div></div><div class="bar-val">10.9%</div></div>
      <div class="bar-row"><div class="bar-label">Agropecuario</div><div class="bar-track"><div class="bar-fill" style="width:18%;background:var(--muted)"></div></div><div class="bar-val">7.2%</div></div>
    </div>
  </div>
  <div class="alert alert-green" style="margin-top:16px"><strong>Insight clave:</strong> El 55.3% de informalidad es una OPORTUNIDAD, no un obst&aacute;culo. Cada empresa que se formaliza se convierte en un cliente potencial de TalentoYA.</div>
</section>

<hr class="divider">

<section id="tam">
  <div class="section-title">04 &middot; TAM &middot; SAM &middot; SOM</div>
  <div class="section-sub">&iquest;Qu&eacute; tan grande es la oportunidad real?</div>
  <div class="tam-visual">
    <div class="tam-ring" style="background:rgba(10,22,40,.06);border:2px solid var(--navy)"><div><div class="tam-num" style="color:var(--navy)">$125M USD</div><div class="tam-lbl">TAM &mdash; Mercado Total Direccionable</div><div class="tam-desc">HR Tech Colombia (&asymp;10% de LATAM $1.25B). Incluye ERP de RRHH, n&oacute;mina, portales de empleo, ATS y todo el ecosistema de tecnolog&iacute;a laboral.</div></div></div>
    <div style="font-size:20px;text-align:center;color:var(--muted)">&#9660;</div>
    <div class="tam-ring" style="background:rgba(255,98,0,.06);border:2px solid var(--orange)"><div><div class="tam-num" style="color:var(--orange)">$18M USD</div><div class="tam-lbl">SAM &mdash; Mercado Abordable</div><div class="tam-desc">~167,000 PyMEs colombianas que contratan activamente (peque&ntilde;as + medianas con 10-200 empleados) pagando alguna herramienta digital de reclutamiento. A $9 USD/mes promedio.</div></div></div>
    <div style="font-size:20px;text-align:center;color:var(--muted)">&#9660;</div>
    <div class="tam-ring" style="background:rgba(0,166,118,.06);border:2px solid var(--green)"><div><div class="tam-num" style="color:var(--green)">$540K&ndash;$2.16M USD/a&ntilde;o</div><div class="tam-lbl">SOM &mdash; Mercado Obtenible</div><div class="tam-desc">A&ntilde;os 1-3: capturar 0.3% al 1.2% del SAM = 500 a 2,000 empresas pagando. A $29&ndash;$79 USD/mes (COP $122K&ndash;$332K). Alcanzable sin inversi&oacute;n masiva en ventas.</div></div></div>
  </div>
  <div style="height:24px"></div>
  <div class="card">
    <div style="font-weight:700;margin-bottom:16px">Construcci&oacute;n del n&uacute;mero: &iquest;Cu&aacute;ntas PyMEs son clientes potenciales?</div>
    <table><thead><tr><th>Segmento</th><th>Empresas est.</th><th>% que contrata digitalmente</th><th>Potenciales TalentoYA</th><th>Ticket mensual COP</th></tr></thead>
    <tbody>
      <tr><td>Microempresas (1-9 emp.)</td><td>1,300,000</td><td>~5%</td><td style="font-weight:700">65,000</td><td>$29,000 &ndash; $59,000</td></tr>
      <tr><td>Peque&ntilde;as (10-49 emp.)</td><td>145,000</td><td>~35%</td><td style="font-weight:700">50,750</td><td>$79,000 &ndash; $149,000</td></tr>
      <tr><td>Medianas (50-199 emp.)</td><td>22,000</td><td>~70%</td><td style="font-weight:700">15,400</td><td>$199,000 &ndash; $499,000</td></tr>
      <tr style="background:var(--light);font-weight:700"><td>TOTAL SAM Colombia</td><td>&mdash;</td><td>&mdash;</td><td>~131,000 empresas</td><td>Promedio $99,000 COP</td></tr>
    </tbody></table>
  </div>
  <div class="highlight"><p><strong>El premio gordo:</strong> Capturar solo el <strong>1% del SAM</strong> (1,310 empresas &times; $99K COP/mes) = <strong>$1.56 mil millones COP/a&ntilde;o</strong> en ARR (~$371K USD). Con 3% = $4.7M USD/a&ntilde;o. Esto es totalmente alcanzable en 3-5 a&ntilde;os con el producto correcto.</p></div>
</section>

<hr class="divider">

<section id="competidores">
  <div class="section-title">05 &middot; An&aacute;lisis de Competidores</div>
  <div class="section-sub">&iquest;Qui&eacute;n m&aacute;s est&aacute; en este mercado y c&oacute;mo nos comparamos?</div>
  <div class="grid-2" style="margin-bottom:16px">
    <div class="comp-card">
      <div style="font-size:22px">&#128309;</div><h4>Computrabajo Colombia</h4><div class="comp-price">Gratis + planes pagos</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">L&iacute;der LATAM &middot; 19 pa&iacute;ses &middot; 60M candidatos</div>
      <ul class="comp-pros"><li>Mayor base de candidatos Colombia</li><li>3 avisos gratis al registrarse</li><li>60 d&iacute;as por aviso activo</li></ul>
      <ul class="comp-cons"><li>No tiene IA de matching</li><li>UX anticuada para PyMEs</li><li>Candidatos no pre-filtrados</li></ul>
      <div class="score-bar"><div class="score-dot filled"></div><div class="score-dot filled"></div><div class="score-dot filled"></div><div class="score-dot"></div><div class="score-dot"></div></div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">3/5 &mdash; Volumen pero sin inteligencia</div>
    </div>
    <div class="comp-card">
      <div style="font-size:22px">&#128279;</div><h4>LinkedIn Colombia</h4><div class="comp-price">$59.99 USD/mes</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Premium Business &middot; Recruiter Lite ~$170/mes</div>
      <ul class="comp-pros"><li>Red profesional global</li><li>Perfiles verificados</li><li>B&uacute;squeda avanzada con filtros</li></ul>
      <ul class="comp-cons"><li>Demasiado caro para PyMEs ($252K COP+)</li><li>Perfil de cargos ejecutivos/tech</li><li>No adaptado al mercado informal colombiano</li></ul>
      <div class="score-bar"><div class="score-dot filled"></div><div class="score-dot filled"></div><div class="score-dot"></div><div class="score-dot"></div><div class="score-dot"></div></div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">2/5 &mdash; Muy caro para el segmento PyME</div>
    </div>
    <div class="comp-card">
      <div style="font-size:22px">&#128203;</div><h4>Torre.ai (Torrenegra)</h4><div class="comp-price">$2,490 USD / contrataci&oacute;n</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Global &middot; Trabajo remoto &middot; $22M USD recaudados</div>
      <ul class="comp-pros"><li>9 tipos de IA de matching</li><li>Agente aut&oacute;nomo Emma</li><li>Reconocimiento de marca en Colombia</li></ul>
      <ul class="comp-cons"><li>$10.5M COP por contrataci&oacute;n &mdash; fuera de rango PyME</li><li>Orientado a trabajo remoto global</li><li>No dise&ntilde;ado para PyME colombiana informal</li></ul>
      <div class="score-bar"><div class="score-dot filled"></div><div class="score-dot filled"></div><div class="score-dot"></div><div class="score-dot"></div><div class="score-dot"></div></div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">2/5 &mdash; Competencia indirecta, segmento distinto</div>
    </div>
    <div class="comp-card talentoya-card">
      <div style="font-size:22px">&#9889;</div><h4>TalentoYA &larr; <span style="color:var(--orange)">Nosotros</span></h4>
      <div class="comp-price">$29&ndash;$199 USD/mes (objetivo)</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Nacido para la PyME colombiana &middot; IA nativa</div>
      <ul class="comp-pros"><li>IA matching 0-100% por vacante</li><li>Chat empresa-candidato tiempo real</li><li>UX mobile-first en espa&ntilde;ol</li><li>Dashboard de reportes con IA insights</li><li>Perfil candidato completo</li></ul>
      <ul class="comp-cons"><li>Sin usuarios a&uacute;n (beta)</li><li>Sin brand awareness</li><li>Base de candidatos a construir</li></ul>
      <div class="score-bar"><div class="score-dot filled green"></div><div class="score-dot filled green"></div><div class="score-dot filled green"></div><div class="score-dot filled green"></div><div class="score-dot filled green"></div></div>
      <div style="font-size:11px;color:var(--green);margin-top:4px;font-weight:700">5/5 &mdash; El mejor producto, el menor alcance (por ahora)</div>
    </div>
  </div>
  <div class="alert alert-green"><strong>Ventaja competitiva principal:</strong> Ning&uacute;n competidor directo en Colombia sirve el cuadrante "PyME + IA" con precio accesible. TalentoYA tiene la oportunidad de ser el primero en definir esa categor&iacute;a.</div>
</section>

<hr class="divider">

<section id="modelo">
  <div class="section-title">06 &middot; Modelo de Negocio y Monetizaci&oacute;n</div>
  <div class="section-sub">&iquest;D&oacute;nde est&aacute; el dinero para TalentoYA?</div>
  <div class="card" style="border-left:4px solid var(--green);margin-bottom:20px">
    <div style="font-weight:700;font-size:16px;margin-bottom:16px">Fuentes de ingreso (de mayor a menor potencial a corto plazo)</div>
    <table><thead><tr><th>#</th><th>Fuente</th><th>&iquest;Qui&eacute;n paga?</th><th>Monto est. COP</th><th>Modelo</th><th>Estado</th></tr></thead>
    <tbody>
      <tr><td style="font-weight:700">1</td><td><strong>Suscripci&oacute;n PyME</strong></td><td>Empresa que contrata</td><td style="font-weight:700;color:var(--green)">$99K &ndash; $399K/mes</td><td><span class="tag-chip chip-green">MRR</span></td><td><span class="tag-chip chip-orange">Dise&ntilde;ar</span></td></tr>
      <tr><td style="font-weight:700">2</td><td><strong>Publicaci&oacute;n de vacante</strong></td><td>Empresa (pago &uacute;nico)</td><td>$49K &ndash; $249K/vacante</td><td><span class="tag-chip chip-navy">Per Post</span></td><td><span class="tag-chip chip-orange">Dise&ntilde;ar</span></td></tr>
      <tr><td style="font-weight:700">3</td><td><strong>Candidato Premium</strong></td><td>Candidato buscando empleo</td><td>$15K &ndash; $39K/mes</td><td><span class="tag-chip chip-purple">Freemium</span></td><td><span class="tag-chip chip-navy">Futuro</span></td></tr>
      <tr><td style="font-weight:700">4</td><td><strong>Acceso base CVs</strong></td><td>Empresa / Headhunter</td><td>$199K &ndash; $499K/mes</td><td><span class="tag-chip chip-green">MRR</span></td><td><span class="tag-chip chip-navy">Futuro</span></td></tr>
      <tr><td style="font-weight:700">5</td><td><strong>Comisi&oacute;n por contrataci&oacute;n</strong></td><td>Empresa (&eacute;xito)</td><td>$300K &ndash; $1.5M/contrataci&oacute;n</td><td><span class="tag-chip chip-navy">Success Fee</span></td><td><span class="tag-chip chip-red">Alto riesgo</span></td></tr>
    </tbody></table>
  </div>
  <div style="font-weight:700;margin-bottom:16px">Planes propuestos para lanzamiento</div>
  <div class="grid-3">
    <div class="card-sm" style="border-top:4px solid var(--muted)">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted)">GRATIS</div>
      <div style="font-size:28px;font-weight:900;margin:12px 0">$0 <span style="font-size:14px;font-weight:400;color:var(--muted)">/mes</span></div>
      <ul style="list-style:none;font-size:13px;line-height:2;color:var(--muted)"><li>&#10003; 1 vacante activa</li><li>&#10003; 10 postulaciones/mes</li><li>&#10007; Sin IA matching</li><li>&#10007; Sin chat</li></ul>
    </div>
    <div class="card-sm" style="border-top:4px solid var(--orange)">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--orange)">PyME PRO &#11088; PRINCIPAL</div>
      <div style="font-size:28px;font-weight:900;margin:12px 0;color:var(--orange)">$99K <span style="font-size:14px;font-weight:400;color:var(--muted)">COP/mes</span></div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">&asymp; $24 USD/mes</div>
      <ul style="list-style:none;font-size:13px;line-height:2"><li>&#10003; Vacantes ilimitadas</li><li>&#10003; <strong>IA Matching 0-100%</strong></li><li>&#10003; Chat empresa-candidato</li><li>&#10003; Dashboard reportes</li></ul>
    </div>
    <div class="card-sm" style="border-top:4px solid var(--navy)">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--navy)">ENTERPRISE</div>
      <div style="font-size:28px;font-weight:900;margin:12px 0">$399K <span style="font-size:14px;font-weight:400;color:var(--muted)">COP/mes</span></div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">&asymp; $95 USD/mes</div>
      <ul style="list-style:none;font-size:13px;line-height:2"><li>&#10003; Todo PyME Pro</li><li>&#10003; M&uacute;ltiples usuarios empresa</li><li>&#10003; Acceso base de datos CVs</li><li>&#10003; Account manager dedicado</li></ul>
    </div>
  </div>
</section>

<hr class="divider">

<section id="proyecciones">
  <div class="section-title">07 &middot; Proyecciones de Ingresos</div>
  <div class="section-sub">Escenarios conservador, base y optimista &mdash; 3 a&ntilde;os</div>
  <div class="card">
    <table class="rev-table"><thead><tr><th>M&eacute;trica</th><th>A&ntilde;o 1 (Conservador)</th><th>A&ntilde;o 2 (Base)</th><th>A&ntilde;o 3 (Optimista)</th></tr></thead>
    <tbody>
      <tr><td>Empresas Plan Gratis</td><td>150</td><td>800</td><td>3,500</td></tr>
      <tr><td>Empresas PyME Pro ($99K COP)</td><td>30</td><td>200</td><td>900</td></tr>
      <tr><td>Empresas Enterprise ($399K COP)</td><td>2</td><td>15</td><td>80</td></tr>
      <tr><td>Candidatos registrados</td><td>2,000</td><td>15,000</td><td>80,000</td></tr>
      <tr class="total-row"><td>MRR (fin de a&ntilde;o)</td><td class="green">$3.77M COP</td><td class="green">$25.8M COP</td><td class="green">$121M COP</td></tr>
      <tr class="total-row"><td>ARR (ingresos anuales)</td><td class="green">$45M COP / ~$10.7K USD</td><td class="green">$310M COP / ~$74K USD</td><td class="green">$1.45B COP / ~$345K USD</td></tr>
      <tr><td>Costo total operaci&oacute;n/a&ntilde;o</td><td>$4M COP</td><td>$20M COP</td><td>$85M COP</td></tr>
      <tr class="total-row"><td>Margen operativo</td><td>&mdash;</td><td class="green">93.5%</td><td class="green">94.1%</td></tr>
    </tbody></table>
  </div>
  <div class="alert alert-green" style="margin-top:16px"><strong>El margen es excepcional:</strong> TalentoYA es 100% software. Cada empresa adicional que paga cuesta ~$0.50 USD/mes en infraestructura y IA. El margen bruto supera el 90%.</div>
</section>

<hr class="divider">

<section id="costos">
  <div class="section-title">08 &middot; Estructura de Costos Operativos</div>
  <div class="section-sub">&iquest;Cu&aacute;nto cuesta operar TalentoYA por mes?</div>
  <div class="card">
    <div style="font-weight:700;margin-bottom:16px">Costo total mensual por etapa de crecimiento</div>
    <table><thead><tr><th>Etapa</th><th>Empresas</th><th>Firebase</th><th>Claude AI</th><th>Vercel</th><th style="color:#4ADE80">TOTAL/MES</th></tr></thead>
    <tbody>
      <tr><td><span class="tag-chip chip-green">Beta</span></td><td>0&ndash;50</td><td>$0</td><td>$1</td><td>$0</td><td style="font-weight:700;color:var(--green)">~$1 USD</td></tr>
      <tr><td><span class="tag-chip chip-orange">Early</span></td><td>50&ndash;200</td><td>$8</td><td>$6</td><td>$0</td><td style="font-weight:700;color:var(--green)">~$19 USD</td></tr>
      <tr><td><span class="tag-chip chip-navy">Growth</span></td><td>200&ndash;500</td><td>$35</td><td>$22</td><td>$20</td><td style="font-weight:700;color:var(--green)">~$92 USD</td></tr>
      <tr><td><span class="tag-chip chip-purple">Scale</span></td><td>500&ndash;2000</td><td>$120</td><td>$85</td><td>$40</td><td style="font-weight:700;color:var(--green)">~$295 USD</td></tr>
    </tbody></table>
    <div style="margin-top:12px;padding:12px;background:var(--light);border-radius:8px;font-size:13px">
      Con 2,000 empresas pagando $24 USD/mes = $48,000 USD MRR y costos de solo $295 USD/mes = <strong style="color:var(--green)">99.4% de margen bruto</strong>.
    </div>
  </div>
</section>

<hr class="divider">

<section id="veredicto">
  <div class="section-title">&#9733; Veredicto Final</div>
  <div class="section-sub">&iquest;Est&aacute;n en el mercado correcto?</div>
  <div class="verdict">
    <div class="verdict-icon">&#9989;</div>
    <h2>S&iacute;. El mercado es real,<br>grande y desatendido.</h2>
    <p>TalentoYA est&aacute; en la intersecci&oacute;n correcta de tres tendencias poderosas: la digitalizaci&oacute;n de las PyMEs colombianas, el auge de la IA en reclutamiento y un mercado laboral con 55% de informalidad que necesita soluciones accesibles.</p>
    <div class="verdict-grid">
      <div class="verdict-item"><div class="vi-icon">&#128230;</div><div class="vi-lbl">Tama&ntilde;o mercado</div><div class="vi-val">$125M USD</div></div>
      <div class="verdict-item"><div class="vi-icon">&#127919;</div><div class="vi-lbl">Competencia directa</div><div class="vi-val">Casi cero</div></div>
      <div class="verdict-item"><div class="vi-icon">&#128176;</div><div class="vi-lbl">Margen bruto</div><div class="vi-val">&gt;90%</div></div>
      <div class="verdict-item"><div class="vi-icon">&#128200;</div><div class="vi-lbl">CAGR HR Tech LATAM</div><div class="vi-val">+6.27%</div></div>
      <div class="verdict-item"><div class="vi-icon">&#9889;</div><div class="vi-lbl">CAGR IA en reclut.</div><div class="vi-val">+24.8%</div></div>
      <div class="verdict-item"><div class="vi-icon">&#127942;</div><div class="vi-lbl">Posici&oacute;n competitiva</div><div class="vi-val">First mover</div></div>
    </div>
  </div>
  <div style="height:24px"></div>
  <div class="grid-3">
    <div class="alert alert-green"><strong>&#9989; Hacer YA</strong><br>Activar monetizaci&oacute;n. Con $99K COP/mes, 100 clientes = $9.9M COP/mes ($2,357 USD) &mdash; punto de equilibrio superado.</div>
    <div class="alert alert-orange"><strong>&#9889; Priorizar</strong><br>Crecer la base de candidatos PRIMERO (efecto red). Sin candidatos no hay valor para empresas. Invertir en SEO / WhatsApp marketing.</div>
    <div class="alert alert-navy"><strong>&#128301; Visi&oacute;n 3 a&ntilde;os</strong><br>Con 2,000 empresas Pro: $48K USD MRR. La salida vale 5-10x ARR = $2.4M &ndash; $5.8M USD.</div>
  </div>
</section>

<div class="sources" style="max-width:1200px;margin:0 auto;padding:0 24px 48px">
  <strong>Fuentes:</strong> DANE &mdash; Mercado Laboral Colombia 2025 &middot; Confec&aacute;maras / RUES 2025 &middot; IMARC Group HR Tech LATAM &middot; DemandSage AI Recruitment Statistics 2026 &middot; Computrabajo Empresas Planes &middot; Torre.ai Wefunder &middot; Tracxn Torre 2026 &middot; Supersociedades PyMEs Colombia
</div>

</div>
</div>

<script>
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector('.sidebar a[href="#' + e.target.id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => obs.observe(s));
  navLinks.forEach(l => {
    l.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(l.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
</script>
</body>
</html>`;

export default STUDY_HTML;
