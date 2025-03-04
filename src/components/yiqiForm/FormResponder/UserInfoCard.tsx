import { motion } from 'framer-motion'
import React from 'react'
import { UserProps } from './Publish'
import Image from 'next/image'

export const UserInfoCard = React.memo(
  ({ user }: { user: UserProps | null }) => {
    if (!user) return null

    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      }
    }
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-lg bg-[rgba(0,0,0,1)]  dark:bg-[hsla(0,0%,4%,1)]  p-6 mt-4 w-full max-w-2xl mx-auto border border-slate-200 dark:border-[#333]"
      >
        <div className="flex items-center space-x-4">
          {user.picture && (
            <Image
              src={user.picture}
              alt={user.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {user.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-muted-foreground ">
              {user.email}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }
)

UserInfoCard.displayName = 'UserInfoCard'
