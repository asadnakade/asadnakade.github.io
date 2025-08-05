# Overview

This is a personal portfolio website for Asad Nakade, a Software Engineer with 2+ years of experience at Capgemini. The portfolio showcases expertise in Java, Spring Boot, React.js, and Azure technologies through a modern, responsive web interface. The site features a clean, professional design with dark/light theme switching, smooth animations, and interactive elements to present skills, projects, and contact information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The portfolio uses a **vanilla JavaScript single-page application (SPA)** approach with modern web standards:

- **HTML5** semantic structure with comprehensive SEO meta tags including Open Graph and Twitter Cards
- **CSS3** with custom properties (CSS variables) for theme management and responsive design
- **Vanilla JavaScript** for all interactive functionality, avoiding framework dependencies for optimal performance
- **Component-based CSS architecture** using CSS custom properties for consistent theming
- **Progressive enhancement** approach ensuring core content is accessible without JavaScript

## Design System
The architecture implements a **design token system** through CSS custom properties:

- **Color system** with semantic naming (primary, secondary, accent) supporting both light and dark themes
- **Typography scale** using Google Fonts (Inter for UI, JetBrains Mono for code)
- **Spacing and shadow system** with consistent scales
- **Z-index management** with predefined layers for UI components

## Theme Management
**Client-side theme switching** with persistence:

- Theme state stored in localStorage for user preference retention
- CSS custom properties enable instant theme switching without page reload
- Semantic color tokens automatically adapt to selected theme
- Theme toggle button with appropriate ARIA labels for accessibility

## Animation and Interaction
**Performance-optimized animations** using modern web APIs:

- AOS (Animate On Scroll) library for scroll-triggered animations
- Custom loading screen with CSS animations
- Smooth scrolling and progressive disclosure patterns
- CSS transitions with defined timing scales for consistent motion design

## Performance Optimizations
**Lightweight architecture** focused on fast loading:

- Minimal external dependencies (only Google Fonts, Font Awesome, and AOS)
- CSS and JavaScript organized for optimal caching
- Semantic HTML for better accessibility and SEO
- Lazy loading and progressive enhancement patterns

# External Dependencies

## CDN Resources
- **Google Fonts API**: Inter and JetBrains Mono font families for typography
- **Font Awesome 6.4.0**: Icon library for UI elements and social media icons
- **AOS (Animate On Scroll) 2.3.1**: Scroll-triggered animation library

## Browser APIs
- **Local Storage API**: Theme preference persistence
- **Intersection Observer API**: Scroll-based animations and effects
- **CSS Custom Properties**: Dynamic theming system

## SEO and Social Media
- **Open Graph Protocol**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing experience
- **Structured Data**: SEO-optimized meta tags and semantic HTML

The architecture prioritizes simplicity, performance, and maintainability while providing a rich user experience through modern web technologies and design patterns.