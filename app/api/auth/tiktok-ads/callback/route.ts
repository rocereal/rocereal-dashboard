import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_ID      = process.env.TIKTOK_APP_ID!;
const APP_SECRET  = process.env.TIKTOK_APP_SECRET!;
const API_BASE    = "https://business-api.tiktok.com/open_api/v1.3";

export async function GET(req: NextRequest) {
  const auth_code = req.nextUrl.searchParams.get("auth_code");
  const error     = req.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(`<html><body>
      <h2>Eroare OAuth TikTok: ${error}</h2>
      <p>Închide această pagină și încearcă din nou.</p>
    </body></html>`, { headers: { "Content-Type": "text/html" } });
  }

  if (!auth_code) {
    return new NextResponse(`<html><body><h2>Lipsește auth_code.</h2></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Exchange auth_code for access_token
  const tokenRes = await fetch(`${API_BASE}/oauth2/access_token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id:     APP_ID,
      secret:     APP_SECRET,
      auth_code,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json() as {
    code:    number;
    message: string;
    data?: {
      access_token:    string;
      advertiser_ids:  string[];
      scope:           number[];
    };
  };

  if (tokenData.code !== 0 || !tokenData.data?.access_token) {
    return new NextResponse(`<html><body>
      <h2>Eroare la obținerea token-ului TikTok</h2>
      <pre>${JSON.stringify(tokenData, null, 2)}</pre>
    </body></html>`, { headers: { "Content-Type": "text/html" } });
  }

  const { access_token, advertiser_ids } = tokenData.data;

  return new NextResponse(`<!DOCTYPE html>
<html>
<head>
  <title>TikTok Ads — Token obținut</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 60px auto; padding: 0 20px; }
    .token-box { background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0; }
    code { background: #1e293b; color: #86efac; padding: 12px 16px; border-radius: 6px; display: block; word-break: break-all; font-size: 13px; margin: 8px 0; }
    .step { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; }
    h1 { color: #16a34a; }
  </style>
</head>
<body>
  <h1>✓ Autorizare TikTok reușită!</h1>
  <div class="token-box">
    <p><strong>Adaugă aceste variabile în Vercel:</strong></p>
    <p>Key: <code>TIKTOK_ACCESS_TOKEN</code></p>
    <p>Value: <code>${access_token}</code></p>
    <p>Key: <code>TIKTOK_ADVERTISER_ID</code></p>
    <p>Value: <code>${advertiser_ids[0] ?? "verifică lista de mai jos"}</code></p>
    ${advertiser_ids.length > 1 ? `<p><strong>Toate advertiser IDs:</strong> ${advertiser_ids.join(", ")}</p>` : ""}
  </div>

  <div class="step">
    <strong>Pași:</strong>
    <ol>
      <li>Mergi la <a href="https://vercel.com" target="_blank">vercel.com</a> → proiectul tău → Settings → Environment Variables</li>
      <li>Adaugă <code>TIKTOK_ACCESS_TOKEN</code> și <code>TIKTOK_ADVERTISER_ID</code></li>
      <li>Redeploy proiectul</li>
      <li>Pagina TikTok Ads va afișa date reale</li>
    </ol>
  </div>

  <p><a href="/education/tiktok-ads">← Înapoi la TikTok Ads</a></p>
</body>
</html>`, { headers: { "Content-Type": "text/html" } });
}
