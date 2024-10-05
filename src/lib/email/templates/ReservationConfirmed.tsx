// Define the props types for each template
export interface OrgInviteTemplateProps {
  name: string;
  inviteLink: string;
}
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Img,
} from "@react-email/components";

const TechGrillEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>
        Tech Grill de Andino - Noche de Fracasos en Innovación y Tecnología
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://ruta-a-tu-imagen.png"
            alt="Tech Grill de Andino"
            style={headerImage}
          />
          <Heading style={heading}>
            ¡Gracias por unirte al Tech Grill de Andino!
          </Heading>
          <Text style={text}>
            Este sábado 02 de noviembre nos espera una noche increíble de
            networking, innovación y una temática especial de Halloween.
          </Text>
          <Text style={text}>
            Puedes venir con o sin disfraz (opcional), pero si te animas,
            participa en la votación del mejor disfraz con premio sorpresa.
          </Text>
          <Heading style={subHeading}>Detalles importantes:</Heading>
          <Text style={text}>
            Lugar: Edificio Corporativo Lumiere, Los Laureles 104, Santiago de
            Surco.
            <br />
            Hora: 4:00 pm a 10:00 pm.
            <br />
            Ingreso: Solo con DNI.
          </Text>
          <Text style={text}>¡Llega con tiempo!</Text>

          <Button href="https://link-a-calendario.com" style={button}>
            Agenda el evento en tu calendario
          </Button>
          <Button href="https://link-a-whatsapp.com" style={buttonWhatsapp}>
            Ingresa a nuestro grupo de Whatsapp
          </Button>

          <Link href="https://www.andinolabs.io" style={link}>
            www.andinolabs.io
          </Link>
          <Text style={text}>Síguenos:</Text>
          <div style={socialContainer}>
            <Link href="https://www.linkedin.com" style={iconLink}>
              <Img
                src="https://ruta-a-icono-linkedin.png"
                alt="LinkedIn"
                style={iconImage}
              />
            </Link>
            <Link href="https://www.instagram.com" style={iconLink}>
              <Img
                src="https://ruta-a-icono-instagram.png"
                alt="Instagram"
                style={iconImage}
              />
            </Link>
            <Link href="https://www.tiktok.com" style={iconLink}>
              <Img
                src="https://ruta-a-icono-tiktok.png"
                alt="TikTok"
                style={iconImage}
              />
            </Link>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#000000",
  fontFamily: "Arial, sans-serif",
  color: "#FFFFFF",
  padding: "20px",
};

const container = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "20px",
  maxWidth: "600px",
  margin: "0 auto",
};

const headerImage = {
  width: "100%",
  borderRadius: "8px 8px 0 0",
};

const heading = {
  fontSize: "24px",
  color: "#FF5722",
  marginBottom: "16px",
};

const subHeading = {
  fontSize: "20px",
  color: "#FF5722",
  marginTop: "24px",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#FFFFFF",
  marginBottom: "16px",
};

const button = {
  display: "inline-block",
  backgroundColor: "#FF5722",
  color: "#FFFFFF",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "4px",
  fontSize: "16px",
  marginTop: "16px",
  marginRight: "10px",
};

const buttonWhatsapp = {
  display: "inline-block",
  backgroundColor: "#34a853",
  color: "#FFFFFF",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "4px",
  fontSize: "16px",
  marginTop: "16px",
};

const link = {
  color: "#FF5722",
  textDecoration: "none",
  fontSize: "14px",
  marginTop: "20px",
  display: "block",
};

const socialContainer = {
  marginTop: "16px",
  display: "flex",
  justifyContent: "center",
};

const iconLink = {
  margin: "0 10px",
};

const iconImage = {
  width: "32px",
  height: "32px",
};

export default TechGrillEmail;
