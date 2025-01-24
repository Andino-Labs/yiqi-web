import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  User,
  Calendar,
  CheckSquare,
  Radio,
  Type,
  AlignLeft,
  List
} from 'lucide-react'
import {
  InputTypes,
  SubmissionDataFieldType,
  submissionResponse
} from '@/schemas/yiqiFormSchema'

function ResultForm({ submissions }: { submissions: submissionResponse }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  const getIcon = (fieldType: string) => {
    switch (fieldType) {
      case InputTypes.CHECKBOX:
        return <CheckSquare className="w-5 h-5 text-purple-400" />
      case InputTypes.RADIO:
        return <Radio className="w-5 h-5 text-blue-400" />
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
        <div className="space-y-2">
          <p className="text-gray-200 font-medium">
            {field.value[0]?.question}
          </p>
          {field.value.map(item => {
            if (item.checked) {
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">{item.text}</span>
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }
    if ('isEtc' in field.value) {
      return (
        <div className="space-y-1">
          <p className="text-gray-200 font-medium">{field.value.question}</p>
          <p className="text-gray-300">
            {field.value.text}
            {field.value.isEtc && ' (Otro)'}
          </p>
        </div>
      )
    }
    if ('text' in field.value) {
      return (
        <div className="space-y-1">
          <p className="text-gray-200 font-medium">{field.value.question}</p>
          <p className="text-gray-300">{field.value.text}</p>
        </div>
      )
    }
    return null
  }
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          {submissions.length} submissions
        </h1>
      </div>
      {submissions.map(submission => (
        <motion.div key={submission.submissionId} variants={item}>
          <Card className="w-full   overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-muted/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-full">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-100 font-medium">
                        {submission.userName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {submission.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {format(new Date(submission.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {submission.data.map((field, index) => {
                    if (field.id === 'TitleCard') return null
                    return (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="bg-gray-800/50 p-2 rounded-lg">
                          {getIcon(field.inputType)}
                        </div>
                        <div className="flex-1 space-y-1">
                          {renderFieldValue(field)}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ResultForm
