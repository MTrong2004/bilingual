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
        title: "Bài 1: Giới thiệu giao diện",
        videoUrl: "", // Sẽ điền link OneDrive của bạn vào đây
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
