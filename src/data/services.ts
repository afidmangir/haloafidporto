export interface Service {
  id: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "website",
    title: "Website",
    description:
      "Website yang nggak cuma bagus dilihat — tapi gampang ketemu di Google, cepat dibuka, dan jelas ngajak pengunjung action. Bukan cuma lewat.",
  },
  {
    id: "systems",
    title: "Sistem Informasi",
    description:
      "Aplikasi web buat beresin kerjaan: data rapi, proses kepangkas, tim makin efektif. Dari inventaris, kasir, sampai booking.",
  },
  {
    id: "search",
    title: "SEO & GEO",
    description:
      "Biar brand kamu gampang ditemuin — di Google, YouTube, sampai AI kayak ChatGPT & Gemini. Fondasi teknis + konten yang bener.",
  },
  {
    id: "ai",
    title: "Solusi AI",
    description:
      "Integrasi AI yang fokus ke kebutuhan nyata: otomasi, asisten, content workflow. Bukan sekadar numpang tren.",
  },
];