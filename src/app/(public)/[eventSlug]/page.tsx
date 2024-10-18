export default async function Page({
  params
}: {
  params: { eventSlug: string }
}) {
  return <div>evento: {params.eventSlug}</div>
}
