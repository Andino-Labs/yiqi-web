import { UserDataCollected } from '@/schemas/userSchema'
import { ProfileWithPrivacy } from '@/schemas/userSchema'

export type NetworkingData = Pick<
  UserDataCollected,
  | 'professionalMotivations'
  | 'communicationStyle'
  | 'professionalValues'
  | 'careerAspirations'
  | 'significantChallenge'
  | 'resumeUrl'
  | 'resumeText'
  | 'resumeLastUpdated'
  | 'resumeFileName'
>

export type Props = {
  initialData: NetworkingData
  user: ProfileWithPrivacy
}
