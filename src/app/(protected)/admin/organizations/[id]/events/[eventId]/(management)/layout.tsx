export default async function Layout({
  params,
  children
}: {
  children: React.ReactNode
  params: { id: string; eventId: string }
}) {
  console.log('params', params)
  return (
    <div>
      <div className="text-3xl">asdasd de la vida misma</div>
      {children}
    </div>
  )
}
