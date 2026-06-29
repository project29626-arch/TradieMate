# [cite_start]PRODUCT ROADMAP [cite: 1061]

[cite_start]**TradieMate Working Title** [cite: 1062]
[cite_start]*AI-powered admin for Australian tradies - roadmap from MVP to scalable Australian launch* [cite: 1063]

> [cite_start]**Brand direction reference:** field-first, straight talk, hi-vis action, industrial trust, voice-first UX[cite: 1065].
> Prepared from business_context.md, the uploaded Replit MVP codebase, and the supplied brand kit. [cite_start]App name to be finalised later[cite: 1066].

---

## [cite_start]01 - ROADMAP THESIS [cite: 1067]

### [cite_start]Executive product direction [cite: 1068]
* [cite_start]The product should not become another heavy field-service management platform[cite: 1069].
* [cite_start]The wedge is simpler and sharper: a mobile-first, voice-first admin co-pilot that turns what a tradie says on site into a quote, site report, follow-up task, booking message, and later a missed-call recovery workflow[cite: 1070].
* [cite_start]The strongest launch path is to win one painful admin moment first: "I just finished the site visit, now turn my voice note into something I can send." [cite: 1071]
* [cite_start]From there, expand into follow-up, booking, invoices, missed calls, and eventually a full AI admin layer for 1-5 person Australian trade businesses[cite: 1072].
* [cite_start]The current Replit MVP is a good alpha foundation: it already supports business setup, mobile site notes, browser speech-to-text, photo capture, Gemini-generated quote/report/task outputs, basic task management, and quote/report download/share flows[cite: 1073].
* The next work is not more random features. [cite_start]It is production hardening, a cleaner quote-send loop, customer follow-up automation, and proof from real tradies[cite: 1074].

### [cite_start]North Star [cite: 1075]
* [cite_start]Minutes of admin saved per tradie per week[cite: 1076].

### [cite_start]First paid promise [cite: 1077]
* Speak once on site. [cite_start]Get a professional quote, site report, follow-up task list, and customer message in minutes[cite: 1078].

### [cite_start]Primary customer [cite: 1079]
* [cite_start]Australian sole trader or 1-5 person trade business that is smartphone-native, admin-averse, and loses time or jobs through missed calls, rough quoting, and manual follow-up[cite: 1080].

### [cite_start]Key product principles [cite: 1081]
* [cite_start]**One-handed field use:** every core action should work while standing on site, in the ute, or between jobs[cite: 1082].
* [cite_start]**Human review by default:** AI writes drafts, the tradie approves before anything goes to a customer[cite: 1083].
* [cite_start]**Speed beats complexity:** quote/report generation must feel faster than typing a text message[cite: 1084].
* [cite_start]**Australian-native workflows:** ABN, GST, AUD, Australian English, local mobile formats, quote expiry, job address, call-out fee, and trade-specific language[cite: 1085].
* [cite_start]**Trust before automation:** automate only after the tradie sees and trusts the output[cite: 1086].

---

## [cite_start]02 - CURRENT MVP AUDIT [cite: 1087]

[cite_start]**Where the first MVP is right now** [cite: 1088]

| Area | Current MVP status | Roadmap action |
|---|---|---|
| Frontend | [cite_start]React, Vite, TypeScript PWA-style mobile web app with dashboard, bottom nav, site notes, quotes, reports, tasks, account, and placeholder bookings. [cite: 1089] | Keep the stack. [cite_start]Tighten responsive field UX, PWA install/offline behaviour, and brand-kit v2 component system. [cite: 1089] |
| Backend | [cite_start]Express API with authenticated routes for business, customers, site notes, AI generation, quotes, reports, tasks, bookings, and dashboard summary. [cite: 1089] | [cite_start]Add validation, API contracts, rate limits, audit logs, background jobs, webhooks, and production deployment pipeline. [cite: 1089] |
| Database | [cite_start]PostgreSQL with Drizzle tables for users, businesses, customers, site notes, quotes, reports, tasks, and bookings. [cite: 1089] | [cite_start]Strengthen multi-tenant boundaries, add jobs table, communications log, follow-up schedules, subscriptions, files table, and AI run history. [cite: 1089] |
| AI | [cite_start]Gemini server-side endpoint generates JSON for job summary, report, quote draft, tasks, booking message, follow-up message, missing info, and risk notes. [cite: 1089] | [cite_start]Add structured schemas, retries, eval tests, prompt versioning, confidence/missing-info UI, and trade-specific templates. [cite: 1089] |
| Voice/photo capture | [cite_start]Browser speech recognition in en-AU; photos resized to base64 JPEG with max 8 photos. [cite: 1089] | [cite_start]Move photos to object storage, support offline drafts, improve recording reliability, and create photo evidence tagging. [cite: 1089] |
| Sharing/export | [cite_start]Quote and report detail pages support PDF/Word download plus native share, WhatsApp, Gmail/mail, and copy. [cite: 1089] | [cite_start]Add actual send tracking, email/SMS integration, quote acceptance, audit trail, and customer-facing link. [cite: 1089] |
| Bookings | [cite_start]Backend model exists, frontend route is placeholder. [cite: 1089] | [cite_start]Build booking screen, calendar connection, AI suggested times, and booking confirmation. [cite: 1089] |
| Auth/deployment | [cite_start]Uses Replit OIDC and Replit environment assumptions. [cite: 1089] | [cite_start]Move to production-ready auth and hosting when leaving prototype mode. [cite: 1089] |

