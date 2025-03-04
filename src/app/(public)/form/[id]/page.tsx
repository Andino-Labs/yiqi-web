import FormNotFound from '@/components/yiqiForm/FormResponder/FormNotFound'
import Publish from '@/components/yiqiForm/FormResponder/Publish'
import { getUser } from '@/lib/auth/lucia'
import { getFormById } from '@/services/actions/typeForm/typeFormActions'
import React from 'react'
type Props = {
  params: { id: string }
}
async function page({ params }: Props) {
  const user = await getUser()
  const formResponse = await getFormById(params.id)

  if (!formResponse.success || !formResponse.form) {
    return <FormNotFound />
  }

  return <Publish form={formResponse.form} user={user} />
}

export default page
