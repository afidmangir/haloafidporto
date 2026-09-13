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

/** Slug project yang tampil di section Featured. */
export const featuredSlugs = [
  "arkamaya-kusuma-resort-glamping",
  "siakad-faast-penerbangan",
  "sistem-pengelolaan-air-sendangwarih",
] as const;

export const projects: Project[] = [
  {
    slug: "arkamaya-kusuma-resort-glamping",
    title: "Arkamaya Kusuma Resort & Glamping",
    category: "Website · Hospitality",
    description:
      "Website reservasi dan company profile untuk resort & glamping di Gamping, Sleman — dibangun dengan fondasi SEO & GEO agar mudah muncul di berbagai kata kunci pencarian Google maupun jawaban AI seperti ChatGPT dan Gemini. Katalog unit, venue MICE, paket gathering, dan alur reservasi disusun agar calon tamu korporat maupun keluarga gampang menemukan, yakin, lalu memesan. Galeri visual, detail tiap unit dan venue, serta kontak reservasi yang jelas membuat pengalaman menjelajah website terasa meyakinkan dari awal sampai booking.",
    services: ["Website", "SEO & GEO", "Booking Flow"],
    image: "/assets/porto/website-arkamaya-kusuma/mainimage.png",
    status: "real",
  },
  {
    slug: "siakad-faast-penerbangan",
    title: "SIAKAD FAAST Penerbangan Yogyakarta",
    category: "Sistem Informasi · Akademik",
    description:
      "Sistem informasi akademik untuk lembaga pendidikan pramugari dan staff penerbangan — termasuk sistem penerimaan siswa baru (PPDB online), data taruna, kurikulum, jadwal, dan administrasi dalam satu dashboard terpusat.",
    services: ["Web App", "SIAKAD", "PPDB Online"],
    image: "/assets/porto/sistem-siakad-faast-penerbangan/mainimage.png",
    status: "real",
  },
  {
    slug: "sistem-pengelolaan-air-sendangwarih",
    title: "Sistem Pengelolaan Air PAM Sendangwarih",
    category: "Sistem Informasi · Utilitas",
    description:
      "Sistem pencatatan dan penagihan layanan air bersih untuk pengelola PAM dusun — data pelanggan, catat meter, dan rekap tagihan yang transparan.",
    services: ["Web App", "Billing System"],
    image: "/assets/porto/sistem-pengelolaan-air-sendangwarih/mainimage.png",
    status: "real",
  },
  {
    slug: "website-faast-penerbangan",
    title: "FAAST Penerbangan Yogyakarta",
    category: "Website · Education",
    description:
      "Website company profile untuk sekolah pramugari dan staff penerbangan — program pendidikan, alur pendaftaran, dan galeri kegiatan yang meyakinkan calon siswa.",
    services: ["Website", "Company Profile"],
    image: "/assets/porto/website-faast-penerbangan/mainimage.png",
    status: "real",
  },
  {
    slug: "website-bmt-artha-barokah",
    title: "BMT Artha Barokah",
    category: "Website · Financial Service",
    description:
      "Website layanan keuangan syariah dengan katalog produk simpanan dan pembiayaan, lengkap dengan simulasi kebutuhan pembiayaan untuk calon anggota.",
    services: ["Website", "Interactive UI"],
    image: "/assets/porto/website-bmt-artha-barokah/mainimage.png",
    status: "real",
  },
  {
    slug: "website-logikaos",
    title: "Logikaos",
    category: "Website · Fashion",
    description:
      "Website katalog untuk brand clothing — koleksi produk, lookbook, dan jalur pemesanan cepat yang memudahkan pelanggan.",
    services: ["Website", "Catalog"],
    image: "/assets/porto/website-logikaos/mainimage.png",
    status: "real",
  },
  {
    slug: "website-lpk-daiseikou",
    title: "LPK Daiseikou",
    category: "Website · Education",
    description:
      "Website profil LPK penyalur magang Jepang — informasi program, syarat, dan alur pendaftaran yang jelas untuk calon peserta.",
    services: ["Website", "Company Profile"],
    image: "/assets/porto/website-lpk-daiseikou/mainimage.png",
    status: "real",
  },
  {
    slug: "website-rdj-clothing",
    title: "RDJ Clothing",
    category: "Website · Fashion",
    description:
      "Website company profile dan katalog untuk konveksi — layanan maklon, portofolio produksi, dan kontak order dalam satu tempat.",
    services: ["Website", "Catalog"],
    image: "/assets/porto/website-rdj-clothing/mainimage.png",
    status: "real",
  },
  {
    slug: "website-sendangwarih",
    title: "Sendangwarih",
    category: "Website · Community",
    description:
      "Website profil digital layanan air bersih dusun — informasi layanan, tarif, dan kontak pengaduan yang mudah diakses warga.",
    services: ["Website", "Company Profile"],
    image: "/assets/porto/website-sendangwarih/mainimage.png",
    status: "real",
  },
  {
    slug: "website-story-guppy-farm",
    title: "Story Guppy Farm",
    category: "Website · Agribisnis",
    description:
      "Website katalog untuk farm ikan hias guppy — galeri strain, daftar harga, dan pemesanan langsung yang praktis.",
    services: ["Website", "Catalog"],
    image: "/assets/porto/website-story-guppy-farm/mainimage.png",
    status: "real",
  },
  {
    slug: "sistem-konveksi-logikaos",
    title: "Sistem Konveksi Logikaos",
    category: "Sistem Informasi · Manufaktur",
    description:
      "Sistem pencatatan order dan produksi konveksi — progres jahitan, stok bahan, dan rekap order terpantau secara real-time.",
    services: ["Web App", "Production"],
    image: "/assets/porto/sistem-konveksi-logikaos/mainimage.png",
    status: "real",
  },
  {
    slug: "sistem-konveksi-rdj-clothing",
    title: "Sistem Konveksi RDJ Clothing",
    category: "Sistem Informasi · Manufaktur",
    description:
      "Sistem manajemen produksi garmen — SPK digital, tracking proses, dan QC berlapis untuk ketepatan waktu pengiriman.",
    services: ["Web App", "Production"],
    image: "/assets/porto/sistem-konveksi-rdj-clothing/mainimage.png",
    status: "real",
  },
  {
    slug: "sistem-produksi-arafs-apparel",
    title: "Sistem Produksi Arafs Apparel",
    category: "Sistem Informasi · Manufaktur",
    description:
      "Sistem pengelolaan produksi apparel — dari order masuk, penjadwalan, hingga monitoring output harian yang terukur.",
    services: ["Web App", "Production"],
    image: "/assets/porto/sistem-produksi-arafs-apparel/mainimage.png",
    status: "real",
  },
  {
    slug: "sistem-latihan-soal-lpk-jepang",
    title: "Sistem Latihan Soal LPK Jepang",
    category: "Sistem Informasi · Edukasi",
    description:
      "Platform latihan soal dan try-out untuk peserta LPK Jepang — bank soal, penilaian otomatis, dan pemantauan progres belajar.",
    services: ["Web App", "E-Learning"],
    image: "/assets/porto/sistem-latihan-soal-lpk-jepang/mainimage.png",
    status: "real",
  },
];
