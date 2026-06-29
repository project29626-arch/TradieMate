# PRODUCT ROADMAP

**TradieMate Working Title**
*AI-powered admin for Australian tradies - roadmap from MVP to scalable Australian launch*

> **Brand direction reference:** field-first, straight talk, hi-vis action, industrial trust, voice-first UX.
> Prepared from business_context.md, the uploaded Replit MVP codebase, and the supplied brand kit. App name to be finalised later.

---

## 01 - ROADMAP THESIS

### Executive product direction
* The product should not become another heavy field-service management platform.
* The wedge is simpler and sharper: a mobile-first, voice-first admin co-pilot that turns what a tradie says on site into a quote, site report, follow-up task, booking message, and later a missed-call recovery workflow.
* The strongest launch path is to win one painful admin moment first: "I just finished the site visit, now turn my voice note into something I can send."
* From there, expand into follow-up, booking, invoices, missed calls, and eventually a full AI admin layer for 1-5 person Australian trade businesses.
* The current Replit MVP is a good alpha foundation: it already supports business setup, mobile site notes, browser speech-to-text, photo capture, Gemini-generated quote/report/task outputs, basic task management, and quote/report download/share flows.
* The next work is not more random features. It is production hardening, a cleaner quote-send loop, customer follow-up automation, and proof from real tradies.

### North Star
* Minutes of admin saved per tradie per week.

### First paid promise
* Speak once on site. Get a professional quote, site report, follow-up task list, and customer message in minutes.

### Primary customer
* Australian sole trader or 1-5 person trade business that is smartphone-native, admin-averse, and loses time or jobs through missed calls, rough quoting, and manual follow-up.

### Key product principles
* **One-handed field use:** every core action should work while standing on site, in the ute, or between jobs.
* **Human review by default:** AI writes drafts, the tradie approves before anything goes to a customer.
* **Speed beats complexity:** quote/report generation must feel faster than typing a text message.
* **Australian-native workflows:** ABN, GST, AUD, Australian English, local mobile formats, quote expiry, job address, call-out fee, and trade-specific language.
* **Trust before automation:** automate only after the tradie sees and trusts the output.

---

## 02 - CURRENT MVP AUDIT

**Where the first MVP is right now**

| Area | Current MVP status | Roadmap action |
|---|---|---|
| Frontend | React, Vite, TypeScript PWA-style mobile web app with dashboard, bottom nav, site notes, quotes, reports, tasks, account, and placeholder bookings. | Keep the stack. Tighten responsive field UX, PWA install/offline behaviour, and brand-kit v2 component system. |
| Backend | Express API with authenticated routes for business, customers, site notes, AI generation, quotes, reports, tasks, bookings, and dashboard summary. | Add validation, API contracts, rate limits, audit logs, background jobs, webhooks, and production deployment pipeline. |
| Database | PostgreSQL with Drizzle tables for users, businesses, customers, site notes, quotes, reports, tasks, and bookings. | Strengthen multi-tenant boundaries, add jobs table, communications log, follow-up schedules, subscriptions, files table, and AI run history. |
| AI | Gemini server-side endpoint generates JSON for job summary, report, quote draft, tasks, booking message, follow-up message, missing info, and risk notes. | Add structured schemas, retries, eval tests, prompt versioning, confidence/missing-info UI, and trade-specific templates. |
| Voice/photo capture | Browser speech recognition in en-AU; photos resized to base64 JPEG with max 8 photos. | Move photos to object storage, support offline drafts, improve recording reliability, and create photo evidence tagging. |
| Sharing/export | Quote and report detail pages support PDF/Word download plus native share, WhatsApp, Gmail/mail, and copy. | Add actual send tracking, email/SMS integration, quote acceptance, audit trail, and customer-facing link. |
| Bookings | Backend model exists, frontend route is placeholder. | Build booking screen, calendar connection, AI suggested times, and booking confirmation. |
| Auth/deployment | Uses Replit OIDC and Replit environment assumptions. | Move to production-ready auth and hosting when leaving prototype mode. |

### Biggest MVP gaps before charging
* The quote loop is not fully closed: a tradie can generate and share, but not properly send, track, follow up, and mark accepted from a single workflow.
* No automated follow-up engine yet: the app creates tasks/messages, but it does not send scheduled reminders or chase pending quotes/invoices.
* No missed-call product yet: this is a future moat, but should not be built before quote/report trust is proven.
* Photo storage is not scalable because base64 photos live in the database.
* Current auth and environment are prototype-friendly, not production SaaS-ready.
* No billing, trial, account limits, admin dashboard, usage analytics, or onboarding analytics yet.

