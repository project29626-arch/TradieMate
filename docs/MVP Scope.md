# MVP Product Scope

**Working Title:** App Name TBD
**Market:** Australian Tradies, Sole Traders, Contractors, and Small Trade Businesses
**Stack:** Gemini + Firebase + PWA First

---

## 1. MVP Overview

### What the MVP is
* The MVP is a mobile-first, voice-first admin assistant for Australian tradies.
* It helps a tradie capture job information quickly while on-site, then turns that information into practical admin outputs: tasks, customer messages, quote follow-ups, invoice follow-ups, and daily admin summaries.
* The first version should not try to replace ServiceM8, Tradify, AroFlo, Xero, MYOB, or a full CRM.
* The MVP should prove one core thing: Can a tradie save real time every week by speaking job/admin notes into the app and letting AI turn them into useful follow-ups and tasks?

### Who it is for
The MVP is for:
* Solo tradies who do everything themselves.
* Small trade teams with 1–5 workers.
* Trade business owners who are on-site during the day and doing admin at night.
* Partners, spouses, or admin helpers who help chase quotes, invoices, and customer messages.
* Contractors who currently use notes, texts, screenshots, paper, memory, or messy spreadsheets.

### Problem it solves
Australian tradies lose time and money because admin happens after the job, not during the job. The core pain is not “they want AI.” The real pain is:
* They forget to follow up quotes.
* They forget job details after leaving site.
* They miss calls while working.
* They delay sending quotes.
* They chase invoices too late.
* They do admin at night when they are tired.
* Customer communication is scattered across phone calls, SMS, email, and memory.

### Outcome the MVP should prove
The MVP should prove that users will:
* Capture job/admin notes in the app at least 3 times per week.
* Use AI-generated admin outputs instead of writing everything manually.
* Send quote or invoice follow-up messages from the app.
* Come back weekly because the app reduces admin stress.
* Show willingness to pay after seeing time saved.

### MVP North Star
* One spoken job note becomes useful admin action within 2 minutes.
* That is the core product promise.

---

## 2. Target Users

### Primary User 1: Solo Tradie
* **Profile:** A plumber, electrician, carpenter, concreter, handyman, tiler, builder, painter, roofer, landscaper, or similar trade operator working alone or mostly alone.
* **Main pain:** They do the work, answer calls, inspect jobs, quote jobs, chase customers, and handle payments themselves.
* **MVP need:** They need the fastest possible way to record job info and produce follow-ups without typing.

### Primary User 2: Small Trade Team
* **Profile:** A 2–5 person business with the owner still heavily involved on-site.
* **Main pain:** Job details are split across the owner, workers, phone calls, texts, and memory.
* **MVP need:** They need a basic shared admin system for jobs, notes, tasks, and customer follow-ups.

### Primary User 3: Admin Staff or Partner
* **Profile:** A spouse, partner, assistant, or casual admin person helping the tradie keep the business organised.
* **Main pain:** They do not always know what happened on-site and need the tradie to explain everything again.
* **MVP need:** They need clear site notes, tasks, and follow-up messages generated from the tradie’s voice notes.

### Primary User 4: Trade Business Owner
* **Profile:** A small business owner trying to become more organised and professional without buying a heavy field-service platform.
* **Main pain:** They know admin is costing them money but do not want complex software.
* **MVP need:** They need simple daily visibility: what quotes need follow-up, what invoices need chasing, what tasks are overdue, and what jobs need action.

---

## 3. Core MVP Problem
The MVP should focus on the admin gap between “job happened” and “admin got done.”

**Main pain points to validate:**
1. **Missed Calls:** Tradies cannot answer the phone while on-site, driving, using tools, or speaking with customers.
2. **Quote Follow-Ups:** Quotes get sent late, forgotten, or never followed up.
3. **Invoice Follow-Ups:** Unpaid invoices are chased manually and inconsistently.
4. **Voice Notes:** Tradies already use voice, calls, and quick notes. The MVP should meet them where they are.
5. **Job Tracking:** Users need a lightweight job record, not a complex project management system.
6. **Customer Communication:** The MVP should help draft clear, professional SMS/email messages quickly.
7. **Basic Admin Automation:** The MVP should automate reminders, summaries, and message drafting — not full business operations yet.

---

## 4. MVP Feature Scope

### A. Must-Have for MVP
These are the minimum features needed to validate the product.

