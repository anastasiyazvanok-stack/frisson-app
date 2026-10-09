# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary users are women working on their psychological state — onboarding segments them by current need: exhausted and needing rest, searching for a sense of self, anxious and seeking calm, or ready to grow further ("Я устала — нужна тишина и восполнение" / "Я ищу себя" / "Я в тревоге" / "Я готова расцветать"). They arrive wanting a structured, guided practice rather than an unguided meditation library.

## Product Purpose
Nectar is a women's psychological-capital app: guided meditations, an AI coach, a journal, a mood/state visualization ("Orbit"), and an energy test that together track and grow five axes of psychological capital (safety, self-worth, femininity, trust, authenticity). Success is a user returning to track and grow her state over time, not a single session.

## Positioning
Two factors together, neither alone: (1) the practice content follows a named clinical methodology (created by Anastasia Zvanok, Master of Clinical Psychology) rather than generic wellness content, and (2) the product is one connected system — AI coach, journal, meditations, and state-tracking feed the same five-axis psychological-capital model — rather than an audio library with bolt-on features.

## Operating Context
Primary market and language is Russian-speaking; English exists as a secondary language for a future/international audience, not the current focus. Distributed as a web PWA (Vercel) and wrapped for iOS via Capacitor — the iOS build is a packaging/distribution channel for the same web design language, not a separate native design system. Backend is Supabase (auth, Postgres with RLS, Storage); AI features (coach replies, diary reflections, insights) proxy through Anthropic's API via authenticated serverless endpoints.

## Capabilities and Constraints
- Meditation content (23 pieces, 15 with audio currently) and categories are hard-coded in `src/data/content.js` / `src/data/audioUrls.js`; a parallel Supabase-backed catalog (`meditations`/`sections` tables, managed via an Admin panel) exists in code but is not yet wired into the Library screen — not a live CMS yet.
- Free/paid split is already modeled per meditation (7 free, 16 paid of the current 23) and shown in the UI, but no payment processor is integrated (no Stripe/RevenueCat/StoreKit) — the subscription described in the Terms of Use is not yet technically enforced.
- No established accessibility requirement beyond incidental ARIA usage; not yet audited.

## Brand Commitments
Brand name is Nectar (brandbook-governed: obsidian/plum/bordeaux/rust/ember/amber/gold/iris/lavender/cream palette, Cormorant Garamond + Manrope type, a two-circle "lens" mark). Tagline: "Расцветать — это тоже работа с психикой." / "Blooming is inner work, too." Tone is warm, adult, direct — no diagnoses, no urgency pressure, no spiritual-bypass language (brandbook explicitly rules out lines like "Не пропусти серию!").

## Evidence on Hand
No real user testimonials, press, or case studies yet — soft-launch stage, first testers only. Do not fabricate any.

## Product Principles
- One connected system, not a feature pile: AI coach, journal, meditations, and the orbit/energy test all feed the same five-axis psychological-capital model.
- Methodology over generic wellness: content and copy trace back to a named clinical-psychology framework, not interchangeable mindfulness filler.
- Warm, not clinical and not saccharine: adult tone, no diagnoses, no guilt-based engagement hooks.
- Russian-speaking users first; design and copy decisions should not assume an English-first audience.