### Current MVP feature maturity

| Capability | Business importance | MVP maturity | Next milestone |
|---|---|---|---|
| AI voice quoting | Lead wedge | Partially built: voice site note to quote draft. | Editable quote builder, send/track, quote acceptance. |
| Voice site reports + photo | High early value | Built v0: transcript + photos + AI report. | Photo evidence labels, branded PDF, send tracking. |
| AI follow-up | Retention driver | Message/task templates only. | Scheduled SMS/email follow-up engine. |
| Missed-call handling | Future moat | Not built. | Start with missed-call capture and callback script before full AI phone agent. |
| Task management | Daily utility | Basic tasks list and status toggle. | Task due dates, reminders, job links, recurring follow-ups. |
| Bookings | Conversion utility | API model exists, UI placeholder. | Booking calendar and customer confirmation. |

---

## 03 - ROADMAP OVERVIEW

### Development phases

| Phase | Timing | Product goal | Main unlock | Exit criteria |
|---|---|---|---|---|
| 0. Foundation reset | Week 0-1 | Turn Replit prototype into a clean alpha baseline. | A stable app that can be used by real testers without breaking trust. | Test accounts can create, generate, save, export, and share without manual developer help. |
| 1. Closed alpha | Weeks 1-4 | Nail the site-note-to-quote/report workflow. | First 5-10 tradies use it on real jobs. | At least 30 real site notes generated; 70% of AI outputs require only light edits. |
| 2. Paid beta | Weeks 5-8 | Close the quote/follow-up loop. | Tradies can send, track, and follow up from the app. | First paid users or LOIs; weekly active usage from at least 50% of onboarded testers. |
| 3. Launch wedge | Months 3-4 | Launch into the strongest early trade vertical. | A clear industry-specific story and onboarding flow. | One vertical case study with measurable admin time saved or quote follow-up improvement. |
| 4. AI admin engine | Months 5-6 | Add automated follow-up, booking, invoice chasing, and missed-call v1. | The app becomes a daily admin assistant, not just a document generator. | Retention improves; users rely on app for daily tasks and customer response. |
| 5. Australian scale | Months 7-12 | Expand across states and verticals through referrals and partnerships. | Repeatable GTM and product templates by trade. | 100+ active businesses, channel partner tests, and clear upgrade tiers. |
| 6. Platform/moat | 12-24 months | Become the AI admin layer for small trade businesses. | Proprietary workflow data, integrations, voice-agent defensibility. | Reliable AI receptionist, partner distribution, multi-user teams, and low churn. |

### Priority stack

| Priority | Build now | Do not overbuild yet |
|---|---|---|
| P0 | Quote/report generation, review, export, send, tracking, and customer follow-up. | Complex workforce scheduling, inventory, payroll, supplier marketplace. |
| P1 | Production auth, file storage, subscriptions, app analytics, onboarding, data safety. | Enterprise admin, franchise mode, deep accounting sync. |
| P2 | Missed-call capture and AI callback assistant v1. | Fully autonomous phone agent with no human guardrails. |
| P3 | Trade-specific templates and partner channels. | Trying to serve every trade with equal messaging from day one. |

---

## 04 - DETAILED PHASE PLAN

### Phase 0 - Foundation reset
* **Timing:** Week 0-1
* **Goal:** Make the current MVP stable, clean, and ready for real tradie testing.

**Product work**
* Confirm the exact alpha promise: "Speak your site note. Get quote, report, tasks, and customer message."
* Clean onboarding: business name, ABN, GST status, trade type, default labour rate, call-out fee, quote terms, payment terms, service area.
* Create a single "job" concept that links customer, site note, quote, report, task, booking, and communication logs.
* Add sample empty states that explain what to do in plain tradie language.

**Technical work**
* Add request validation with shared Zod schemas across client and server.
* Move photo storage out of JSONB/base64 and into object storage with signed URLs.
* Add AI run history: prompt version, model, input hash, output, status, error, cost/usage estimate.
* Add basic observability: error logging, request IDs, slow route logging, AI failure tracking.
* Create staging and production environments, even if production remains private.

