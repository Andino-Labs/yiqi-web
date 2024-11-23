//import { EventPage } from '@/components/lumalike/template1'
// import { DragDropZone } from '@/components/upload/upload'
/*const event = {
  title: 'Tech Grill',
  subtitle: 'El Gran Cierre de Lima Tech Week 2024',
  date: 'sabado, November 9',
  startTime: '12:30 PM',
  endTime: '8:30 PM',
  location: 'Miraflores',
  city: 'Provincia de Lima',
  description: `# SaborTech: El Gran Cierre de Lima Tech Week 2024

¡Prepárate para el evento que cierra con broche de oro la semana más importante del ecosistema tech y emprendedor en Lima! SaborTech es el punto de encuentro ideal entre el ecosistema de startups tecnológicas y el mundo empresarial, reuniendo a fundadores de startups, inversores, líderes corporativos y visionarios del sector privado en una jornada que combina innovación, networking y gastronomía.

## ¿Por qué SaborTech?

Lima es famosa por su pasión por la buena comida, y en SaborTech llevamos esta esencia a nuestro evento. Aquí, la gastronomía se convierte en el catalizador para generar conexiones auténticas y significativas entre emprendedores, empresarios e innovadores.`,
  backgroundColor: '#1a2847',
  heroImage: '/event-image.jpg',
  hosts: [
    {
      name: 'AndinoLabs',
      image: '/host1.jpg',
      instagramUrl: 'https://instagram.com/reevalua'
    },
    {
      name: 'OpenAi',
      image: '/host2.jpg',
      instagramUrl: 'https://instagram.com/preauth'
    }
  ],
  featuredIn: {
    name: 'Lima Tech Week 2024',
    url: '/lima-tech-week'
  }
}*/
export default async function Page({
  params
}: {
  params: { eventSlug: string }
}) {
  console.log(params.eventSlug)
  return (
    <>
      <div>Eventos</div>
    </>
  )
}
