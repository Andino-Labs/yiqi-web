import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'
import {
  FileIcon,
  HandIcon,
  RadiobuttonIcon,
  StarFilledIcon
} from '@radix-ui/react-icons'

function FeatDisplayer(props: {
  icon: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2">
      <CardContent className="p-4 h-full flex flex-col items-start">
        {props.icon}
        <h3 className="text-lg sm:text-xl font-semibold mt-2 break-words">
          {props.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2">{props.subtitle}</p>
      </CardContent>
    </Card>
  )
}

export interface FeatDisplayer {
  title: string
  subtitle: string
}

export interface FAQProps {
  header1: string;
  header2: string;
  feat1: FeatDisplayer;
  feat2: FeatDisplayer;
  feat3: FeatDisplayer;
  feat4: FeatDisplayer;
}

export default function Faq(props: FAQProps) {
  return (
    <div
      id="faq"
      className="max-w-screen flex flex-col items-center justify-center min-h-screen w-full px-4 py-12 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 text-center">
        {props.header1} <br className="hidden sm:inline" /> {props.header2}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        <FeatDisplayer
          icon={<RadiobuttonIcon className="w-6 h-6" />}
          title={props.feat1.title}
          subtitle={props.feat1.subtitle}
        />
        <FeatDisplayer
          icon={<FileIcon className="w-6 h-6" />}
          title={props.feat2.title}
          subtitle={props.feat2.subtitle}
        />
        <FeatDisplayer
          icon={<StarFilledIcon className="w-6 h-6" />}
          title={props.feat3.title}
          subtitle={props.feat3.subtitle}
        />
        <FeatDisplayer
          icon={<HandIcon className="w-6 h-6" />}
          title={props.feat4.title}
          subtitle={props.feat4.subtitle}
        />
      </div>
    </div>
  )
}