### [cite_start]Biggest MVP gaps before charging [cite: 1090]
* [cite_start]The quote loop is not fully closed: a tradie can generate and share, but not properly send, track, follow up, and mark accepted from a single workflow[cite: 1091].
* [cite_start]No automated follow-up engine yet: the app creates tasks/messages, but it does not send scheduled reminders or chase pending quotes/invoices[cite: 1092].
* [cite_start]No missed-call product yet: this is a future moat, but should not be built before quote/report trust is proven[cite: 1093].
* [cite_start]Photo storage is not scalable because base64 photos live in the database[cite: 1094].
* [cite_start]Current auth and environment are prototype-friendly, not production SaaS-ready[cite: 1095].
* [cite_start]No billing, trial, account limits, admin dashboard, usage analytics, or onboarding analytics yet[cite: 1096].

### [cite_start]Current MVP feature maturity [cite: 1097]

| Capability | Business importance | MVP maturity | Next milestone |
|---|---|---|---|
| AI voice quoting | Lead wedge | [cite_start]Partially built: voice site note to quote draft. [cite: 1098] | [cite_start]Editable quote builder, send/track, quote acceptance. [cite: 1098] |
| Voice site reports + photo | High early value | [cite_start]Built v0: transcript + photos + AI report. [cite: 1098] | [cite_start]Photo evidence labels, branded PDF, send tracking. [cite: 1098] |
| AI follow-up | Retention driver | [cite_start]Message/task templates only. [cite: 1098] | [cite_start]Scheduled SMS/email follow-up engine. [cite: 1098] |
| Missed-call handling | Future moat | [cite_start]Not built. [cite: 1098] | [cite_start]Start with missed-call capture and callback script before full AI phone agent. [cite: 1098] |
| Task management | Daily utility | [cite_start]Basic tasks list and status toggle. [cite: 1098] | [cite_start]Task due dates, reminders, job links, recurring follow-ups. [cite: 1098] |
| Bookings | Conversion utility | [cite_start]API model exists, UI placeholder. [cite: 1098] | [cite_start]Booking calendar and customer confirmation. [cite: 1098] |

---

## [cite_start]03 - ROADMAP OVERVIEW [cite: 1099]

### [cite_start]Development phases [cite: 1100]

| Phase | Timing | Product goal | Main unlock | Exit criteria |
|---|---|---|---|---|
| 0. Foundation reset | Week 0-1 | Turn Replit prototype into a clean alpha baseline. | A stable app that can be used by real testers without breaking trust. | [cite_start]Test accounts can create, generate, save, export, and share without manual developer help. [cite: 1101] |
| 1. Closed alpha | Weeks 1-4 | Nail the site-note-to-quote/report workflow. | First 5-10 tradies use it on real jobs. | At least 30 real site notes generated; [cite_start]70% of AI outputs require only light edits. [cite: 1101] |
| 2. Paid beta | Weeks 5-8 | Close the quote/follow-up loop. | Tradies can send, track, and follow up from the app. | [cite_start]First paid users or LOIs; weekly active usage from at least 50% of onboarded testers. [cite: 1101] |
| 3. Launch wedge | Months 3-4 | Launch into the strongest early trade vertical. | A clear industry-specific story and onboarding flow. | [cite_start]One vertical case study with measurable admin time saved or quote follow-up improvement. [cite: 1101] |
| 4. AI admin engine | Months 5-6 | Add automated follow-up, booking, invoice chasing, and missed-call v1. | The app becomes a daily admin assistant, not just a document generator. | [cite_start]Retention improves; users rely on app for daily tasks and customer response. [cite: 1101] |
| 5. Australian scale | Months 7-12 | Expand across states and verticals through referrals and partnerships. | Repeatable GTM and product templates by trade. | [cite_start]100+ active businesses, channel partner tests, and clear upgrade tiers. [cite: 1101] |
| 6. Platform/moat | 12-24 months | Become the AI admin layer for small trade businesses. | Proprietary workflow data, integrations, voice-agent defensibility. | [cite_start]Reliable AI receptionist, partner distribution, multi-user teams, and low churn. [cite: 1101] |

### [cite_start]Priority stack [cite: 1102]

