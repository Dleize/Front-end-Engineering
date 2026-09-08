const Icon = ({ children, size = 20, ...props }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    {...props}
  >
    {children}
  </svg>
);

export const ArrowIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
);

export const BookmarkIcon = ({ filled = false, ...props }) => (
  <Icon {...props}>
    <path d="M6.75 4.75A1.75 1.75 0 0 1 8.5 3h7a1.75 1.75 0 0 1 1.75 1.75V21L12 17.75 6.75 21V4.75Z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="m5 12.5 4.25 4.25L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
  </Icon>
);

export const RefreshIcon = (props) => (
  <Icon {...props}>
    <path d="M19 8a7.5 7.5 0 1 0 .25 7.5M19 3v5h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="10.75" cy="10.75" r="6.25" stroke="currentColor" strokeWidth="1.8" />
    <path d="m15.5 15.5 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </Icon>
);

export const SparkIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2.75c.5 4.35 2.9 6.75 7.25 7.25-4.35.5-6.75 2.9-7.25 7.25C11.5 12.9 9.1 10.5 4.75 10 9.1 9.5 11.5 7.1 12 2.75Z" fill="currentColor" />
    <path d="M19 16c.2 1.75 1.25 2.8 3 3-1.75.2-2.8 1.25-3 3-.2-1.75-1.25-2.8-3-3 1.75-.2 2.8-1.25 3-3Z" fill="currentColor" />
  </Icon>
);

export const VolumeIcon = (props) => (
  <Icon {...props}>
    <path d="M5 9.25h3L12 6v12l-4-3.25H5V9.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    <path d="M15 9a4 4 0 0 1 0 6m2-8.5a7 7 0 0 1 0 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
  </Icon>
);
