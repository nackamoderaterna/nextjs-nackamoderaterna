This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, create a `.env.local` file in the root directory and add your environment variables (see `.env.example` for reference):

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Your Sanity dataset (e.g., "production")
- `RESEND_API_KEY` - Your Resend API key (get from https://resend.com)
- `CONTACT_EMAIL` - Email address where contact form submissions will be sent

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Email Configuration

This project uses [Resend](https://resend.com) for sending emails from the contact form. 

### Setup Steps:

1. Sign up for a free account at [resend.com](https://resend.com)
2. Create an API key in your Resend dashboard
3. Add the API key to your `.env.local` file:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Configure your sender email in `.env.local`:
   ```
   # Option 1: Simple email format (recommended)
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   
   # Option 2: With display name (must use proper format)
   RESEND_FROM_EMAIL="Contact Form <noreply@yourdomain.com>"
   
   # Recipient email (where form submissions go)
   CONTACT_EMAIL=your-email@example.com
   ```
   
   **Important:** 
   - The `from` email must use a verified domain in Resend
   - Format must be: `email@domain.com` or `"Name <email@domain.com>"`
   - For development/testing, you can use Resend's test domain: `onboarding@resend.dev`
   - Make sure your domain is verified in Resend dashboard before using it

### Rate Limiting

The contact form has built-in rate limiting:
- Maximum 5 requests per IP address
- 15-minute time window
- Prevents abuse and spam

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## On-demand revalidation (Sanity webhooks)

Content from Sanity is revalidated on a 5-minute schedule. To refresh pages immediately when content is created, updated, or deleted, use Sanity webhooks and on-demand revalidation.

### 1. Create a webhook secret

Generate a random string (e.g. `openssl rand -hex 24`) and add it to your environment:

```bash
# .env.local (or your hosting env)
SANITY_REVALIDATE_SECRET=your-secret-here
```

**Important:** Do not use `NEXT_PUBLIC_*` for this variable. Keep it server-only.

### 2. Add the webhook in Sanity

1. Open [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Webhooks** → **Create webhook**.
2. **URL:** `https://YOUR_DEPLOYMENT_URL/api/revalidate` (e.g. `https://yoursite.vercel.app/api/revalidate`).
3. **Trigger on:** Create, Update, Delete.
4. **Projection** (GROQ; paste into the webhook form):

```
{
  _type,
  _id,
  "slug": slug.current,
  key
}
```

5. **HTTP method:** POST.
6. **Secret:** Use the same value as `SANITY_REVALIDATE_SECRET`. Save it in the webhook form.
7. Enable the webhook and save.

### 3. Local development

The webhook must POST to a reachable URL. For local testing, use a tunnel (e.g. [ngrok](https://ngrok.com)) and point the webhook at `https://your-ngrok-url/api/revalidate`.

### Document types → paths

The handler revalidates paths based on `_type`, `slug`, and `key`:

| Type | Paths revalidated |
|------|-------------------|
| `navigationHeader`, `navigationFooter`, `globalSettings` | `/` (layout; header/footer) |
| `page` | `/` when slug is `hem`, else `/[slug]` |
| `news` | `/nyheter`, `/nyheter/[slug]` |
| `politician` | `/politiker`, `/politiker/[slug]` |
| `event` | `/evenemang`, `/evenemang/[slug]` |
| `politicalArea` | `/politik`, `/politik/[slug]` |
| `geographicalArea` | `/omrade`, `/omrade/[slug]` |
| `politicalIssue` | `/politik` |
| `listingPage` | `/politiker`, `/politik`, `/omrade`, `/nyheter`, `/evenemang`, or `/kontakt` (by `key`) |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
