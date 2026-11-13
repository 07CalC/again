# Complete Personal Website Renovation

You are an autonomous senior frontend engineer, product designer, and creative developer. Your task is to completely renovate my personal website from scratch.

This is not a minor redesign. Rethink the entire experience: visual identity, information architecture, layout, typography, interactions, and implementation.

## 1. About Me

I'm a software engineer and engineering student who enjoys building things, understanding how technology works, and experimenting with ideas.

My interests include:

- Systems programming and low-level engineering.
- Rust, Linux, and open-source software.
- Web and infrastructure.
- Developer tools, build systems, and tooling.
- Building independent products and side projects.

I don't want to present myself as another generic full-stack developer. I want the website to communicate curiosity, technical depth, experimentation, and a genuine passion for engineering.

## 2. Design Direction

Create something distinctive, minimal, sophisticated, and deeply personal.

The website should feel like a combination of:

- An engineer's personal workspace.
- An independent developer's portfolio.
- A digital garden documenting ideas and experiments.
- A thoughtfully designed publication.

Avoid the typical developer portfolio aesthetic.

**Strictly avoid:**

- Generic gradient backgrounds.
- Excessive glassmorphism.
- Giant gradient text.
- Generic SaaS landing-page layouts.
- Unnecessary floating cards.
- Overused rounded containers.
- Excessive animations.
- Stock illustrations and generic developer graphics.
- Fake terminal interfaces just for decoration.

Instead, focus on:

- Strong typography and intentional whitespace.
- Interesting composition and asymmetrical layouts.
- Subtle borders, dividers, and visual hierarchy.
- A restrained color palette.
- Thoughtful use of monochrome imagery.
- Small details that reward exploration.
- A consistent visual language across every page.

The result should feel designed, not generated.

## 3. Website Architecture

Build a cohesive personal website with the following sections.

### Home

The homepage should immediately establish my identity.

Include:

- A short, memorable introduction.
- What I'm currently interested in.
- A selection of things I've built.
- A small section about what I'm exploring currently.
- Recent writing or notes.
- Links to GitHub, LinkedIn, and other relevant profiles.
- a section for currently listening or last listened on spotify

Avoid turning the homepage into a traditional resume.

### Projects

A curated collection of things I've built.

Each project should have:

- Name and concise description.
- Technologies used.
- Current status.
- Screenshots or visual representations where available.
- GitHub and live-demo links where available.
- A dedicated project detail page for substantial projects.

Prioritize engineering decisions, interesting technical challenges, and what I learned.

Don't invent project descriptions, achievements, or metrics. Inspect existing repositories and content wherever possible.

### Writing / Notes

A personal space for technical writing, ideas, experiments, and observations.

Support:

- Long-form articles.
- Short technical notes.
- Tutorials and explanations.
- Engineering experiments.
- Ideas that are still evolving.

The reading experience should be excellent, with readable typography, proper code highlighting, and a clean article layout.

### Now

A small page describing what I'm currently working on, learning, and exploring.

Make it easy to update.

Include the spotify current listening.

## 4. The Shelf — /shelf

Create a dedicated `/shelf` section that acts as my personal collection of media and things I've consumed, enjoyed, or want to explore.

Think of it as a digital bookshelf and personal archive.

### Categories

Support the following categories:

- Books
- Anime
- Movies
- research papers
- Games
- Other media (extensible)

### Shelf Experience

The page should feel like browsing someone's personal collection, not browsing an entertainment catalogue.

Each item should support:

- Title
- Cover or poster image
- Category
- Creator / author / director
- Description or personal note
- Date added
- optional link
- Date completed (optional)
- Status: Want to explore, Currently consuming, Completed, Dropped
- Rating (optional)
- Personal review or thoughts (optional)
- External links (optional)
- Tags (optional)

### Organization and Filtering

Allow visitors to:

- Browse the entire collection.
- Filter by category.
- Filter by consumption status.
- Sort by recently added, rating, or completion date.
- Search by title.
- Open an individual item to see its details and my personal thoughts.

