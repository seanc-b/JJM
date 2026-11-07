import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P): P => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.6 3.5h3l1.6 4-2 1.3a11.5 11.5 0 0 0 5.9 5.9l1.3-2 4 1.6v3a1.8 1.8 0 0 1-2 1.8A15.6 15.6 0 0 1 4.8 5.5a1.8 1.8 0 0 1 1.8-2Z" />
  </svg>
);

export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base({ strokeWidth: 2, ...p })}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base({ strokeWidth: 2, ...p })}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlay = (p: P) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M7 5.5v13l11-6.5z" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconPerson = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 19.5a7 7 0 0 1 14 0" />
  </svg>
);
