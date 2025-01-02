import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { ProfileWithPrivacy } from '@/schemas/userSchema'
import { useTranslations } from 'next-intl'

interface HostsProps {
  hosts: ProfileWithPrivacy[] | null
}

export function Hosts({ hosts }: HostsProps) {
  const t = useTranslations('RegistrationComponent')
  if (!hosts || !hosts[0]?.name) {
    return <div></div>
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-2xl font-semibold text-primary-foreground">
        {t('eventHostedBy')}
      </h2>
      <div className="grid gap-4">
        {hosts.map((host, index) => (
          <motion.div
            key={host.name}
            className="flex items-center gap-4 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src={host.picture || undefined} alt={host.name} />
              <AvatarFallback>{host.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-lg text-primary-foreground">
                {host.name}
              </div>
              {host.instagram && (
                <Link
                  href={host.instagram}
                  className="text-sm text-primary-foreground/80 hover:text-primary transition-colors flex items-center gap-1 mt-1"
                >
                  <Instagram className="h-4 w-4" />
                  {t('eventHostInstagram')}
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
