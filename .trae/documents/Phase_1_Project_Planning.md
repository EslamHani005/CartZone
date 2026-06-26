# Phase 1: Project Planning & Management

## 1. Project Plan & Timeline (Gantt Chart)

```mermaid
gantt
    title CartZone Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Planning
    Project Proposal & Scope :done, p1, 2026-01-01, 7d
    Task Assignment & Risks  :done, p2, 2026-01-08, 7d
    section Phase 2 & 3: Requirements
    Literature Review        :done, p3, 2026-01-15, 14d
    Requirements Gathering   :done, p4, 2026-01-29, 14d
    section Phase 4: Design
    System Analysis          :done, p5, 2026-02-12, 14d
    Software Architecture    :done, p6, 2026-02-26, 14d
    section Phase 5: Implementation
    Backend API Development  :done, p7, 2026-03-12, 30d
    Frontend React Setup     :done, p8, 2026-04-11, 21d
    Integration & Refinement :active, p9, 2026-05-02, 21d
    section Phase 6 & 7: QA & Delivery
    Testing & Bug Fixing     :p10, 2026-05-23, 14d
    Final Presentation       :p11, 2026-06-06, 14d
```

## 2. Task Assignment & Roles

| Role | Responsibilities | Assigned To |
|------|------------------|-------------|
| **Project Manager** | Oversees timeline, manages risks, ensures milestone delivery. | Mahmoud |
| **Backend Developer** | ASP.NET Core API development, Database Schema, Authentication. | Eslam / Mahmoud |
| **Frontend Developer** | React UI, Tailwind styling, Redux state management. | Mahmoud |
| **QA / Tester** | Creates test plans, executes test cases, bug tracking. | Team |
| **Documentation Lead**| Academic writing, UML diagrams, Presentation slides. | Team |

## 3. Risk Assessment & Mitigation Plan

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy |
|---------|------------------|-------------|--------|---------------------|
| **R01** | Scope Creep (Adding too many features like real-time chat). | High | High | Stick strictly to the Product Requirements Document (PRD). Delay extra features to v2. |
| **R02** | Stripe API Integration failure or key exposure. | Medium | High | Use environment variables for secrets. Thoroughly test Webhooks locally before deployment. |
| **R03** | Frontend/Backend connection issues (CORS / Authentication). | Low | High | Configure `AllowAll` CORS during development. Ensure JWT tokens are correctly attached to Axios interceptors. |
| **R04** | Time constraints before university deadline. | Medium | Critical | Prioritize core e-commerce flow (Login -> Cart -> Checkout). Secondary features (Wishlist, Reviews) can be mocked if necessary. |

## 4. Key Performance Indicators (KPIs)

- **Performance:** Frontend First Contentful Paint (FCP) under 1.5 seconds.
- **Reliability:** Backend API uptime of 99.9% during the grading period.
- **Code Quality:** Zero critical security vulnerabilities in `npm audit` and NuGet dependencies.
- **Usability:** 100% success rate for guest users completing the checkout flow during User Acceptance Testing.