**UX and brand**
* Translate the supplied brand kit into app tokens: Graphite, Concrete, Steel, Hi-Vis Green, Aussie Teal, Alert Orange.
* Make the primary action a big voice/mic action, not a tiny form submit.
* Use high-contrast status chips: Draft, Generated, Sent, Follow-up due, Accepted, Overdue.
* Keep the feel industrial and clean: less SaaS fluff, more "get back to the job".

**Exit criteria**
* One tester can complete onboarding in under 3 minutes.
* One real site visit can become a quote/report/task set without developer help.
* AI failure has a friendly fallback and the original site note is never lost.

### Phase 1 - Closed alpha
* **Timing:** Weeks 1-4
* **Goal:** Prove the core workflow with 5-10 real tradies from personal networks.

**Must-have features**
* Improved site note capture: customer, job address, trade type, urgency, voice note, photos, quick save.
* AI generate screen: show quote draft, report, tasks, booking message, follow-up message, missing info, and risk notes.
* Quote editor: edit scope, line items, GST, subtotal, total, terms, expiry, notes, and quote number.
* Report editor: edit summary, issue found, recommendation, next steps, selected photos, and photo captions.
* Save quote/report/tasks with one tap and navigate clearly to what was created.
* Download/share v1 remains but add "Mark sent" and "Set follow-up".

**Testing focus**
* Run every tester through a 30-minute onboarding call.
* Ask them to use it on 3 real jobs, not fake examples.
* Collect before/after admin time, edit count, and whether they would send the output to a customer.
* Record exact words tradies use to describe value and confusion. This becomes website copy.

**Exit criteria**
* 30+ real notes generated.
* At least 10 generated quotes or reports sent externally.
* At least 5 testers say they would keep using it weekly.
* Identify the strongest first vertical from actual usage, not guessing.

### Phase 2 - Paid beta
* **Timing:** Weeks 5-8
* **Goal:** Turn the app from a generator into a trackable admin workflow.

**Core features**
* Real send workflow: send quote/report by email and/or SMS from inside the app.
* Communication log: who was contacted, what was sent, timestamp, delivery status where available.
* Follow-up engine v1: schedule follow-up for quote not accepted, unpaid invoice reminder, or booking confirmation.
* Customer record: timeline of site notes, quotes, reports, messages, tasks, and bookings.
* Dashboard v2: money waiting, quotes not sent, follow-ups due, jobs to book, overdue tasks, missed admin items.
* Subscription/trial system: free trial plus simple paid plan, with soft usage limits.

**Technical priorities**
* Integrate email/SMS provider via backend only.
* Add background job queue for scheduled follow-ups and AI generation retries.
* Add webhook handling for delivery, bounce, acceptance, and unsubscribe/opt-out states where applicable.
* Add subscription and billing tables.
* Add role-based access groundwork even if alpha is owner-only.

**Exit criteria**
* First paid beta users or signed willingness-to-pay commitments.
* Follow-up reminders produce measurable customer responses.
* Users open the app beyond initial generation: tasks, follow-ups, and dashboard create return usage.

---

## 05 - LAUNCH AND SCALE PHASES

### Phase 3 - Launch wedge
* **Timing:** Months 3-4
* **Goal:** Launch publicly into the strongest early vertical while keeping the product flexible enough to expand.

**Product work**
* Create trade templates for the first winning vertical: quote wording, common job types, common risk notes, photo evidence prompts, and follow-up timing.
* Build onboarding by trade: plumber, electrician, carpenter, builder, concreter, landscaper, etc., but only polish the winning vertical deeply first.
* Create customer-facing quote/report links with approve/request changes buttons.
* Add booking page v1 with time slots and Google/Apple calendar export or integration.
* Add quote acceptance status and automatic next task creation after acceptance.

**GTM work**
* Turn the first cohort into a local reference story with screenshots, quotes, and time saved.
* Use state-based tradie communities and peer referrals rather than broad paid ads too early.
* Test one simple offer: "We set it up with you in 20 minutes and your first quote is free."
* Build a public waitlist/landing page with vertical-specific copy.

### Phase 4 - AI admin engine
* **Timing:** Months 5-6
* **Goal:** Make the app feel like a real admin assistant that keeps jobs moving.

**Features**
* AI follow-up sequences: quote follow-up, booking confirmation, post-job review request, overdue invoice reminder.
* Missed-call handling v1: capture missed call, identify caller where possible, send callback SMS, create task, and draft callback script.
* AI receptionist pilot: optional number forwarding for after-hours or busy-on-site scenarios, with human approval guardrails.
* Invoice draft and payment reminder workflow. Keep accounting sync optional, not required.
* Admin autopilot dashboard: what needs attention today, what can wait, what AI already handled.

