Pre-Deployment Code Tasks                                   │
│                                                             │
│ Before transferring anything, add the missing SEO files:    │
│                                                             │
│ 1. Create src/app/sitemap.ts                                │
│                                                             │
│ Generate a dynamic sitemap that fetches all slugs from      │
│ Sanity (pages, news, politicians, events, political areas,  │
│ geographical areas, political issues).                      │
│                                                             │
│ 2. Create src/app/robots.ts                                 │
│                                                             │
│ Allow all crawlers, point to the sitemap at                 │
│ https://nackamoderaterna.se/sitemap.xml.                    │
│                                                             │
│ ---                                                         │
│ Step-by-Step Transfer & Go-Live                             │
│                                                             │
│ Step 1: Sanity — Transfer Project Ownership                 │
│                                                             │
│ 1. Go to https://manage.sanity.io → project 0vagy5jk        │
│ 2. Members → Invite the client's email as Administrator     │
│ 3. Once they accept, go to Settings → General and transfer  │
│ ownership to their account                                  │
│ 4. API → CORS Origins → Ensure the production domain is     │
│ listed:                                                     │
│   - https://nackamoderaterna.se (with credentials allowed)  │
│   - Remove any localhost/dev origins you don't want to      │
│ leave                                                       │
│ 5. API → Tokens → Create a read-only token for the webhook  │
│ if not using public API                                     │
│ 6. API → Webhooks → Create the revalidation webhook (do     │
│ this after Vercel is set up, see Step 5)                    │
│                                                             │
│ Step 2: Resend — Set Up on Client Account                   │
│                                                             │
│ Resend doesn't support project transfers. Set up fresh on   │
│ the client's account:                                       │
│                                                             │
│ 1. Log in to the client's https://resend.com account (or    │
│ create one)                                                 │
│ 2. Domains → Add nackamoderaterna.se                        │
│ 3. Add the DNS records Resend provides to the domain        │
│ registrar:                                                  │
│   - SPF record (TXT)                                        │
│   - DKIM records (CNAME × 3)                                │
│   - Optionally DMARC (TXT)                                  │
│ 4. Wait for domain verification (check status in Resend     │
│ dashboard)                                                  │
│ 5. API Keys → Create a new API key with Sending access      │
│ permission                                                  │
│ 6. Note the key (re_...) — you'll need it for Vercel env    │
│ vars                                                        │
│                                                             │
│ Step 3: Vercel — Transfer Project Ownership                 │
│                                                             │
│ 1. Log in to the client's https://vercel.com account (or    │
│ create a team)                                              │
│ 2. On your Vercel account, go to the project → Settings →   │
│ General → Transfer Project                                  │
│ 3. Transfer to the client's Vercel account/team             │
│ 4. On the client's account, verify the GitHub repo          │
│ connection:                                                 │
│   - If the repo also moves, reconnect it                    │
│   - If the repo stays on your GitHub, the client needs to   │
│ connect their GitHub account and you give them access to    │
│ the repo (or transfer the repo too)                         │
│                                                             │
│ Step 4: Environment Variables — Configure on Vercel         │
│                                                             │
│ In the client's Vercel project → Settings → Environment     │
│ Variables, set:                                             │
│ Variable: NEXT_PUBLIC_SANITY_PROJECT_ID                     │
│ Value: 0vagy5jk                                             │
│ Scope: All                                                  │
│ ────────────────────────────────────────                    │
│ Variable: NEXT_PUBLIC_SANITY_DATASET                        │
│ Value: production                                           │
│ Scope: All                                                  │
│ ────────────────────────────────────────                    │
│ Variable: NEXT_PUBLIC_SITE_URL                              │
│ Value: https://nackamoderaterna.se                          │
│ Scope: All                                                  │
│ ────────────────────────────────────────                    │
│ Variable: RESEND_API_KEY                                    │
│ Value: re_... (from Step 2)                                 │
│ Scope: Production + Preview                                 │
│ ────────────────────────────────────────                    │
│ Variable: RESEND_FROM_EMAIL                                 │
│ Value: noreply@nackamoderaterna.se                          │
│ Scope: Production + Preview                                 │
│ ────────────────────────────────────────                    │
│ Variable: CONTACT_EMAIL                                     │
│ Value: Client's recipient email                             │
│ Scope: Production + Preview                                 │
│ ────────────────────────────────────────                    │
│ Variable: SANITY_REVALIDATE_SECRET                          │
│ Value: Generate with openssl rand -hex 24                   │
│ Scope: Production + Preview                                 │
│ Step 5: Sanity Webhook — Connect to Vercel                  │
│                                                             │
│ Back in https://manage.sanity.io → project → API →          │
│ Webhooks:                                                   │
│                                                             │
│ 1. Create webhook                                           │
│ 2. Name: Vercel Revalidate                                  │
│ 3. URL: https://nackamoderaterna.se/api/revalidate          │
│ 4. Trigger on: Create, Update, Delete                       │
│ 5. Filter: Leave empty (all document types)                 │
│ 6. Projection:                                              │
│ {_type, _id, "slug": slug.current, key}                     │
│ 7. Secret: Paste the same SANITY_REVALIDATE_SECRET value    │
│ from Step 4                                                 │
│ 8. HTTP method: POST                                        │
│ 9. API version: v2021-03-25                                 │
│ 10. Status: Enabled                                         │
│                                                             │
│ Step 6: DNS — Point Domain to Vercel                        │
│                                                             │
│ In the client's domain registrar:                           │
│                                                             │
│ 1. On Vercel: Settings → Domains → Add nackamoderaterna.se  │
│ and www.nackamoderaterna.se                                 │
│ 2. Vercel will show the required DNS records. Typically:    │
│   - A record: nackamoderaterna.se → 76.76.21.21             │
│   - CNAME record: www.nackamoderaterna.se →                 │
│ cname.vercel-dns.com                                        │
│ 3. Also add the Resend DNS records from Step 2 (if not done │
│  already):                                                  │
│   - SPF, DKIM, and DMARC records                            │
│ 4. Wait for DNS propagation (can take up to 48 hours,       │
│ usually faster)                                             │
│ 5. Vercel will auto-provision SSL via Let's Encrypt once    │
│ DNS resolves                                                │
│                                                             │
│ Step 7: Deploy & Verify                                     │
│                                                             │
│ 1. Trigger a production deployment on Vercel (redeploy from │
│  dashboard or push to main)                                 │
│ 2. Verify the following:                                    │
│                                                             │
│ Site basics:                                                │
│ - Homepage loads at https://nackamoderaterna.se             │
│ - www redirects to non-www (or vice versa, depending on     │
│ Vercel config)                                              │
│ - SSL certificate is valid                                  │
│ - All images load (Sanity CDN)                              │
│                                                             │
│ SEO:                                                        │
│ - /sitemap.xml returns valid XML                            │
│ - /robots.txt is accessible                                 │
│ - Page titles and OG meta render correctly (test with       │
│ https://opengraph.xyz)                                      │
│                                                             │
│ Content:                                                    │
│ - Sanity Studio loads at /studio                            │
│ - Editing a page in Sanity triggers revalidation (check     │
│ webhook logs in Sanity dashboard)                           │
│ - Changes appear on the live site within seconds            │
│                                                             │
│ Email:                                                      │
│ - Submit the contact form on /kontakt                       │
│ - Verify email arrives at the CONTACT_EMAIL address         │
│ - Verify the sender shows as noreply@nackamoderaterna.se    │
│ (not resend.dev)                                            │
│                                                             │
│ Analytics:                                                  │
│ - Vercel Analytics is collecting data (check Vercel         │
│ dashboard → Analytics)                                      │
│                                                             │
│ ---                                                         │
│ Post-Launch                                                 │
│                                                             │
│ - Submit https://nackamoderaterna.se/sitemap.xml to Google  │
│ Search Console                                              │
│ - Verify domain ownership in Google Search Console          │
│ - Remove your personal accounts from Sanity/Vercel once the │
│  client confirms everything works                           │
│ - Document the SANITY_REVALIDATE_SECRET somewhere secure    │
│ for the client    
