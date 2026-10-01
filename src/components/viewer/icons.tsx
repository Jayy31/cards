const paths: Record<string, string> = {
  prev: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  music: "M9 18V5l11-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  mute: "M11 5L6 9H3v6h3l5 4V5z M22 9l-6 6 M16 9l6 6",
  share: "M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7 M16 6l-4-4-4 4 M12 2v13",
  calendar: "M4 5h16v16H4z M4 10h16 M9 3v4 M15 3v4",
  rsvp: "M20 6L9 17l-5-5",
  map: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  close: "M6 6l12 12 M18 6L6 18",
  replay: "M3 12a9 9 0 1 0 3-6.7 M3 4v5h5",
  flip: "M4 12a8 8 0 0 1 14-5.3 M20 4v5h-5 M20 12a8 8 0 0 1-14 5.3 M4 20v-5h5",
  download: "M12 3v12 M7 10l5 5 5-5 M4 19h16",
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3z M3 6l9 7 9-7",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18",
  whatsapp: "M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2L9 8.5z",
  contact: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  edit: "M4 20h4L19 9l-4-4L4 16v4z M13.5 6.5l4 4",
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1 M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  plus: "M12 5v14 M5 12h14",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  video: "M3 6h13v12H3z M16 10l5-3v10l-5-3",
  image: "M3 5h18v14H3z M3 16l5-5 4 4 3-3 6 6 M15 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  file: "M6 3h8l4 4v14H6z M14 3v4h4",
  copy: "M8 8h12v12H8z M4 16V4h12",
  check: "M20 6L9 17l-5-5",
};

export function Icon({ name, size = 20 }: { name: keyof typeof paths | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name] ?? ""} />
    </svg>
  );
}