**Technical work**
* Communications layer for phone/SMS/email events.
* Consent and compliance UX for call recording/transcription and SMS follow-ups.
* Job state machine: lead -> site visit -> quote drafted -> sent -> follow-up -> accepted -> booked -> completed -> invoice -> paid.
* AI guardrails: allowed actions, blocked actions, escalation rules, and safe fallback scripts.

### Phase 5 - Australian scale
* **Timing:** Months 7-12
* **Goal:** Scale across more trade verticals and Australian regions without becoming generic.

**Product expansion**
* Vertical packs: plumbing, electrical, building/renovation, landscaping, concreting, roofing, tiling.
* State/service-area profiles: state-specific labels, service zones, call-out fee defaults, timezone handling.
* Team mode: owner, admin, technician, subcontractor permissions.
* Basic integrations: calendar, accounting export/sync, contact import, cloud storage, payment links.
* Referral and review workflow: after job completion, AI drafts review request and referral ask.

**GTM expansion**
* Referral loop: give existing tradies account credit for referred tradie businesses.
* Community demos: short Loom/TikTok-style demos showing one job from voice note to quote.
* Supplier/industry partner pilots once PMF signals are stronger.
* Case studies by vertical, not one generic landing page.

### Phase 6 - Platform and moat
* **Timing:** 12-24 months
* **Goal:** Become the default AI admin layer for small Australian trade businesses.

**Long-term opportunities**
* AI receptionist and missed-call recovery as the strongest defensible feature.
* Proprietary job-admin dataset: anonymised patterns from quotes, follow-ups, tasks, and customer response timing.
* Price and material intelligence by trade, starting with user-owned templates and later supplier integrations.
* Lead-to-cash workflow: capture, quote, accept, book, report, invoice, collect, review.
* Admin benchmarking: show tradies how much admin time, quote value, and follow-up revenue is waiting.
* Partner channel: suppliers, accountants/bookkeepers, industry associations, insurance brokers, trade schools.

---

## 06 - TECHNICAL ARCHITECTURE ROADMAP

### Scalable technical priorities

| Layer | Current state | Near-term priority | Scale-state direction |
|---|---|---|---|
| Frontend/PWA | Mobile-first React app with core screens. | Add install prompt, offline draft capture, loading states, better error states, and brand-kit components. | Fast PWA with offline-first job capture, accessibility, and device-native sharing. |
| API | Express routes with session auth. | Validation, pagination, standard error shapes, audit logging, rate limits. | Versioned API with background workers, webhooks, and integration endpoints. |
| Database | Postgres/Drizzle core tables. | Add jobs, communications, files, AI runs, subscriptions, follow-up schedules. | Tenant-safe schema with reporting views, retention policies, backups, and event history. |
| AI layer | Single Gemini generate endpoint. | Prompt versioning, schema enforcement, retry/fallback, confidence and missing-info detection. | Multi-model AI gateway, eval suite, trade templates, action guardrails, cost monitoring. |
| Files/photos | Base64 in database. | Object storage with image compression and signed URLs. | Photo evidence pipeline with captions, EXIF handling, and report attachments. |
| Comms | Share links/open apps only. | Email/SMS send, log, delivery state, scheduled follow-ups. | Phone, SMS, email, calendar, payment, and accounting event hub. |
| Auth/security | Replit OIDC prototype. | Production auth, tenant scoping tests, secure secrets, CSRF/cookie strategy. | Roles, teams, audit trails, SSO optional, security monitoring. |
| Billing | Not built. | Trial, subscription, usage limits, Stripe-style webhooks. | Plan tiers, add-ons for AI calls/SMS/phone, partner billing. |
| Analytics | Dashboard summary only. | Track activation, generation success, edits, sends, follow-ups, retention. | Cohort analytics by trade, region, plan, and workflow. |

### Suggested production schema additions

| Entity | Why it matters |
|---|---|
| jobs | Central object linking customer, site note, quote, report, booking, tasks, invoices, and communications. |
| communications | Audit trail for SMS/email/phone messages and customer-facing sends. |
| follow_up_schedules | Powers automated quote, booking, invoice, and review follow-ups. |
| ai_runs | Debugs quality, prompt versions, failure modes, cost, and latency. |
| files | Stores photo/report/quote assets outside database JSON. |
| subscriptions | Handles trial, plan, payment status, usage limits, and add-ons. |
| team_members | Supports 1-5 person operations and future admin/technician roles. |
| integrations | Stores connected providers such as email, SMS, calendar, accounting, payments. |