| Feature | User Problem | Feature Description | User Flow | Business Value | Technical Requirement | Priority |
|---|---|---|---|---|---|---|
| Firebase login | Users need secure access to their business data | Email/password login, Google login optional | User signs up → creates account → enters business profile | Required for real beta users and data separation | Firebase Authentication, Firestore user profile, security rules | P0 |
| Business setup | AI needs business context for messages and quote language | Capture business name, trade type, ABN, GST status, default terms, contact details | Signup → business setup → dashboard | Makes outputs more professional and Australian-specific | Firestore businesses collection | P0 |
| Customer records | Users need a place to save customers | Add customer name, phone, email, address, notes | Dashboard → customers → add/edit customer | Reduces repeated typing and supports follow-ups | Firestore customers collection | P0 |
| Basic job records | Admin needs to connect notes, tasks, messages, quotes, and invoices to a job | Create simple job with customer, address, status, job type | Add customer → create job → add note/tasks/messages | Creates the core operating layer | Firestore jobs collection | P0 |
| Voice note capture | Tradies do not want to type on-site | Record or dictate job/admin notes using phone microphone | Job → tap voice button → speak → save note | Core wedge; validates voice-first behaviour | Browser speech-to-text or audio upload to Firebase Storage; Firestore voiceNotes | P0 |
| AI note summary | Messy notes need to become clean admin records | Gemini turns voice transcript into summary, key details, missing info | Save voice note → generate summary → user reviews | Saves time and makes app useful immediately | Cloud Function calling Gemini; structured JSON response | P0 |
| AI task extraction | Tradies forget what to do next | Gemini converts note into tasks with due dates and priority | Voice note → “Create tasks” → tasks appear | Turns voice into action | Gemini Cloud Function, tasks collection | P0 |
| Task list | Users need a simple admin to-do list | View, complete, and filter tasks by today, overdue, follow-up, job | Dashboard → tasks → mark done | Helps retention and daily usage | Firestore tasks, indexes by businessId/status/dueDate | P0 |
| Quote follow-up message drafting | Users forget or avoid quote follow-ups | Generate polite SMS/email follow-up for pending quote | Job/quote → “Draft follow-up” → edit → copy/send | Helps win more jobs | Gemini function, messages collection | P0 |
| Invoice follow-up message drafting | Users chase invoices late | Generate professional payment reminder | Invoice/job → “Draft invoice reminder” → edit → copy/send | Improves cashflow; strong business value | Firestore invoices, Gemini message drafting | P0 |
| Daily admin summary | Users need to know what needs action today | AI/admin dashboard summarises overdue tasks, quotes to follow, invoices to chase | Open app → see “Today’s admin” | Makes app sticky | Firestore query + Gemini optional summary | P0 |
| PWA installable app | Users need home-screen access without App Store | Mobile-friendly web app installable to phone | Open link → add to home screen → use like app | Fast launch and low friction | Firebase Hosting, web manifest, service worker | P0 |
| Basic analytics | Founder needs to know if MVP is working | Track signups, active users, voice notes, AI generations, follow-ups | App events fire automatically | Validates product-market fit | Firebase Analytics / Google Analytics | P0 |
> *(Data from Must-Have MVP table)*

### B. Should-Have After Validation
These should be built once the first 5–10 users are actually using the core workflow.

| Feature | User Problem | Feature Description | User Flow | Business Value | Technical Requirement | Priority |
|---|---|---|---|---|---|---|
| Photo upload for site notes | Job evidence is visual | Add photos to job/site note | Job → add photo → attach to note/report | Supports reports and trust with customers | Firebase Storage, Firestore photo metadata | P1 |
| AI site report draft | Users need professional site reports | Gemini turns notes/photos into clean customer-facing report | Voice note + photos → generate report → review | Makes tradie look professional | Gemini function, reports collection, Storage URLs | P1 |
| Manual quote draft | Users need lightweight quote drafting | Create a quote from job info and AI scope, with editable line items | Job → create quote → edit → export/copy | Validates quote workflow without full accounting | Firestore quotes, PDF/HTML export later | P1 |
| Basic invoice record | Users need to track unpaid invoices | Add invoice amount, due date, status manually | Job → add invoice → status unpaid/paid | Enables invoice follow-up workflow | Firestore invoices | P1 |
| Push reminders | Users forget to follow up | Reminders for due tasks, quote follow-ups, invoice follow-ups | Set due date → receive reminder | Drives retention | Firebase Cloud Messaging, Cloud Functions scheduler | P1 |
| Message history | Users need record of what was sent/copied | Store drafted/sent/copied messages | Generate message → copy/send → log message | Useful for admin and proof | Firestore messages collection | P1 |
| Admin/helper role | Partners/admin staff need access | Invite one extra user to business | Owner invites admin → admin logs in | Expands value beyond solo user | Firebase Auth, teamMembers collection, rules | P1 |
| Simple export | Users may want to send professional docs | Export quote/report as PDF or shareable text | Quote/report → export PDF/copy text | Helps real-world use | Client-side PDF or Cloud Function render | P1 |
> *(Data from Should-Have table)*

### C. Nice-to-Have Later
These are useful but not needed to prove the MVP.

