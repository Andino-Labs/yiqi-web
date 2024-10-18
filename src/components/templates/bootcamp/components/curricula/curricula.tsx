'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TracingBeam } from "../tb";
import { Urlprop } from "../navbar/navbar";

interface DummyContent {
  title: string;
  description: React.JSX.Element;
  badge: string;
  image: string;
}

export interface CurriculaProps {
  title: string;
  dummyContent: DummyContent[];
  url: Urlprop;
}

export function Curricula(props: CurriculaProps) {
  return (
    <section
      id="curricula"
      className="max-w-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">{props.title}</h1>
      <TracingBeam className=" md:block hidden w-full max-w-screen">
        <div className="max-w-2xl mx-auto antialiased pt-4 relative">
          {props.dummyContent.map((item, index) => (
            <div key={`content-${index}`} className="mb-12">
              <Badge variant="secondary" className="mb-4">
                {item.badge}
              </Badge>
              <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
              <div className="prose prose-sm dark:prose-invert mb-6">
                {item?.image && (
                  <Image
                    src={item.image}
                    alt={`Imagen para ${item.title}`}
                    width={1000}
                    height={800}
                    className="rounded-lg object-cover w-full h-auto mb-6"
                  />
                )}
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>

      <div className="md:hidden max-w-screen space-y-6 w-full max-w-md">
        {props.dummyContent.map((content, index) => (
          <Card key={index} className="overflow-hidden">
            <Image
              src={content.image}
              alt={`Imagen para ${content.title}`}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {content.title}
              </CardTitle>
              <Badge variant="secondary" className="mt-2">
                {content.badge}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600">
                {content.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Link href={props.url.link} className="mt-4 md:mt-1">
        <div className="flex flex-row items-center justify-center gap-2 p-4 rounded-[55px] border group hover:bg-gray-50">
          {props.url.text}
          <ArrowRight className="group-hover:-rotate-45 transition-all" />
        </div>
      </Link>
    </section>
  )
}
