export type ProjectStatus = "placeholder" | "real";

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  services: string[];
  image: string;
  status: ProjectStatus;
  /** Only present when verified — never invent metrics. */
  result?: string;
}

export const projects: Project[] = [
  {
    slug: "kampung-mangir-digital",
    title: "Kampung Mangir Digital",
    category: "Website · Community",
    description:
      "Website profil digital yang menyatukan informasi dusun, kegiatan, budaya, dan dokumentasi dalam satu pengalaman yang mudah dijelajahi.",
    services: ["Website", "Content Structure"],
    image: "/images/kampung-mangir-digital.svg",
    status: "placeholder",
  },
  {
    slug: "faast-penerbangan",
    title: "FAAST Penerbangan",
    category: "Website · Education",
    description:
      "Digital experience untuk lembaga pendidikan dan pelatihan yang menempatkan informasi program, fasilitas, kegiatan, dan CTA pendaftaran secara lebih terstruktur.",
    services: ["Website", "Information Architecture"],
    image: "/images/faast-penerbangan.svg",
    status: "placeholder",
  },
  {
    slug: "logikaos",
    title: "LogikaOS",
    category: "Information System",
    description:
      "Konsep sistem informasi operasional untuk membantu bisnis mengelola proses kerja, data, dan kebutuhan internal secara lebih rapi.",
    services: ["Web App", "System Design"],
    image: "/images/logikaos.svg",
    status: "placeholder",
  },
  {
    slug: "bmt-artha-barokah",
    title: "BMT Artha Barokah",
    category: "Website · Financial Service",
    description:
      "Website layanan keuangan dengan pengalaman informasi yang jelas, termasuk simulasi kebutuhan pembiayaan.",
    services: ["Website", "Interactive UI"],
    image: "/images/bmt-artha-barokah.svg",
    status: "placeholder",
  },
  {
    slug: "haloafid-ai-assistant",
    title: "HaloAfid AI Assistant",
    category: "AI · Automation",
    description:
      "Konsep asisten AI yang membantu menangani pertanyaan berulang, merangkum informasi, dan menghubungkan alur kerja digital.",
    services: ["AI", "Automation"],
    image: "/images/haloafid-ai-assistant.svg",
    status: "placeholder",
  },
  {
    slug: "local-commerce-search",
    title: "Local Commerce Search Engine",
    category: "SEO · GEO",
    description:
      "Eksperimen optimasi visibilitas lokal agar bisnis lebih mudah dipahami oleh search engine dan mesin jawaban berbasis AI.",
    services: ["SEO", "GEO"],
    image: "/images/local-commerce-search.svg",
    status: "placeholder",
  },
];