| Priority | Build now | Do not overbuild yet |
|---|---|---|
| P0 | [cite_start]Quote/report generation, review, export, send, tracking, and customer follow-up. [cite: 1103] | [cite_start]Complex workforce scheduling, inventory, payroll, supplier marketplace. [cite: 1103] |
| P1 | [cite_start]Production auth, file storage, subscriptions, app analytics, onboarding, data safety. [cite: 1103] | [cite_start]Enterprise admin, franchise mode, deep accounting sync. [cite: 1103] |
| P2 | [cite_start]Missed-call capture and AI callback assistant v1. [cite: 1103] | [cite_start]Fully autonomous phone agent with no human guardrails. [cite: 1103] |
| P3 | [cite_start]Trade-specific templates and partner channels. [cite: 1103] | [cite_start]Trying to serve every trade with equal messaging from day one. [cite: 1103] |

---

## [cite_start]04 - DETAILED PHASE PLAN [cite: 1104]

### [cite_start]Phase 0 - Foundation reset [cite: 1105]
* [cite_start]**Timing:** Week 0-1 [cite: 1106]
* [cite_start]**Goal:** Make the current MVP stable, clean, and ready for real tradie testing[cite: 1107].

[cite_start]**Product work** [cite: 1108]
* [cite_start]Confirm the exact alpha promise: "Speak your site note. Get quote, report, tasks, and customer message." [cite: 1109]
* [cite_start]Clean onboarding: business name, ABN, GST status, trade type, default labour rate, call-out fee, quote terms, payment terms, service area[cite: 1110].
* [cite_start]Create a single "job" concept that links customer, site note, quote, report, task, booking, and communication logs[cite: 1111].
* [cite_start]Add sample empty states that explain what to do in plain tradie language[cite: 1112].

[cite_start]**Technical work** [cite: 1113]
* [cite_start]Add request validation with shared Zod schemas across client and server[cite: 1114].
* [cite_start]Move photo storage out of JSONB/base64 and into object storage with signed URLs[cite: 1115].
* [cite_start]Add AI run history: prompt version, model, input hash, output, status, error, cost/usage estimate[cite: 1116].
* [cite_start]Add basic observability: error logging, request IDs, slow route logging, AI failure tracking[cite: 1117].
* [cite_start]Create staging and production environments, even if production remains private[cite: 1118].

[cite_start]**UX and brand** [cite: 1119]
* [cite_start]Translate the supplied brand kit into app tokens: Graphite, Concrete, Steel, Hi-Vis Green, Aussie Teal, Alert Orange[cite: 1120].
* [cite_start]Make the primary action a big voice/mic action, not a tiny form submit[cite: 1121].
* [cite_start]Use high-contrast status chips: Draft, Generated, Sent, Follow-up due, Accepted, Overdue[cite: 1122].
* [cite_start]Keep the feel industrial and clean: less SaaS fluff, more "get back to the job"[cite: 1123].

[cite_start]**Exit criteria** [cite: 1124]
* [cite_start]One tester can complete onboarding in under 3 minutes[cite: 1125].
* [cite_start]One real site visit can become a quote/report/task set without developer help[cite: 1126].
* [cite_start]AI failure has a friendly fallback and the original site note is never lost[cite: 1127].

### [cite_start]Phase 1 - Closed alpha [cite: 1128]
* [cite_start]**Timing:** Weeks 1-4 [cite: 1129]
* [cite_start]**Goal:** Prove the core workflow with 5-10 real tradies from personal networks[cite: 1130].

[cite_start]**Must-have features** [cite: 1131]
* [cite_start]Improved site note capture: customer, job address, trade type, urgency, voice note, photos, quick save[cite: 1132].
* [cite_start]AI generate screen: show quote draft, report, tasks, booking message, follow-up message, missing info, and risk notes[cite: 1133].
* [cite_start]Quote editor: edit scope, line items, GST, subtotal, total, terms, expiry, notes, and quote number[cite: 1134].
* [cite_start]Report editor: edit summary, issue found, recommendation, next steps, selected photos, and photo captions[cite: 1135].
* [cite_start]Save quote/report/tasks with one tap and navigate clearly to what was created[cite: 1136].
* [cite_start]Download/share v1 remains but add "Mark sent" and "Set follow-up"[cite: 1137].

[cite_start]**Testing focus** [cite: 1138]
* [cite_start]Run every tester through a 30-minute onboarding call[cite: 1139].
* [cite_start]Ask them to use it on 3 real jobs, not fake examples[cite: 1140].
* [cite_start]Collect before/after admin time, edit count, and whether they would send the output to a customer[cite: 1141].
* Record exact words tradies use to describe value and confusion. [cite_start]This becomes website copy[cite: 1142].

[cite_start]**Exit criteria** [cite: 1143]
* [cite_start]30+ real notes generated[cite: 1144].
* [cite_start]At least 10 generated quotes or reports sent externally[cite: 1145].
* [cite_start]At least 5 testers say they would keep using it weekly[cite: 1146].
* [cite_start]Identify the strongest first vertical from actual usage, not guessing[cite: 1147].

