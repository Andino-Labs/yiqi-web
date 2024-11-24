'use client'

import { Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { UserType } from '@/schemas/userSchema'
import { OrganizationUserType } from '@/schemas/organizerSchema'
import { translations } from '@/lib/translations/translations'

interface CommunityMembersProps {
  members: UserType[]
  organizers: OrganizationUserType[]
}

export default function CommunityMembers({
  members,
  organizers
}: CommunityMembersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState(
    translations.es.communityDetails.members.allMembers
  )
  const allOrganizers = useMemo(
    () => organizers.map(organizer => organizer.user),
    [organizers]
  )

  const sections = useMemo(
    () => [
      {
        name: translations.es.communityDetails.members.allMembers,
        count: members.length
      },
      {
        name: translations.es.communityDetails.members.organizers,
        count: organizers.length
      }
    ],
    [members.length, organizers.length]
  )

  const currentMembers = useMemo(() => {
    return selectedSection ===
      translations.es.communityDetails.members.allMembers
      ? members
      : allOrganizers
  }, [selectedSection, members, allOrganizers])

  const filteredMembers = useMemo(() => {
    return currentMembers.filter(member =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentMembers, searchQuery])

  return (
    <div className="flex flex-col gap-4 bg-[#111827] rounded-lg sm:flex-row sm:gap-8">
      <div className="w-full sm:w-64">
        <nav className="space-y-1">
          {sections.map(section => (
            <button
              key={section.name}
              onClick={() => setSelectedSection(section.name)}
              className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md ${
                selectedSection === section.name
                  ? 'bg-[#00C9A7] bg-opacity-10 text-[#00C9A7]'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <span>{section.name}</span>
              <span
                className={
                  selectedSection === section.name
                    ? 'text-[#00C9A7]'
                    : 'text-gray-500'
                }
              >
                {section.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {selectedSection} (
              {sections.find(s => s.name === selectedSection)?.count})
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search members"
              className="pl-10 bg-[#1F2937] border-[#374151] text-gray-300 placeholder:text-gray-400"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-12 w-12">
                  {member.picture ? (
                    <Image
                      src={member.picture}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-gray-400">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#00C9A7] truncate max-w-full">
                    {member.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
