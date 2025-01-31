import { NetworkingMatchesType } from '@/schemas/networkingMatchSchema'
import { UsersMatchsModal } from './UsersMatchsModal'
import { Button } from '@/components/ui/button'
import { Loader, Waypoints } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getNetworkingMatches } from '@/services/actions/networking/getNetworkingMatches'
import { useTranslations } from 'next-intl'

const NetworkingUsersList = ({
  isModalVisible,
  setIsModalVisible,
  registrationId
}: {
  setIsModalVisible: (isOpen: boolean) => void
  isModalVisible: boolean
  registrationId: string
}) => {
  const [matches, setMatches] = useState<NetworkingMatchesType>([])

  useEffect(() => {
    const fetchNetworkingMatches = async () => {
      const response = await getNetworkingMatches(registrationId)
      setMatches(response)
    }

    fetchNetworkingMatches()
  }, [registrationId])

  const isStillLoadingMatches = matches.length === 0
  const t = useTranslations('NetworkingUserList')
  return (
    <div className="mt-4">
      {/* Title and Collapsible Trigger */}
      <div className="mt-2">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <div className="flex flex-col gap-2 overflow-hidden">
            <h3 className="text-md font-semibold text-white">{t('title')}</h3>
            <p className="text-sm text-zinc-400">
              {isStillLoadingMatches
                ? t('loadingMatches')
                : t('foundText', { nbr: matches.length })}
            </p>
          </div>

          <Button
            onClick={() => setIsModalVisible(true)}
            variant="outline"
            disabled={isStillLoadingMatches}
            className="flex items-center gap-2 bg-white/5 border-zinc-700 hover:bg-white/10 text-white hover:text-white"
          >
            {isStillLoadingMatches ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {t('buttonLoading')}
              </>
            ) : (
              <>
                <Waypoints className="w-4 h-4" />
                {t('buttonText')}
              </>
            )}
          </Button>
        </div>
      </div>

      <UsersMatchsModal
        matches={matches}
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default NetworkingUsersList