### [cite_start]Phase 2 - Paid beta [cite: 1148]
* [cite_start]**Timing:** Weeks 5-8 [cite: 1149]
* [cite_start]**Goal:** Turn the app from a generator into a trackable admin workflow[cite: 1150].

[cite_start]**Core features** [cite: 1151]
* [cite_start]Real send workflow: send quote/report by email and/or SMS from inside the app[cite: 1152].
* [cite_start]Communication log: who was contacted, what was sent, timestamp, delivery status where available[cite: 1153].
* [cite_start]Follow-up engine v1: schedule follow-up for quote not accepted, unpaid invoice reminder, or booking confirmation[cite: 1154].
* [cite_start]Customer record: timeline of site notes, quotes, reports, messages, tasks, and bookings[cite: 1155].
* [cite_start]Dashboard v2: money waiting, quotes not sent, follow-ups due, jobs to book, overdue tasks, missed admin items[cite: 1156].
* [cite_start]Subscription/trial system: free trial plus simple paid plan, with soft usage limits[cite: 1157].

[cite_start]**Technical priorities** [cite: 1158]
* [cite_start]Integrate email/SMS provider via backend only[cite: 1159].
* [cite_start]Add background job queue for scheduled follow-ups and AI generation retries[cite: 1160].
* [cite_start]Add webhook handling for delivery, bounce, acceptance, and unsubscribe/opt-out states where applicable[cite: 1161].
* [cite_start]Add subscription and billing tables[cite: 1162].
* [cite_start]Add role-based access groundwork even if alpha is owner-only[cite: 1163].

[cite_start]**Exit criteria** [cite: 1164]
* [cite_start]First paid beta users or signed willingness-to-pay commitments[cite: 1165].
* [cite_start]Follow-up reminders produce measurable customer responses[cite: 1166].
* [cite_start]Users open the app beyond initial generation: tasks, follow-ups, and dashboard create return usage[cite: 1167].

---

## [cite_start]05 - LAUNCH AND SCALE PHASES [cite: 1168]

### [cite_start]Phase 3 - Launch wedge [cite: 1169]
* [cite_start]**Timing:** Months 3-4 [cite: 1170]
* [cite_start]**Goal:** Launch publicly into the strongest early vertical while keeping the product flexible enough to expand[cite: 1171].

[cite_start]**Product work** [cite: 1172]
* [cite_start]Create trade templates for the first winning vertical: quote wording, common job types, common risk notes, photo evidence prompts, and follow-up timing[cite: 1173].
* [cite_start]Build onboarding by trade: plumber, electrician, carpenter, builder, concreter, landscaper, etc., but only polish the winning vertical deeply first[cite: 1174].
* [cite_start]Create customer-facing quote/report links with approve/request changes buttons[cite: 1175].
* [cite_start]Add booking page v1 with time slots and Google/Apple calendar export or integration[cite: 1176].
* [cite_start]Add quote acceptance status and automatic next task creation after acceptance[cite: 1177].

[cite_start]**GTM work** [cite: 1178]
* [cite_start]Turn the first cohort into a local reference story with screenshots, quotes, and time saved[cite: 1179].
* [cite_start]Use state-based tradie communities and peer referrals rather than broad paid ads too early[cite: 1180].
* [cite_start]Test one simple offer: "We set it up with you in 20 minutes and your first quote is free." [cite: 1181]
* [cite_start]Build a public waitlist/landing page with vertical-specific copy[cite: 1182].

### [cite_start]Phase 4 - AI admin engine [cite: 1183]
* [cite_start]**Timing:** Months 5-6 [cite: 1184]
* [cite_start]**Goal:** Make the app feel like a real admin assistant that keeps jobs moving[cite: 1185].

[cite_start]**Features** [cite: 1186]
* [cite_start]AI follow-up sequences: quote follow-up, booking confirmation, post-job review request, overdue invoice reminder[cite: 1187].
* [cite_start]Missed-call handling v1: capture missed call, identify caller where possible, send callback SMS, create task, and draft callback script[cite: 1188].
* [cite_start]AI receptionist pilot: optional number forwarding for after-hours or busy-on-site scenarios, with human approval guardrails[cite: 1189].
* Invoice draft and payment reminder workflow. [cite_start]Keep accounting sync optional, not required[cite: 1190].
* [cite_start]Admin autopilot dashboard: what needs attention today, what can wait, what AI already handled[cite: 1191].

[cite_start]**Technical work** [cite: 1192]
* [cite_start]Communications layer for phone/SMS/email events[cite: 1193].
* [cite_start]Consent and compliance UX for call recording/transcription and SMS follow-ups[cite: 1194].
* [cite_start]Job state machine: lead -> site visit -> quote drafted -> sent -> follow-up -> accepted -> booked -> completed -> invoice -> paid[cite: 1195].
* [cite_start]AI guardrails: allowed actions, blocked actions, escalation rules, and safe fallback scripts[cite: 1196].

