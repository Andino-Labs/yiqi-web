import {
  UsersIcon,
  BarChart3Icon,
  CalendarIcon,
  MessageSquareIcon,
  Settings2Icon,
  HeartHandshakeIcon
} from 'lucide-react'
 
// False data based on the prism shema
export const eventListItem = [
  {
  id: '1', // ID del evento
  title: 'Tech Conference 2023', // Título
  description: 'Únete a la mayor conferencia tecnológica del año.', // Descripción
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', // Imagen
  time: '2023-09-15T09:00:00Z', // Fecha y hora del evento
  place: 'San Francisco, CA', // Ubicación del evento
  organizer: {
    name: 'Marcial Igme', // Nombre del organizador
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Foto del organizador
  },
},
 {
    id: '2',
    title: 'Cumbre de Innovación 2024',
    description: 'Explora las últimas tendencias en innovación y tecnología.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    time: '2024-01-25T10:00:00Z',
    place: 'New York, NY',
    organizer: {
      name: 'Ana González',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
{
    id: '3',
    title: 'Feria de Startups',
    description: 'Conoce las startups emergentes más prometedoras del año.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
    time: '2024-03-05T12:30:00Z',
    place: 'Austin, TX',
    organizer: {
      name: 'Carlos Pérez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: '4',
    title: 'Foro de Inteligencia Artificial',
    description: 'Debate sobre el futuro de la IA con expertos del sector.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    time: '2024-05-12T15:00:00Z',
    place: 'Barcelona, España',
    organizer: {
      name: 'Lucía Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    },
  },
   {
  id: '5', // ID del evento
  title: 'Tech Conference 2023', // Título
  description: 'Únete a la mayor conferencia tecnológica del año.', // Descripción
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', // Imagen
  time: '2023-09-15T09:00:00Z', // Fecha y hora del evento
  place: 'San Francisco, CA', // Ubicación del evento
  organizer: {
    name: 'Marcial Igme', // Nombre del organizador
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Foto del organizador
  },
},
 {
    id: '6',
    title: 'Cumbre de Innovación 2024',
    description: 'Explora las últimas tendencias en innovación y tecnología.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    time: '2024-01-25T10:00:00Z',
    place: 'New York, NY',
    organizer: {
      name: 'Ana González',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
{
    id: '7',
    title: 'Feria de Startups',
    description: 'Conoce las startups emergentes más prometedoras del año.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
    time: '2024-03-05T12:30:00Z',
    place: 'Austin, TX',
    organizer: {
      name: 'Carlos Pérez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: '8',
    title: 'Foro de Inteligencia Artificial',
    description: 'Debate sobre el futuro de la IA con expertos del sector.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    time: '2024-05-12T15:00:00Z',
    place: 'Barcelona, España',
    organizer: {
      name: 'Lucía Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    },
  },
]
  
export const communityHighlights = [
{
  "id": "org1",
  "name": "Tech Innovators",
  "logo": "https://images.unsplash.com/photo-1542744095-291d1f67b221", 
  "description": "A community of tech enthusiasts driving innovation.",
  "link": "/communities/org1"
},
{
  "id": "org2",
  "name": "Health and Wellness",
  "logo": "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
  "description": "Join us to promote a healthy lifestyle and well-being.",
  "link": "/communities/org2"
},
{
  "id": "org3",
  "name": "Green Earth Advocates",
  "logo": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
  "description": "Environmental activists working to make a greener planet.",
  "link": "/communities/org3"
},
{
  "id": "org4",
  "name": "Art & Culture Society",
  "logo": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38",
  "description": "Where art, music, and culture enthusiasts meet.",
  "link": "/communities/org4"
}

]

const eventDetails = {
  id: '1', // ID del evento
  title: 'Tech Conference 2023', // Título
  description: 'Explora las últimas tendencias tecnológicas...', // Descripción extendida
  startDate: '2023-09-15T09:00:00Z', // Fecha y hora de inicio
  endDate: '2023-09-15T18:00:00Z', // Fecha y hora de fin
  location: 'San Francisco, CA', // Ubicación física
  virtualLink: 'https://zoom.us/j/123456789', // Enlace virtual (si aplica)
  maxAttendees: 500, // Máximo de asistentes permitidos
  requiresApproval: false, // Si requiere aprobación para asistir

  organizer: {
    name: 'Marcial Igme', // Nombre del organizador
    avatar: 'https://example.com/john-doe.jpg', // Imagen del organizador
    role: 'ADMIN', // Rol del organizador
  },

  customFields: {
    field1: 'Información adicional 1',
    field2: 'Información adicional 2',
  }, // Campos personalizados

  queueJobs: [], // Trabajos en cola relacionados (si aplica)

  notifications: [
    { id: 'n1', message: 'Evento confirmado', type: 'email', sentAt: '2023-09-10T10:00:00Z' },
  ], // Notificaciones relacionadas

  forms: [
    {
      id: 'f1',
      title: 'Encuesta de Satisfacción',
      submissionCount: 20,
    },
  ], // Formularios asociados

  media: [
    {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    },
    {
      type: 'PDF',
      url: 'https://example.com/schedule.pdf',
    },
  ], // Medios generados relacionados

  registrations: [
    {
      userId: 'u1',
      status: 'PENDING',
      paid: true,
    },
  ], // Registro de asistentes

  bots: [
    {
      model: 'GPT-4',
      instructions: 'Responder preguntas sobre el evento.',
    },
  ], // Bots asociados al evento

  createdAt: '2023-09-01T12:00:00Z', // Fecha de creación
  updatedAt: '2023-09-10T15:30:00Z', // Última actualización
};

export const communityDetail ={
  "id": "org1",
  "name": "Tech Innovators",
  "logo": "https://images.unsplash.com/photo-1542744095-291d1f67b221",
  "description": "A community of tech enthusiasts driving innovation.",
  "colour": "#4CAF50",
  "events": [
    {
      "id": "event1",
      "title": "Tech Expo 2024",
      "startDate": "2024-11-05T10:00:00Z",
      "endDate": "2024-11-06T18:00:00Z",
      "location": "San Francisco, CA",
      "virtualLink": "https://tech-expo-2024.com",
      "maxAttendees": 500
    },
    {
      "id": "event2",
      "title": "AI Conference",
      "startDate": "2024-12-12T09:00:00Z",
      "endDate": "2024-12-14T17:00:00Z",
      "location": "New York, NY",
      "virtualLink": "https://ai-conference.com",
      "maxAttendees": 300
    }
  ],
  "organizers": [
    {
      "name": "John Doe",
      "role": "ADMIN",
      "avatar": "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      "name": "Jane Smith",
      "role": "VIEWER",
      "avatar": "https://randomuser.me/api/portraits/women/60.jpg"
    }
  ],
  "createdAt": "2022-04-15T10:00:00Z",
  "updatedAt": "2024-09-12T10:00:00Z",
  "queueJobs": [
    {
      "id": "queue1",
      "description": "Process event registrations"
    }
  ],
  "customFields": {
    "focus": "Innovation in AI and Robotics",
    "partnerships": "Collaborating with major tech companies"
  }
}


export const features = [
  {
    title: 'Community Management',
    description:
      'Efficiently manage your community members, roles, and permissions with our intuitive tools.',
    icon: UsersIcon
  },
  {
    title: 'Analytics & Insights',
    description:
      "Make data-driven decisions with comprehensive analytics about your community's engagement.",
    icon: BarChart3Icon
  },
  {
    title: 'Event Organization',
    description:
      'Plan, schedule, and manage community events seamlessly with integrated calendar features.',
    icon: CalendarIcon
  },
  {
    title: 'Discussion Forums',
    description:
      'Foster meaningful conversations with customizable discussion spaces and moderation tools.',
    icon: MessageSquareIcon
  },
  {
    title: 'Customization',
    description:
      "Tailor the platform to match your community's unique needs and branding requirements.",
    icon: Settings2Icon
  },
  {
    title: 'Community Engagement',
    description:
      'Build stronger connections with tools designed to increase member participation and interaction.',
    icon: HeartHandshakeIcon
  }
]