| Feature | User Problem | Feature Description | User Flow | Business Value | Technical Requirement | Priority |
|---|---|---|---|---|---|---|
| Xero/MYOB integration | Users already invoice elsewhere | Sync invoice status or customer info | Connect accounting → sync invoices | Strong retention later | OAuth, webhooks, Cloud Functions | P2 |
| SMS sending inside app | Copy/paste is friction | Send SMS directly from app | Draft message → send SMS | More automation | Twilio/Telnyx/Messagemedia integration | P2 |
| Email sending inside app | Users send quotes/reports by email | Send customer email directly | Draft email → send | More professional workflow | SendGrid/Mailgun/Gmail API | P2 |
| Calendar/job scheduling | Users need booking management | Simple calendar and job booking | Job → schedule date/time | Useful but can become complex | Calendar UI, Firestore bookings | P2 |
| Trade-specific templates | Different trades speak differently | Templates for plumbing, electrical, carpentry, building, etc. | Choose trade → AI uses template | Improves AI quality | Prompt templates by tradeType | P2 |
| Customer portal | Customers can approve quotes online | Customer opens link and accepts quote | Send quote link → customer approves | Better conversion | Hosted public quote pages | P2 |
| Team job assignment | Small teams need coordination | Assign jobs/tasks to workers | Owner assigns task → worker sees it | Useful for teams | teamMembers, permissions, notifications | P2 |
> *(Data from Nice-to-Have table)*

### D. Do Not Build Yet
These sound impressive but will slow validation.

| Feature | User Problem | Feature Description | User Flow | Business Value | Technical Requirement | Priority |
|---|---|---|---|---|---|---|
| Full AI phone agent | Missed calls are painful, but real call handling is complex | AI answers/returns calls and books jobs | Customer calls → AI handles call | Strong future moat but high risk | Telephony, call recording, transcription, consent, scheduling, error handling | Do not build yet |
| Full accounting system | Users need invoicing, but accounting is crowded | Replace Xero/MYOB | Create invoices, payments, BAS, accounting | Too big and regulated-adjacent | Payments, accounting rules, tax logic | Do not build yet |
| Marketplace for tradies | Customers find tradies | Consumer-side job marketplace | Customer posts job → tradies quote | Different business model | Two-sided marketplace | Do not build yet |
| Complex project management | Bigger teams need project management | Gantt charts, dependencies, staff schedules | Create project plan | Not for 1–5 person MVP | Heavy UI/data model | Do not build yet |
| Native apps from day one | Users want mobile access | iOS/Android app stores | Download from App Store | Expensive before validation | Separate build/deployment | Do not build yet |
| Automated quote pricing | Users want price help | AI calculates exact quote price | Speak job → AI prices it | Dangerous if wrong | Pricing database, labour/material logic | Do not build yet |
| Supplier integrations | Users buy materials | Connect Reece/Bunnings/Tradelink | Add materials from supplier | Useful later | Partner APIs | Do not build yet |
> *(Data from Do Not Build Yet table)*

---

## 5. Gemini AI Scope

### How Gemini should be used in the MVP
* Gemini should act as an admin drafting assistant, not an autonomous operator.
* The user should always review and approve AI output before sending anything.

### MVP Gemini Use Cases

**1. Voice Note Summarisation**
* **Input:** Voice transcript, Job/customer context, Business details, Trade type.
* **Output:** Clean internal job summary, Key issue, Customer request, Work required, Missing information, Risk notes, Suggested next action.
* **Purpose:** Turn messy spoken notes into clear admin records.

**2. Turning Voice Notes into Tasks**
* **Input:** Voice note transcript, Job status, Due date hints, Customer context.
* **Output:** Task title, Task description, Priority, Due date suggestion, Task type: quote, invoice, call, booking, site work, admin.
* **Purpose:** Make the app feel like “speak once, admin appears.”

**3. Drafting Customer Messages**
* **Input:** Customer name, Job summary, Tone preference, Message type.
* **Output:** SMS version, Email version, Short version, Friendly version.
* **Purpose:** Help tradies communicate professionally without sounding robotic.

**4. Quote Follow-Up Suggestions**
* **Input:** Quote status, Days since quote sent, Job type, Customer name, Quote amount if available.
* **Output:** Follow-up message, Recommended timing, Suggested next step.
* **Purpose:** Increase quote response speed and reduce forgotten follow-ups.

**5. Invoice Follow-Up Message Generation**
* **Input:** Invoice amount, Due date, Days overdue, Customer name, Prior reminder count.
* **Output:** Gentle reminder, Firmer reminder, Final reminder draft.
* **Purpose:** Help users chase money without awkward wording.

