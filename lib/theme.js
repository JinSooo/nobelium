import { createContext, useContext, useEffect } from 'react'
import { useMedia } from 'react-use'
import { useConfig } from '@/lib/config'

const ThemeContext = createContext({ dark: true })

export function ThemeProvider ({ children }) {
  const { appearance } = useConfig()

  // `defaultState` should normally be a boolean. But it causes initial loading flashes in slow
  // rendering. Setting it to `null` so that we can differentiate the initial loading phase
  const prefersDark = useMedia('(prefers-color-scheme: dark)', null)
  const dark = appearance === 'dark' || (appearance === 'auto' && prefersDark)

  useEffect(() => {
    // Only decide color scheme after initial loading, i.e. when `dark` is really representing a
    // media query result
    if (typeof dark === 'boolean') {
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.classList.remove('color-scheme-unset')
    }

    // Add/remove prism theme based on dark mode
    const prismTheme = dark ? 'prism-dark' : 'prism-light'
    const existingLink = document.getElementById('prism-theme')
    if (existingLink) existingLink.remove()

    const link = document.createElement('link')
    link.id = 'prism-theme'
    link.rel = 'stylesheet'
    link.href = `/${prismTheme}.css`
    document.head.appendChild(link)
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme () {
  return useContext(ThemeContext)
}
