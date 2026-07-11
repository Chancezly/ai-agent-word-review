interface IconProps {
  className?: string
  filled?: boolean
}

export function IconHome({ className, filled }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {filled ? (
        <path
          d="M10.5 3.75a1.5 1.5 0 0 1 1.5 0l7.5 4.5A1.5 1.5 0 0 1 21 9.75V19.5A1.5 1.5 0 0 1 19.5 21h-4.5a1.5 1.5 0 0 1-1.5-1.5v-4.5h-3v4.5A1.5 1.5 0 0 1 9 21H4.5A1.5 1.5 0 0 1 3 19.5V9.75a1.5 1.5 0 0 1 .75-1.3l7.5-4.5Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M10.5 3.75a1.5 1.5 0 0 1 1.5 0l7.5 4.5A1.5 1.5 0 0 1 21 9.75V19.5A1.5 1.5 0 0 1 19.5 21h-4.5a1.5 1.5 0 0 1-1.5-1.5v-4.5h-3v4.5A1.5 1.5 0 0 1 9 21H4.5A1.5 1.5 0 0 1 3 19.5V9.75a1.5 1.5 0 0 1 .75-1.3l7.5-4.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export function IconCards({ className, filled }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {filled ? (
        <>
          <rect x="3" y="5" width="14" height="16" rx="2.5" fill="currentColor" opacity="0.35" />
          <rect x="7" y="3" width="14" height="16" rx="2.5" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="3" y="5" width="14" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="7" y="3" width="14" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

export function IconCalendar({ className, filled }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {filled ? (
        <>
          <path
            d="M7 3.75a1 1 0 0 1 1 1V6h8V4.75a1 1 0 1 1 2 0V6h.25A2.75 2.75 0 0 1 21 8.75v10.5A2.75 2.75 0 0 1 18.25 22H5.75A2.75 2.75 0 0 1 3 19.25V8.75A2.75 2.75 0 0 1 5.75 6H6V4.75a1 1 0 0 1 1-1Z"
            fill="currentColor"
          />
          <rect x="7" y="11" width="3" height="3" rx="0.75" fill="var(--bg-secondary)" />
          <rect x="14" y="11" width="3" height="3" rx="0.75" fill="var(--bg-secondary)" />
        </>
      ) : (
        <>
          <path
            d="M7 3.75a1 1 0 0 1 1 1V6h8V4.75a1 1 0 1 1 2 0V6h.25A2.75 2.75 0 0 1 21 8.75v10.5A2.75 2.75 0 0 1 18.25 22H5.75A2.75 2.75 0 0 1 3 19.25V8.75A2.75 2.75 0 0 1 5.75 6H6V4.75a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

export function IconPlan({ className, filled }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {filled ? (
        <path
          d="M6 3.75A2.75 2.75 0 0 0 3.25 6.5v11A2.75 2.75 0 0 0 6 20.25h12A2.75 2.75 0 0 0 20.75 17.5v-11A2.75 2.75 0 0 0 18 3.75H6Zm2.5 5.5h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Zm0 4h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Zm0 4h4.5a.75.75 0 0 1 0 1.5H8.5a.75.75 0 0 1 0-1.5Z"
          fill="currentColor"
        />
      ) : (
        <>
          <path
            d="M6 3.75A2.75 2.75 0 0 0 3.25 6.5v11A2.75 2.75 0 0 0 6 20.25h12A2.75 2.75 0 0 0 20.75 17.5v-11A2.75 2.75 0 0 0 18 3.75H6Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8.5 9.25h7M8.5 13.25h7M8.5 17.25h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function IconChevron({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
