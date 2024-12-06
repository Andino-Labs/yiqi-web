'use client'

import Image from 'next/image'
import {
  Mail,
  Phone,
  Briefcase,
  Building,
  Twitter,
  Globe,
  User
} from 'lucide-react'
import { ProfileWithPrivacy } from '@/schemas/userSchema'
import { translations } from '@/lib/translations/translations'
import { BiInstagramIcon, BiLinkedinIcon } from '@/assets/icons'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'

interface UserProfilePageProps {
  user: ProfileWithPrivacy
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
  const hasLinks =
    (user.website || user.linkedin || user.x || user.instagram) &&
    (user.privacySettings.website ||
      user.privacySettings.linkedin ||
      user.privacySettings.x ||
      user.privacySettings.x)

  return (
    <Card className="min-h-screen bg-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans mt-5">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0A0A0A] rounded-lg shadow-xl overflow-hidden border border-[#1A1A1A]">
          <div className="h-32 bg-gradient-to-r from-gray-700 to-black opacity-90"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center">
              {user.picture && (
                <Image
                  src={user.picture}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="absolute -top-16 ring-4 ring-black rounded-full"
                />
              )}
              <div className="mt-16 sm:mt-0 sm:ml-32 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {user.name}
                </h1>
                <p className="mt-1 text-xl text-muted-foreground">
                  {user.position || 'Sin posición'}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  {user.company || 'Sin empresa'}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.privacySettings.email && user.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.privacySettings.phoneNumber && user.phoneNumber && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{user.position || 'Sin posición'}</span>
              </div>
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{user.company || 'Sin empresa'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-[#1A1A1A]">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <User className="w-6 h-6 mr-2 text-muted-foreground" />
            {translations.es.aboutMe}
          </h2>
          <Separator />
          <div className="pt-5">
            <p className="text-gray-400 leading-relaxed">
              {user.shortDescription || translations.es.notDescriptionAvailable}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-[#1A1A1A]">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            {translations.es.links}
          </h2>
          <Separator />
          <div className="pt-5">
            {!hasLinks ? (
              <p className="text-gray-400">{translations.es.availableLinks}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.privacySettings.website && user.website ? (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:underline"
                  >
                    <Globe className="w-5 h-5 mr-2 text-muted-foreground" />
                    {translations.es.website}
                  </a>
                ) : null}
                {user.privacySettings.linkedin && user.linkedin ? (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:underline"
                  >
                    <BiLinkedinIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                    {translations.es.linkedin}
                  </a>
                ) : null}
                {user.privacySettings.x && user.x ? (
                  <a
                    href={user.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:underline"
                  >
                    <Twitter className="w-5 h-5 mr-2 text-muted-foreground" />
                    {translations.es.x}
                  </a>
                ) : null}
                {user.instagram ? (
                  <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:underline"
                  >
                    <BiInstagramIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                    {translations.es.instagram}
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
