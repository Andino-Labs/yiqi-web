import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export interface PriceGrid {
  price: string;
  title: string;
  subtitle?: string;
  features: string[];
}

export interface pricingProps {
  imageSrc: string;
  title: string;
  priceDetails: PriceGrid[];
}

export default function Pricing(props: pricingProps) {
  return (
    <div id="precio" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="relative -z-50">
          <Image
            src={props.imageSrc || "/AndinoLabs.svg"}
            alt="Earth from space"
            width={1200}
            height={400}
            className="w-screen  h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-[22px]"
          />
          <div className="absolute inset-0 bg-black opacity-50 rounded-[22px]"></div>
        </div>
        <h2 className="absolute top-8 left-0 right-0 text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {props.title}
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center -mt-16 sm:-mt-24 px-4 sm:px-8">
          {props.priceDetails.map((items, index) => (
            <PriceCard
              key={index}
              price={items.price}
              title={items.title}
              features={items.features}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PriceCard(props: {
  price: string
  title: string
  subtitle?: string
  features: string[]
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg mb-5 sm:mb-0">
      <div className="text-center mb-6">
        <p className="text-5xl sm:text-6xl font-bold text-gray-600">
          ${props.price}
        </p>
        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
          {props.title}
        </h3>
        {props.subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {props.subtitle}
          </p>
        )}
      </div>
      <ul className="space-y-2">
        {props.features.map((feature, index) => (
          <li key={index} className="flex items-center text-xs sm:text-sm">
            <svg
              className="mr-2 h-4 w-4 text-green-500 flex-shrink-0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="#contacto">
        <Button className="w-full font-semibold py-4 mt-4">
          Quiero Postular!
        </Button>
      </Link>
    </div>
  )
}
