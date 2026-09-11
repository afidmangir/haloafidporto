export interface SiteConfig {
  name: string;
  domain: string;
  phone: string;
  email: string;
  whatsapp: string;
  tiktok: string;
  instagram: string;
  threads: string;
  address: string;
}

export const site: SiteConfig = {
  name: "HaloAfid",
  domain: "haloafid.site",
  phone: "082136006831",
  email: "haloafid@gmail.com",
  whatsapp: "https://wa.me/6282136006831",
  tiktok: "https://www.tiktok.com/@haloafid",
  instagram: "https://www.instagram.com/haloafid",
  threads: "https://www.threads.com/@haloafid",
  address: "Mangir, Sendangsari, Pajangan, Bantul, DI Yogyakarta",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;