**6. Missed Call Response Suggestions**
* **Input:** Missed call number/contact, Existing customer/job if matched, Optional manual note from tradie.
* **Output:** Suggested callback SMS, Suggested voicemail-style message, Suggested task: call back today.
* **Purpose:** Validate missed-call admin pain without building real AI calling yet. Important: MVP should not make or receive phone calls automatically.

**7. Daily Admin Summary**
* **Input:** Today’s tasks, Overdue tasks, Draft quotes, Pending follow-ups, Unpaid invoices, Missed call logs.
* **Output:** “Today’s admin”, Top 3 actions, Risk warnings, Suggested quick wins.
* **Purpose:** Make the app useful every morning or end of day.

### AI should not do yet
Gemini should not:
* Send messages automatically without user review.
* Call customers.
* Promise job availability.
* Confirm bookings without user approval.
* Generate legally binding contract terms.
* Create final quote pricing without user input.
* Give safety, compliance, licensing, or legal advice as fact.
* Replace accounting software.
* Make payment demands automatically.
* Store raw prompts without user/business linkage and security controls.
* Invent material costs or labour charges.

### Required AI safety/product rules
Every AI output should have:
* “Review before sending” label.
* Editable text.
* Missing information warning.
* Confidence or “needs review” status.
* AI log stored for debugging.
* Clear source context: voice note, job, customer, invoice, quote.

---

## 6. Firebase Scope

* **Firebase Authentication:** Used for User signup/login, Business owner account, Admin/helper login later, Password reset, Identity management. Use email/password and Google login first. Phone login can be tested later because SMS-based auth can add cost and complexity.
* **Firestore Database:** Used for Users, Businesses, Customers, Jobs, Quotes, Invoices, Voice notes, Tasks, Messages, Notifications, AI logs. Firestore is fast to build with, works well with web/mobile apps, and is suitable for MVP-stage multi-tenant SaaS if security rules are done properly. Warning: Firestore cost can grow if the app reads too much data repeatedly. Use proper indexes, query limits, pagination, and dashboard summary documents.
* **Firebase Storage:** Used for Site photos, Voice note audio files if stored, Generated PDFs later, Business logos later. Store photos and optional audio only when needed. If browser speech-to-text provides transcript, avoid storing raw audio by default to reduce privacy and storage risk.
* **Firebase Hosting:** Used for Hosting the PWA, Fast public deployment, Custom domain, HTTPS, Web app delivery. Use Firebase Hosting for the first launch. Keep deployment simple.
* **Firebase Cloud Functions:** Used for Calling Gemini securely, Hiding API keys from frontend, Generating AI summaries, Creating tasks from voice notes, Drafting messages, Scheduled reminders, Notification triggers, Data validation, Future webhook handling. All AI calls must go through Cloud Functions. Do not call Gemini directly from the frontend.
* **Firebase Cloud Messaging:** Used for Follow-up reminders, Task reminders, Daily admin summary notifications, Quote/invoice chase reminders. Use push notifications carefully. For beta, also support email/SMS-style fallback or in-app reminders because push permissions can be unreliable depending on user/device/browser behaviour.
* **Firebase Analytics:** Used for Signup events, Activation rate, Voice note created, AI output generated, Task created, Message copied/sent, Follow-up completed, Daily active and weekly active usage. Analytics is critical. Without it, you will not know if users are actually getting value.
* **Firebase Crashlytics:** Used for Native iOS/Android crash reporting later, Flutter/React Native/Capacitor native wrapper later. Not required for pure PWA MVP. Add later if wrapping into mobile apps. For PWA, use frontend error logging and analytics first.
* **Firebase Security Rules:** Used for Preventing users from accessing another business’s data, Protecting customer information, Protecting uploaded files, Enforcing business-level access. This is not optional. Multi-tenant data security must be designed from day one.
* **Firebase App Check:** Used for Reducing API abuse, Protecting Firestore, Functions, and Storage from unauthorised clients. Add after core MVP is running, before public beta or paid launch.

---

## 7. PWA Scope

* **PWA first version:** The first app should launch as a Progressive Web App.
* **Required PWA behaviour:**
    * **Mobile-first design:** The app must be designed for phone-first usage. Desktop should work, but phone is the main product.
    * **Installable app experience:** Users should be able to add the app to their phone home screen.
    * **Offline or limited offline support:** MVP should support: Viewing recently loaded jobs/tasks, Drafting a voice note or text note offline if possible, Saving locally and syncing later, Showing clear “offline” state. Do not attempt full offline sync for everything yet.
    * **Push notification considerations:** Use push notifications for: Daily admin reminder, Quote follow-up due, Invoice follow-up due, Overdue task. But do not rely only on push notifications in MVP. Many users ignore or block push prompts.
    * **Fast loading:** The app should load quickly on mobile data. Avoid heavy animations, large images, and bloated dashboards.
    * **Home screen access:** Include: Web app manifest, App icon, Splash screen styling, Clear “Add to Home Screen” onboarding step.
    * **Responsive design:** Phone-first layout, but desktop/tablet should work for admin helpers who may use a laptop.

