import {
  Container,
  Font,
  Head,
  Html,
  Tailwind,
  Img,
  Button
} from '@react-email/components'

export default function GiftEmail(props: {
  receiverName: string
  eventName: string
  senderName: string
}) {
  return (
    <Html>
      <Head>
        <title>You&#39;ve received a gift ticket from skilz</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#007291'
              }
            }
          }
        }}
      >
        <div className="bg-zinc-600 block">
          <Container className="bg-black text-white w-full h-fit p-10">
            <div className="block space-y-3 justify-center items-center">
              {/* <GiftIcon className="w-24 h-24 m-5 stroke-[#04F1FF] text-center" /> */}
              <div className="w-fit mx-auto">
                <Img
                  alt="Instagram"
                  height="200"
                  // src="https://i.ibb.co/KVztkZm/Boxing-Day-bro.png"
                  src="https://i.ibb.co/9gKrN3t/Halloween-tickets-bro.png"
                  width="200"
                />
              </div>
              <div className="justfy-center block items-center">
                <h3 className="text-2xl mb-1 text-center font-bold m-0">
                  Hello {props.receiverName},
                </h3>
                <p className="text-muted-foreground text-lg m-0 text-center">
                  You have been gifted a free ticket to attend the{' '}
                  {props.eventName} by {props.senderName}
                </p>
              </div>
            </div>
            <div className="px-10">
              <p className="text-md text-white/60 text-center">
                Click on the button below to login so you can check in to the
                event with your ticket
              </p>
              <Button
                className="box-border w-full rounded-[8px] bg-[#04F1FF] text-black px-[12px] py-[12px] text-center font-semibold"
                href="https://react.email"
              >
                View Ticket
              </Button>
            </div>
          </Container>
        </div>
      </Tailwind>
    </Html>
  )
}
