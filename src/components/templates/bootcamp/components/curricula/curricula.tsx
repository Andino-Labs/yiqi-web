"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

const dummyContent = [
  {
    title: "Fundamentos de inteligencia artificial generativa",
    description: (
      <>
        <>
          En este modulo aprenderás las bases de que es la inteligencia
          artificial generativa y como funciona, exploraremos diversos casos de
          uso practicos en el día a dia, desde un enfoque poco tecnico para
          luego desentrañar como funcionan estas herramientas por detrás, a
          nivel de arquitectura de la solución.
        </>
        <>
          Este bootcamp está diseñado tanto para gerentes de producto como para
          ingenieros. Así que en este modulo aprenderás todo lo necesario para
          comprender los requerimientos que te llevaran a poder liderar un
          equipo de alta eficiencia para poder construir productos sobre la
          inteligencia artificial generativa.
        </>
      </>
    ),
    badge: "Introducción - primer modulo",
    image: "/genai.jpeg",
  },
  {
    title: "La arquitectura de una solución de AI",
    description: (
      <>
        En este modulo desentrañaremos lo que toma arquitectar una solución de
        inteligencia artificial desde 0, para lo cual tendremos en cuanta
        diversos conceptos requeridos para poder llevar a cabo la idea, como por
        ejemplo los diversos servicios de cloud los cuales pueden consumir, como
        tomar una desición de pricing y como ahorrar costos al momento de hacer
        una solución que requiera de esta tecnología.
      </>
    ),
    badge: "Arquitectura de una solución - Segundo módulo",
    image: "/arch.jpeg",
  },
  {
    title: "Desarrollo de una solución",
    description: (
      <>
        Hay miles de formas de poder desarrollar una solución de inteligencia
        artificial y diversos enfoques para poder llevarlas a cabo, sin embargo
        aveces no todos los caminos llegan a roma, por lo tanto en este modulo
        te enseñaremos como puedes implementar tu idea, con herramientas que te
        ayudarán a poder ahorrar mucho tiempo, al momento de hacer tu idea
        realidad y llevarlas al go to market, explicaremos cuando y cuando no
        utilizar langchain, explicaremos los diversos tipos de servicios que
        podemos utilizar para solucionar diversas problematicas además de como
        desarrollar utilizando frameworks de ultima generación como Next.js,
        Langchain, además de servicios de AWS y vercel para poder hacer el
        deploy.
      </>
    ),
    badge: "Desarrollo, implementación y despliegue - Tercer módulo",
    image: "/final.jpeg",
  },
];

export function Curricula() {
  return (
    <section
      id="curricula"
      className="max-w-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">
        ¿Cuál será el plan de estudios?
      </h1>
      <TracingBeam className=" md:block hidden w-full max-w-screen">
        <div className="max-w-2xl mx-auto antialiased pt-4 relative">
          {dummyContent.map((item, index) => (
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
        {dummyContent.map((content, index) => (
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

      <Link href="/course" className="mt-4 md:mt-1">
        <div className="flex flex-row items-center justify-center gap-2 p-4 rounded-[55px] border group hover:bg-gray-50">
          Ver curricula completa
          <ArrowRight className="group-hover:-rotate-45 transition-all" />
        </div>
      </Link>
    </section>
  );
}
