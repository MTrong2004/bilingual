export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const COURSE_CONTENT: Module[] = [
  {
    id: "m1",
    title: "Chương 1: Làm quen với ZBrush",
    lessons: [
      {
        id: "l1",
        title: "Bài 1: Блокаут (Blockout)",
        videoUrl: "https://4c28g5-my.sharepoint.com/personal/mtrong_bm2004_onmicrosoft_com/_layouts/15/embed.aspx?UniqueId=9aab419a-2970-4fe3-b808-45890aeefcfc&embed=%7B%22ust%22%3Afalse%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
        duration: "15:00",
        description: "Làm quen với không gian làm việc và các công cụ cơ bản."
      },
      {
        id: "l2",
        title: "Bài 2: Các thao tác cơ bản",
        videoUrl: "", 
        duration: "20:00",
        description: "Cách xoay, zoom, và di chuyển model."
      }
    ]
  },
  {
    id: "m2",
    title: "Chương 2: Điêu khắc cơ bản",
    lessons: [
      {
        id: "l3",
        title: "Bài 3: Cọ vẽ (Brushes)",
        videoUrl: "",
        duration: "25:00",
        description: "Tìm hiểu các loại cọ thông dụng."
      }
    ]
  }
];