### AI quality system
* Create 20-30 golden test cases from real site notes across early verticals.
* Evaluate outputs for: useful scope, no invented price, correct GST handling, customer-safe language, missing info detection, and follow-up clarity.
* Save prompt versions so regressions can be traced.
* Show missing information to the user before they send a quote.
* Never let autonomous messages go out without an approval path until trust is proven.

---

## 07 - UX ROADMAP

### User experience improvements

| UX area | Roadmap recommendation |
|---|---|
| Home dashboard | Make it an admin command centre: today, money waiting, follow-ups due, jobs to book, overdue items, and one big voice action. |
| Voice action | Central mic button with clear states: ready, listening, processing, draft ready, missing info, saved. |
| Quote review | Use a simple card-by-card review: scope, line items, GST, terms, message, send. Avoid spreadsheet-style complexity. |
| Site report | Let users choose photos, add captions, and generate a clean customer-safe report. |
| Follow-up | Use suggested timing: tomorrow, 3 days, 7 days. Show exact message before send. |
| Field constraints | Large touch targets, high contrast, offline draft save, minimal typing, no tiny menus for core actions. |
| Brand direction | Move toward the supplied industrial board: Graphite base, Hi-Vis Green action, Aussie Teal for AI, Alert Orange for urgent/overdue. |
| Language | Use straight Aussie admin language: "Quote ready", "Follow up due", "Job booked", "Missing price", "Send to customer". |

### Activation flow
* Sign up and enter business basics.
* Create first site note using voice and optional photos.
* Generate AI outputs.
* Edit quote/report in under 2 minutes.
* Send or share to customer.
* Schedule follow-up.
* Return to dashboard and see saved time/money waiting.

### UX metrics to track
* Time from opening app to saved site note.
* Time from site note to generated quote/report.
* Percentage of generated outputs saved.
* Percentage of quotes sent externally.
* Average number of edits before send.
* Follow-up tasks completed or automated.
* Week 1 and week 4 retention by trade type.

---

## 08 - MARKET EXPANSION

### Australian market expansion roadmap
* The early target should stay broad enough to learn, but the launch story should narrow as soon as actual users cluster around one or two verticals.
* A generic "for all tradies" message is okay for personal outreach; public marketing needs sharper proof.

| Stage | Customer target | Channel | Offer | Learning goal |
|---|---|---|---|---|
| First 10 | Personal network tradies, likely 1-2 natural verticals. | Direct calls, DMs, in-person demos. | Free setup and hands-on onboarding. | Which job type, trade, and admin pain creates repeat usage? |
| 10-30 | Same vertical cluster plus nearby referrals. | Peer referrals, local Facebook groups, short demo videos. | Free trial then paid beta. | Which messaging drives demos and willingness to pay? |
| 30-100 | Winning vertical in 1-2 Australian states. | Case studies, state-based groups, local trade communities. | Monthly subscription with trial. | Retention, paid conversion, and support burden. |
| 100+ | More trade verticals and small teams. | Partner pilots, supplier relationships, accountants/bookkeepers, industry communities. | Tiered plans and add-ons. | Repeatable acquisition and vertical-specific onboarding. |

### Pricing tests
* Do not lock pricing too early. Test willingness to pay with the first cohort.
* Start with a simple paid beta: Starter for owner-operator, Pro for AI follow-up and higher limits, Phone add-on later for missed-call handling.
* Use a free trial because tradies may be skeptical of software until they see their own quote/report generated.
* Charge for outcomes, not feature count: time saved, quotes followed up, missed jobs recovered.

### Suggested plan structure to test

| Plan | Target user | Includes | Pricing logic |
|---|---|---|---|
| Starter | Sole trader testing AI admin. | Voice site notes, AI quote/report drafts, basic tasks, exports. | Affordable entry plan; validate habit. |
| Pro | Busy owner/operator. | Send tracking, follow-up automation, customer timeline, templates, more AI usage. | Core paid plan once product creates repeat value. |
| Phone add-on | Tradies losing jobs from missed calls. | Missed-call capture, callback SMS, AI receptionist pilot. | Premium add-on after core workflow has trust. |
| Team | 2-5 person crews. | Team members, roles, shared customers/jobs, admin dashboard. | Expansion revenue once SMB teams adopt. |

