'use client'
import { useCallback, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { TriangleAlert } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { deleteUserAccount } from '@/services/actions/userActions'
import { translations } from '@/lib/translations/translations'

export default function DeleteAccountDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await deleteUserAccount()
      if (result.success) {
        toast({
          title: translations.es.accountDeleted,
          description: translations.es.accountDeletedDescription
        })
        router.push('/auth')
      } else {
        toast({
          title: translations.es.error,
          description: result.error ?? translations.es.errorDeleting,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: translations.es.error,
        description: translations.es.somethingWentWrong,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center space-x-2">
          <TriangleAlert className="h-4 w-4" />
          <span>{translations.es.deleteAccount}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.es.areYouSure}</AlertDialogTitle>
          <AlertDialogDescription>
            {translations.es.actionCannotBeUndone}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.es.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading
              ? translations.es.deleting
              : translations.es.deleteAccountConfirmation}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