---

## 8. Native App Strategy

**Option 1: Start with PWA Only**
* **Pros / Cons:** Fastest, cheapest, easiest to update, no App Store approval, perfect for testing. / Push/offline can be less reliable than native, users may not install it properly.
* **Cost / Complexity:** Low / Low to medium.
* **Best use case / Timing:** MVP, first 10 customers, fast iteration. / Now.
* **Verdict:** Best option for MVP.

**Option 2: PWA + Capacitor Wrapper**
* **Pros / Cons:** Can ship to App Store/Google Play while reusing web code. / Still needs mobile build/deploy work, native plugins can become messy.
* **Cost / Complexity:** Medium / Medium.
* **Best use case / Timing:** When users specifically ask for App Store install or push reliability. / After beta if PWA is getting traction.
* **Verdict:** Good bridge after validation.

**Option 3: React Native Later**
* **Pros / Cons:** Better mobile UX, stronger native features, good JavaScript/React alignment. / Separate app codebase or heavy shared-code planning.
* **Cost / Complexity:** Medium to high / Medium to high.
* **Best use case / Timing:** When mobile experience becomes the main differentiator. / After clear retention and willingness to pay.
* **Verdict:** Good later option if the app becomes daily-use mobile software.

**Option 4: Flutter Later**
* **Pros / Cons:** Strong cross-platform UI, good performance, good for polished mobile apps. / Different language/framework from current React MVP.
* **Cost / Complexity:** High if rebuilding from React. / High.
* **Best use case / Timing:** If starting mobile apps from scratch with a dedicated mobile team. / Not for MVP.
* **Verdict:** Do not choose this now unless the team commits to Flutter fully.

**Option 5: Fully Native iOS and Android Later**
* **Pros / Cons:** Best device integration, best performance, strongest platform control. / Most expensive, slowest, two codebases, overkill before validation.
* **Cost / Complexity:** Very high / Very high.
* **Best use case / Timing:** Mature product with strong revenue and platform-specific needs. / Much later.
* **Verdict:** Do not build native from day one.

**MVP recommendation**
* Start with PWA only.
* Move to Capacitor wrapper only if early users say: “I want this from the App Store”, “Push reminders are unreliable”, “I don’t know how to add it to home screen”, “I need better camera/microphone/native file handling”.
* Do not move to React Native or Flutter until retention and willingness to pay are proven.

---

## 9. Technical Architecture

* **Frontend:** Recommended React + Vite + TypeScript PWA. Responsibilities: Mobile-first UI, Auth screens, Dashboard, Jobs/customers/tasks, Voice note capture, AI output review screens, Message drafting/editing, PWA install prompts. Current MVP note: The Replit MVP already has a useful frontend foundation with dashboard, business setup, site notes, quotes, reports, tasks, and account pages. The next build should not restart from zero unless the code quality blocks migration.
* **Backend:** Recommended Firebase Cloud Functions using TypeScript. Responsibilities: Gemini requests, AI prompt templates, Structured output validation, Notification triggers, Scheduled reminders, Server-side business logic, Webhooks later.
* **Database:** Recommended Firestore. Responsibilities: Multi-tenant business data, Jobs, Customers, Tasks, Follow-ups, Invoices, AI logs, Analytics-friendly events.
* **AI Layer:** Recommended Gemini via Cloud Functions only. Responsibilities: Summarise voice notes, Extract tasks, Draft messages, Generate quote follow-up copy, Generate invoice follow-up copy, Generate daily admin summaries. Important: Use structured JSON outputs. Validate the schema before saving to Firestore.
* **Authentication:** Recommended Firebase Authentication. MVP roles: Owner, Admin/helper. Later roles: Worker, Manager, Read-only accountant/bookkeeper.
* **File Storage:** Recommended Firebase Storage. Store: Site photos, Optional voice audio, Generated PDFs later, Business logo later.
* **Notifications:** Recommended Firebase Cloud Messaging + in-app notification feed. MVP notifications: Follow-up due, Invoice reminder due, Task overdue, Daily admin summary.
* **Analytics:** Recommended Firebase Analytics / Google Analytics. Track: Activation, Voice note created, AI output generated, Task completed, Follow-up copied/sent, Retention, Trial-to-paid intent.
* **Admin Dashboard:** MVP internal admin dashboard for founder/admin only: Users, Businesses, Usage metrics, AI generations, Errors, Feedback, Beta cohort status. Do not overbuild. A simple protected admin page is enough.
* **Third-Party Integrations:** MVP: Avoid most integrations. Only consider Gemini, Firebase, Optional email/SMS provider after validation. Later: Xero, MYOB, Google Calendar, Twilio/Telnyx/MessageMedia, Stripe, Supplier APIs.