Keep filtering lightweight and intuitive. Avoid making it look like an e-commerce product catalogue.

### Visual Design

Experiment with a visually rich but restrained layout.

- Book covers, movie posters, and anime artwork should be the primary visual elements.
- Use different aspect ratios where appropriate: portrait for books and posters, landscape where appropriate for other media.
- Keep metadata subtle.
- Add tasteful hover interactions.
- Make the collection enjoyable to explore.
- Ensure the layout works beautifully on mobile.

Consider a compact category navigation and a responsive editorial grid.

### Admin Dashboard Integration

This is particularly important: ALL shelf content must be managed through the admin dashboard.

Do not hardcode shelf entries into frontend components or static arrays.

The admin dashboard should provide:

- Create, edit, and delete items.
- Upload cover/poster images.
- Select category and status.
- Add ratings, tags, descriptions, and personal notes.
- Set completion and addition dates.
- Preview how an item will appear publicly.
- Publish/unpublish entries.
- Search and filter existing entries.

The public `/shelf` page should fetch and render published entries from the backend.

### Data Architecture

Design a flexible content model that supports multiple media categories without requiring a separate database table for every category.

Use a common media item model with category-specific optional metadata where necessary.

Keep the schema extensible so new media types and fields can be introduced later.

Ensure that:
- Draft and unpublished entries never appear publicly.
- Image uploads are handled through the existing storage infrastructure.
- Public API responses expose only fields intended for public consumption.
- Admin operations are properly authenticated and authorized.

### Important Design Principle

The shelf should feel personal.

I want visitors to discover what I read, watch, play, and enjoy. My ratings and notes should give the collection personality.

It should feel like opening someone's actual bookshelf, not scrolling through a database of media.

## 4. Visual and Interaction Details

Pay special attention to the following:

- Navigation should be minimal and intuitive.
- Typography should be a major part of the visual identity.
- Use deliberate hover states and subtle transitions.
- Add tasteful page transitions only if they improve the experience.
- Make project browsing enjoyable.
- Code blocks should look excellent.
- Support light and dark themes if they fit the design.
- Ensure mobile layouts feel intentionally designed rather than merely responsive.
- Include excellent keyboard navigation and accessibility.

Micro-interactions should feel purposeful, not decorative.

## 5. Technical Requirements

First inspect the existing codebase before making changes.

Understand:

- Existing framework and architecture.
- Current routes and components.
- Existing content and assets.
- Dependencies and design conventions.
- Deployment environment.

Then propose a clear implementation plan.

Technical expectations:

- Use the existing stack unless there is a compelling reason to change it.
- Build reusable components.
- Keep components modular and maintainable.
- Optimize images, fonts, and loading performance.
- Use semantic HTML.
- Implement proper SEO metadata and Open Graph images.
- Ensure excellent Core Web Vitals.
- Avoid unnecessary dependencies.
- Avoid overengineering.
- Make content easy to maintain and extend.

## 6. Execution Instructions

Work autonomously.

Follow this sequence:

1. Audit the existing website and repository.
2. Identify what should be preserved and what should be discarded.
3. Establish a new design direction.
4. Define the information architecture.
5. Implement the design system, typography, colors, and components.
6. Build the homepage and remaining sections.
7. Implement responsive layouts and interactions.
8. Test all routes and interactions.
9. Fix visual inconsistencies, accessibility issues, and performance problems.

Do not stop after creating a design proposal. Actually implement the website.

Do not leave placeholder sections, fake content, broken links, or unfinished components.

If information is missing, inspect the repository first. Only ask me questions when a decision genuinely requires my input.

## 7. Quality Bar

The final website should feel like something an independent engineer with a strong design sensibility would build for themselves.

It should be:

- Personal rather than corporate.
- Technical without being intimidating.
- Minimal without being boring.
- Creative without being chaotic.
- Sophisticated without being pretentious.

I want someone visiting the website to get a sense of how I think, what I build, and what kind of engineer I am.

**Most importantly: Don't build another template portfolio. Create a distinctive personal website with its own identity.**
