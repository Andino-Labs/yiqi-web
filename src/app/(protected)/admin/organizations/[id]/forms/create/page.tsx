import FormManager from '@/components/yiqiForm/FormManager'
import React from 'react'

async function page({ params }: { params: { id: string } }) {
  return (
    <section className="w-full flex flex-1">
      <FormManager orgId={params.id} formResponse={null} submissions={null} />
    </section>
  )
}

export default page
