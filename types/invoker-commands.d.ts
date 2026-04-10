import 'react'

declare module 'react' {
  interface HTMLAttributes {
    commandfor?: string
    command?: string
  }
}
