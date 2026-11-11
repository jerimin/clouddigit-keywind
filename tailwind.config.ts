import type { Config } from 'tailwindcss';

// Cloud Digit UI tokens: one look for every Cloud Digit site.
// Source of truth: jerimin/clouddigit-brand BRAND.md "UI tokens", taken from the live
// tenant portal theme (design.css), which App Stacks shares.

// Ember scale = the portal's --cd-ember-* (fixed in both colour schemes).
// 300 and 900 are not portal tokens: 300 is the per-channel midpoint of 200 and 400,
// 900 continues the 700 -> 800 step (each channel x 800/700).
// White text belongs on 600 or darker only (white on 500 is 2.58:1).
const ember = {
  50: '#FFF5EC',
  100: '#FFE7D3',
  200: '#FDCFA9',
  300: '#FBB57A',
  400: '#F99A4A',
  500: '#F6821F',
  600: '#C45308',
  700: '#A94706',
  800: '#8A3A05',
  900: '#712F04',
};

// Everything that changes between light and dark reads a --cd-* custom property.
// The values (light in :root, dark under prefers-color-scheme) live in src/index.css,
// with the same names as the portal.
const cd = (name: string) => `var(--cd-${name})`;

export default {
  content: ['./theme/**/*.ftl'],
  // Dark follows the visitor's OS setting, like the portal's default.
  darkMode: 'media',
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        primary: ember,

        canvas: cd('canvas'),
        surface: {
          DEFAULT: cd('surface'),
          2: cd('surface-2'),
          hover: cd('hover'),
          press: cd('press'),
        },
        // Input background: surface in light, surface-2 in dark.
        field: cd('field'),
        line: {
          DEFAULT: cd('line'),
          strong: cd('line-strong'),
        },
        ink: {
          DEFAULT: cd('text'),
          strong: cd('text-strong'),
          muted: cd('text-muted'),
          faint: cd('text-faint'),
        },
        link: {
          DEFAULT: cd('link'),
          hover: cd('link-hover'),
        },
        accent: {
          DEFAULT: cd('accent-text'),
          soft: cd('accent-soft'),
          line: cd('accent-line'),
        },
        success: {
          DEFAULT: cd('success'),
          bg: cd('success-bg'),
          line: cd('success-line'),
          text: cd('success-text'),
        },
        warning: {
          DEFAULT: cd('warning'),
          bg: cd('warning-bg'),
          line: cd('warning-line'),
          text: cd('warning-text'),
        },
        danger: {
          DEFAULT: cd('danger'),
          bg: cd('danger-bg'),
          line: cd('danger-line'),
          text: cd('danger-text'),
        },
        info: {
          DEFAULT: cd('info'),
          bg: cd('info-bg'),
          line: cd('info-line'),
          text: cd('info-text'),
        },

        provider: {
          apple: '#000000',
          bitbucket: '#0052CC',
          discord: '#5865F2',
          facebook: '#1877F2',
          github: '#181717',
          gitlab: '#FC6D26',
          google: '#4285F4',
          instagram: '#E4405F',
          linkedin: '#0A66C2',
          microsoft: '#5E5E5E',
          oidc: '#F78C40',
          openshift: '#EE0000',
          paypal: '#00457C',
          slack: '#4A154B',
          stackoverflow: '#F58025',
          twitter: '#1DA1F2',
        },
      },
      // Self-hosted from theme/keywind/login/resources/fonts (see fonts.css there).
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      // Shape tokens: controls 10px, cards and panels 16px, small chips 8px. No pills.
      borderRadius: {
        control: '.625rem',
        card: '1rem',
        chip: '.5rem',
      },
      boxShadow: {
        'cd-xs': cd('shadow-xs'),
        'cd-sm': cd('shadow-sm'),
        'cd-lg': cd('shadow-lg'),
        'cd-ring': cd('ring'),
      },
    },
  },
} satisfies Config;
