# SAN SaaS Messenger (Clean)

Minimal Next.js app with a Messenger webhook route.

## Deploy steps

1. Create a repo on GitHub and upload all files in this zip.
2. Import the repo in Vercel → New Project → Next.js.
3. Add Environment Variables:
   - `FB_VERIFY_TOKEN` = your secret (e.g. san-verify-123)
   - `OPENAI_API_KEY` = your OpenAI key
   - (Leave `FB_PAGE_ACCESS_TOKEN` empty for now)
4. Deploy.
5. Verify the webhook by opening in your browser:
   `https://<app>.vercel.app/api/messenger/webhook?hub.mode=subscribe&hub.verify_token=<YOUR_TOKEN>&hub.challenge=OK`
6. Afterwards, connect a Facebook App → subscribe the Page to `messages` and `messaging_postbacks`, then set `FB_PAGE_ACCESS_TOKEN` in Vercel and redeploy.
