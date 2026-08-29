import type { TemplateModel } from '../types/template';

const now = new Date().toISOString();

export const baselineTemplate: TemplateModel = {
  id: 'nova-saas-v1',
  name: 'Nova AI SaaS Landing Page',
  version: 1,
  rootId: 'root',
  globalStyles: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    primaryColor: '#6366f1',
    backgroundColor: '#090d16',
    textColor: '#f8fafc',
    accentColor: '#38bdf8',
  },
  elements: {
    'root': {
      id: 'root',
      type: 'container',
      name: 'Page Root',
      parentId: null,
      children: ['nav', 'hero-section', 'features-section', 'pricing-section', 'footer'],
      content: {},
      style: {
        backgroundColor: '#090d16',
        color: '#f8fafc',
        padding: '0px',
        margin: '0px',
      },
      layout: { display: 'flex', flexDirection: 'column' },
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-root-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: '#090d16', color: '#f8fafc', padding: '0px', margin: '0px' }, layout: { display: 'flex', flexDirection: 'column' }, content: {}, overrides: {} }
      }]
    },

    'nav': {
      id: 'nav',
      type: 'nav',
      name: 'Navigation Bar',
      parentId: 'root',
      children: ['nav-logo', 'nav-links', 'nav-cta'],
      content: {},
      style: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        padding: '16px 32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      layout: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      overrides: {
        mobile: {
          style: { padding: '12px 16px' },
          layout: { flexDirection: 'column', gap: '12px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-nav-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: {
          style: { backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '16px 32px', border: '1px solid rgba(255, 255, 255, 0.1)' },
          layout: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          content: {},
          overrides: { mobile: { style: { padding: '12px 16px' }, layout: { flexDirection: 'column', gap: '12px' } } }
        }
      }]
    },

    'nav-logo': {
      id: 'nav-logo',
      type: 'heading',
      name: 'Brand Logo',
      parentId: 'nav',
      children: [],
      content: { text: '✦ NOVA.AI', icon: 'Sparkles' },
      style: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#38bdf8',
        letterSpacing: '1px',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-nav-logo-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '20px', fontWeight: '800', color: '#38bdf8' }, layout: {}, content: { text: '✦ NOVA.AI' }, overrides: {} }
      }]
    },

    'nav-links': {
      id: 'nav-links',
      type: 'container',
      name: 'Nav Links Container',
      parentId: 'nav',
      children: [],
      content: { tagline: 'Features • Solutions • Pricing • Docs' },
      style: {
        fontSize: '14px',
        color: '#94a3b8',
        fontWeight: '500',
        gap: '24px',
      },
      layout: { display: 'flex', flexDirection: 'row' },
      overrides: {
        mobile: {
          style: { fontSize: '12px', gap: '12px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-nav-links-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '14px', color: '#94a3b8' }, layout: { display: 'flex' }, content: { tagline: 'Features • Solutions • Pricing • Docs' }, overrides: {} }
      }]
    },

    'nav-cta': {
      id: 'nav-cta',
      type: 'button',
      name: 'Nav CTA Button',
      parentId: 'nav',
      children: [],
      content: { linkText: 'Launch App' },
      style: {
        backgroundColor: '#6366f1',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-nav-cta-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: '#6366f1', color: '#ffffff', padding: '10px 20px', borderRadius: '8px' }, layout: {}, content: { linkText: 'Launch App' }, overrides: {} }
      }]
    },

    'hero-section': {
      id: 'hero-section',
      type: 'section',
      name: 'Hero Section',
      parentId: 'root',
      children: ['hero-badge', 'hero-heading', 'hero-subtitle', 'hero-actions', 'hero-image'],
      content: {},
      style: {
        padding: '80px 32px 60px 32px',
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
      layout: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' },
      overrides: {
        mobile: {
          style: { padding: '40px 16px 30px 16px' },
          layout: { gap: '16px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-hero-sec-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { padding: '80px 32px 60px 32px', textAlign: 'center' }, layout: { display: 'flex', flexDirection: 'column' }, content: {}, overrides: {} }
      }]
    },

    'hero-badge': {
      id: 'hero-badge',
      type: 'badge',
      name: 'Hero Badge',
      parentId: 'hero-section',
      children: [],
      content: { badge: '⚡ NEXT-GEN ENGINE 2.0 IS LIVE' },
      style: {
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        color: '#818cf8',
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '700',
        border: '1px solid rgba(99, 102, 241, 0.3)',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-hero-badge-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }, layout: {}, content: { badge: '⚡ NEXT-GEN ENGINE 2.0 IS LIVE' }, overrides: {} }
      }]
    },

    'hero-heading': {
      id: 'hero-heading',
      type: 'heading',
      name: 'Hero Headline',
      parentId: 'hero-section',
      children: [],
      content: { text: 'Automate Your Workflow With Deterministic AI' },
      style: {
        fontSize: '48px',
        fontWeight: '800',
        color: '#f8fafc',
        maxWidth: '800px',
        lineHeight: '1.15',
        textAlign: 'center',
      },
      layout: {},
      overrides: {
        tablet: {
          style: { fontSize: '36px' }
        },
        mobile: {
          style: { fontSize: '28px', lineHeight: '1.2' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-hero-h1-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: {
          style: { fontSize: '48px', fontWeight: '800', color: '#f8fafc' },
          layout: {},
          content: { text: 'Automate Your Workflow With Deterministic AI' },
          overrides: { tablet: { style: { fontSize: '36px' } }, mobile: { style: { fontSize: '28px' } } }
        }
      }]
    },

    'hero-subtitle': {
      id: 'hero-subtitle',
      type: 'text',
      name: 'Hero Subtitle',
      parentId: 'hero-section',
      children: [],
      content: { text: 'Transform complex business logic into modular, responsive templates. Edit safely across desktop, tablet, and mobile scopes without collateral changes.' },
      style: {
        fontSize: '18px',
        color: '#94a3b8',
        maxWidth: '640px',
        lineHeight: '1.6',
        textAlign: 'center',
      },
      layout: {},
      overrides: {
        mobile: {
          style: { fontSize: '15px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-hero-sub-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '18px', color: '#94a3b8' }, layout: {}, content: { text: 'Transform complex business logic...' }, overrides: {} }
      }]
    },

    'hero-actions': {
      id: 'hero-actions',
      type: 'container',
      name: 'Hero Button Row',
      parentId: 'hero-section',
      children: ['hero-primary-btn', 'hero-secondary-btn'],
      content: {},
      style: {
        gap: '16px',
        margin: '12px 0 0 0',
      },
      layout: { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
      overrides: {
        mobile: {
          style: { gap: '12px', width: '100%' },
          layout: { flexDirection: 'column', alignItems: 'stretch' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-hero-act-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { gap: '16px' }, layout: { display: 'flex', flexDirection: 'row' }, content: {}, overrides: {} }
      }]
    },

    'hero-primary-btn': {
      id: 'hero-primary-btn',
      type: 'button',
      name: 'Hero Primary CTA',
      parentId: 'hero-actions',
      children: [],
      content: { linkText: 'Start Free Trial →' },
      style: {
        backgroundColor: '#6366f1',
        color: '#ffffff',
        padding: '14px 28px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '700',
        border: 'none',
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-hero-pbtn-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: '#6366f1', color: '#ffffff', padding: '14px 28px' }, layout: {}, content: { linkText: 'Start Free Trial →' }, overrides: {} }
      }]
    },

    'hero-secondary-btn': {
      id: 'hero-secondary-btn',
      type: 'button',
      name: 'Hero Secondary Button',
      parentId: 'hero-actions',
      children: [],
      content: { linkText: 'Watch Demo Video' },
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#e2e8f0',
        padding: '14px 28px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-hero-sbtn-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#e2e8f0' }, layout: {}, content: { linkText: 'Watch Demo Video' }, overrides: {} }
      }]
    },

    'hero-image': {
      id: 'hero-image',
      type: 'image',
      name: 'Hero Preview Image',
      parentId: 'hero-section',
      children: [],
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Analytics Dashboard Preview',
      },
      style: {
        width: '100%',
        maxWidth: '900px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        margin: '20px 0 0 0',
      },
      layout: {},
      overrides: {
        mobile: {
          style: { borderRadius: '10px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-hero-img-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { maxWidth: '900px', borderRadius: '16px' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'features-section': {
      id: 'features-section',
      type: 'section',
      name: 'Features Section',
      parentId: 'root',
      children: ['features-heading', 'features-sub', 'features-grid'],
      content: {},
      style: {
        padding: '60px 32px',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      },
      layout: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
      overrides: {
        mobile: {
          style: { padding: '40px 16px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-feat-sec-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { padding: '60px 32px' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'features-heading': {
      id: 'features-heading',
      type: 'heading',
      name: 'Features Section Heading',
      parentId: 'features-section',
      children: [],
      content: { text: 'Engineered for Modular Control' },
      style: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#f8fafc',
        textAlign: 'center',
      },
      layout: {},
      overrides: {
        mobile: {
          style: { fontSize: '24px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-feat-h2-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '32px' }, layout: {}, content: { text: 'Engineered for Modular Control' }, overrides: {} }
      }]
    },

    'features-sub': {
      id: 'features-sub',
      type: 'text',
      name: 'Features Section Subtitle',
      parentId: 'features-section',
      children: [],
      content: { text: 'Every element maintains stable IDs, bidirectional canvas-code sync, and isolated history.' },
      style: {
        fontSize: '16px',
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: '560px',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-feat-sub-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '16px' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'features-grid': {
      id: 'features-grid',
      type: 'grid',
      name: 'Features 3-Card Grid',
      parentId: 'features-section',
      children: ['feature-card-1', 'feature-card-2', 'feature-card-3'],
      content: {},
      style: {
        width: '100%',
        maxWidth: '1100px',
        gap: '24px',
        margin: '24px 0 0 0',
      },
      layout: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' },
      overrides: {
        tablet: {
          layout: { gridTemplateColumns: 'repeat(2, 1fr)' }
        },
        mobile: {
          layout: { gridTemplateColumns: '1fr' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-feat-grid-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { gap: '24px' }, layout: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }, content: {}, overrides: {} }
      }]
    },

    'feature-card-1': {
      id: 'feature-card-1',
      type: 'card',
      name: 'Feature Card 1',
      parentId: 'features-grid',
      children: [],
      content: {
        text: 'Viewport Scope Isolation',
        tagline: 'Make desktop edits without breaking mobile layouts. Overrides stay strictly scoped to selected views.',
        badge: 'SCOPE SAFE',
        icon: 'Layers'
      },
      style: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f8fafc',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-fc1-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(30, 41, 59, 0.6)' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'feature-card-2': {
      id: 'feature-card-2',
      type: 'card',
      name: 'Feature Card 2',
      parentId: 'features-grid',
      children: [],
      content: {
        text: 'Deterministic AI Proposals',
        tagline: 'Text prompts return clear before/after diff proposals. Accept or reject per element before committing.',
        badge: 'AI DEMO',
        icon: 'Cpu'
      },
      style: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f8fafc',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-fc2-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(30, 41, 59, 0.6)' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'feature-card-3': {
      id: 'feature-card-3',
      type: 'card',
      name: 'Feature Card 3',
      parentId: 'features-grid',
      children: [],
      content: {
        text: 'Granular History Recovery',
        tagline: 'Restore any past state for a single element on mobile without rolling back unrelated desktop changes.',
        badge: 'RECOVERY',
        icon: 'RotateCcw'
      },
      style: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f8fafc',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-fc3-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(30, 41, 59, 0.6)' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'pricing-section': {
      id: 'pricing-section',
      type: 'section',
      name: 'Pricing Section',
      parentId: 'root',
      children: ['pricing-heading', 'pricing-grid'],
      content: {},
      style: {
        padding: '60px 32px',
        backgroundColor: 'transparent',
      },
      layout: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
      overrides: {
        mobile: {
          style: { padding: '40px 16px' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-prc-sec-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { padding: '60px 32px' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'pricing-heading': {
      id: 'pricing-heading',
      type: 'heading',
      name: 'Pricing Heading',
      parentId: 'pricing-section',
      children: [],
      content: { text: 'Flexible Plans For Every Business' },
      style: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#f8fafc',
        textAlign: 'center',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-prc-h2-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '32px' }, layout: {}, content: { text: 'Flexible Plans For Every Business' }, overrides: {} }
      }]
    },

    'pricing-grid': {
      id: 'pricing-grid',
      type: 'grid',
      name: 'Pricing Cards Grid',
      parentId: 'pricing-section',
      children: ['pricing-card-1', 'pricing-card-2'],
      content: {},
      style: {
        width: '100%',
        maxWidth: '800px',
        gap: '24px',
        margin: '20px 0 0 0',
      },
      layout: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' },
      overrides: {
        mobile: {
          layout: { gridTemplateColumns: '1fr' }
        }
      },
      revision: 1,
      history: [{
        id: 'hist-prc-grid-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { gap: '24px' }, layout: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }, content: {}, overrides: {} }
      }]
    },

    'pricing-card-1': {
      id: 'pricing-card-1',
      type: 'card',
      name: 'Starter Plan Card',
      parentId: 'pricing-grid',
      children: [],
      content: {
        text: 'Starter Plan',
        badge: '$29 / mo',
        tagline: 'Ideal for small businesses adapting baseline web templates.',
        linkText: 'Get Started',
        listItems: ['1 Template License', 'Canvas & Code Editing', 'Standard Viewport Previews']
      },
      style: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-pc1-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(15, 23, 42, 0.8)' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'pricing-card-2': {
      id: 'pricing-card-2',
      type: 'card',
      name: 'Pro Plan Card',
      parentId: 'pricing-grid',
      children: [],
      content: {
        text: 'Pro AI Edition',
        badge: '$79 / mo',
        tagline: 'Full deterministic AI engine, marquee selection, and per-element recovery.',
        linkText: 'Upgrade to Pro',
        listItems: ['Unlimited Viewport Overrides', 'Deterministic AI Demo Engine', 'Granular Per-Element Recovery']
      },
      style: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        padding: '32px',
        borderRadius: '16px',
        border: '2px solid #6366f1',
        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.25)',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-pc2-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '2px solid #6366f1' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'footer': {
      id: 'footer',
      type: 'section',
      name: 'Footer Section',
      parentId: 'root',
      children: ['footer-text'],
      content: {},
      style: {
        padding: '32px',
        backgroundColor: '#05070d',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
      },
      layout: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-foot-sec-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { padding: '32px', backgroundColor: '#05070d' }, layout: {}, content: {}, overrides: {} }
      }]
    },

    'footer-text': {
      id: 'footer-text',
      type: 'text',
      name: 'Footer Copyright Text',
      parentId: 'footer',
      children: [],
      content: { text: '© 2026 Nova AI Template Editor. All rights reserved. Built with Scoped Viewport Safety.' },
      style: {
        fontSize: '13px',
        color: '#64748b',
      },
      layout: {},
      overrides: {},
      revision: 1,
      history: [{
        id: 'hist-foot-txt-1',
        timestamp: now,
        scope: 'all',
        source: 'initial',
        description: 'Initial template state',
        snapshot: { style: { fontSize: '13px', color: '#64748b' }, layout: {}, content: {}, overrides: {} }
      }]
    }
  }
};
