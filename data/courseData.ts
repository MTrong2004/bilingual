import { ProcessedData } from '../types';

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
  data?: ProcessedData;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules: Module[];
}

// Hàm hỗ trợ tạo link Cloudflare R2 tự động
const BASE_URL = "https://pub-8c569db7fcf342d4b467cd01472e88e3.r2.dev";
const ROOT_FOLDER = "Стилизованное оружие в Zbrush";

const getLink = (folder: string | null, filename: string) => {
  // Kết hợp đường dẫn: Base + Root Folder + SubFolder (nếu có) + Filename
  // Tự động mã hóa URL (thay dấu cách bằng %20, v.v.)
  const parts = [BASE_URL, ROOT_FOLDER];
  if (folder) parts.push(folder);
  parts.push(filename);
  
  return parts.map(part => encodeURIComponent(part).replace(/%3A/g, ':').replace(/%2F/g, '/')).join('/');
};

const ZBRUSH_MODULES: Module[] = [
  // --- CHƯƠNG 1: CƠ BẢN (FILES Ở NGOÀI) ---
  {
    id: "m1",
    title: "Chapter 1: Basics & Interface",
    lessons: [
      {
        id: "l1-1",
        title: "1. Loading Brushes & Materials",
        videoUrl: getLink(null, "1. Загрузка кистей и материалов.mp4"),
        duration: "50 min",
      },
      {
        id: "l1-2",
        title: "2. Basics",
        videoUrl: getLink(null, "2. Основы.mp4"),
        duration: "Main Basics",
      },
      {
        id: "l1-3",
        title: "3. ZBrush Interface & Basics",
        videoUrl: getLink(null, "3. Интерфейс Zbrush и основы.mp4"),
        duration: "Interface",
      }
    ]
  },

  // --- CHƯƠNG 2: TẠO BÚA (Create Hammer) ---
  {
    id: "m2",
    title: "Chapter 2: Creating a Hammer",
    lessons: [
      { id: "l2-1", title: "1. Blockout", videoUrl: getLink("2. Создание молота", "1. Блокаут.mp4"), duration: "08:51" },
      { id: "l2-2", title: "2. Sculpting Hammer", videoUrl: getLink("2. Создание молота", "2. Скульптинг молота - Булыжник.mp4"), duration: "15:38" },
      { id: "l2-3", title: "3. Metal Processing", videoUrl: getLink("2. Создание молота", "3. Обработка металла.mp4"), duration: "14:49" },
      { id: "l2-4", title: "4. Detailing Hammer", videoUrl: getLink("2. Создание молота", "4. Детализация молота.mp4"), duration: "13:35" },
      { id: "l2-5", title: "5. Detailing Hammer 2", videoUrl: getLink("2. Создание молота", "5. Детализация молота 2.mp4"), duration: "14:46" },
      { id: "l2-6", title: "6. Wooden Handle", videoUrl: getLink("2. Создание молота", "6. Деревянная рукоятка.mp4"), duration: "15:51" },
      { id: "l2-7", title: "7. Wraps (Обмотки)", videoUrl: getLink("2. Создание молота", "7. Обмотки.mp4"), duration: "12:54" },
      { id: "l2-8", title: "8. Final Detailing", videoUrl: getLink("2. Создание молота", "8. Финальная детализация.mp4"), duration: "18:56" },
    ]
  },

  // --- CHƯƠNG 3: TẠO KHIÊN (Create Shield) ---
  {
    id: "m3",
    title: "Chapter 3: Creating a Shield",
    lessons: [
      { id: "l3-1", title: "1. Blockout Shield", videoUrl: getLink("3. Создание щита", "1. Блокаут Щита.mp4"), duration: "16:15" },
      { id: "l3-2", title: "2. Blockout Shield 2", videoUrl: getLink("3. Создание щита", "2. Блокаут Щита 2.mp4"), duration: "08:44" },
      { id: "l3-3", title: "3. Metal", videoUrl: getLink("3. Создание щита", "3. Металл.mp4"), duration: "13:55" },
      { id: "l3-4", title: "4. Shield Frame", videoUrl: getLink("3. Создание щита", "4. Рама щита.mp4"), duration: "18:38" },
      { id: "l3-5", title: "5. Wood", videoUrl: getLink("3. Создание щита", "5. Дерево.mp4"), duration: "09:29" },
      { id: "l3-6", title: "6. Leather", videoUrl: getLink("3. Создание щита", "6. Кожа.mp4"), duration: "22:21" },
      { id: "l3-7", title: "7. Shield Handle", videoUrl: getLink("3. Создание щита", "7. Рукоятка щита.mp4"), duration: "14:52" },
      { id: "l3-8", title: "8. Leather Strap", videoUrl: getLink("3. Создание щита", "8. Кожаный ремень.mp4"), duration: "17:13" },
    ]
  },

  // --- CHƯƠNG 4: TẠO KIẾM (Create Sword) ---
  {
    id: "m4",
    title: "Chapter 4: Creating a Sword",
    lessons: [
      { id: "l4-1", title: "1. Blockout Sword", videoUrl: getLink("4. Создание меча", "1. Блокаут Меча.mp4"), duration: "16:21" },
      { id: "l4-2", title: "2. Blockout Blade", videoUrl: getLink("4. Создание меча", "2. Блокаут Клинка.mp4"), duration: "11:27" },
      { id: "l4-3", title: "3. Blade Processing", videoUrl: getLink("4. Создание меча", "3. Обработка клинка.mp4"), duration: "12:39" },
      { id: "l4-4", title: "4. Blade Detailing", videoUrl: getLink("4. Создание меча", "4. Детализация клинка.mp4"), duration: "14:54" },
      { id: "l4-5", title: "5. Blade Final", videoUrl: getLink("4. Создание меча", "5. Финал клинка.mp4"), duration: "22:16" },
      { id: "l4-6", title: "6. Guard", videoUrl: getLink("4. Создание меча", "6. Гарда.mp4"), duration: "09:37" },
      { id: "l4-7", title: "7. Guard Detailing", videoUrl: getLink("4. Создание меча", "7. Детализация гарды.mp4"), duration: "16:10" },
      { id: "l4-8", title: "8. Guard Final", videoUrl: getLink("4. Создание меча", "8. Финал Гарды.mp4"), duration: "07:28" },
      { id: "l4-9", title: "9. Handle", videoUrl: getLink("4. Создание меча", "9. Рукоятка.mp4"), duration: "11:12" },
      { id: "l4-10", title: "10. Pommel", videoUrl: getLink("4. Создание меча", "10. Наболдашник рукоятки.mp4"), duration: "02:28" },
    ]
  },

  // --- CHƯƠNG 5: TẠO CUNG (Create Bow) ---
  {
    id: "m5",
    title: "Chapter 5: Creating a Bow",
    lessons: [
      { id: "l5-1", title: "1. 3 Ways to make Bow", videoUrl: getLink("5. Создание лука", "1. Три способа сделать лук.mp4"), duration: "10:04" },
      { id: "l5-2", title: "2. Blockout Bow", videoUrl: getLink("5. Создание лука", "2. Блокаут лука.mp4"), duration: "16:43" },
      { id: "l5-3", title: "3. Blockout Bow 02", videoUrl: getLink("5. Создание лука", "3. Блокаут лука 02.mp4"), duration: "18:22" },
      { id: "l5-4", title: "4. Metal Elements", videoUrl: getLink("5. Создание лука", "4. Металлические элементы.mp4"), duration: "24:56" },
      { id: "l5-5", title: "5. Metal Polishing", videoUrl: getLink("5. Создание лука", "5. Полировка и детализация метала.mp4"), duration: "21:22" },
      { id: "l5-6", title: "6. Metal Finalization", videoUrl: getLink("5. Создание лука", "6. Финализация металлических элементов.mp4"), duration: "29:58" },
      { id: "l5-7", title: "7. Creating Blade (Method 1)", videoUrl: getLink("5. Создание лука", "7. Создание клинка. Способ первый.mp4"), duration: "13:43" },
      { id: "l5-8", title: "8. Sculpt Main Blade", videoUrl: getLink("5. Создание лука", "8. Скульпт основного клинка.mp4"), duration: "20:28" },
      { id: "l5-9", title: "9. Zmodeller Top Blades", videoUrl: getLink("5. Создание лука", "9. Zmodeller для верхних клинков.mp4"), duration: "26:36" },
      { id: "l5-10", title: "10. Metal Rings", videoUrl: getLink("5. Создание лука", "10. Металлические кольца.mp4"), duration: "04:33" },
      { id: "l5-11", title: "11. Horns & Spikes", videoUrl: getLink("5. Создание лука", "11. Рога и металлические шипы.mp4"), duration: "18:37" },
      { id: "l5-12", title: "12. Bowstring", videoUrl: getLink("5. Создание лука", "12. Создание тетивы.mp4"), duration: "14:18" },
      { id: "l5-13", title: "13. Wood & Cloth Handle", videoUrl: getLink("5. Создание лука", "13. Деревянные части и тряпка рукоятки.mp4"), duration: "19:56" },
      { id: "l5-14", title: "14. Wraps", videoUrl: getLink("5. Создание лука", "14. Обмотки.mp4"), duration: "11:56" },
      { id: "l5-15", title: "15. Blade Wrap", videoUrl: getLink("5. Создание лука", "15. Обмотка клинка.mp4"), duration: "12:07" },
      { id: "l5-16", title: "16. Feathers Final", videoUrl: getLink("5. Создание лука", "16. Перья. Финал.mp4"), duration: "11:07" },
    ]
  }
];

export const COURSES: Course[] = [
  {
    id: "zbrush-weapon",
    title: "Stylized Weapon in ZBrush",
    description: "Khóa học toàn diện về tạo vũ khí 3D phong cách Stylized. Từ cơ bản đến nâng cao: Búa, Khiên, Kiếm và Cung.",
    thumbnail: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop", 
    modules: ZBRUSH_MODULES
  }
];

export const COURSE_CONTENT = ZBRUSH_MODULES;
