import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

// TODO: once a public endpoint exists (e.g. GET /waitlist/count), fetch the
// real total and pass it in as `end` from the parent instead of a static number.
function AnimatedCounter({ end, duration = 1800, prefix = '', suffix = '', className }: AnimatedCounterProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const startTime = performance.now()

            const step = (now: number) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / duration, 1)
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.round(eased * end))

              if (progress < 1) {
                requestAnimationFrame(step)
              }
            }

            requestAnimationFrame(step)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export default AnimatedCounter
