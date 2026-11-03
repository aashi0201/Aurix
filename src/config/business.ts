export const business = {
  name: "Aurix Travels Limited",
  shortName: "Aurix Travels",
  domain: "https://aurixtravelslimited.in",
  email: "info@aurixtravelslimited.in",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  phone: "",
  address: "",
  businessHours: "",
  logo: "",
  socialLinks: [],
  assets: { hero: "/images/hero.png", story: "/images/maldives.png" },
  services: {
    flights: true,
    hotels: false,
    visas: false,
    holidays: false,
    insurance: false,
  },
};
export const navigation = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Services", "/services"],
  ["Destinations", "/destinations"],
  ["Contact Us", "/contact"],
] as const;
export const serviceCatalog = [
  {
    id: "flights",
    name: "Flight Ticketing",
    description:
      "A journey that starts with the right flight. Share your route and preferences for personalized domestic and international flight assistance.",
  },
  {
    id: "hotels",
    name: "Hotel Reservations",
    description:
      "Tell us your destination and preferred stay for accommodation assistance.",
  },
  {
    id: "visas",
    name: "Visa Assistance",
    description:
      "Enquire about guidance on destination-specific visa requirements. Decisions rest with the relevant authorities.",
  },
  {
    id: "holidays",
    name: "Holiday Packages",
    description:
      "Discuss a holiday shaped around your interests, dates and travel preferences.",
  },
  {
    id: "insurance",
    name: "Travel Insurance",
    description:
      "Enquire about travel cover options, subject to provider terms and eligibility.",
  },
] as const;
export const enabledServices = serviceCatalog.filter(
  (s) => business.services[s.id],
);
export const destinations = [
  {
    name: "Dubai",
    country: "United Arab Emirates",
    code: "DXB",
    image: "/images/dubai.png",
    description: "Sky-high views & golden desert evenings",
    tag: "CITY ESCAPE",
  },
  {
    name: "Maldives",
    country: "Maldives",
    code: "MLE",
    image: "/images/maldives.png",
    description: "Turquoise waters & a slower pace",
    tag: "ISLAND DAYS",
  },
  {
    name: "Switzerland",
    country: "Switzerland",
    code: "ZRH",
    image: "/images/switzerland.png",
    description: "Alpine air & storybook landscapes",
    tag: "ALPINE ADVENTURE",
  },
  {
    name: "London",
    country: "United Kingdom",
    code: "LHR",
    image: "/images/london.png",
    description: "Timeless streets & new discoveries",
    tag: "CULTURE & HISTORY",
  },
  {
    name: "Singapore",
    country: "Singapore",
    code: "SIN",
    image: "/images/singapore.png",
    description: "Garden trails & vibrant city nights",
    tag: "CITY DISCOVERIES",
  },
  {
    name: "Thailand",
    country: "Thailand",
    code: "BKK",
    image: "/images/thailand.png",
    description: "Tropical shores & colourful traditions",
    tag: "TROPICAL GETAWAY",
  },
];
