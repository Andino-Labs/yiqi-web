import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NetworkingMatchesType } from '@/schemas/networkingMatchSchema'

interface UsersMatchsModelProps {
  isOpen: boolean
  onClose: () => void
  matches: NetworkingMatchesType
}

export function UsersMatchsModel({
  isOpen,
  onClose,
  matches
}: UsersMatchsModelProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 p-4 pt-10 w-full h-full rounded-none md:rounded-md  mx-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-2xl md:text-3xl">
            Networking Matches
          </DialogTitle>
          <p className="text-center text-zinc-400 text-sm mt-2">
            Here are the people you’ve matched with! Connect and collaborate to
            build meaningful relationships.
          </p>
        </DialogHeader>

        <div className="flex flex-col p-4 space-y-6">
          {matches.map(match => (
            <div
              key={match.id}
              className="group bg-zinc-800/60 border border-zinc-700/50 shadow-md rounded-lg p-6 space-y-4"
            >
              {/* Person Details */}
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 rounded-full ring-2 ring-zinc-500">
                  <AvatarImage
                    src={match.user.picture || '/default-avatar.png'}
                  />
                  <AvatarFallback>{match.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <h4 className="text-white font-semibold text-lg">
                  {match.user.name}
                </h4>
              </div>

              {/* Why should we meet */}
              <div className="space-y-2">
                <h5 className="text-zinc-400 font-semibold">
                  Why should we meet?
                </h5>
                <p className="text-zinc-300 px-3">{match.matchReason}</p>
              </div>

              {/* Person Description */}
              <div className="space-y-2">
                <h5 className="text-zinc-400 font-semibold">About</h5>
                <p className="text-zinc-300">{match.personDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
