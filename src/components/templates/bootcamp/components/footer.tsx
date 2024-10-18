import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface SocialLink {
  url: string;
  label: string;
  icon: React.ElementType;
}

export interface MinimalisticFooterProps {
  imageSrc: string;
  socials: SocialLink[];
}

export default function MinimalisticFooter(props: MinimalisticFooterProps) {
  return (
    <footer className="relative bg-background border-t w-full">
      <div className="container mx-auto max-w-full py-4 px-4 sm:px-8 lg:px-20 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center justify-center sm:justify-start">
          <Image
            height={50}
            width={75}
            src={props.imageSrc || "/logoandino.svg"}
            alt="Logo"
            className="text-black"
            style={{ filter: 'invert(1)' }}
          />
        </div>
        <div className="flex space-x-4 justify-center">
          {props.socials.map((items, index) => (
            <SocialLink key={index} href={items.url} aria-label={items.label}>
              <items.icon className="w-5 h-5" />
            </SocialLink>
          ))}
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </Link>
  )
}
