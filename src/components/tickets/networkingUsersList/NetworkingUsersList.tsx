import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NetworkingMatchesType } from '@/schemas/networkingMatchSchema'
import { UsersMatchsModel } from './UsersMatchsModel'
import { Button } from '@/components/ui/button'
import { Waypoints } from 'lucide-react'

const NetworkingUsersList = ({
  matches,
  isModalVisible,
  setIsModalVisible
}: {
  matches: NetworkingMatchesType
  setIsModalVisible: (isOpen: boolean) => void
  isModalVisible: boolean
}) => {
  return (
    <>
      <div className="mt-4">
        {/* Title and Collapsible Trigger */}
        <div className="mt-2">
          {/* Avatar Group for Collapsible Trigger */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              {/* Avatar Group for first 3 users */}
              <div className="flex -space-x-4 overflow-hidden rounded-lg">
                {matches.slice(0, 3).map(match => (
                  <Avatar
                    key={match.id}
                    className="h-10 w-10 rounded-full border-2 border-white"
                  >
                    <AvatarImage
                      src={match.user.picture || '/default-avatar.png'}
                    />
                    <AvatarFallback>{match.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {matches.length > 3 && (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-800 text-sm font-medium z-10">
                    +{matches.length}
                  </span>
                )}
              </div>
              <h3 className="text-md font-semibold text-white">
                Networking Matches
              </h3>
            </div>
            <Button
              onClick={() => setIsModalVisible(true)}
              variant="outline"
              className="flex items-center gap-2 bg-white/5 border-zinc-700 hover:bg-white/10 text-white hover:text-white"
            >
              <Waypoints className="w-4 h-4" />
              View Recommendations
            </Button>
          </div>
        </div>
      </div>
      <UsersMatchsModel
        matches={matches}
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  )
}

export default NetworkingUsersList
