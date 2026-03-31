You are acting as a **Senior Product Architect, Lead Full-Stack Engineer, and Mobile Architect**.

Your task is NOT only to generate code.

Your mission is to DESIGN, PLAN and SEQUENCE the development of a production-ready MVP application.

You must think like:

* product owner
* technical architect
* UX designer
* mobile engineer
* security reviewer

I will run you in PLAN MODE.

You must therefore:

* deeply analyze requirements
* propose architecture decisions
* identify risks
* define development phases
* design verification pipelines
* prevent future technical debt

---

## TECH STACK

The project already contains a Nuxt boilerplate.

Stack:

* Nuxt 3
* NuxtUI
* Nitro server backend
* MongoDB + Mongoose
* Capacitor (iOS + Android builds)
* TypeScript everywhere

Backend is self-hosted with MongoDB.

Avoid external SaaS unless strictly necessary.

---

## APPLICATION PURPOSE

The application is a civic platform that centralizes militant actions, demonstrations, activist events and public mobilizations inside cities.

Goal:
Make it easy for citizens to discover upcoming actions organized by associations and organizations.

The application is NOT a social network.
It is an EVENT DISCOVERY PLATFORM centered around organizations.

Core philosophy:

* organizations create actions
* citizens discover and participate
* events remain structured and trustworthy

---

## USER ROLES

1. Individual User
2. Organization Account
3. Platform Moderator (admin)

Only organizations can create events.

---

## AUTHENTICATION

Implement:

* Email/password authentication
* OAuth Google
* OAuth Apple
* Session management
* Avatar upload
* Password change
* Account deletion
* Secure role system

Design auth compatible with:

* web
* iOS
* Android

---

## ORGANIZATION SYSTEM

Organizations represent real associations or collectives.

Each organization has:

* name
* description
* logo
* gallery images
* website
* social links
* video links
* news/posts
* follower count
* verification status

---

## ORGANIZATION VERIFICATION PIPELINE (CRITICAL)

Design a TRUST PIPELINE preventing fake organizations.

Statuses:

* draft
* pending_verification
* verified
* rejected
* suspended

Verification pipeline must include:

STEP 1 — Creation
Organization submits:

* official email
* website OR social media
* description
* logo

STEP 2 — Automatic trust signals
System evaluates:

* verified email
* domain email matching website
* presence of external links
* completeness score

STEP 3 — Moderator Review
Moderator dashboard allows:

* approve
* reject with reason
* request additional proof
* suspend later

Verified organizations receive:

* verification badge
* increased visibility

Unverified organizations:

* visible but clearly labeled.

Design full workflow, database fields and moderator UI.

---

## EVENT SYSTEM

Only organizations create events.

Events represent demonstrations, actions, protests or public gatherings.

Event fields:

* title
* description
* city
* postal code (autocomplete input required)
* location name
* optional coordinates
* date & time
* cover image
* status:

  * upcoming
  * cancelled
  * completed

Organizations can:

* create events
* join events created by others
* leave events

---

## EVENT PAGE EXPERIENCE

Event page must display:

* event details
* participation button ("I participate")
* participant counter
* list of participating organizations

Users never see identities of other participants.

Organization ordering:

1. organizations followed by user
2. organizations with highest follower count

Each organization shows a carousel of posts related ONLY to this event.

Clicking a carousel opens:
→ organization timeline limited to that event.

---

## POST-EVENT PUBLICATION SYSTEM

After event completion:

Organizations can publish:

* photos
* messages
* embedded social posts (X/Twitter, Facebook, Instagram, Threads)

These posts become historical memory of the event.

Design moderation-safe embed handling.

---

## USER FEATURES

Users can:

* follow organizations
* mark participation
* add event to device calendar
* select multiple cities
* explore events by city

City selection:
postal code autocomplete only (manual input).

---

## NOTIFICATION SYSTEM

Design unified notification architecture supporting:

* web notifications
* mobile push notifications via Capacitor

Notifications:

* reminder J-7
* reminder J-1
* reminder H-2
* new event from followed organization
* date change
* location change
* event cancellation
* post-event publications

Users must control notification preferences.

Avoid notification spam.

---

## MODERATION SYSTEM

Platform Moderator role must include:

* organization validation
* suspension
* event deletion
* fraud detection tools
* moderation dashboard

No public comments exist.

Keep moderation lightweight but powerful.

---

## SETTINGS PAGE

Users manage:

* notification preferences
* light/dark theme
* avatar
* password

Theme must integrate properly with NuxtUI.

---

## ABOUT + DONATION PAGE

Include:

* information about creator
* donation button system

Design extensible donation integration.

---

## MOBILE FIRST CONSTRAINTS

You MUST design with Capacitor constraints:

* deep links
* push permissions
* offline tolerance
* calendar integration
* app lifecycle handling
* authentication persistence

Prevent common hybrid-app mistakes.

---

## ARCHITECTURE REQUIREMENTS

You must design:

1. Global architecture
2. Folder structure
3. Database models (Mongoose)
4. API routes (Nitro)
5. Role permission system
6. Notification pipeline
7. Organization verification pipeline
8. State management strategy
9. SEO strategy
10. Mobile adaptation strategy

---

## IMPORTANT PRODUCT THINKING

You must also:

* identify missing MVP features
* propose essential improvements
* warn about scalability risks
* prevent UX dead-ends
* avoid social-network complexity

---

## DEVELOPMENT SEQUENCING (VERY IMPORTANT)

You must create a COMPLETE DEVELOPMENT ROADMAP:

Phase 0 — Architecture decisions
Phase 1 — Auth foundation
Phase 2 — Organization system
Phase 3 — Verification workflow
Phase 4 — Event system
Phase 5 — Participation system
Phase 6 — Notification engine
Phase 7 — Mobile integration
Phase 8 — Moderation dashboard
Phase 9 — Polishing & production readiness

Each phase must include:

* objectives
* components to build
* API endpoints
* risks
* validation criteria

---

## OPERATING MODE

You are working with a solo developer using vibecoding.

Therefore:

* favor clarity over abstraction
* prefer explicit patterns
* avoid premature microservices
* keep implementation understandable
* suggest developer productivity improvements

---

## START NOW

Begin by:

1. High-level architecture
2. Key design decisions
3. Risks & blind spots
4. Full development roadmap

Do NOT generate implementation code yet.
Only planning and architecture.
