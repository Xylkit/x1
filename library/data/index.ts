export const demoRecipients = [
  {
    name: "Alice Org",
    avatarUrl: null,
    type: "organization" as const,
  },
  {
    name: "Bob Individual",
    avatarUrl: null,
    type: "individual" as const,
  },
];

export const demoCollectors = [
  {
    name: "Charlie Collector",
    emojiCodePoint: "1F60E",
    services: [
      { name: "Web Development", emojiCodePoint: "1F4BB", price: 800 },
      { name: "UI Design", emojiCodePoint: "1F3A8", price: 600 },
    ],
  },
  {
    name: "Diana Collector",
    emojiCodePoint: "1F609",
    services: [
      { name: "Content Writing", emojiCodePoint: "270D", price: 400 },
      { name: "SEO Optimization", emojiCodePoint: "1F50D", price: 500 },
    ],
  },
];
