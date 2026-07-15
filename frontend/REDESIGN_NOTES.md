# BlogMix Frontend Redesign

## Scope

This redesign changes only the React frontend. The backend routes, database models, request payloads, authentication flow, and API URL remain unchanged.

## Main improvements

- Professional responsive navigation and mobile menu
- Editorial home hero and featured-story presentation
- Social-style story cards with reactions and author metadata
- Refined Explore page with search and category filtering
- Long-form article reading layout
- Modern creator studio for publishing and editing
- Production-grade profile and account settings experience
- Simplified responsive sign-in and registration flow
- Cohesive design system for spacing, typography, colors, borders, and states
- Empty states, loading state, accessibility labels, and a 404 page

## Deployment

Use the same Render configuration already used by the project:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

The frontend continues to use the existing API value in `src/config.js`.

## Verification

`npm run build` completes successfully.
