const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.njk', './src/**/*.svg'],
    layers: ['components', 'utilities'],
    options: {
      safelist: ['header-shadow', '-translate-y-full', 'hidden']
    }
  },
  darkMode: 'class',
  theme: {
    minWidth: {
      '0': '0',
      '1/10': '10%',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      pink: colors.pink,
      red: colors.red,
      gray: colors.gray,
      teal: colors.teal
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1': {
              fontWeight: '700'
            },
            'blockquote': {
              fontWeight: 'normal',
              color: theme('colors.gray.700')
            },
            'blockquote p:first-of-type::before': {
              content: ''
            },
            'blockquote p:last-of-type::after': {
              content: ''
            }
          }
        }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