---

## 10. Data Model

* **users:** Stores individual app users. Key fields: uid, email, displayName, phone, createdAt, lastLoginAt, onboardingCompleted, role, defaultBusinessId.
* **businesses:** Stores trade business profile. Key fields: businessId, ownerId, businessName, tradeType, abn, gstRegistered, phone, email, serviceArea, defaultPaymentTerms, defaultQuoteTerms, createdAt, updatedAt, subscriptionStatus later.
* **teamMembers:** Allows owner/admin/helper access to a business. Key fields: businessId, userId, role, status, invitedAt, acceptedAt, permissions.
* **customers:** Stores customer contact and job history. Key fields: customerId, businessId, name, phone, email, address, notes, createdAt, updatedAt, lastContactAt.
* **jobs:** Main work object connecting customer, notes, tasks, messages, quotes, and invoices. Key fields: jobId, businessId, customerId, title, jobType, jobAddress, status, priority, source, createdAt, updatedAt, nextAction, nextActionDueAt.
* **quotes:** Stores quote drafts and follow-up status. Key fields: quoteId, businessId, jobId, customerId, quoteNumber, status, amount, scopeOfWork, lineItems, sentAt, followUpDueAt, acceptedAt, declinedAt, aiGenerated, createdAt.
* **invoices:** Stores basic invoice tracking for follow-up. Key fields: invoiceId, businessId, jobId, customerId, invoiceNumber, amount, dueDate, status, paidAt, reminderCount, lastReminderAt, nextReminderDueAt.
* **voiceNotes:** Stores spoken notes or transcripts. Key fields: voiceNoteId, businessId, jobId, customerId, transcript, audioUrl optional, source, status, aiSummary, createdAt, createdBy, missingInfo.
* **tasks:** Stores admin and job tasks. Key fields: taskId, businessId, jobId, customerId, title, description, status, priority, type, dueAt, completedAt, assignedTo, sourceVoiceNoteId, aiGenerated.
* **messages:** Stores drafted/copied/sent communication. Key fields: messageId, businessId, jobId, customerId, type, channel, body, status, copiedAt, sentAt later, aiGenerated, sourceType, sourceId.
* **notifications:** Stores reminders and in-app alerts. Key fields: notificationId, businessId, userId, type, title, body, status, dueAt, readAt, relatedEntityType, relatedEntityId.
* **aiLogs:** Stores AI request/response metadata for debugging, cost control, and quality improvement. Key fields: aiLogId, businessId, userId, feature, model, inputSummary, outputSummary, tokenUsage, status, error, createdAt, userFeedback. Do not store sensitive full transcripts forever unless needed. Add retention rules later.

---

## 11. User Flows

* **Flow 1: New User Onboarding.** User opens PWA link → User signs up with email/password or Google → User enters business name → User selects trade type → User enters ABN optional → User sets GST status → User enters default payment/quote terms → App shows “Add to Home Screen” → User lands on dashboard → Dashboard shows empty state: “Create your first job note”. Success moment: User reaches dashboard in under 3 minutes.
* **Flow 2: Adding a Customer.** User taps “Customers” or “New Job” → User enters customer name → User adds phone number → User adds email optional → User adds address optional → User saves customer. Customer can now be linked to jobs, notes, quotes, invoices, and messages. Success moment: Customer added in under 30 seconds.
* **Flow 3: Creating a Job.** User taps “New Job” → User selects or creates customer → User enters job address → User selects job type → User adds basic title → User saves → App opens job detail screen. User can add voice note, task, quote, invoice, or message. Success moment: Job exists as the home for all admin.
* **Flow 4: Recording a Voice Note.** User opens job → User taps large microphone button → User speaks job/admin details → App transcribes or records note → User reviews transcript → User saves voice note → App shows “Generate admin actions”. Success moment: A messy spoken note is captured before the tradie forgets.
* **Flow 5: Turning a Voice Note into Tasks.** User saves voice note → User taps “Create tasks” → Cloud Function sends transcript/context to Gemini → Gemini returns structured tasks → User reviews tasks → User deletes/edits tasks if needed → User confirms → Tasks appear in task list and dashboard. Success moment: User speaks once and gets a usable admin to-do list.
* **Flow 6: Sending a Quote Follow-Up.** User opens dashboard → App shows quote follow-up due → User taps quote/job → User taps “Draft follow-up” → Gemini generates message → User edits message → User copies message or sends later → App logs follow-up as completed. Success moment: User follows up without thinking too hard.
* **Flow 7: Sending an Invoice Follow-Up.** User opens dashboard → App shows unpaid invoice due/overdue → User taps invoice → User taps “Draft payment reminder” → Gemini generates polite reminder → User edits if needed → User copies/sends → App increments reminder count and updates next reminder date. Success moment: User chases money faster and less awkwardly.
* **Flow 8: Handling a Missed Call.** MVP version should be manual, not automated. User taps “Missed Call” → User enters phone number or selects customer → User adds quick context optional → App suggests callback SMS → User copies/sends message manually → App creates task: “Call back customer”. Missed call is linked to customer/job if known. Success moment: User turns missed call into an action instead of forgetting it.
* **Flow 9: Viewing Daily Admin Summary.** User opens app in morning or end of day → Dashboard shows: Tasks due today, Overdue tasks, Quotes to follow up, Invoices to chase, Missed calls to action → User taps “Generate summary” or sees auto-generated summary → App shows top 3 recommended actions → User completes actions one by one. Success moment: User knows exactly what admin to do today.

