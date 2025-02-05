import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import {
  User,
  Calendar,
  CheckSquare,
  Radio,
  Type,
  AlignLeft,
  List,
  Mail
} from 'lucide-react'
import {
  InputTypes,
  SubmissionDataFieldType,
  submissionResponse
} from '@/schemas/yiqiFormSchema'
import { Fragment } from 'react'

function ResultForm({ submissions }: { submissions: submissionResponse }) {
  const getIcon = (fieldType: string) => {
    switch (fieldType) {
      case InputTypes.CHECKBOX:
        return <CheckSquare className="w-5 h-5 text-purple-400" />
      case InputTypes.RADIO:
        return <Radio className="w-5 h-5 text-blue-500" />
      case InputTypes.TEXTAREA:
        return <AlignLeft className="w-5 h-5 text-yellow-400" />
      case InputTypes.TEXT:
        return <Type className="w-5 h-5 text-green-400" />
      case InputTypes.SELECT:
        return <List className="w-5 h-5 text-teal-400" />
      default:
        return <Type className="w-5 h-5 text-green-400" />
    }
  }

  const renderFieldValue = (field: SubmissionDataFieldType) => {
    if (!field.value) return null

    if (Array.isArray(field.value)) {
      return (
        <div className="grid grid-cols-3 gap-2 items-center border-b last:border-b-0 py-1">
          <div className="col-span-1 font-medium text-gray-300 flex flex-row gap-1">
            {getIcon(field.inputType)}
            <div className="truncate hidden">{field.value[0]?.question}</div>
          </div>
          <div className="col-span-2 text-gray-200 truncate">
            {field.value.map(item => {
              if (item.checked) {
                return (
                  <span key={item.id} className="text-gray-300">
                    {item.text}
                  </span>
                )
              }
              return null
            })}
          </div>
        </div>
      )
    }
    if ('isEtc' in field.value) {
      return (
        <div className="grid grid-cols-3 gap-2 items-center border-b last:border-b-0 py-1">
          <div className="col-span-1 font-medium text-gray-300 flex flex-row gap-1">
            {getIcon(field.inputType)}
            <div className="truncate hidden">{field.value.question}</div>
          </div>
          <div className="col-span-2 text-gray-200 truncate">
            {field.value.text}
            {field.value.isEtc && ' (Otro)'}
          </div>
        </div>
      )
    }
    if ('text' in field.value) {
      return (
        <div className="grid grid-cols-3 gap-2 items-center border-b last:border-b-0 py-1">
          <div className="col-span-1 font-medium text-gray-300 flex flex-row gap-1">
            {getIcon(field.inputType)}
            <div className="truncate hidden">{field.value.question}</div>
          </div>
          <div className="col-span-2 text-gray-200 truncate">
            {field.value.text}
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {submissions.length} Submissions
      </h1>
      <div className="space-y-2">
        {submissions.map(submission => (
          <Card key={submission.submissionId} className="w-full">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                <div className="flex justify-between border-b pb-2">
                  <div className="flex items-center gap-2 justify-center ">
                    <User className="w-4 h-4 " />
                    <span>{submission.userName}</span>
                    <Mail className="w-4 h-4" />
                    <span>{submission.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(submission.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                {submission.data
                  .filter(field => field.id !== 'TitleCard')
                  .map(field => (
                    <Fragment key={field.id}>
                      {renderFieldValue(field)}
                    </Fragment>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ResultForm
