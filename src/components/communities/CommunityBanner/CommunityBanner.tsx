import Image from 'next/image'
import { MapPin, Users } from 'lucide-react'
import {
  BiFacebookIcon,
  BiInstagramIcon,
  BiLinkedinIcon,
  BiTiktokIcon,
  BiWebsiteIcon
} from '@/assets/icons'
import { PublicCommunityType } from '@/schemas/communitySchema'
import { OrganizationUserType } from '@/schemas/organizerSchema'
import { UserType } from '@/schemas/userSchema'
import { translations } from '@/lib/translations/translations'

interface CommunityBannerProps {
  organization: PublicCommunityType
  organizers: OrganizationUserType[]
  members: UserType[]
}

export default function CommunityBanner({
  organization,
  organizers,
  members
}: CommunityBannerProps) {
  const allOrganizers = organizers.map(organizer => organizer.user)
  const firstOrganizer = allOrganizers[0]?.name || 'Unknown Organizer'
  const remainingOrganizersCount = allOrganizers.length - 1
  const membersLength = members.length

  return (
    <div className="mb-8 bg-[#111827] rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-[#B7202E] relative h-[200px] md:h-auto rounded-lg overflow-hidden">
          {organization.logo && (
            <Image
              src={organization.logo}
              alt={
                organization.name ||
                translations.es.communityDetails.banner.organizationLogo ||
                translations.es.communityDetails.banner.organizationLogo
              }
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-between items-center md:items-start">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white">
              {organization.name || 'Unnamed Organization'}
            </h2>

            <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
              <MapPin className="h-5 w-5" />
              <p>Lima, Peru</p>
            </div>

            <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
              <Users className="h-5 w-5" />
              <span>
                {membersLength}{' '}
                {translations.es.communityDetails.banner.members}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
              <Users className="h-5 w-5" />
              <span>
                {translations.es.communityDetails.banner.organizedBy}{' '}
                <span className="font-semibold text-white">
                  {firstOrganizer}
                </span>
                {remainingOrganizersCount > 0 && (
                  <span>
                    {' '}
                    {translations.es.banner.communityDetails.and}{' '}
                    {remainingOrganizersCount} {translations.es.banner.other}
                    {remainingOrganizersCount > 1 ? 's' : ''}
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {organization.facebook && (
                <SocialIcon
                  href={organization.facebook}
                  label="Facebook"
                  hoverColor="bg-blue-600"
                  icon={<BiFacebookIcon className="w-4 h-4" />}
                />
              )}
              {organization.instagram && (
                <SocialIcon
                  href={organization.instagram}
                  label="Instagram"
                  hoverColor="bg-pink-900"
                  icon={<BiInstagramIcon className="w-4 h-4" />}
                />
              )}
              {organization.tiktok && (
                <SocialIcon
                  href={organization.tiktok}
                  label="TikTok"
                  hoverColor="bg-black"
                  icon={<BiTiktokIcon className="w-4 h-4" />}
                />
              )}
              {organization.linkedin && (
                <SocialIcon
                  href={organization.linkedin}
                  label="LinkedIn"
                  hoverColor="bg-blue-600"
                  icon={<BiLinkedinIcon className="w-4 h-4" />}
                />
              )}
              {organization.website && (
                <SocialIcon
                  href={organization.website}
                  label="Website"
                  hoverColor="bg-green-600"
                  icon={<BiWebsiteIcon className="w-4 h-4" />}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SocialIconProps {
  href: string
  label: string
  hoverColor: string
  icon: React.ReactNode
}

const SocialIcon = ({ href, label, hoverColor, icon }: SocialIconProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`text-gray-400 rounded-full p-2 transition-all duration-300 border border-gray-600 bg-gray-800 hover:${hoverColor} hover:text-white`}
  >
    {icon}
  </a>
)