---

## 12. Success Metrics

**Product Usage Metrics**
| Metric | Target for Beta |
|---|---|
| New users onboarded | 10–20 beta users |
| Activation rate | 60%+ create first job or voice note |
| Voice notes per active user | 3+ per week |
| AI generations per active user | 3+ per week |
| Tasks created from AI | 5+ per user/week |
| Follow-ups drafted | 2+ per user/week |
| Weekly active usage | 50%+ of beta users |
| 4-week retention | 30%+ early signal |
> *(Data from Product Usage Metrics table)*

**Business Value Metrics**
| Metric | What to Measure |
|---|---|
| Time saved per week | Self-reported before/after admin time |
| Admin tasks automated | Number of AI-generated tasks/messages |
| Quote response speed | Time from site visit to quote/follow-up |
| Invoice follow-up completion | Number of overdue invoices followed up |
| Missed call recovery | Number of missed calls turned into tasks/messages |
| Willingness to pay | "Would they pay $29, $49, $79, or $99/month?" |
| Referral intent | Would they recommend to another tradie? |
> *(Data from Business Value Metrics table)*

**MVP Validation Questions**
Ask beta users:
* Did this save you real admin time?
* Which feature did you actually use?
* Which feature felt useless?
* Did the AI write messages you would actually send?
* Did it help you follow up faster?
* What would make this worth paying for?
* Would you use it every week?
* Would your partner/admin staff use it?
* What trade-specific wording was wrong?
* What should be removed?

---

## 13. MVP Build Phases

* **Phase 1: Foundation.** Main goal: Set up the core app infrastructure and replace Replit-specific backend/auth with Firebase. Features included: Firebase project, Firebase Auth, Firestore setup, Firebase Hosting, Core security rules, Basic user/business setup, Basic dashboard, PWA manifest, Deploy pipeline. Estimated complexity: Medium. Dependencies: Firebase project, Domain, Existing Replit code review, UI decision: reuse current React app or rebuild clean. Risks: Poor Firestore structure causing messy scale later, Weak security rules, Replit-to-Firebase migration taking longer than expected.
* **Phase 2: Core Admin Workflows.** Main goal: Build useful non-AI admin workflows first. Features included: Customers, Jobs, Tasks, Manual invoices, Manual quote status, Basic missed call log, Dashboard summary, Message log. Estimated complexity: Medium. Dependencies: Firestore data model, UI components, Dashboard queries. Risks: Too much CRM complexity, Overbuilding job management, Users not wanting to enter data manually.
* **Phase 3: AI Automation.** Main goal: Make the app meaningfully faster than manual admin. Features included: Voice note transcript, Gemini note summary, Gemini task extraction, Quote follow-up draft, Invoice follow-up draft, Missed call response suggestion, Daily admin summary, AI logs. Estimated complexity: Medium to high. Dependencies: Gemini API key, Cloud Functions, Prompt templates, Structured output validation, Error handling. Risks: AI output too generic, AI inventing details, Users not trusting AI text, AI cost increasing with usage.
* **Phase 4: PWA Polish.** Main goal: Make the app feel like something tradies can use daily on their phone. Features included: Home screen install prompt, Fast loading, Mobile tap targets, Offline draft support, Basic push reminders, Better empty states, Brand kit visual polish, High contrast field-first UI. Estimated complexity: Medium. Dependencies: Stable frontend, Firebase Hosting, Service worker, FCM setup. Risks: Push notifications inconsistent, PWA install confusion, Offline sync bugs.
* **Phase 5: Beta Testing.** Main goal: Validate real usage with first 10–20 users. Features included: Founder/admin dashboard, Feedback button, Analytics events, Weekly user interviews, Bug tracking, Usage reports, Pricing testing. Estimated complexity: Low to medium. Dependencies: Usable MVP, Personal network outreach, Beta onboarding script. Risks: Users say they like it but do not use it, Wrong target segment, Too broad across all trades, Low willingness to pay.
* **Phase 6: Native App Decision.** Main goal: Decide whether the product needs App Store/Google Play apps. Decision criteria: Build native/wrapper only if: Weekly retention is strong, Users complain about PWA install or push reliability, Voice/camera usage needs better native access, Paid users ask for it, The product becomes daily-use software. Estimated complexity: Medium to high depending on path. Dependencies: Usage data, User feedback, Revenue signal, Technical review. Risks: Building apps too early, Splitting developer focus, Increasing maintenance before PMF.