### [cite_start]Phase 5 - Australian scale [cite: 1197]
* [cite_start]**Timing:** Months 7-12 [cite: 1198]
* [cite_start]**Goal:** Scale across more trade verticals and Australian regions without becoming generic[cite: 1199].

[cite_start]**Product expansion** [cite: 1200]
* [cite_start]Vertical packs: plumbing, electrical, building/renovation, landscaping, concreting, roofing, tiling[cite: 1201].
* [cite_start]State/service-area profiles: state-specific labels, service zones, call-out fee defaults, timezone handling[cite: 1202].
* [cite_start]Team mode: owner, admin, technician, subcontractor permissions[cite: 1203].
* [cite_start]Basic integrations: calendar, accounting export/sync, contact import, cloud storage, payment links[cite: 1204].
* [cite_start]Referral and review workflow: after job completion, AI drafts review request and referral ask[cite: 1205].

[cite_start]**GTM expansion** [cite: 1206]
* [cite_start]Referral loop: give existing tradies account credit for referred tradie businesses[cite: 1207].
* [cite_start]Community demos: short Loom/TikTok-style demos showing one job from voice note to quote[cite: 1208].
* [cite_start]Supplier/industry partner pilots once PMF signals are stronger[cite: 1209].
* [cite_start]Case studies by vertical, not one generic landing page[cite: 1210].

### [cite_start]Phase 6 - Platform and moat [cite: 1211]
* [cite_start]**Timing:** 12-24 months [cite: 1212]
* [cite_start]**Goal:** Become the default AI admin layer for small Australian trade businesses[cite: 1213].

[cite_start]**Long-term opportunities** [cite: 1214]
* [cite_start]AI receptionist and missed-call recovery as the strongest defensible feature[cite: 1215].
* [cite_start]Proprietary job-admin dataset: anonymised patterns from quotes, follow-ups, tasks, and customer response timing[cite: 1216].
* [cite_start]Price and material intelligence by trade, starting with user-owned templates and later supplier integrations[cite: 1217].
* [cite_start]Lead-to-cash workflow: capture, quote, accept, book, report, invoice, collect, review[cite: 1218].
* [cite_start]Admin benchmarking: show tradies how much admin time, quote value, and follow-up revenue is waiting[cite: 1219].
* [cite_start]Partner channel: suppliers, accountants/bookkeepers, industry associations, insurance brokers, trade schools[cite: 1220].

---

## [cite_start]06 - TECHNICAL ARCHITECTURE ROADMAP [cite: 1221]

### [cite_start]Scalable technical priorities [cite: 1222]

| Layer | Current state | Near-term priority | Scale-state direction |
|---|---|---|---|
| Frontend/PWA | [cite_start]Mobile-first React app with core screens. [cite: 1223] | [cite_start]Add install prompt, offline draft capture, loading states, better error states, and brand-kit components. [cite: 1223] | [cite_start]Fast PWA with offline-first job capture, accessibility, and device-native sharing. [cite: 1223] |
| API | [cite_start]Express routes with session auth. [cite: 1223] | [cite_start]Validation, pagination, standard error shapes, audit logging, rate limits. [cite: 1223] | [cite_start]Versioned API with background workers, webhooks, and integration endpoints. [cite: 1223] |
| Database | [cite_start]Postgres/Drizzle core tables. [cite: 1223] | [cite_start]Add jobs, communications, files, AI runs, subscriptions, follow-up schedules. [cite: 1223] | [cite_start]Tenant-safe schema with reporting views, retention policies, backups, and event history. [cite: 1223] |
| AI layer | [cite_start]Single Gemini generate endpoint. [cite: 1223] | [cite_start]Prompt versioning, schema enforcement, retry/fallback, confidence and missing-info detection. [cite: 1223] | [cite_start]Multi-model AI gateway, eval suite, trade templates, action guardrails, cost monitoring. [cite: 1223] |
| Files/photos | [cite_start]Base64 in database. [cite: 1223] | [cite_start]Object storage with image compression and signed URLs. [cite: 1223] | [cite_start]Photo evidence pipeline with captions, EXIF handling, and report attachments. [cite: 1223] |
| Comms | [cite_start]Share links/open apps only. [cite: 1223] | [cite_start]Email/SMS send, log, delivery state, scheduled follow-ups. [cite: 1223] | [cite_start]Phone, SMS, email, calendar, payment, and accounting event hub. [cite: 1223] |
| Auth/security | [cite_start]Replit OIDC prototype. [cite: 1223] | [cite_start]Production auth, tenant scoping tests, secure secrets, CSRF/cookie strategy. [cite: 1223] | [cite_start]Roles, teams, audit trails, SSO optional, security monitoring. [cite: 1223] |
| Billing | [cite_start]Not built. [cite: 1223] | [cite_start]Trial, subscription, usage limits, Stripe-style webhooks. [cite: 1223] | [cite_start]Plan tiers, add-ons for AI calls/SMS/phone, partner billing. [cite: 1223] |
| Analytics | [cite_start]Dashboard summary only. [cite: 1223] | [cite_start]Track activation, generation success, edits, sends, follow-ups, retention. [cite: 1223] | [cite_start]Cohort analytics by trade, region, plan, and workflow. [cite: 1223] |

