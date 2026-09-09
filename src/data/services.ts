export interface Service {
  id: string;
  title: string;
  description: string;
  short: string;
}

export const services: Service[] = [
  {
    id: "website",
    title: "Website",
    description:
      "Website cepat, responsif, terstruktur, dan dirancang untuk membantu brand terlihat lebih profesional sekaligus memudahkan orang mengambil tindakan.",
    short: "Website yang cepat, jelas, responsif, dan dibuat untuk benar-benar mendukung bisnis.",
  },
  {
    id: "systems",
    title: "Sistem Informasi",
    description:
      "Aplikasi web dan sistem informasi untuk membuat proses kerja lebih teratur, data lebih mudah dikelola, dan pekerjaan berulang lebih sederhana.",
    short: "Sistem web untuk merapikan proses, data, dan pekerjaan operasional.",
  },
  {
    id: "search",
    title: "SEO & GEO",
    description:
      "Fondasi teknis, struktur konten, dan strategi entitas agar brand lebih mudah ditemukan di search engine maupun mesin jawaban berbasis AI.",
    short: "Membangun fondasi agar brand lebih mudah ditemukan di search engine dan mesin jawaban berbasis AI.",
  },
  {
    id: "ai",
    title: "AI",
    description:
      "Integrasi AI yang fokus pada kebutuhan nyata—otomasi, assistant, content workflow, knowledge retrieval, dan pengalaman digital yang lebih cerdas.",
    short: "Mengintegrasikan AI ke alur kerja, layanan, dan produk digital tanpa sekadar ikut tren.",
  },
];