---

## 14. Risks and Assumptions

**What is proven:**
* The business direction is clear: AI admin for Australian tradies.
* The current Replit MVP already proves that the product can be mocked and partially built.
* Voice-first admin is a strong wedge because tradies are mobile and time-poor.
* PWA-first is practical for fast validation.
* Firebase is suitable for early-stage speed.

**What is not proven:**
* Tradies will use a standalone admin app every week.
* Tradies will trust AI-generated customer messages.
* Tradies will pay monthly before deeper integrations exist.
* The product can win against existing field-service software.
* Missed-call handling is urgent enough to pay for in V1.
* Targeting all trade verticals from day one will work.

**Technical risks:**
* Firestore security rules are easy to get wrong.
* PWA push/offline support can be inconsistent.
* AI output needs schema validation.
* Voice transcription quality may vary by phone, accent, noise, and job site conditions.
* Firebase costs can increase if dashboard queries are inefficient.
* Photo/audio uploads may increase storage cost.

**AI accuracy risks:**
* Gemini may misunderstand trade-specific language.
* AI may invent missing details.
* AI may write messages that sound too polished or not tradie-like.
* AI may suggest wrong next actions.
* AI should not price jobs automatically in MVP.

**User adoption risks:**
* Tradies may not want to enter data.
* Users may prefer SMS/notes over another app.
* PWA install flow may confuse some users.
* The product may feel too generic across trades.
* Admin partners may become heavier users than tradies themselves.

**Privacy and data risks:**
* Customer names, phone numbers, addresses, job details, and invoice info are sensitive business data.
* Voice recordings may contain private information.
* Photos may show customer property.
* AI logs must be handled carefully.
* User consent and clear privacy wording are needed.

**Cost risks:**
* Gemini usage cost.
* Firebase reads/writes.
* Firebase Storage for photos/audio.
* SMS costs later.
* Telephony costs later.
* Native app maintenance later.

**Market validation gaps:**
* Best first trade vertical is unknown.
* Pricing is unknown.
* Most valuable workflow is unknown.
* Whether users prefer quote follow-ups, invoice follow-ups, or voice reports first is unknown.
* Whether missed-call handling is a wedge or later moat is unknown.

---

## 15. Recommended MVP Scope

**Build first:**
Build the smallest useful system: Firebase Auth, Business setup, Customers, Jobs, Voice notes, AI note summary, AI task extraction, Task dashboard, Quote follow-up draft, Invoice follow-up draft, Missed call response suggestion, Daily admin summary, PWA installable experience, Analytics and feedback tracking.

**Delay:**
Real AI phone answering, Automated customer calling, Full quote pricing automation, Xero/MYOB integrations, App Store/Google Play apps, Full invoicing/accounting, Calendar scheduling, Supplier integrations, Marketplace features, Complex team/project management.

**Test with real users:**
* Do users record voice notes?
* Do they trust AI summaries?
* Do they send AI-drafted follow-ups?
* Do invoice reminders feel valuable?
* Does the daily admin summary bring users back?
* Which trade vertical has the strongest pull?
* What price feels fair?
* Does the admin partner/spouse become the real power user?

**Avoid for now:**
Avoid building anything that does not directly prove time saved or admin pain solved. Do not build “cool AI” features unless they help a tradie: Remember something, Follow up faster, Chase money, Communicate better, Save typing, Get back to the job.

**Is PWA enough for first launch?**
Yes. PWA is enough for the MVP and first beta. The MVP’s job is to validate pain and behaviour, not win the App Store.

**When to consider native iPhone and Android apps:**
Consider native or a Capacitor wrapper only after:
* 10–20 beta users are active.
* At least 30% use it weekly after 4 weeks.
* Users are creating voice notes or follow-ups every week.
* At least 3–5 users say they would pay.
* Users complain about PWA limitations.
* Push/camera/microphone limitations become real blockers.

**Final recommendation:**
* The MVP should be a PWA-first Firebase app powered by Gemini, focused on one workflow: Capture job/admin info by voice → generate tasks and follow-up messages → help the tradie clear admin faster. That is the product to validate first.
* Missed-call AI should stay as a manual response-suggestion feature in MVP, not a full phone agent.
* Native apps should wait.
* The first goal is not to build the biggest tradie platform. The first goal is to prove that tradies will actually use this every week because it saves them time and helps them get paid faster.