### [cite_start]Suggested production schema additions [cite: 1224]

| Entity | Why it matters |
|---|---|
| jobs | [cite_start]Central object linking customer, site note, quote, report, booking, tasks, invoices, and communications. [cite: 1225] |
| communications | [cite_start]Audit trail for SMS/email/phone messages and customer-facing sends. [cite: 1225] |
| follow_up_schedules | [cite_start]Powers automated quote, booking, invoice, and review follow-ups. [cite: 1225] |
| ai_runs | [cite_start]Debugs quality, prompt versions, failure modes, cost, and latency. [cite: 1225] |
| files | [cite_start]Stores photo/report/quote assets outside database JSON. [cite: 1225] |
| subscriptions | [cite_start]Handles trial, plan, payment status, usage limits, and add-ons. [cite: 1225] |
| team_members | [cite_start]Supports 1-5 person operations and future admin/technician roles. [cite: 1225] |
| integrations | [cite_start]Stores connected providers such as email, SMS, calendar, accounting, payments. [cite: 1225] |

### [cite_start]AI quality system [cite: 1226]
* [cite_start]Create 20-30 golden test cases from real site notes across early verticals[cite: 1227].
* [cite_start]Evaluate outputs for: useful scope, no invented price, correct GST handling, customer-safe language, missing info detection, and follow-up clarity[cite: 1228].
* [cite_start]Save prompt versions so regressions can be traced[cite: 1229].
* [cite_start]Show missing information to the user before they send a quote[cite: 1230].
* [cite_start]Never let autonomous messages go out without an approval path until trust is proven[cite: 1231].

---

## [cite_start]07 - UX ROADMAP [cite: 1232]

### [cite_start]User experience improvements [cite: 1233]

| UX area | Roadmap recommendation |
|---|---|
| Home dashboard | [cite_start]Make it an admin command centre: today, money waiting, follow-ups due, jobs to book, overdue items, and one big voice action. [cite: 1234] |
| Voice action | [cite_start]Central mic button with clear states: ready, listening, processing, draft ready, missing info, saved. [cite: 1234] |
| Quote review | Use a simple card-by-card review: scope, line items, GST, terms, message, send. [cite_start]Avoid spreadsheet-style complexity. [cite: 1234] |
| Site report | [cite_start]Let users choose photos, add captions, and generate a clean customer-safe report. [cite: 1234] |
| Follow-up | Use suggested timing: tomorrow, 3 days, 7 days. [cite_start]Show exact message before send. [cite: 1234] |
| Field constraints | [cite_start]Large touch targets, high contrast, offline draft save, minimal typing, no tiny menus for core actions. [cite: 1234] |
| Brand direction | [cite_start]Move toward the supplied industrial board: Graphite base, Hi-Vis Green action, Aussie Teal for AI, Alert Orange for urgent/overdue. [cite: 1234] |
| Language | [cite_start]Use straight Aussie admin language: "Quote ready", "Follow up due", "Job booked", "Missing price", "Send to customer". [cite: 1234] |

### [cite_start]Activation flow [cite: 1235]
* [cite_start]Sign up and enter business basics[cite: 1236].
* [cite_start]Create first site note using voice and optional photos[cite: 1237].
* [cite_start]Generate AI outputs[cite: 1238].
* [cite_start]Edit quote/report in under 2 minutes[cite: 1239].
* [cite_start]Send or share to customer[cite: 1240].
* [cite_start]Schedule follow-up[cite: 1241].
* [cite_start]Return to dashboard and see saved time/money waiting[cite: 1242].

### [cite_start]UX metrics to track [cite: 1243]
* [cite_start]Time from opening app to saved site note[cite: 1244].
* [cite_start]Time from site note to generated quote/report[cite: 1245].
* [cite_start]Percentage of generated outputs saved[cite: 1246].
* [cite_start]Percentage of quotes sent externally[cite: 1247].
* [cite_start]Average number of edits before send[cite: 1248].
* [cite_start]Follow-up tasks completed or automated[cite: 1249].
* [cite_start]Week 1 and week 4 retention by trade type[cite: 1250].

---

## [cite_start]08 - MARKET EXPANSION [cite: 1251]

### [cite_start]Australian market expansion roadmap [cite: 1252]
* [cite_start]The early target should stay broad enough to learn, but the launch story should narrow as soon as actual users cluster around one or two verticals[cite: 1253].
* [cite_start]A generic "for all tradies" message is okay for personal outreach; public marketing needs sharper proof[cite: 1254].

