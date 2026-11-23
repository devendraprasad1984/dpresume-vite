# Devendra Prasad: Principal Frontend Engineer, Professional Summary

## Overview

I am a principal-level frontend engineer, architect and engineering leader with 20 years of experience building web applications, the last several of them leading frontend architecture for large commerce platforms. My focus is scalable, high-performance digital commerce: platforms that serve many brands, regions and customers from one coherent frontend foundation, and that stay fast, secure and maintainable as they grow.

My core toolset is React, Next.js, micro-frontends, monorepos and CMS-driven architectures, using Payload CMS and Adobe Experience Manager (AEM). I work at the intersection of architecture, platform modernisation and engineering excellence: deciding how systems should be shaped, leading the teams that build them, and making sure the result is measurable in cost, speed, conversion and customer trust.

At Blackhawk Network (BHN) I own and lead the global multi-tenant frontend architecture of giftcards.com, a high-traffic e-commerce platform. I am responsible for its availability, scale and performance, and for the engineering standards, roadmap and practices that the teams around it follow. Outside delivery, I contribute to technical roadmaps, architecture reviews, hiring, mentoring and cross-team enablement, and I am a recipient of the D2C Innovation Award (2026).

## Owning a multi-tenant commerce platform

The heart of my current role is ownership of the frontend architecture for giftcards.com. A multi-tenant platform has to serve several brands and regions without becoming a collection of copies, and without letting one tenant's needs distort another's experience. That makes architecture decisions unusually consequential: a choice about how components are shared, how content is composed or how releases are deployed is repeated across every tenant.

I lead this architecture globally. That means I am accountable for the system's availability, for how it scales under high traffic, and for its performance in the browser. I treat these as architectural properties rather than late-stage tuning tasks. They are decided by how pages are rendered, how code is split and shipped, how content is delivered and how the delivery pipeline behaves, so I shape those choices early and review them continuously.

The platform has run on AEM Cloud, and my work includes keeping it available and performant there while leading its evolution. Because I carry responsibility for the whole picture, from the content system through the application framework to the build and release pipeline, I can make trade-offs that a single team looking at one layer could not.

## Leading the migration from AEM to Next.js and Payload CMS

One of the most significant initiatives I have led is the platform migration from AEM to Next.js and Payload CMS. The immediate, concrete result was removing AEM licensing, which saves roughly **$1.5 million per year**. That figure matters, but the migration also changed what the platform is.

Moving to Next.js and Payload CMS gave the teams a modern, code-first application stack and a CMS that fits it, in place of a heavier platform with licensing cost attached. It also reduced platform complexity and gave the teams more flexibility in how they build, compose and deliver content and experiences.

Platform migrations of this kind are as much leadership work as engineering work. They require a clear architectural target, a credible path from the current system to that target, agreement from the people who depend on the platform, and the discipline to deliver without disrupting a live, high-traffic commerce business. Driving this initiative is the clearest example of how I combine architecture with business outcomes: the technical decision and the cost decision are the same decision.

## Micro-frontend architecture and reusable patterns

I engineered the micro-frontend architecture for giftcards.com, built around reusable patterns that apply across applications rather than solutions that work in only one place. In a multi-tenant, multi-application environment, shared patterns are what keep delivery fast: teams do not reinvent the same structure, and improvements made once benefit every application that uses them.

The measurable results are significant. Development time dropped by about **60%** through AI adoption, and deployment time dropped by approximately **40%** through improved build and CI/CD pipelines. I treat those as two separate levers. AI-assisted development changed how quickly teams could build, while the build and pipeline work changed how quickly and reliably the result reached production. Both were necessary, and both came from deliberate investment in how the engineering system works, not just in the product code.

I also work with enterprise-scale architectures built on React, Next.js, micro-frontends and monorepos, integrated with Payload CMS and Adobe Experience Manager, and I am a co-developer of the BHN design system. The design system matters because it is the shared language between design and engineering, and it supports onboarding and cross-team development: new teams and new engineers start from common, consistent building blocks.

## Customer experience and measurable business outcomes

I care about customer experience, and I insist on measuring it. Two pieces of work show this clearly.

The first is the redesign of the product detail page (PDP) for giftcards.com, centred on fee transparency. Showing customers clearly what they are paying is a trust decision as much as a design decision. The redesign brought Core Web Vitals into the green zone, **increased conversion by 18%**, and **reduced customer queries by 20%**, which also gave the support desk time back. That combination is what I look for in frontend work: a change that is better for the customer, better for the business and better for the teams who support the product.

The second is improvement of the checkout journey, aimed at raising the conversion metric and increasing transparency for customers. Checkout is where trust, performance and clarity meet, and small improvements there carry direct commercial weight.

Across this work I focus on performance, Core Web Vitals, conversion and trust, because these are the measures through which frontend quality becomes visible to the business. I hold myself to outcomes, not just delivery.

## Build, CI/CD and engineering productivity

Engineering productivity is part of architecture. I reduced frontend build time from more than **5 minutes to 0.5 minute** using ESLint and snapshot caching. A build that fast changes behaviour: developers run it more often, feedback arrives while the context is still fresh, and the cost of iteration falls across every team that works in the codebase.

I established automated CI/CD pipelines using GitHub Actions, SonarQube and Snyk. They enforce security scanning, automated testing and zero-downtime releases, which saves developer time while raising the floor on quality and safety. The same pipeline work contributed to the roughly 40% reduction in deployment time. Releases that are automated, tested and scanned are releases teams are willing to make often, and frequent small releases are safer than infrequent large ones.

## Quality, governance and security

