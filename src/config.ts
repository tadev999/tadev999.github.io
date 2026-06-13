export const SITE = {
  website: "https://tadev999.github.io/", // replace this with your deployed domain
  author: "TaDev",
  profile: "https://blog.greenolio.com/",
  desc: "Blog cá nhân về lập trình và cuộc sống - Chia sẻ kinh nghiệm, kiến thức và những suy ngẫm từ một lập trình viên.",
  title: "TaDev",
  ogImage: "astropaper-og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/tadev999/tadev-blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "vi", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Ho_Chi_Minh", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
