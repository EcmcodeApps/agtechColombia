# Esquema de Datos Relevantes del Candidato — TalentoYA

## Campos del perfil y su interpretación

### Identificación
- `nombre`: nombre completo del candidato.
- `titulo`: título profesional o cargo objetivo (ej. "Auxiliar contable", "Ingeniero de sistemas").
- `ciudad`: ciudad de residencia (relevante para vacantes presenciales).

### Resumen
- `resumen`: texto libre, máx ~400 chars. Puede revelar motivación, especialización y tono profesional.
  Si está vacío: señalar en el análisis que el perfil está incompleto.

### Habilidades (`habilidades[]`)
- Cada ítem: `{ nombre: string, nivel: 0-100 }`.
- Nivel: 0-30 básico, 31-60 intermedio, 61-85 avanzado, 86-100 experto.
- Buscar coincidencias literales Y semánticas con la vacante.

### Experiencia laboral (`experiencia[]`)
- Cada ítem: `{ empresa, cargo, desde (YYYY-MM), hasta (YYYY-MM), actual: bool, descripcion? }`.
- Calcular años: (hasta - desde) o (hoy - desde si actual).
- Si `descripcion` está presente, úsala para detectar responsabilidades y logros.
- Vacíos en el historial: preguntar en entrevista, no penalizar automáticamente.

### Educación (`educacion[]`)
- Cada ítem: `{ titulo, institucion, desde, hasta }`.
- Niveles en Colombia: Bachiller → Técnico → Tecnólogo → Profesional → Especialización → Maestría → Doctorado.
- Instituciones reconocidas: SENA (técnico/tecnólogo), universidades públicas (UN, U. Antioquia, U. Valle) y privadas.

### Certificaciones (`certificaciones[]`)
- Cada ítem: `{ nombre, institucion, año }`.
- Valorar: certificaciones SENA, Google, Microsoft, Scrum, ICONTEC, BPO, etc.
- Certificaciones >5 años: menor peso salvo que sean atemporales (ej. título universitario).

### Idiomas (`idiomas[]`)
- Cada ítem: `{ idioma, nivel: "basico"|"intermedio"|"avanzado"|"nativo" }`.
- Inglés relevante principalmente para multinacionales, exportación, tecnología, turismo.

### Condiciones laborales
- `salarioEsperado`: monto en COP. Si es 0 o null: candidato flexible o no lo ha indicado.
- `disponibilidad`: "inmediata" | "15_dias" | "30_dias" | "mas_de_30".
- `modalidadPreferida`: "presencial" | "remoto" | "hibrido" | "indiferente".

## Señales de perfil incompleto (mencionar en análisis)
- Sin experiencia registrada: puede ser candidato junior/sin experiencia.
- Sin habilidades: el match de skills no puede calcularse correctamente.
- Sin resumen: perfil menos competitivo en plataforma.
- Sin educación: no es disqualificador per se, pero es información que falta.

## Protección de datos
- No revelar email, teléfono ni documentos de identidad en el análisis.
- No inferir datos sensibles (edad, estado civil, orientación, etc.) de la información disponible.
