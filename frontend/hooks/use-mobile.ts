import * as React from "react"

const DESKTOP_BREAKPOINT_QUERY = "(min-width: 48rem)"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    return !window.matchMedia(DESKTOP_BREAKPOINT_QUERY).matches
  })

  React.useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT_QUERY)
    const onChange = () => {
      setIsMobile(!mql.matches)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(!mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
