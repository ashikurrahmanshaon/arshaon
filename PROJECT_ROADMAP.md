# ARSHAON.COM — Architecture & Design Simplification Roadmap

**Project:** [arshaon.com](https://arshaon.com)  
**Owner:** Ashikur Rahman Shaon (`ARSHAON`)  
**Creative Direction:** Editorial Personal Brand + Interactive 3D Architectural Workspace

---

## 1. Streamlined Architecture

```text
src/
  app/
    layout.tsx                 # Editorial metadata, JSON-LD schema, global styles
    page.tsx                   # Five main experiences (Entrance, Workspace, About, Creations, CV & Contact)
    robots.ts                  # Search engine robots configuration
    sitemap.ts                 # Dynamic XML sitemap generation
  city/
    core/
      CityCanvas.tsx           # Client-only R3F Canvas for the Interactive 3D Workspace
      CityScene.tsx            # Camera focus interpolation & mouse parallax controller
      TextureFactory.ts        # Procedural walnut wood, travertine stone, concrete & marble textures
    environment/
      LightingAndSky.tsx       # Sunlit window lighting, GPU HDRI reflections & ContactShadows
    objects/
      InteriorFurniture.tsx    # Detailed 3D office: desk, computer, monitors, keyboard, mouse, chair, bookshelf, printer, lamp
  components/
    layout/
      MainHeader.tsx           # Minimalist editorial header
      WebGLFallback.tsx        # 2D interactive studio schematic fallback
    interface/
      AboutMeModal.tsx         # Experience C: Editorial biography section + Bookshelf quick modal
      ContactModal.tsx         # Experience E: Inline CV preview, PDF/Print, social links & collaboration form
    portfolio/
      ProjectsShowcaseModal.tsx # Experience D: Filterable creations grid + Computer interactive preview modal
    cv/
      CVPreviewModal.tsx       # Full-screen A4 CV preview, PDF binary generator & window.print() isolation
  data/
    profileData.ts             # Editable biography, career history, skills & interests
    businessData.ts            # Editable executive practice areas
    projectsData.ts            # Editable creations (Websites, SaaS, AI, Digital Marketing, Creative)
    cvData.ts                  # Editable A4 resume content
  hooks/
    useCityStore.ts            # Lightweight Zustand store for workspace camera focus & modals
    useAudioFeedback.ts        # Subtle Web Audio UI feedback
  styles/
    globals.css                # Warm alabaster/charcoal/wood editorial palette & @media print A4 isolation
  types/
    city.ts                    # TypeScript interfaces
```

---

## 2. Completed Milestones

- [x] **Removed Game Complexity**: Removed WASD movement, third-person avatar, collision physics, open-world city roads, and gaming HUDs.
- [x] **Experience A — The Entrance**: Editorial hero displaying `ASHIKUR RAHMAN SHAON` and `Welcome to my digital world.` with an architectural studio visual and `Explore My World` CTA.
- [x] **Experience B — My Workspace**: Focused, sunlit 3D architectural office with clickable Computer/Monitor (opens Portfolio), Printer (opens CV), Bookshelf (opens Biography), and Brass Desk Lamp.
- [x] **Experience C — About Me**: Editorial biography covering Introduction, Professional Identity, Skills, Career Journey, and Personal Interests.
- [x] **Experience D — My Creations**: Filterable project showcase covering Websites, SaaS Products, AI Projects, Digital Marketing Campaigns, and Creative Work.
- [x] **Experience E — My CV & Contact**: Inline and modal A4 CV preview, direct PDF download, isolated browser printing (`window.print()`), email/social links, and collaboration form.
