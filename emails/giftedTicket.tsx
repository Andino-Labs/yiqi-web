import {
  Container,
  Font,
  Head,
  Html,
  Tailwind,
  Text,
  Column,
  Row,
  Img,
  Link,
  Button
} from '@react-email/components'
import { GiftIcon } from 'lucide-react'

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
        <div className="bg-zinc-600 flex flex-col space-y-5">
          <Container className="bg-black text-white w-full h-fit p-10">
            <div className="flex flex-col space-y-3 justify-center items-center">
              <GiftIcon className="w-24 h-24 m-5 stroke-[#04F1FF]" />
              <div className="justfy-center flex flex-col space-y-1 items-center">
                <h3 className="text-2xl mb-1 font-bold m-0">
                  Hello {props.receiverName},
                </h3>
                <p className="text-muted-foreground text-lg m-0">
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

          {/* footer */}
          <Container className="bg-black/60 text-white px-10 py-5">
            <Row>
              <Column colSpan={4}>
                <Img
                  alt="Yiqi logo logo"
                  height="42"
                  src="https://i.ibb.co/Jn4fKsw/logo.png"
                />
                <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-500">
                  Yiqi
                </Text>
                <Text className="mb-[0px] mt-[4px] text-[16px] leading-[24px] text-gray-500">
                  Connect in a different way
                </Text>
              </Column>
              <Column align="left" className="table-cell align-bottom">
                <Row className="table-cell h-[44px] w-[56px] align-bottom">
                  <Column className="pr-[8px]">
                    <Link href="#">
                      <Img
                        alt="Facebook"
                        height="36"
                        src="https://react.email/static/facebook-logo.png"
                        width="36"
                      />
                    </Link>
                  </Column>
                  <Column className="pr-[8px]">
                    <Link href="#">
                      <Img
                        alt="X"
                        height="36"
                        src="https://react.email/static/x-logo.png"
                        width="36"
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href="#">
                      <Img
                        alt="Instagram"
                        height="36"
                        src="https://react.email/static/instagram-logo.png"
                        width="36"
                      />
                    </Link>
                  </Column>
                </Row>
                <Row>
                  <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-500">
                    123 Main Street Anytown, CA 12345
                  </Text>
                  <Text className="mb-[0px] mt-[4px] text-[16px] font-semibold leading-[24px] text-gray-500">
                    mail@example.com +123456789
                  </Text>
                </Row>
              </Column>
            </Row>
          </Container>
        </div>
      </Tailwind>
    </Html>
  )
}
