import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLIENT_ID     = process.env.GOOGLE_ADS_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET!;
const REDIRECT_URI  = `${process.env.NEXTAUTH_URL}/api/auth/google-ads/callback`;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(`<html><body>
      <h2>Eroare OAuth: ${error}</h2>
      <p>Închide această pagină și încearcă din nou.</p>
    </body></html>`, { headers: { "Content-Type": "text/html" } });
  }

  if (!code) {
    return new NextResponse(`<html><body><h2>Lipsește codul de autorizare.</h2></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      grant_type:    "authorization_code",
    }),
  });

  const tokens = await tokenRes.json() as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (tokens.error || !tokens.refresh_token) {
    return new NextResponse(`<html><body>
      <h2>Eroare la obținerea token-ului</h2>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>
    </body></html>`, { headers: { "Content-Type": "text/html" } });
  }

  // Show refresh token so user can add it to Vercel env vars
  return new NextResponse(`<!DOCTYPE html>
<html>
<head>
  <title>Google Ads — Token obținut</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 60px auto; padding: 0 20px; }
    .token-box { background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0; }
    code { background: #1e293b; color: #86efac; padding: 12px 16px; border-radius: 6px; display: block; word-break: break-all; font-size: 13px; margin: 8px 0; }
    .step { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; }
    h1 { color: #16a34a; }
  </style>
</head>
<body>
  <h1>✓ Autorizare reușită!</h1>
  <div class="token-box">
    <p><strong>Refresh Token obținut. Copiază-l și adaugă-l în Vercel:</strong></p>
    <p>Key: <code>GOOGLE_ADS_REFRESH_TOKEN</code></p>
    <p>Value: <code>${tokens.refresh_token}</code></p>
  </div>

  <div class="step">
    <strong>Pași:</strong>
    <ol>
      <li>Mergi la <a href="https://vercel.com" target="_blank">vercel.com</a> → proiectul tău → Settings → Environment Variables</li>
      <li>Adaugă variabila <code>GOOGLE_ADS_REFRESH_TOKEN</code> cu valoarea de mai sus</li>
      <li>Redeploy proiectul</li>
      <li>Pagina Google Ads va afișa date reale</li>
    </ol>
  </div>

  <p><a href="/education/google-ads">← Înapoi la Google Ads</a></p>
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}