### Expansion watch-outs
* Avoid selling as generic CRM. The wedge is "admin that gets out of your way".
* Do not compete feature-for-feature with mature field-service systems too early.
* Avoid fully autonomous AI before users trust draft quality.
* Keep onboarding done-with-you until the product is obvious enough to self-serve.
* Let the first 10 customers teach the vertical story. Do not force a vertical before evidence.

---

## 09 - NEXT 30 DAYS

### Immediate execution plan

| Week | Product | Engineering | Customer/GTM | Success signal |
|---|---|---|---|---|
| Week 1 | Define alpha workflow and clean onboarding fields. | Refactor schema around Jobs; add validation; fix photo storage plan. | Recruit 5 testers from personal network. | 2 testers onboarded and first real notes created. |
| Week 2 | Quote editor v1 and report editor v1. | AI schema, prompt versioning, AI error handling, save flow cleanup. | Watch testers use the app live and note friction. | First quotes/reports sent outside the app. |
| Week 3 | Follow-up task scheduling and dashboard improvements. | Add communication log model and mark-sent state. | Ask for willingness-to-pay feedback after real job usage. | At least 10 generated outputs saved. |
| Week 4 | Polish brand-kit UX and alpha onboarding. | Staging/prod setup, logging, backups, basic analytics. | Turn best customer story into case study and landing page copy. | Clear decision on first vertical and paid beta feature set. |

### Next build tickets

| Priority | Ticket | Definition of done |
|---|---|---|
| P0 | Create Job entity and link site notes/quotes/reports/tasks/bookings. | Every generated output belongs to a single job timeline. |
| P0 | Build quote editor and mark-sent/follow-up actions. | A tester can edit and mark a quote sent from mobile. |
| P0 | Move photos to storage service. | Database stores file references, not base64 payloads. |
| P0 | Add AI run logging and prompt versioning. | Every generation has traceable input/output/status. |
| P1 | Build booking UI from existing booking API. | Bookings page lists jobs to book and saved booking messages. |
| P1 | Add customer timeline. | Customer detail shows notes, quotes, reports, tasks, messages. |
| P1 | Add app analytics events. | Activation funnel is measurable. |
| P2 | Design missed-call handling v1 flow. | Prototype call capture/callback workflow with clear guardrails. |

### Decision gates
* After 10 testers: choose the first vertical or continue broad only if usage is evenly spread.
* After 30 real notes: decide whether AI output quality is strong enough for paid beta.
* After first paid beta: decide whether follow-up automation or missed-call handling drives stronger willingness to pay.
* Before public launch: complete production auth, billing, storage, privacy/consent flows, and support process.

---

## 10 - RISK REGISTER

### Risks and mitigations

| Risk | Why it hurts | Mitigation |
|---|---|---|
| Generic positioning | All trades messaging can feel vague and weak. | Start broad through network but publish vertical-specific proof once a cluster emerges. |
| AI hallucination/pricing trust | Wrong quote details can lose trust fast. | Do not invent price; show missing info; require human approval; add eval tests. |
| Too much product scope | Trying to beat ServiceM8/Tradify/AroFlo feature-for-feature will slow the wedge. | Win voice admin first; integrate or export before replacing every system. |
| Low willingness to pay | Tradies may say it is cool but not subscribe. | Charge early in beta, measure repeat use, and anchor value to time saved and jobs recovered. |
| Missed-call complexity | Voice agents, phone numbers, consent, and call quality are harder than document generation. | Build missed-call capture and callback SMS before full AI receptionist. |
| Operational support burden | Non-software users may need help setting up. | Done-with-you onboarding, simple templates, help videos, and a tight first vertical. |
| Data/privacy concerns | Customer/job data, photos, and calls are sensitive. | Clear consent, retention, secure storage, audit logs, and privacy-friendly defaults. |

### Final recommendation
* Build the next version around the job timeline and the quote/report/follow-up loop.
* Do not rush straight into full AI missed-call handling until the core AI admin output is trusted by real tradies.
* The missed-call feature should become the moat, but the quote/report workflow should become the wedge.
* The brand direction should stay bold, industrial, and practical: less dashboard theatre, more fast action.
* The product should feel like an on-site tool, not office software.