I govern code quality through SonarQube, git hooks, Snyk scans and a constant review cycle. These mechanisms are layered deliberately: git hooks catch problems at the earliest point, the pipeline enforces standards consistently, scanning tools surface quality and dependency risks, and human review provides judgment that tools cannot.

I standardise test-driven development and spec-driven frontend development, mainly across ReactJS, Next.js, HTML, CSS and JavaScript. Standards only work when they are practical and shared, so I set them as part of engineering standards for the teams I work with rather than as individual preferences.

On security, my applications follow established authentication patterns such as OAuth 2.0 and JWT tokens, and I secure them against XSS, CSRF and other vulnerabilities through constant review and iteration. For a commerce platform, security is not a separate concern from frontend engineering: the frontend is where customer input and sessions meet the browser, so it has to be treated as part of the security perimeter.

## AI-assisted and spec-driven engineering

I drive GitHub Copilot adoption and spec-driven development across the team. I regard AI-assisted engineering as a practice that needs standards, not just a tool to switch on. Writing the specification first gives AI assistance something precise to work from, keeps intent reviewable, and fits naturally with test-driven development.

The result I can point to is the roughly 60% reduction in development time on the micro-frontend work through AI adoption. I also hold certifications in this area: Foundations of AI & Agentic AI (Simplilearn, September 2026), Advanced Generative AI Development on AWS (AWS Training and Certification, July 2026) and Building Advanced Agentic Systems on AWS (AWS Training and Certification, July 2026). My interest is in building strong frontend practices around quality, security and maintainability so that AI makes teams faster without making the codebase worse.

## Technical leadership and influence

My role extends well beyond writing code. I set engineering standards and own the technical roadmap for D2C. I mentor Senior and Staff engineers, which means much of my impact is multiplied through other people: helping them make better architectural decisions, grow into broader responsibility and carry standards forward without me in the room.

I help recruit, grow and enable the team, and I act as a code reviewer, mentor and the face of the development team. I contribute to engineering metrics, working groups, architecture design and leadership discussions, which keeps the frontend perspective present where decisions about direction, investment and priorities are made.

I also lead the end-to-end operational lifecycle: architecture design, release strategies, incidents, triage and SLA metrics across teams. Owning that lifecycle matters because a platform is only as good as its behaviour in production. The same engineer who helps design a system should care how it is released, how it fails and how quickly it recovers. For me the work runs in one continuous loop: code, collaborate, build, change, handle incidents, release and triage.

## Earlier experience

Before BHN, I was a developer and tech lead for 10 years at NatWest / Royal Bank of Scotland, where I led the move of finance tooling from VB6 and MS-SQL to React. That decade, working on finance and colleague-experience applications, gave me deep experience with enterprise applications inside a large organisation and with moving established systems to modern frontend technology, which is the same pattern I later applied at platform scale.

I then worked as a Lead UI Developer at Thoughtworks, via Geektrust, on projects for Kroger and First Abu Dhabi Bank, followed by a short engagement at Fictiv. Earlier in my career I worked at Syntel and 9 Dimensions, and as a freelance developer and a software developer using VBA and VB6. Across small and large organisations I have delivered a wide range of enterprise applications, and that breadth is why I am comfortable moving between hands-on frontend work and platform-level architecture.

## Education and certifications

My education includes a PGDITM from Symbiosis, Pune (2017), a BTech in Information Technology from MDU, Rohtak (2007) and an HND in Computing from Pearson Edexcel, UK (2004). My certifications are the three AI-focused programs listed above. I also maintain open-source work, including the oneliners npm package, a utility helper library for core JavaScript, which I use in my own projects.

## Technical profile

My strongest and longest-standing skills are React (10+ years), HTML, CSS and JavaScript (12+ years), GraphQL (7+ years) and CI/CD (7+ years). I have 4+ years with AEM and 2+ years each with Next.js and Payload CMS. I work with Vitest, Jest and Mocha for testing, and with Turborepo, Vite and Webpack for build tooling. I am comfortable across client-server, monorepo, REST, monolithic, microservice and micro-frontend architectures, and I choose between them based on the problem rather than preference.

I use Jira, Rally, Leankit and Trello for agile delivery, bug tracking and backlog grooming.

## How I work

Several principles run through everything above.

**Architecture is accountable to outcomes.** I measure architectural decisions by what they change for customers and the business: cost removed, conversion gained, support queries avoided, time saved for engineers.

**Standards are leverage.** A standard that every team follows multiplies my impact far beyond what I could build myself, so I invest in making standards practical, automated where possible and visible in the pipeline.

**Platform thinking over project thinking.** Shared patterns, a design system and a micro-frontend architecture make the next application cheaper to build than the last. I build for that compounding effect.

**Performance, security and accessibility are built in.** They are architectural properties, set early and enforced continuously, not tasks added at the end.

**Leadership is enablement.** Mentoring Senior and Staff engineers, hiring, reviewing and contributing to leadership forums are core parts of my role, because durable results depend on strong teams.

**Honest measurement.** I report results as they were measured and attribute them to the work that produced them, such as AI adoption for development speed and pipeline improvements for deployment speed.

## In summary

I am a principal frontend engineer who combines hands-on technical depth with ownership of architecture and engineering leadership. I led a migration that saves about $1.5 million a year, architected micro-frontend patterns that cut development time by about 60% and deployment time by about 40%, redesigned a product page to lift conversion by 18% while reducing customer queries by 20%, and cut build time from over five minutes to thirty seconds. I set standards, mentor engineers, drive responsible AI-assisted engineering and lead the operational lifecycle of a global, multi-tenant commerce platform.

Behind that work are 19 years of experience across enterprise finance, consulting and commerce, and a consistent approach: build scalable, fast and secure platforms, measure the result, and grow the people and practices around them.