| Stage | Customer target | Channel | Offer | Learning goal |
|---|---|---|---|---|
| First 10 | [cite_start]Personal network tradies, likely 1-2 natural verticals. [cite: 1255] | [cite_start]Direct calls, DMs, in-person demos. [cite: 1255] | [cite_start]Free setup and hands-on onboarding. [cite: 1255] | [cite_start]Which job type, trade, and admin pain creates repeat usage? [cite: 1255] |
| 10-30 | [cite_start]Same vertical cluster plus nearby referrals. [cite: 1255] | [cite_start]Peer referrals, local Facebook groups, short demo videos. [cite: 1255] | [cite_start]Free trial then paid beta. [cite: 1255] | [cite_start]Which messaging drives demos and willingness to pay? [cite: 1255] |
| 30-100 | [cite_start]Winning vertical in 1-2 Australian states. [cite: 1255] | [cite_start]Case studies, state-based groups, local trade communities. [cite: 1255] | [cite_start]Monthly subscription with trial. [cite: 1255] | [cite_start]Retention, paid conversion, and support burden. [cite: 1255] |
| 100+ | [cite_start]More trade verticals and small teams. [cite: 1255] | [cite_start]Partner pilots, supplier relationships, accountants/bookkeepers, industry communities. [cite: 1255] | [cite_start]Tiered plans and add-ons. [cite: 1255] | [cite_start]Repeatable acquisition and vertical-specific onboarding. [cite: 1255] |

### [cite_start]Pricing tests [cite: 1256]
* Do not lock pricing too early. [cite_start]Test willingness to pay with the first cohort[cite: 1257].
* [cite_start]Start with a simple paid beta: Starter for owner-operator, Pro for AI follow-up and higher limits, Phone add-on later for missed-call handling[cite: 1258].
* [cite_start]Use a free trial because tradies may be skeptical of software until they see their own quote/report generated[cite: 1259].
* [cite_start]Charge for outcomes, not feature count: time saved, quotes followed up, missed jobs recovered[cite: 1260].

### [cite_start]Suggested plan structure to test [cite: 1261]

| Plan | Target user | Includes | Pricing logic |
|---|---|---|---|
| Starter | [cite_start]Sole trader testing AI admin. [cite: 1262] | [cite_start]Voice site notes, AI quote/report drafts, basic tasks, exports. [cite: 1262] | [cite_start]Affordable entry plan; validate habit. [cite: 1262] |
| Pro | [cite_start]Busy owner/operator. [cite: 1262] | [cite_start]Send tracking, follow-up automation, customer timeline, templates, more AI usage. [cite: 1262] | [cite_start]Core paid plan once product creates repeat value. [cite: 1262] |
| Phone add-on | [cite_start]Tradies losing jobs from missed calls. [cite: 1262] | [cite_start]Missed-call capture, callback SMS, AI receptionist pilot. [cite: 1262] | [cite_start]Premium add-on after core workflow has trust. [cite: 1262] |
| Team | [cite_start]2-5 person crews. [cite: 1262] | [cite_start]Team members, roles, shared customers/jobs, admin dashboard. [cite: 1262] | [cite_start]Expansion revenue once SMB teams adopt. [cite: 1262] |

### [cite_start]Expansion watch-outs [cite: 1263]
* Avoid selling as generic CRM. [cite_start]The wedge is "admin that gets out of your way"[cite: 1264].
* [cite_start]Do not compete feature-for-feature with mature field-service systems too early[cite: 1265].
* [cite_start]Avoid fully autonomous AI before users trust draft quality[cite: 1266].
* [cite_start]Keep onboarding done-with-you until the product is obvious enough to self-serve[cite: 1267].
* Let the first 10 customers teach the vertical story. [cite_start]Do not force a vertical before evidence[cite: 1268].

---

## [cite_start]09 - NEXT 30 DAYS [cite: 1269]

### [cite_start]Immediate execution plan [cite: 1270]

| Week | Product | Engineering | Customer/GTM | Success signal |
|---|---|---|---|---|
| Week 1 | [cite_start]Define alpha workflow and clean onboarding fields. [cite: 1271] | [cite_start]Refactor schema around Jobs; add validation; fix photo storage plan. [cite: 1271] | [cite_start]Recruit 5 testers from personal network. [cite: 1271] | [cite_start]2 testers onboarded and first real notes created. [cite: 1271] |
| Week 2 | [cite_start]Quote editor v1 and report editor v1. [cite: 1271] | [cite_start]AI schema, prompt versioning, AI error handling, save flow cleanup. [cite: 1271] | [cite_start]Watch testers use the app live and note friction. [cite: 1271] | [cite_start]First quotes/reports sent outside the app. [cite: 1271] |
| Week 3 | [cite_start]Follow-up task scheduling and dashboard improvements. [cite: 1271] | [cite_start]Add communication log model and mark-sent state. [cite: 1271] | [cite_start]Ask for willingness-to-pay feedback after real job usage. [cite: 1271] | [cite_start]At least 10 generated outputs saved. [cite: 1271] |
| Week 4 | [cite_start]Polish brand-kit UX and alpha onboarding. [cite: 1271] | [cite_start]Staging/prod setup, logging, backups, basic analytics. [cite: 1271] | [cite_start]Turn best customer story into case study and landing page copy. [cite: 1271] | [cite_start]Clear decision on first vertical and paid beta feature set. [cite: 1271] |

