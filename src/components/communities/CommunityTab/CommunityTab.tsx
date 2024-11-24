'use client'

import { useState } from 'react'
import EventCardCommunity from '../EventCardCommunity/EventCardCommunity'
import CommunityMembers from '../CommunityMembers/CommunityMembers'
import { OrganizationUserType } from '@/schemas/organizerSchema'
import { UserType } from '@/schemas/userSchema'
import { EventCommunityType } from '@/schemas/eventSchema'
import { translations } from '@/lib/translations/translations'

interface CommunityTabsProps {
  navItems: string[]
  description: string
  events: EventCommunityType[]
  members: UserType[]
  organizers: OrganizationUserType[]
}

export default function CommunityTab({
  navItems,
  description,
  events,
  members,
  organizers
}: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    translations.es.communityDetails.navigation.about
  )
  const [showAllContent, setShowAllContent] = useState<boolean>(false)

  const lines = description.split('\n')
  const visibleContent = showAllContent ? lines : lines.slice(0, 4)

  const validEvents = events.filter(
    event => new Date(event.startDate) >= new Date()
  )
  const pastEvents = events.filter(
    event => new Date(event.startDate) < new Date()
  )

  console.log(translations.es.communityDetails.about.showLess)

  return (
    <>
      <div className="mt-2 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="bg-[#111827] rounded-lg shadow-sm">
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex space-x-8">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`${
                  activeTab === item
                    ? 'text-[#00C9A7] border-b-2 border-[#00C9A7]'
                    : 'text-gray-400 hover:text-white'
                } font-medium pb-2 transition-colors duration-200`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      </div>
      <div className="mt-2 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div
        className={`bg-[#111827] rounded-lg shadow-sm ${activeTab === translations.es.communityDetails.navigation.members ? 'w-full' : 'w-full sm:w-1/2'}`}
      >
        <div className="p-4 sm:p-6">
          {activeTab === translations.es.communityDetails.navigation.about && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                {translations.es.communityDetails.navigation.about}
              </h2>
              <div className="whitespace-pre-wrap">
                {visibleContent.map((line, index) => (
                  <p key={index} className="text-gray-400 mb-2">
                    {line}
                  </p>
                ))}
              </div>
              {lines.length > 4 && (
                <button
                  onClick={() => setShowAllContent(prev => !prev)}
                  className="mt-4 text-[#00C9A7] hover:text-[#00b396] font-medium"
                >
                  {showAllContent
                    ? translations.es.communityDetails.about.showLess
                    : translations.es.communityDetails.about.loadMore}
                </button>
              )}

              {validEvents.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {translations.es.communityDetails.events.upcomingEvents} (
                      {validEvents.length})
                    </h3>
                  </div>
                  <EventCardCommunity events={validEvents} />
                </div>
              )}

              {pastEvents.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {translations.es.communityDetails.events.pastEvents} (
                      {pastEvents.length})
                    </h3>
                  </div>
                  <EventCardCommunity events={pastEvents} />
                </div>
              )}
            </>
          )}

          {activeTab ===
            translations.es.communityDetails.navigation.members && (
            <CommunityMembers members={members} organizers={organizers} />
          )}
        </div>
      </div>
    </>
  )
}
