import { register } from 'tsconfig-paths'

// Explicitly set the paths configuration
register({
  baseUrl: '.',
  paths: {
    '@/*': ['./src/*']
  }
})
