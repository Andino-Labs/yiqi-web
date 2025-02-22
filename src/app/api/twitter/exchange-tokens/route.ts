import axios from "axios";
import { NextResponse } from "next/server";

const X_API_KEY = process.env.X_API_KEY as string;
const X_API_SECRET = process.env.X_API_SECRET as string;

export async function POST(request: Request) {
  try {
    const { oauth_token, oauth_verifier } = await request.json();

    if (!oauth_token || !oauth_verifier) {
      return NextResponse.json(
        { error: "Los parámetros oauth_token y oauth_verifier son obligatorios." },
        { status: 400 }
      );
    }

    const accessTokenUrl = "https://api.twitter.com/oauth/access_token";
    const params = new URLSearchParams({
      oauth_token,
      oauth_verifier,
    });

    const response = await axios.post(accessTokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${X_API_KEY}:${X_API_SECRET}`).toString("base64")}`,
      },
    });

    const result = new URLSearchParams(response.data);
    const accessToken = result.get("oauth_token");
    const accessTokenSecret = result.get("oauth_token_secret");
    const userId = result.get("user_id");
    const screenName = result.get("screen_name");

    if (!accessToken || !accessTokenSecret || !userId) {
      return NextResponse.json(
        { error: "No se pudieron obtener los tokens de acceso." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accessToken,
      accessTokenSecret,
      userId,
      screenName,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al intercambiar tokens:", error.message);
    } else {
      console.error("Error al intercambiar tokens:", error);
    }
    return NextResponse.json(
      { error: "Error al conectar con Twitter." },
      { status: 500 }
    );
  }
}
