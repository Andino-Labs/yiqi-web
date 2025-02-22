// the prompt is used to find the most important things a user should know about his match
export function generateKeyInsightsPrompt(
  userDetailedProfile: string,
  matchUserDetailedProfile: string
) {
  return `Analiza estos perfiles y destaca los factores clave de conexión profesional. Enfócate en:
    - Habilidades complementarias que resuelven necesidades inmediatas
    - Proyectos actuales/recientes donde podrían colaborar
    - Conexiones estratégicas relevantes para sus objetivos actuales

    Formato:
    Core Synergy: [Título de 5 palabras que capture la esencia]
    Top Match Drivers:
    • [Habilidad/Experiencia específica del match] → [Cómo resuelve necesidad del usuario]
    • [Recurso único del match] → [Aplicación práctica en proyectos del usuario]
    • [Conexión estratégica] → [Potencial impacto en objetivos actuales]

    Mi Perfil: ${userDetailedProfile}
    Perfil del Match: ${matchUserDetailedProfile}

    Mantén un tono directo y orientado a la acción, máximo 150 palabras. Evita listas numeradas.`
}

// the prompt is used to find out what opportunities of collaboration exist between the user and his match
export function generateCollaborationPrompt(
  userDetailedProfile: string,
  matchUserDetailedProfile: string
) {
  return `Identifica oportunidades concretas de colaboración inmediata basadas en:
    - Proyectos activos mencionados en ambos perfiles
    - Habilidades técnicas complementarias
    - Recursos/contactos estratégicos compartidos

    Estructura:
    Opportunity Spotlight: [Título de 3-5 palabras]
    • Specific Fit: [Habilidad/recurso del match que cubre necesidad específica del usuario]
    • Immediate Value: [Resultado tangible en los próximos 3-6 meses]
    • Strategic Edge: [Ventaja competitiva que esta colaboración crea]

    Next-Step Collaboration:
    - [Acción específica con entregable claro]
    - [Formato ideal de primera interacción]
    - [Métrica de éxito inicial]

    Mi Perfil: ${userDetailedProfile}
    Perfil del Match: ${matchUserDetailedProfile}

    Enfócate en resultados accionables, máximo 120 palabras. Sin marcadores numéricos.`
}

// the prompt is used to generate a search query to find professionals that match the user's profile and the event description
export function generateEmbeddingPrompt(
  eventDescription: string,
  userDetailedProfile: string
) {
  return `Crea una cadena de búsqueda combinando estos elementos:
- Mis principales habilidades: [Extraer del perfil]
- Enfoque del evento: ${eventDescription}
- Tipos de colaboración deseados: [Identificar de los objetivos profesionales]
- Palabras clave de la industria: [Extraer de la experiencia]

Combina estos en una cadena de búsqueda en lenguaje natural para encontrar profesionales con:
1. Experiencia complementaria en [Mi Industria]
2. Conocimiento en [Tecnologías Relevantes]
3. Interés en [Mis Tipos de Proyectos]

Perfil: ${userDetailedProfile}
Devuelve solo la cadena de búsqueda sin comentarios.`
}