### [cite_start]Next build tickets [cite: 1272]

| Priority | Ticket | Definition of done |
|---|---|---|
| P0 | [cite_start]Create Job entity and link site notes/quotes/reports/tasks/bookings. [cite: 1273] | [cite_start]Every generated output belongs to a single job timeline. [cite: 1273] |
| P0 | [cite_start]Build quote editor and mark-sent/follow-up actions. [cite: 1273] | [cite_start]A tester can edit and mark a quote sent from mobile. [cite: 1273] |
| P0 | [cite_start]Move photos to storage service. [cite: 1273] | [cite_start]Database stores file references, not base64 payloads. [cite: 1273] |
| P0 | [cite_start]Add AI run logging and prompt versioning. [cite: 1273] | [cite_start]Every generation has traceable input/output/status. [cite: 1273] |
| P1 | [cite_start]Build booking UI from existing booking API. [cite: 1273] | [cite_start]Bookings page lists jobs to book and saved booking messages. [cite: 1273] |
| P1 | [cite_start]Add customer timeline. [cite: 1273] | [cite_start]Customer detail shows notes, quotes, reports, tasks, messages. [cite: 1273] |
| P1 | [cite_start]Add app analytics events. [cite: 1273] | [cite_start]Activation funnel is measurable. [cite: 1273] |
| P2 | [cite_start]Design missed-call handling v1 flow. [cite: 1273] | [cite_start]Prototype call capture/callback workflow with clear guardrails. [cite: 1273] |

### [cite_start]Decision gates [cite: 1274]
* [cite_start]After 10 testers: choose the first vertical or continue broad only if usage is evenly spread[cite: 1275].
* [cite_start]After 30 real notes: decide whether AI output quality is strong enough for paid beta[cite: 1276].
* [cite_start]After first paid beta: decide whether follow-up automation or missed-call handling drives stronger willingness to pay[cite: 1277].
* [cite_start]Before public launch: complete production auth, billing, storage, privacy/consent flows, and support process[cite: 1278].

---

## [cite_start]10 - RISK REGISTER [cite: 1279]

### [cite_start]Risks and mitigations [cite: 1280]

| Risk | Why it hurts | Mitigation |
|---|---|---|
| Generic positioning | [cite_start]All trades messaging can feel vague and weak. [cite: 1281] | [cite_start]Start broad through network but publish vertical-specific proof once a cluster emerges. [cite: 1281] |
| AI hallucination/pricing trust | [cite_start]Wrong quote details can lose trust fast. [cite: 1281] | [cite_start]Do not invent price; show missing info; require human approval; add eval tests. [cite: 1281] |
| Too much product scope | [cite_start]Trying to beat ServiceM8/Tradify/AroFlo feature-for-feature will slow the wedge. [cite: 1281] | [cite_start]Win voice admin first; integrate or export before replacing every system. [cite: 1281] |
| Low willingness to pay | [cite_start]Tradies may say it is cool but not subscribe. [cite: 1281] | [cite_start]Charge early in beta, measure repeat use, and anchor value to time saved and jobs recovered. [cite: 1281] |
| Missed-call complexity | [cite_start]Voice agents, phone numbers, consent, and call quality are harder than document generation. [cite: 1281] | [cite_start]Build missed-call capture and callback SMS before full AI receptionist. [cite: 1281] |
| Operational support burden | [cite_start]Non-software users may need help setting up. [cite: 1281] | [cite_start]Done-with-you onboarding, simple templates, help videos, and a tight first vertical. [cite: 1281] |
| Data/privacy concerns | [cite_start]Customer/job data, photos, and calls are sensitive. [cite: 1281] | [cite_start]Clear consent, retention, secure storage, audit logs, and privacy-friendly defaults. [cite: 1281] |

### [cite_start]Final recommendation [cite: 1282]
* [cite_start]Build the next version around the job timeline and the quote/report/follow-up loop[cite: 1283].
* [cite_start]Do not rush straight into full AI missed-call handling until the core AI admin output is trusted by real tradies[cite: 1284].
* [cite_start]The missed-call feature should become the moat, but the quote/report workflow should become the wedge[cite: 1285].
* [cite_start]The brand direction should stay bold, industrial, and practical: less dashboard theatre, more fast action[cite: 1286].
* [cite_start]The product should feel like an on-site tool, not office software[cite: 1287].