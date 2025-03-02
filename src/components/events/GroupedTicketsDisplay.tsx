interface Ticket {
  id: string
  name: string
  price: number | null
}

interface GroupedTicketsDisplayProps {
  tickets: Ticket[]
}

export function GroupedTicketsDisplay({ tickets }: GroupedTicketsDisplayProps) {
  return (
    <>
      {Object.entries(
        tickets.reduce(
          (acc, ticket) => {
            const key = `${ticket.name}_${ticket.price ?? 0}`
            acc[key] = (acc[key] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )
      ).map(([key, count]) => {
        const [name, price] = key.split('_')
        return (
          <div key={key}>
            {count}x {name} {Number(price) ? `(S/ ${price})` : ''}
          </div>
        )
      })}
    </>
  )
}
