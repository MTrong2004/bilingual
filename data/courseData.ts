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
      data: {
  "subtitles": [
    {
      "id": 1,
      "startTime": "00:00",
      "endTime": "00:00",
      "textOriginal": "Hey, ребятки, доброго времени суток.",
      "textVietnamese": "Chào các bạn, chúc một ngày tốt lành."
    },
    {
      "id": 2,
      "startTime": "00:00",
      "endTime": "00:00:05",
      "textOriginal": "Ну, во-первых, добро пожаловать на курс, и спасибо за доверие.",
      "textVietnamese": "Đầu tiên, chào mừng đến với khóa học và cảm ơn sự tin tưởng của các bạn."
    },
    {
      "id": 3,
      "startTime": "00:00:05",
      "endTime": "00:00:10",
      "textOriginal": "А во-вторых, давайте немного разберёмся, как этот самый курс проходить.",
      "textVietnamese": "Thứ hai, hãy cùng tìm hiểu cách học khóa học này."
    },
    {
      "id": 4,
      "startTime": "00:00:10",
      "endTime": "00:00:22",
      "textOriginal": "Если вы не глянули строчку, что этот курс не прям совсем вот для новичков, которые только-только открыли Zbrush, то я всё-таки добавил сюда парочку уроков по основам, по интерфейсу этой самой программы.",
      "textVietnamese": "Nếu bạn chưa xem qua dòng ghi chú rằng khóa học này không hoàn toàn dành cho những người mới mở Zbrush lần đầu, thì tôi vẫn thêm vào đây một vài bài học về các nguyên tắc cơ bản và giao diện của phần mềm này."
    },
    {
      "id": 5,
      "startTime": "00:00:22",
      "endTime": "00:00:25",
      "textOriginal": "Поэтому, в принципе, ничего особо страшного не произойдёт.",
      "textVietnamese": "Vì vậy, về cơ bản, không có gì quá đáng sợ sẽ xảy ra."
    },
    {
      "id": 6,
      "startTime": "00:00:25",
      "endTime": "00:00:31",
      "textOriginal": "Посмотрите это видео, и будете уже дальше смотреть сам курс.",
      "textVietnamese": "Bạn chỉ cần xem video này và sau đó tiếp tục với khóa học."
    },
    {
      "id": 7,
      "startTime": "00:00:31",
      "endTime": "00:00:34",
      "textOriginal": "Так, конечно, будет посложнее, но, по крайней мере, вы справитесь.",
      "textVietnamese": "Tất nhiên, việc này sẽ khó hơn, nhưng ít nhất bạn sẽ xử lý được."
    },
    {
      "id": 8,
      "startTime": "00:00:34",
      "endTime": "00:00:41",
      "textOriginal": "Ну, а так, вообще, желательно пройти предыдущий мой курс, который прямо вот полностью по основам ZBrush, для тех, кто вообще в этом никакой.",
      "textVietnamese": "Nhưng nói chung, bạn nên hoàn thành khóa học trước của tôi, khóa học đó hoàn toàn về cơ bản ZBrush, dành cho những người hoàn toàn không biết gì về nó."
    },
    {
      "id": 9,
      "startTime": "00:00:41",
      "endTime": "00:00:45",
      "textOriginal": "То есть, первый раз открыли программу и не знают, что в ней делать.",
      "textVietnamese": "Tức là, họ mở chương trình lần đầu và không biết phải làm gì với nó."
    },
    {
      "id": 10,
      "startTime": "00:00:45",
      "endTime": "00:00:55",
      "textOriginal": "Если же вы не такой, то можете смело выключать это видео и пропускать первый раздел, и переходить сразу же к моделингу и скульптингу молота и остальных предметов курса.",
      "textVietnamese": "Nếu bạn không phải là người như vậy, bạn có thể tự tin tắt video này, bỏ qua phần đầu tiên và chuyển thẳng sang phần tạo mô hình và điêu khắc cái búa và các đối tượng khác trong khóa học."
    },
    {
      "id": 11,
      "startTime": "00:00:55",
      "endTime": "00:01:02",
      "textOriginal": "Ну, а если же это не так, то давайте для начала загрузим кисти, которыми мы будем работать.",
      "textVietnamese": "Nhưng nếu không phải, trước tiên hãy tải các cọ vẽ mà chúng ta sẽ sử dụng."
    },
    {
      "id": 12,
      "startTime": "00:01:02",
      "endTime": "00:01:14",
      "textOriginal": "Я бы с огромным удовольствием добавил ссылки на всё вот это вот добро, но платформа Udemy не разрешает давать ссылки, в которых требуется регистрация и прочее. Хотя, я бы не сказал, что здесь она требуется.",
      "textVietnamese": "Tôi rất sẵn lòng thêm các liên kết đến tất cả những thứ tốt này, nhưng nền tảng Udemy không cho phép cung cấp các liên kết yêu cầu đăng ký và những thứ tương tự. Mặc dù, tôi không nghĩ nó yêu cầu ở đây."
    },
    {
      "id": 13,
      "startTime": "00:01:14",
      "endTime": "00:01:16",
      "textOriginal": "В общем-то, вот она ссылочка.",
      "textVietnamese": "Nói chung, đây là liên kết."
    },
    {
      "id": 14,
      "startTime": "00:01:16",
      "endTime": "00:01:23",
      "textOriginal": "Но если лень вводить, можно просто ввести Orb brushes в Гугле или там в Яндексе, у вас появятся первые две ссылки.",
      "textVietnamese": "Nhưng nếu bạn ngại gõ, bạn có thể chỉ cần nhập Orb brushes vào Google hoặc Yandex, và hai liên kết đầu tiên sẽ xuất hiện."
    },
    {
      "id": 15,
      "startTime": "00:01:23",
      "endTime": "00:01:32",
      "textOriginal": "Первая ссылка на ArtStation, ведёт у нас, собственно, на автора этих самых кистей, ну и вообще достаточно интересного человека и художника,",
      "textVietnamese": "Liên kết đầu tiên là đến ArtStation, dẫn đến tác giả của những cây cọ này, và nói chung là một người và nghệ sĩ khá thú vị."
    },
    {
      "id": 16,
      "startTime": "00:01:32",
      "endTime": "00:01:38",
      "textOriginal": "который, кстати, работает в Blizzard, о чем можно посмотреть его профиль ArtStation.",
      "textVietnamese": "Người này, nhân tiện, làm việc tại Blizzard, bạn có thể xem hồ sơ ArtStation của anh ấy để biết thêm."
    },
    {
      "id": 17,
      "startTime": "00:01:38",
      "endTime": "00:01:47",
      "textOriginal": "И может заодно словить какую-то волну мотивацию. И, собственно, даже в этом самом посте у него есть ссылочка на эти самые кисти.",
      "textVietnamese": "Và có thể đồng thời tìm được động lực. Và thực ra, ngay trong bài đăng này, anh ấy có một liên kết đến chính những cây cọ này."
    },
    {
      "id": 18,
      "startTime": "00:01:47",
      "endTime": "00:01:51",
      "textOriginal": "Вот, ну либо можете сразу перейти на Gumroad по этой ссылочке.",
      "textVietnamese": "Hoặc bạn có thể chuyển thẳng đến Gumroad bằng liên kết này."
    },
    {
      "id": 19,
      "startTime": "00:01:51",
      "endTime": "00:01:56",
      "textOriginal": "И у нас здесь есть кнопочка \"Я хочу это\". Здесь вводим ноль. То есть, мы можем получить их абсолютно бесплатно.",
      "textVietnamese": "Và ở đây chúng ta có nút \"Tôi muốn nó\". Ở đây, chúng ta nhập số không. Tức là, chúng ta có thể nhận chúng hoàn toàn miễn phí."
    },
    {
      "id": 20,
      "startTime": "00:01:56",
      "endTime": "00:02:04",
      "textOriginal": "Но если вы хотите поддержать человека за столь замечательный продукт, можете ввести здесь абсолютно любую сумму.",
      "textVietnamese": "Nhưng nếu bạn muốn hỗ trợ người tạo ra sản phẩm tuyệt vời này, bạn có thể nhập vào đây bất kỳ số tiền nào bạn muốn."
    },
    {
      "id": 21,
      "startTime": "00:02:04",
      "endTime": "00:02:08",
      "textOriginal": "Так как я это делаю уже не в первый раз, то введу нолик.",
      "textVietnamese": "Vì tôi đã làm điều này không phải lần đầu tiên, tôi sẽ nhập số không."
    },
    {
      "id": 22,
      "startTime": "00:02:08",
      "endTime": "00:02:14",
      "textOriginal": "А вот здесь мы уже введём наш электронный адрес, на который придёт ссылка для скачивания.",
      "textVietnamese": "Và ở đây chúng ta sẽ nhập địa chỉ email của mình, nơi liên kết tải xuống sẽ được gửi đến."
    },
    {
      "id": 23,
      "startTime": "00:02:14",
      "endTime": "00:02:15",
      "textOriginal": "Нажимаем \"Get\".",
      "textVietnamese": "Nhấn \"Get\" (Nhận)."
    },
    {
      "id": 24,
      "startTime": "00:02:15",
      "endTime": "00:02:20",
      "textOriginal": "Проходим капчу, как я её ненавижу.",
      "textVietnamese": "Vượt qua Captcha, tôi ghét cái này làm sao."
    },
    {
      "id": 25,
      "startTime": "00:02:20",
      "endTime": "00:02:25",
      "textOriginal": "И просмотр содержания. В принципе, на почту нам проходить сейчас даже не потребуется.",
      "textVietnamese": "Và xem nội dung. Về cơ bản, chúng ta không cần phải vào email ngay bây giờ."
    },
    {
      "id": 26,
      "startTime": "00:02:25",
      "endTime": "00:02:32",
      "textOriginal": "Но, если вы вдруг забудете ссылку, то она у вас будет лежать ещё на почте в письме. Нажимаем \"Download\".",
      "textVietnamese": "Nhưng nếu bạn quên liên kết, nó vẫn sẽ nằm trong email của bạn. Nhấn \"Download\" (Tải xuống)."
    },
    {
      "id": 27,
      "startTime": "00:02:32",
      "endTime": "00:02:34",
      "textOriginal": "У нас скачается архивчик.",
      "textVietnamese": "Một tệp lưu trữ sẽ được tải xuống."
    },
    {
      "id": 28,
      "startTime": "00:02:34",
      "endTime": "00:02:37",
      "textOriginal": "Мы получили архивчик. Распаковываем его.",
      "textVietnamese": "Chúng ta đã nhận được tệp lưu trữ. Hãy giải nén nó."
    },
    {
      "id": 29,
      "startTime": "00:02:37",
      "endTime": "00:02:43",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 30,
      "startTime": "00:02:43",
      "endTime": "00:02:46",
      "textOriginal": "И вот они наши кисточки.",
      "textVietnamese": "Và đây là các cọ vẽ của chúng ta."
    },
    {
      "id": 31,
      "startTime": "00:02:46",
      "endTime": "00:02:56",
      "textOriginal": "В принципе, все их импортировать вовсе не обязательно. Достаточно лишь нескольких. Но, на всякий случай, импортируйте все, мало ли они вам когда-нибудь пригодятся, может даже в этом курсе.",
      "textVietnamese": "Về cơ bản, bạn không cần phải nhập tất cả chúng. Chỉ cần một vài cái là đủ. Nhưng để đề phòng, hãy nhập tất cả, phòng khi chúng hữu ích với bạn, có thể là ngay trong khóa học này."
    },
    {
      "id": 32,
      "startTime": "00:02:57",
      "endTime": "00:03:01",
      "textOriginal": "Теперь нас интересует папочка ZBrush, в которой мы всё это добро поместим.",
      "textVietnamese": "Bây giờ chúng ta cần thư mục ZBrush, nơi chúng ta sẽ đặt tất cả những thứ này."
    },
    {
      "id": 33,
      "startTime": "00:03:01",
      "endTime": "00:03:10",
      "textOriginal": "Как правило, он находится в Program Files, если у вас шестичетырёхбитная версия Виндоуса. Если вы не знаете, что это такое, то и не парьтесь.",
      "textVietnamese": "Thông thường, nó nằm trong Program Files nếu bạn đang sử dụng phiên bản Windows 64-bit. Nếu bạn không biết đó là gì, đừng lo lắng."
    },
    {
      "id": 34,
      "startTime": "00:03:10",
      "endTime": "00:03:20",
      "textOriginal": "Если здесь не будет папки Pixologic, вот этой, то, скорее всего, она будет вот здесь. Ну, если её нет здесь, то она, наоборот, будет в этой папке.",
      "textVietnamese": "Nếu thư mục Pixologic không có ở đây, thì rất có thể nó sẽ nằm ở đây. Và nếu nó không có ở đây, nó sẽ nằm trong thư mục này (Program Files x86)."
    },
    {
      "id": 35,
      "startTime": "00:03:20",
      "endTime": "00:03:27",
      "textOriginal": "О'кей. Заходим сюда. Ищем здесь ZStartup. Выбираем здесь BrushPresets.",
      "textVietnamese": "Được rồi. Đi vào đây. Tìm ZStartup ở đây. Chọn BrushPresets."
    },
    {
      "id": 36,
      "startTime": "00:03:27",
      "endTime": "00:03:40",
      "textOriginal": "И они у меня здесь уже, в принципе, установлены, и как и некоторые другие кисти. Вам нужно просто их будет взять, взять и перетащить сюда. Всё, на этом установка кистей закончится.",
      "textVietnamese": "Và chúng về cơ bản đã được cài đặt ở đây, cũng như một số cọ vẽ khác. Bạn chỉ cần lấy chúng, lấy chúng và kéo chúng vào đây. Vậy là xong, việc cài đặt cọ vẽ đã hoàn tất."
    },
    {
      "id": 37,
      "startTime": "00:03:40",
      "endTime": "00:03:49",
      "textOriginal": "То же самое, если вы скачаете какие-нибудь материалы, вы поместите их уже не в BrushPresets, а в Materials. Здесь пока находятся стандартные материалы.",
      "textVietnamese": "Tương tự, nếu bạn tải xuống bất kỳ vật liệu nào, bạn sẽ đặt chúng không phải trong BrushPresets mà là trong Materials. Hiện tại, các vật liệu tiêu chuẩn đang ở đây."
    },
    {
      "id": 38,
      "startTime": "00:03:49",
      "endTime": "00:04:05",
      "textOriginal": "Теперь при запуске ZBrush, закрывая Lightbox, у нас здесь... Давайте сейчас быстренько так оп-оп. А в панели кистей появятся эти самые Орбовские кисти.",
      "textVietnamese": "Bây giờ, khi ZBrush khởi động và đóng Lightbox, những cây cọ Orb sẽ xuất hiện ở đây... Hãy nhanh chóng làm điều đó. Các cọ vẽ Orb này sẽ xuất hiện trong bảng cọ vẽ."
    },
    {
      "id": 39,
      "startTime": "00:04:05",
      "endTime": "00:04:11",
      "textOriginal": "А материал у нас, соответственно, будет появляться вот здесь.",
      "textVietnamese": "Và vật liệu của chúng ta, tương ứng, sẽ xuất hiện ở đây."
    },
    {
      "id": 40,
      "startTime": "00:04:11",
      "endTime": "00:04:19",
      "textOriginal": "Что касается материалов, можно поступить проще и нажать Load. И выбрать нужный нам материал. То есть, выбрать папку, где он находится, и нажать \"Открыть\".",
      "textVietnamese": "Về vật liệu, bạn có thể làm đơn giản hơn là nhấn Load (Tải) và chọn vật liệu bạn cần. Tức là, chọn thư mục chứa nó và nhấn \"Open\" (Mở)."
    },
    {
      "id": 41,
      "startTime": "00:04:19",
      "endTime": "00:04:30",
      "textOriginal": "Единственный момент, что в некоторых версиях ZBrush после этого материал остаётся здесь навсегда, а вот в некоторых он пропадает после следующего запуска.",
      "textVietnamese": "Điều duy nhất cần lưu ý là trong một số phiên bản ZBrush, vật liệu sẽ ở lại đây vĩnh viễn sau đó, nhưng trong một số phiên bản khác, nó sẽ biến mất sau lần khởi động tiếp theo."
    },
    {
      "id": 42,
      "startTime": "00:04:30",
      "endTime": "00:04:42",
      "textOriginal": "Поэтому, если вы хотите этот материал использовать на постоянке, когда вы его загрузите, нажимаем \"Save as Startup Material\", и тогда он у вас будет появляться сразу при старте ZBrush.",
      "textVietnamese": "Vì vậy, nếu bạn muốn sử dụng vật liệu này vĩnh viễn, sau khi bạn tải nó, hãy nhấp vào \"Save as Startup Material\" (Lưu làm Vật liệu Khởi động), và sau đó nó sẽ xuất hiện ngay khi ZBrush khởi động."
    },
    {
      "id": 43,
      "startTime": "00:04:42",
      "endTime": "00:04:54",
      "textOriginal": "То есть, у меня сейчас вот такой вот зелёненький прикольный материал. По старту здесь обычно, кажется, вот такой вот стоит. А, нет, вру, вот такой. Вот, но он мне вообще не нравится, как-то прямо жуть.",
      "textVietnamese": "Tức là, hiện tại tôi có một vật liệu màu xanh lá cây mát mẻ như thế này. Khi khởi động, ở đây thường có một cái như thế này. À, không phải, tôi nhầm, là cái này. Nhưng tôi không thích cái này chút nào, nó trông thật kinh khủng."
    },
    {
      "id": 44,
      "startTime": "00:04:54",
      "endTime": "00:05:16",
      "textOriginal": "Поэтому я советую использовать либо BasicMaterial, либо MatCap Gray, либо любой другой, который вам понравится, но не слишком уж чёрный, вроде вот такого, чтобы было видно именно саму геометрию. То есть, такой ещё, в принципе, пойдёт, но опять же много переливов всяких и поэтому будет порой сложно ориентироваться.",
      "textVietnamese": "Vì vậy, tôi khuyên bạn nên sử dụng BasicMaterial, hoặc MatCap Gray, hoặc bất kỳ vật liệu nào khác mà bạn thích, nhưng không quá tối, như cái này chẳng hạn, để bạn có thể thấy rõ hình học thực tế. Tức là, cái này vẫn ổn, nhưng lại có quá nhiều ánh sáng phản chiếu và đôi khi sẽ khó để định hướng."
    },
    {
      "id": 45,
      "startTime": "00:05:16",
      "endTime": "00:05:24",
      "textOriginal": "Ну, думаю, с этим мы разобрались и пора переходить к следующим урокам курса. Удачи вам.",
      "textVietnamese": "Vâng, tôi nghĩ chúng ta đã giải quyết xong phần này và đã đến lúc chuyển sang các bài học tiếp theo của khóa học. Chúc các bạn may mắn."
    }
  ],
  "notes": [
    {
      "timestamp": "00:00:55",
      "title": "Tải xuống và cài đặt cọ Orb Brushes",
      "content": "Người hướng dẫn chỉ ra rằng Orb Brushes là miễn phí và có thể được tải xuống từ ArtStation hoặc Gumroad. Bạn có thể nhập số 0 khi mua trên Gumroad để tải miễn phí hoặc nhập số tiền tùy ý để ủng hộ tác giả. Tệp sẽ được gửi qua email hoặc có thể tải trực tiếp từ trang web. Giải nén tệp đã tải xuống."
    },
    {
      "timestamp": "00:02:57",
      "title": "Vị trí cài đặt Cọ vẽ và Vật liệu ZBrush",
      "content": "Để cài đặt cọ vẽ và vật liệu tùy chỉnh, bạn cần tìm thư mục cài đặt ZBrush, thường nằm trong Program Files\\Pixologic. Các cọ vẽ (brushes) cần được đặt vào thư mục ZBrush\\ZStartup\\BrushPresets. Tương tự, các vật liệu (materials) cần được đặt vào thư mục ZBrush\\ZStartup\\Materials."
    },
    {
      "timestamp": "00:04:30",
      "title": "Lưu Vật liệu khởi động (Startup Material)",
      "content": "Trong một số phiên bản ZBrush, vật liệu đã tải có thể biến mất sau khi khởi động lại. Để vật liệu yêu thích luôn xuất hiện, hãy tải nó lên, sau đó vào menu Material và chọn \"Save as Startup Material\". Người hướng dẫn khuyên dùng BasicMaterial hoặc MatCap Gray để có thể thấy rõ hình học của mô hình."
    }
  ],
  "flashcards": [
    {
      "id": "brushes",
      "term": "Orb Brushes",
      "definition": "Bộ cọ vẽ ZBrush miễn phí của Michael Vicente.",
      "context": "Bộ cọ vẽ ZBrush miễn phí của Michael Vicente."
    },
    {
      "id": "zbrush",
      "term": "ZBrush",
      "definition": "Phần mềm điêu khắc kỹ thuật số 3D.",
      "context": "Phần mềm điêu khắc kỹ thuật số 3D."
    },
    {
      "id": "artstation",
      "term": "ArtStation",
      "definition": "Nền tảng trực tuyến phổ biến cho các nghệ sĩ 3D để trưng bày tác phẩm và tài nguyên.",
      "context": "Nền tảng trực tuyến phổ biến cho các nghệ sĩ 3D để trưng bày tác phẩm và tài nguyên."
    },
    {
      "id": "gumroad",
      "term": "Gumroad",
      "definition": "Nền tảng bán hàng cho phép người sáng tạo bán các sản phẩm kỹ thuật số trực tiếp cho khán giả của họ.",
      "context": "Nền tảng bán hàng cho phép người sáng tạo bán các sản phẩm kỹ thuật số trực tiếp cho khán giả của họ."
    },
    {
      "id": "brushpresets",
      "term": "BrushPresets",
      "definition": "Thư mục trong ZBrush nơi lưu trữ các cài đặt trước cọ vẽ tùy chỉnh.",
      "context": "Thư mục trong ZBrush nơi lưu trữ các cài đặt trước cọ vẽ tùy chỉnh."
    },
    {
      "id": "materials",
      "term": "Materials (Vật liệu)",
      "definition": "Các bề mặt áp dụng cho mô hình 3D để thay đổi cách ánh sáng tương tác với chúng.",
      "context": "Các bề mặt áp dụng cho mô hình 3D để thay đổi cách ánh sáng tương tác với chúng."
    },
    {
      "id": "pixologic",
      "term": "Pixologic",
      "definition": "Công ty phát triển phần mềm ZBrush.",
      "context": "Công ty phát triển phần mềm ZBrush."
    },
    {
      "id": "zstartup",
      "term": "ZStartup",
      "definition": "Thư mục chứa các tệp sẽ tự động được tải khi ZBrush khởi động.",
      "context": "Thư mục chứa các tệp sẽ tự động được tải khi ZBrush khởi động."
    },
    {
      "id": "matcap_gray",
      "term": "MatCap Gray",
      "definition": "Một loại vật liệu MatCap được đề xuất để điêu khắc vì nó phản chiếu ánh sáng trung tính, giúp thấy rõ hình học.",
      "context": "Một loại vật liệu MatCap được đề xuất để điêu khắc vì nó phản chiếu ánh sáng trung tính, giúp thấy rõ hình học."
    },
    {
      "id": "startup_material",
      "term": "Save as Startup Material",
      "definition": "Chức năng lưu vật liệu hiện tại để nó tự động tải lên mỗi khi ZBrush khởi động.",
      "context": "Chức năng lưu vật liệu hiện tại để nó tự động tải lên mỗi khi ZBrush khởi động."
    }
  ]
}
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
      { id: "l2-1", title: "1. Blockout", videoUrl: getLink("2. Создание молота", "1. Блокаут.mp4"), duration: "08:51" ,
    data: {
  "subtitles": [
    {
      "id": 1,
      "startTime": "00:00",
      "endTime": "00:01",
      "textOriginal": "Итак, ZBrush запущен, все кнопки на своих местах,",
      "textVietnamese": "Vậy là ZBrush đã khởi động, mọi nút đều ở đúng vị trí,"
    },
    {
      "id": 2,
      "startTime": "00:01",
      "endTime": "00:08",
      "textOriginal": "за исключением некоторых внизу, но они появятся чуть позже, как только мы здесь создадим новый объект.",
      "textVietnamese": "ngoại trừ một số nút ở phía dưới, nhưng chúng sẽ xuất hiện sau khi chúng ta tạo một đối tượng mới ở đây."
    },
    {
      "id": 3,
      "startTime": "00:08",
      "endTime": "00:15",
      "textOriginal": "Так как мы будем делать молот, то давайте начнём с рукоятки, потому что это достаточно быстро мне попалось под руку.",
      "textVietnamese": "Vì chúng ta sẽ làm một cái búa, hãy bắt đầu với tay cầm, vì nó khá nhanh và dễ thấy."
    },
    {
      "id": 4,
      "startTime": "00:17",
      "endTime": "00:27",
      "textOriginal": "Нажимаем Edit либо горячую клавишу T, и сразу же, идя в Subtool, а сначала нажмём Make PolyMesh 3D.",
      "textVietnamese": "Chúng ta nhấn Edit hoặc phím nóng T, và ngay lập tức vào Subtool, à trước hết nhấn Make PolyMesh 3D."
    },
    {
      "id": 5,
      "startTime": "00:27",
      "endTime": "00:32",
      "textOriginal": "И теперь здесь мы добавим какой-нибудь кубик. Вот так.",
      "textVietnamese": "Và bây giờ ở đây, chúng ta sẽ thêm một khối lập phương nào đó. Như thế này."
    },
    {
      "id": 6,
      "startTime": "00:32",
      "endTime": "00:35",
      "textOriginal": "Сейчас они одинакового размера,",
      "textVietnamese": "Hiện tại chúng có cùng kích thước,"
    },
    {
      "id": 7,
      "startTime": "00:35",
      "endTime": "00:38",
      "textOriginal": "но мы это быстренько исправим.",
      "textVietnamese": "nhưng chúng ta sẽ nhanh chóng sửa nó."
    },
    {
      "id": 8,
      "startTime": "00:38",
      "endTime": "00:45",
      "textOriginal": "Через зажатый Alt также всё переключаем и уменьшаем рукоятку в размере, но вытягиваем её.",
      "textVietnamese": "Giữ Alt để chuyển đổi mọi thứ, và giảm kích thước tay cầm, nhưng kéo dài nó ra."
    },
    {
      "id": 9,
      "startTime": "00:47",
      "endTime": "00:54",
      "textOriginal": "Я думаю, нам пока что, о, вполне хватит такого. И теперь нужно поработать именно с ударной частью.",
      "textVietnamese": "Tôi nghĩ kích thước này là đủ. Và bây giờ chúng ta cần xử lý phần đầu búa."
    },
    {
      "id": 10,
      "startTime": "01:01",
      "endTime": "01:08",
      "textOriginal": "Вытягиваем. Я хочу сделать его более таким коротеньким и сбитым.",
      "textVietnamese": "Kéo dài ra. Tôi muốn làm cho nó ngắn hơn và dày hơn."
    },
    {
      "id": 11,
      "startTime": "01:10",
      "endTime": "01:13",
      "textOriginal": "Например, вот так вот. Отлично.",
      "textVietnamese": "Ví dụ, như thế này. Hoàn hảo."
    },
    {
      "id": 12,
      "startTime": "01:17",
      "endTime": "01:24",
      "textOriginal": "Но это слишком просто, поэтому мы добавим сюда ещё несколько.",
      "textVietnamese": "Nhưng nó quá đơn giản, vì vậy chúng ta sẽ thêm một vài cái nữa vào đây."
    },
    {
      "id": 13,
      "startTime": "01:24",
      "endTime": "01:34",
      "textOriginal": "В принципе, можно даже просто продублировать вот этот, и теперь мы его немного увеличим, но укоротим.",
      "textVietnamese": "Về cơ bản, chúng ta thậm chí có thể nhân đôi cái này, và bây giờ chúng ta sẽ làm cho nó to hơn một chút nhưng ngắn hơn."
    },
    {
      "id": 14,
      "startTime": "01:34",
      "endTime": "01:43",
      "textOriginal": "Это у нас будет, как сказать, наконечник. Пол, в принципе, можно отключить,",
      "textVietnamese": "Đây sẽ là, làm sao để nói nhỉ, phần mũi. Về cơ bản, bạn có thể tắt sàn,"
    },
    {
      "id": 15,
      "startTime": "01:43",
      "endTime": "01:53",
      "textOriginal": "просто если вы не очень хорошо ориентируетесь в пространстве ZBrush'а и может получиться так, что у вас он, например, какой-то поднаклоном будет.",
      "textVietnamese": "chỉ là nếu bạn không giỏi định hướng trong không gian ZBrush, và có thể nó sẽ bị nghiêng chẳng hạn."
    },
    {
      "id": 16,
      "startTime": "01:53",
      "endTime": "02:07",
      "textOriginal": "А такое иногда бывает по неопытности, то просто включайте пол, чтобы вам было легче ориентироваться. Я, в принципе, его тогда лучше тоже оставлю, чтобы вы могли ориентироваться тоже.",
      "textVietnamese": "Điều đó đôi khi xảy ra do thiếu kinh nghiệm, nên chỉ cần bật sàn lên để bạn dễ định hướng hơn. Tôi nghĩ tôi sẽ giữ nó, để bạn cũng có thể định hướng."
    },
    {
      "id": 17,
      "startTime": "02:08",
      "endTime": "02:15",
      "textOriginal": "Так. Продублируем его и поместим сюда наверх, чтобы у нас был такой переходик.",
      "textVietnamese": "Rồi. Chúng ta nhân đôi nó và đặt nó lên trên này, để chúng ta có một sự chuyển tiếp."
    },
    {
      "id": 18,
      "startTime": "02:15",
      "endTime": "02:19",
      "textOriginal": "То есть, по сути, сейчас мы делаем простой блоут.",
      "textVietnamese": "Tức là, về cơ bản, bây giờ chúng ta đang làm một khối blockout đơn giản."
    },
    {
      "id": 19,
      "startTime": "02:19",
      "endTime": "02:30",
      "textOriginal": "Я думаю, можно даже его ещё немного вытянуть, потому что мы всё равно будем его стачивать по краям, и в итоге у нас где-то вот такой вот будет. Так что немного с запасом.",
      "textVietnamese": "Tôi nghĩ chúng ta có thể kéo dài nó thêm một chút, vì chúng ta sẽ mài các cạnh đi, và cuối cùng nó sẽ có kích thước như thế này. Vì vậy, cứ để dư ra một chút."
    },
    {
      "id": 20,
      "startTime": "02:31",
      "endTime": "02:36",
      "textOriginal": "Так. Может, даже и побольше.",
      "textVietnamese": "Rồi. Có lẽ còn to hơn một chút."
    },
    {
      "id": 21,
      "startTime": "02:36",
      "endTime": "02:46",
      "textOriginal": "Совсем на чуть-чуть. Вот так. В принципе, можно это сделать ещё раз, только уже для самой вот этой вот ударной части.",
      "textVietnamese": "Chỉ một chút thôi. Như vậy. Về cơ bản, chúng ta có thể làm điều này một lần nữa, nhưng dành cho chính phần đầu búa này."
    },
    {
      "id": 22,
      "startTime": "03:00",
      "endTime": "03:08",
      "textOriginal": "Вот так. Чтобы он был не просто как бы врезан туда, а чтобы был понятный переход.",
      "textVietnamese": "Như vậy. Để nó không chỉ đơn thuần là bị cắt vào đó, mà có một sự chuyển tiếp rõ ràng."
    },
    {
      "id": 23,
      "startTime": "03:09",
      "endTime": "03:14",
      "textOriginal": "Отлично.",
      "textVietnamese": "Tuyệt vời."
    },
    {
      "id": 24,
      "startTime": "03:15",
      "endTime": "03:22",
      "textOriginal": "И теперь добавим что-нибудь именно на сам молот.",
      "textVietnamese": "Và bây giờ chúng ta sẽ thêm một cái gì đó vào chính cây búa."
    },
    {
      "id": 25,
      "startTime": "03:23",
      "endTime": "03:33",
      "textOriginal": "Я вот думаю, добавлять сюда обмотки или нет. Можно, в принципе, это быстренько посмотреть через те же самые дубликаты.",
      "textVietnamese": "Tôi đang tự hỏi liệu có nên thêm các vòng quấn vào đây hay không. Về cơ bản, có thể xem nhanh điều này thông qua các bản sao tương tự."
    },
    {
      "id": 26,
      "startTime": "03:33",
      "endTime": "03:40",
      "textOriginal": "И как бы, в принципе, можно, но с другой стороны, он может оказаться лишним.",
      "textVietnamese": "Về cơ bản là có thể, nhưng mặt khác, nó có thể là thừa."
    },
    {
      "id": 27,
      "startTime": "03:46",
      "endTime": "03:52",
      "textOriginal": "О'кей, пока оставлю, а там будет видно. И что касается самой ударной части,",
      "textVietnamese": "OK, tạm thời cứ để đó, rồi tính sau. Và đối với chính phần đầu búa,"
    },
    {
      "id": 28,
      "startTime": "03:53",
      "endTime": "04:02",
      "textOriginal": "сделаем тоже достаточно просто. Продублируем, увеличим и вот так вот сократим. Ну, кстати, достаточно интересный вариант.",
      "textVietnamese": "chúng ta cũng làm khá đơn giản. Nhân đôi, phóng to và thu gọn lại như thế này. À, đây là một lựa chọn khá thú vị."
    },
    {
      "id": 29,
      "startTime": "04:08",
      "endTime": "04:15",
      "textOriginal": "Мне прямо даже и нравится. Старайтесь, чтобы не было вот таких вот практически плоских переходов.",
      "textVietnamese": "Tôi thậm chí còn thích nó. Hãy cố gắng không để có những chỗ chuyển tiếp gần như phẳng như thế này."
    },
    {
      "id": 30,
      "startTime": "04:15",
      "endTime": "04:26",
      "textOriginal": "Это потом сыграет с вами злую шутку, ну, и, в принципе, это не очень-то красиво смотрится. В таком варианте это гораздо лучше.",
      "textVietnamese": "Điều này sau này sẽ gây rắc rối cho bạn, và về cơ bản, nó không đẹp lắm. Theo cách này thì tốt hơn nhiều."
    },
    {
      "id": 31,
      "startTime": "04:30",
      "endTime": "04:42",
      "textOriginal": "Так. Но вообще я хотел сделать что-то вроде вот такого по краям, а вот этот как бы спрятать. Как бы тоже вариант.",
      "textVietnamese": "Rồi. Nhưng thực ra tôi muốn làm một cái gì đó giống như thế này ở các cạnh, còn cái này thì giấu đi. Cũng là một lựa chọn."
    },
    {
      "id": 32,
      "startTime": "04:42",
      "endTime": "04:55",
      "textOriginal": "Мне кажется, он будет достаточно избитый, что ли. То есть мне кажется, так уже много кто делал, а вот так ещё вроде мне не попадалось.",
      "textVietnamese": "Tôi cảm thấy nó sẽ khá là cũ kỹ. Tức là tôi nghĩ nhiều người đã làm như vậy rồi, nhưng tôi chưa thấy kiểu này."
    },
    {
      "id": 33,
      "startTime": "05:00",
      "endTime": "05:08",
      "textOriginal": "Да, определённо надо сделать шире. Не бойтесь добавлять массы, чтобы казалось массивнее.",
      "textVietnamese": "Vâng, chắc chắn phải làm rộng hơn. Đừng ngại thêm khối lượng, để nó trông đồ sộ hơn."
    },
    {
      "id": 34,
      "startTime": "05:08",
      "endTime": "05:15",
      "textOriginal": "Тем более для такого оружия. Так, здесь тоже стоит немного увеличить.",
      "textVietnamese": "Đặc biệt là đối với loại vũ khí này. Rồi, ở đây cũng nên tăng kích thước một chút."
    },
    {
      "id": 35,
      "startTime": "05:19",
      "endTime": "05:36",
      "textOriginal": "Да даже не немного, потому что здесь мы тоже добавим такой переходик. Так. Просто его тоже дублируем.",
      "textVietnamese": "Thậm chí không chỉ một chút thôi, vì ở đây chúng ta cũng sẽ thêm một sự chuyển tiếp như vậy. Rồi. Chỉ cần nhân đôi nó."
    },
    {
      "id": 36,
      "startTime": "05:48",
      "endTime": "05:53",
      "textOriginal": "Отлично. Вот такой простенький блоут уже у нас получился.",
      "textVietnamese": "Tuyệt vời. Chúng ta đã có một khối blockout đơn giản như thế này."
    },
    {
      "id": 37,
      "startTime": "05:55",
      "endTime": "06:01",
      "textOriginal": "Я всё ещё сомневаюсь, нужны ли нам будут эти обмотки.",
      "textVietnamese": "Tôi vẫn còn nghi ngờ liệu chúng ta có cần những vòng quấn này không."
    },
    {
      "id": 38,
      "startTime": "06:09",
      "endTime": "06:21",
      "textOriginal": "Я всё-таки думаю, что не нужны, поэтому давайте их просто удалим, но всегда нажимайте, всегда точнее проверяйте, то ли вы удаляете.",
      "textVietnamese": "Tôi vẫn nghĩ là không cần, vì vậy hãy xóa chúng đi, nhưng hãy luôn nhấn, hay nói đúng hơn là luôn kiểm tra xem bạn có xóa đúng thứ không."
    },
    {
      "id": 39,
      "startTime": "06:21",
      "endTime": "06:33",
      "textOriginal": "Иначе потом это будет очень проблемно восстановить, если вообще будет такая возможность. Ой, а без них даже как-то и рукоятка пустовато смотрится.",
      "textVietnamese": "Nếu không, sau này sẽ rất khó để khôi phục, nếu có cơ hội. Ôi, không có chúng thì tay cầm trông hơi trống rỗng."
    },
    {
      "id": 40,
      "startTime": "06:33",
      "endTime": "06:40",
      "textOriginal": "Вот же ж, ладно, продублируем.",
      "textVietnamese": "Thật là... thôi được rồi, nhân đôi."
    },
    {
      "id": 41,
      "startTime": "06:40",
      "endTime": "06:51",
      "textOriginal": "Мы, конечно, потом сделаем здесь нормальные обмотки, но даже вот с такой простой, а с таким простым элементом утоления всё равно смотрится куда лучше.",
      "textVietnamese": "Tất nhiên, sau này chúng ta sẽ làm các vòng quấn bình thường ở đây, nhưng ngay cả với một yếu tố đơn giản như vậy, sự giảm kích thước đơn giản này trông vẫn tốt hơn nhiều."
    },
    {
      "id": 42,
      "startTime": "06:51",
      "endTime": "07:01",
      "textOriginal": "А в принципе, блоут готов. У нас уже есть полноценная, так сказать, основа, с которой мы можем работать.",
      "textVietnamese": "Về cơ bản, khối blockout đã sẵn sàng. Chúng ta đã có một cơ sở đầy đủ để bắt đầu làm việc."
    },
    {
      "id": 43,
      "startTime": "07:02",
      "endTime": "07:09",
      "textOriginal": "Так. Может, здесь ещё что-нибудь такое придумать.",
      "textVietnamese": "Rồi. Có lẽ nên nghĩ ra điều gì đó tương tự ở đây."
    },
    {
      "id": 44,
      "startTime": "07:22",
      "endTime": "07:25",
      "textOriginal": "Но, пожалуй, не стоит.",
      "textVietnamese": "Nhưng có lẽ không cần thiết."
    },
    {
      "id": 45,
      "startTime": "07:25",
      "endTime": "07:35",
      "textOriginal": "А вот где это действительно может пригодиться, так это где-нибудь вот здесь. Через зажатый Shift.",
      "textVietnamese": "Nhưng nơi nó thực sự có thể hữu ích, là ở đâu đó quanh đây. Bằng cách giữ Shift."
    },
    {
      "id": 46,
      "startTime": "07:38",
      "endTime": "07:49",
      "textOriginal": "Я его сразу сделаю вот таким вот длинным, чтобы он сразу был на две стороны. Вот так.",
      "textVietnamese": "Tôi sẽ làm cho nó dài ra ngay, để nó nằm trên cả hai mặt. Như vậy."
    },
    {
      "id": 47,
      "startTime": "07:50",
      "endTime": "07:56",
      "textOriginal": "Можно попробовать сделать здесь также квадрат, но, если честно, сомневаюсь, что в этом будет смысл. Пока что удалим.",
      "textVietnamese": "Bạn có thể thử làm một hình vuông ở đây, nhưng thành thật mà nói, tôi nghi ngờ điều đó có ý nghĩa. Tạm thời hãy xóa nó đi."
    },
    {
      "id": 48,
      "startTime": "07:56",
      "endTime": "08:11",
      "textOriginal": "Попробуем через квадрат и, если будет так себе, то пока на этом закончим.",
      "textVietnamese": "Chúng ta hãy thử làm hình vuông, và nếu nó tệ, chúng ta sẽ dừng lại ở đó."
    },
    {
      "id": 49,
      "startTime": "08:12",
      "endTime": "08:15",
      "textOriginal": "Так, не туда.",
      "textVietnamese": "Rồi, không đúng chỗ."
    },
    {
      "id": 50,
      "startTime": "08:27",
      "endTime": "08:35",
      "textOriginal": "Посмотрим в перспективе, что у нас тут.",
      "textVietnamese": "Hãy xem phối cảnh, chúng ta có gì ở đây."
    },
    {
      "id": 51,
      "startTime": "08:39",
      "endTime": "08:51",
      "textOriginal": "Да, интересный вариант, но пока что что-то не то. В общем-то, пока что оставляем, и сейчас мы будем думать, как нам его детализировать.",
      "textVietnamese": "Vâng, một lựa chọn thú vị, nhưng có vẻ chưa ổn lắm. Tóm lại, chúng ta cứ giữ như vậy, và bây giờ chúng ta sẽ nghĩ xem làm thế nào để chi tiết hóa nó."
    }
  ],
  "notes": [
    {
      "timestamp": "00:00",
      "title": "Bắt đầu Blockout Búa: Tạo Tay Cầm và Đầu Búa",
      "content": "Người hướng dẫn bắt đầu bằng cách khởi động ZBrush và tạo hình trụ (Cylinder) để làm tay cầm của búa. Sau đó, họ chuyển sang Chế độ Chỉnh sửa (Edit Mode), chọn Make PolyMesh 3D, và thêm một khối lập phương (Cube) để làm đầu búa. Họ điều chỉnh tỷ lệ và kéo dài tay cầm cho phù hợp."
    },
    {
      "timestamp": "01:17",
      "title": "Thêm các chi tiết cơ bản vào Tay Cầm",
      "content": "Nhận thấy thiết kế quá đơn giản, người hướng dẫn nhân đôi hình trụ tay cầm để tạo ra các phần chuyển tiếp (transition pieces). Họ điều chỉnh kích thước và vị trí của các hình trụ nhỏ hơn này. Người hướng dẫn cũng khuyên nên bật sàn (Floor Grid) để hỗ trợ định hướng trong không gian 3D, đặc biệt với người mới bắt đầu."
    },
    {
      "timestamp": "03:46",
      "title": "Tạo các tấm kim loại cho Đầu Búa",
      "content": "Người hướng dẫn nhân đôi khối lập phương làm đầu búa, phóng to và thu gọn nó để tạo ra các tấm kim loại bao quanh. Họ lưu ý tránh các chỗ chuyển tiếp phẳng vì chúng gây khó khăn khi điêu khắc chi tiết sau này. Sau khi thử nghiệm, họ quyết định giữ lại các yếu tố đơn giản này."
    },
    {
      "timestamp": "06:51",
      "title": "Hoàn thành Blockout",
      "content": "Sau khi thử nghiệm thêm các chi tiết quấn quanh tay cầm và loại bỏ chúng vì thấy không cần thiết, người hướng dẫn hoàn thành khối blockout cơ bản. Họ thử nghiệm với hình dạng tròn và vuông cho phần trung tâm của đầu búa trước khi kết thúc giai đoạn tạo hình tổng thể, chuẩn bị cho bước chi tiết hóa tiếp theo."
    }
  ],
  "flashcards": [
    {
      "id": "card_1",
      "term": "ZBrush",
      "definition": "Phần mềm điêu khắc kỹ thuật số (digital sculpting) phổ biến trong ngành công nghiệp game và phim ảnh.",
      "context": "Digital sculpting software."
    },
    {
      "id": "card_2",
      "term": "Subtool",
      "definition": "Công cụ phụ trong ZBrush; một danh sách các mô hình độc lập (lưới) tạo nên mô hình tổng thể.",
      "context": "Subdivision tools/layers for handling multiple meshes."
    },
    {
      "id": "card_3",
      "term": "Make PolyMesh 3D",
      "definition": "Chuyển đổi một đối tượng nguyên thủy (như hình trụ hay khối lập phương) thành một lưới đa giác có thể chỉnh sửa tự do.",
      "context": "Convert a primitive object into an editable polygonal mesh."
    },
    {
      "id": "card_4",
      "term": "Append",
      "definition": "Thêm một mô hình hoặc công cụ mới vào danh sách Subtool hiện tại.",
      "context": "Add a new mesh/tool to the current Subtool list."
    },
    {
      "id": "card_5",
      "term": "Cylinder 3D",
      "definition": "Hình trụ 3D (một đối tượng nguyên thủy).",
      "context": "3D cylinder primitive object."
    },
    {
      "id": "card_6",
      "term": "Cube 3D",
      "definition": "Khối lập phương 3D (một đối tượng nguyên thủy).",
      "context": "3D cube primitive object."
    },
    {
      "id": "card_7",
      "term": "Scale",
      "definition": "Chức năng điều chỉnh kích thước của mô hình.",
      "context": "Function to adjust the size of the model."
    },
    {
      "id": "card_8",
      "term": "Duplicate",
      "definition": "Nhân bản một Subtool hiện tại.",
      "context": "To make a copy of the current Subtool."
    },
    {
      "id": "card_9",
      "term": "Floor Grid",
      "definition": "Lưới sàn, được sử dụng để định hướng và tham chiếu không gian trong môi trường làm việc.",
      "context": "Reference grid used for spatial orientation."
    },
    {
      "id": "card_10",
      "term": "Blockout",
      "definition": "Giai đoạn tạo hình cơ bản, nơi các khối hình đơn giản được sử dụng để xác định tỷ lệ và bố cục tổng thể.",
      "context": "Initial modeling stage focusing on fundamental shapes, proportion, and layout."
    }
  ]
}
  },
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
      {
    id: "l3-5",
    title: "5. Wood",
    videoUrl: getLink("3. Создание щита", "5. Дерево.mp4"),
    duration: "09:29",
    data: {
  "subtitles": [
    {
      "id": 1,
      "startTime": "00:01",
      "endTime": "00:03",
      "textOriginal": "Так, с деревом всё намного проще.",
      "textVietnamese": "Vâng, với gỗ thì mọi thứ đơn giản hơn nhiều."
    },
    {
      "id": 2,
      "startTime": "00:03",
      "endTime": "00:07",
      "textOriginal": "Сразу же убираем симметричные доски, чтобы ускорить.",
      "textVietnamese": "Chúng ta loại bỏ các tấm ván đối xứng ngay lập tức để tăng tốc."
    },
    {
      "id": 3,
      "startTime": "00:07",
      "endTime": "00:09",
      "textOriginal": "Включаем DynaMesh.",
      "textVietnamese": "Bật DynaMesh lên."
    },
    {
      "id": 4,
      "startTime": "00:09",
      "endTime": "00:19",
      "textOriginal": "И сразу же для уму поставим на большое разрешение, чтобы у нас... не, 1020 перебор. А где-то...",
      "textVietnamese": "Và ngay lập tức, chúng ta sẽ đặt độ phân giải lớn cho nó, để chúng ta có... không, 1020 là quá mức. Khoảng..."
    },
    {
      "id": 5,
      "startTime": "00:19",
      "endTime": "00:21",
      "textOriginal": "Ну вот 65.000 должно хватить.",
      "textVietnamese": "Khoảng 65.000 là đủ."
    },
    {
      "id": 6,
      "startTime": "00:21",
      "endTime": "00:23",
      "textOriginal": "Применяю снова Polish.",
      "textVietnamese": "Tôi áp dụng Polish một lần nữa."
    },
    {
      "id": 7,
      "startTime": "00:27",
      "endTime": "00:34",
      "textOriginal": "И через Trim Dynamic можно также подравнять вот эти вот края.",
      "textVietnamese": "Và thông qua Trim Dynamic, chúng ta cũng có thể làm phẳng các cạnh này."
    },
    {
      "id": 8,
      "startTime": "00:36",
      "endTime": "00:44",
      "textOriginal": "Но опять же, не нужно их делать прямо вот такими вот идеально ровными, как будто они железные, а просто их делаем более плоскими.",
      "textVietnamese": "Nhưng một lần nữa, không cần làm chúng hoàn toàn phẳng phiu như thể chúng bằng sắt, mà chỉ cần làm chúng phẳng hơn thôi."
    },
    {
      "id": 9,
      "startTime": "00:47",
      "endTime": "00:58",
      "textOriginal": "Так. И с остальными делаем то же самое.",
      "textVietnamese": "Rồi. Và làm tương tự với những cái còn lại."
    },
    {
      "id": 10,
      "startTime": "01:00",
      "endTime": "01:04",
      "textOriginal": "И с остальными делаем то же самое.",
      "textVietnamese": "Và làm tương tự với những cái còn lại."
    },
    {
      "id": 11,
      "startTime": "01:09",
      "endTime": "01:13",
      "textOriginal": "Пока что всем добавляю просто DynaMesh.",
      "textVietnamese": "Hiện tại tôi chỉ thêm DynaMesh cho tất cả."
    },
    {
      "id": 12,
      "startTime": "01:17",
      "endTime": "01:21",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 13,
      "startTime": "01:21",
      "endTime": "01:27",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 14,
      "startTime": "01:27",
      "endTime": "01:35",
      "textOriginal": "В принципе, с этой стороны нам можно особо не париться, потому что здесь у нас будет кожа.",
      "textVietnamese": "Về cơ bản, chúng ta không cần phải lo lắng nhiều về phía này, bởi vì ở đây sẽ có da."
    },
    {
      "id": 15,
      "startTime": "01:35",
      "endTime": "01:44",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 16,
      "startTime": "01:44",
      "endTime": "01:46",
      "textOriginal": "Так.",
      "textVietnamese": "Rồi."
    },
    {
      "id": 17,
      "startTime": "01:48",
      "endTime": "01:54",
      "textOriginal": "Остались только эти две.",
      "textVietnamese": "Chỉ còn lại hai cái này thôi."
    },
    {
      "id": 18,
      "startTime": "01:56",
      "endTime": "02:07",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 19,
      "startTime": "02:07",
      "endTime": "02:22",
      "textOriginal": "В принципе, эту сторону вообще не трогаем, она у нас будет закрыта.",
      "textVietnamese": "Về cơ bản, chúng ta sẽ không chạm vào mặt này, nó sẽ được che lại."
    },
    {
      "id": 20,
      "startTime": "02:22",
      "endTime": "02:32",
      "textOriginal": "Если, конечно, мы захотим потом убрать одну из этих штук, чтобы у нас оставалось здесь такое дерево.",
      "textVietnamese": "Trừ khi sau này chúng ta muốn loại bỏ một trong những cái này, để chúng ta có một miếng gỗ ở đây."
    },
    {
      "id": 21,
      "startTime": "02:33",
      "endTime": "02:45",
      "textOriginal": "Вот, ну, как бы не знаю, немножко по-другому тогда надо было делать вот эту окантовку, а пока что мы её как бы так зафейкали.",
      "textVietnamese": "Thì, tôi không biết nữa, lẽ ra nên làm cái viền này hơi khác một chút, nhưng hiện tại chúng ta cứ giả lập nó như thế này."
    },
    {
      "id": 22,
      "startTime": "02:48",
      "endTime": "03:00",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 23,
      "startTime": "03:00",
      "endTime": "03:06",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 24,
      "startTime": "03:06",
      "endTime": "03:10",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 25,
      "startTime": "03:10",
      "endTime": "03:18",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 26,
      "startTime": "03:18",
      "endTime": "03:26",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 27,
      "startTime": "03:26",
      "endTime": "03:30",
      "textOriginal": "Так.",
      "textVietnamese": "Rồi."
    },
    {
      "id": 28,
      "startTime": "03:30",
      "endTime": "03:41",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 29,
      "startTime": "03:41",
      "endTime": "03:48",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 30,
      "startTime": "03:48",
      "endTime": "03:52",
      "textOriginal": "Всё, и теперь уже можно превращать их именно в дерево.",
      "textVietnamese": "Xong, và bây giờ chúng ta có thể biến chúng thành gỗ."
    },
    {
      "id": 31,
      "startTime": "03:52",
      "endTime": "03:59",
      "textOriginal": "Единственное, что здесь немножечко больше фаску сделаю.",
      "textVietnamese": "Chỉ có điều là tôi sẽ tạo một chút vát mép lớn hơn ở đây."
    },
    {
      "id": 32,
      "startTime": "03:59",
      "endTime": "04:04",
      "textOriginal": "В принципе, здесь ничего абсолютно нового сейчас не будет.",
      "textVietnamese": "Về cơ bản, sẽ không có gì hoàn toàn mới ở đây lúc này."
    },
    {
      "id": 33,
      "startTime": "04:04",
      "endTime": "04:19",
      "textOriginal": "В плане проработки текстуры, но единственное, что мы на топоре, на молоте, точнее, делали вот такие кольца, а здесь можно просто делать вот такие вот линии.",
      "textVietnamese": "Về mặt xử lý vân bề mặt, điều duy nhất là với cái rìu, chính xác hơn là cái búa, chúng ta đã làm các vòng tròn như thế này, còn ở đây, chúng ta chỉ cần tạo các đường như thế này."
    },
    {
      "id": 34,
      "startTime": "04:19",
      "endTime": "04:26",
      "textOriginal": "Где-то можно да, там добавить такие вот колечки.",
      "textVietnamese": "Đôi khi chúng ta có thể thêm các vòng nhỏ như thế này ở đâu đó."
    },
    {
      "id": 35,
      "startTime": "04:26",
      "endTime": "04:33",
      "textOriginal": "Причём они не обязательно должны быть с одной стороны.",
      "textVietnamese": "Hơn nữa, chúng không nhất thiết phải nằm ở một bên."
    },
    {
      "id": 36,
      "startTime": "04:33",
      "endTime": "04:38",
      "textOriginal": "Вот, но для этого нам здесь желательно добавить побольше разрешения.",
      "textVietnamese": "Để làm điều này, chúng ta nên thêm độ phân giải cao hơn ở đây."
    },
    {
      "id": 37,
      "startTime": "04:40",
      "endTime": "04:52",
      "textOriginal": "И не забывайте менять размеры.",
      "textVietnamese": "Và đừng quên thay đổi kích thước."
    },
    {
      "id": 38,
      "startTime": "04:56",
      "endTime": "05:14",
      "textOriginal": "Так, и здесь лучше уж тогда заполнить до конца и по новой вот так вот нарисовать.",
      "textVietnamese": "Rồi, và ở đây tốt hơn hết là nên tô đầy đến cuối và vẽ lại như thế này."
    },
    {
      "id": 39,
      "startTime": "05:15",
      "endTime": "05:39",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 40,
      "startTime": "05:39",
      "endTime": "05:52",
      "textOriginal": "А я думаю, что этот момент можно ускорить, потому что, ну, чтобы просто элементарно не затягивать.",
      "textVietnamese": "Và tôi nghĩ rằng khoảnh khắc này có thể được tăng tốc, bởi vì, ừm, chỉ để tránh kéo dài không cần thiết thôi."
    },
    {
      "id": 41,
      "startTime": "06:04",
      "endTime": "07:38",
      "textOriginal": "",
      "textVietnamese": ""
    },
    {
      "id": 42,
      "startTime": "07:38",
      "endTime": "07:49",
      "textOriginal": "Ну, и, конечно, не стоит забывать, что на деревяшке тоже может прилететь удар, соответственно, здесь тоже может быть какой-нибудь скол, и достаточно ощутимый.",
      "textVietnamese": "Và tất nhiên, đừng quên rằng tấm gỗ cũng có thể bị va đập, do đó, ở đây cũng có thể có một vết mẻ đáng kể."
    },
    {
      "id": 43,
      "startTime": "08:12",
      "endTime": "08:21",
      "textOriginal": "Так, ну что же, с деревяшками закончили. Теперь осталось разобраться с задней частью, а именно с вот этой кожей и вот этими железными ручками и кожаным ремнём.",
      "textVietnamese": "Rồi, vậy là xong phần gỗ. Bây giờ còn phải xử lý phần mặt sau, cụ thể là phần da này và các tay cầm bằng sắt cùng dây đeo da."
    },
    {
      "id": 44,
      "startTime": "08:21",
      "endTime": "08:27",
      "textOriginal": "И, в принципе, щит будет полностью готов. Пока что готова только лицевая его часть.",
      "textVietnamese": "Và về cơ bản, chiếc khiên sẽ hoàn toàn sẵn sàng. Hiện tại chỉ có mặt trước của nó là xong."
    },
    {
      "id": 45,
      "startTime": "08:28",
      "endTime": "08:43",
      "textOriginal": "Разве что ещё вот здесь можно добавить, как мы хотели изначально, всякие переходики сюда. Вот так вот.",
      "textVietnamese": "Chỉ còn thêm các chuyển tiếp ở đây, như chúng ta muốn ban đầu. Như thế này."
    },
    {
      "id": 46,
      "startTime": "08:44",
      "endTime": "08:46",
      "textOriginal": "Отлично.",
      "textVietnamese": "Tuyệt vời."
    },
    {
      "id": 47,
      "startTime": "08:50",
      "endTime": "09:00",
      "textOriginal": "Так, единственное, что мне не нравится ещё вот здесь этот переход.",
      "textVietnamese": "Vâng, điều duy nhất tôi không thích là phần chuyển tiếp ở đây."
    },
    {
      "id": 48,
      "startTime": "09:00",
      "endTime": "09:12",
      "textOriginal": "Вот так будет поинтересней.",
      "textVietnamese": "Thế này sẽ thú vị hơn."
    },
    {
      "id": 49,
      "startTime": "09:12",
      "endTime": "09:15",
      "textOriginal": "Хотя, по-моему, вообще он здесь лишний.",
      "textVietnamese": "Mặc dù, theo tôi, nó không cần thiết ở đây."
    },
    {
      "id": 50,
      "startTime": "09:17",
      "endTime": "09:29",
      "textOriginal": "Всё, немножко пообавились детализацией, теперь уже можно и переходить на кожу на следующий урок.",
      "textVietnamese": "Xong, đã hoàn thành một chút chi tiết, giờ chúng ta có thể chuyển sang phần da trong bài học tiếp theo."
    }
  ],
  "notes": [
    {
      "timestamp": "00:03",
      "title": "Sử dụng DynaMesh và Polish cho các tấm ván",
      "content": "Loại bỏ đối xứng và áp dụng DynaMesh với độ phân giải khoảng 65.000 để bắt đầu tạo hình các tấm ván gỗ. Sử dụng công cụ Polish để làm mềm và làm phẳng các cạnh thô."
    },
    {
      "timestamp": "00:27",
      "title": "Làm phẳng các cạnh bằng Trim Dynamic",
      "content": "Sử dụng cọ Trim Dynamic để làm phẳng các cạnh của các tấm ván, giúp chúng trông bớt thô và 'giống kim loại' hơn, nhưng vẫn giữ được vẻ thủ công, không cần phải hoàn hảo tuyệt đối."
    },
    {
      "timestamp": "03:52",
      "title": "Tạo vân gỗ và các chi tiết bề mặt",
      "content": "Sau khi tạo hình cơ bản, bắt đầu thêm chi tiết vân gỗ bằng cọ đặc biệt. Thay vì tạo các vòng tròn như trên búa, tạo các đường vân đơn giản. Đảm bảo tăng độ phân giải (Resolution) của DynaMesh để chi tiết vân gỗ được sắc nét."
    },
    {
      "timestamp": "07:38",
      "title": "Thêm vết mẻ và chi tiết cuối cùng",
      "content": "Thêm các vết mẻ lớn và rõ ràng trên bề mặt gỗ để tăng tính hiện thực do va chạm. Điều chỉnh các chi tiết nhỏ ở phần trung tâm (vùng kim loại) để hoàn thiện mặt trước của chiếc khiên."
    }
  ],
  "flashcards": [
    {
      "id": "1",
      "term": "DynaMesh",
      "definition": "Chức năng trong ZBrush dùng để tạo lại lưới đa giác (re-meshing) nhằm duy trì phân bố đồng đều của các đa giác trong quá trình điêu khắc.",
      "context": "Chức năng (Function)"
    },
    {
      "id": "2",
      "term": "Симметричные доски",
      "definition": "Tấm ván đối xứng.",
      "context": "Symmetric planks"
    },
    {
      "id": "3",
      "term": "Polish",
      "definition": "Công cụ/chức năng dùng để làm mịn và đánh bóng bề mặt mô hình.",
      "context": "Polish (Tool)"
    },
    {
      "id": "4",
      "term": "Trim Dynamic",
      "definition": "Một loại cọ (brush) trong ZBrush dùng để làm phẳng các bề mặt, thường được sử dụng để tạo ra các bề mặt phẳng và sắc nét.",
      "context": "Trim Dynamic brush"
    },
    {
      "id": "5",
      "term": "Разрешение (Resolution)",
      "definition": "Độ phân giải của lưới đa giác trong DynaMesh, quyết định mức độ chi tiết có thể được điêu khắc.",
      "context": "Resolution"
    },
    {
      "id": "6",
      "term": "Фаска",
      "definition": "Vát mép, cạnh được làm tròn hoặc nghiêng.",
      "context": "Bevel / Chamfer"
    },
    {
      "id": "7",
      "term": "Окантовка",
      "definition": "Viền, phần bao quanh mép.",
      "context": "Edging / Border"
    },
    {
      "id": "8",
      "term": "Зафейкали (slang)",
      "definition": "Giả lập hoặc làm giả (trong ngữ cảnh này, chỉ là tạo hình bề mặt chưa hoàn thiện).",
      "context": "Faked (slang)"
    },
    {
      "id": "9",
      "term": "Скол",
      "definition": "Vết sứt, vết mẻ do va đập.",
      "context": "Chip / Break"
    },
    {
      "id": "10",
      "term": "Кожа",
      "definition": "Da, vật liệu da (dùng để bọc phần sau của khiên).",
      "context": "Leather"
    }
  ]
}
  },
      { id: "l3-6", title: "6. Leather", videoUrl: getLink("3. Создание щита", "6. Кожа.mp4"), duration: "22:21" ,
    data: {
  "subtitles": [
    {
      "id": 1,
      "startTime": "00:00",
      "endTime": "00:03",
      "textOriginal": "Так, и осталась у нас задняя сторона щита.",
      "textVietnamese": "Vậy là còn lại mặt sau của chiếc khiên."
    },
    {
      "id": 2,
      "startTime": "00:03",
      "endTime": "00:06",
      "textOriginal": "По сути, самое простое, если бы не одно но.",
      "textVietnamese": "Về cơ bản, nó là phần đơn giản nhất, nếu không vì một điều."
    },
    {
      "id": 3,
      "startTime": "00:06",
      "endTime": "00:12",
      "textOriginal": "А в том варианте, котором она у нас сейчас была для блокаута, она не совсем пригодна для скультинга.",
      "textVietnamese": "Và ở phiên bản mà chúng ta đang có cho phần blockout, nó không hoàn toàn phù hợp để điêu khắc."
    },
    {
      "id": 4,
      "startTime": "00:12",
      "endTime": "00:15",
      "textOriginal": "Даже если мы сделаем здесь Dynamesh,",
      "textVietnamese": "Ngay cả khi chúng ta Dynamesh ở đây,"
    },
    {
      "id": 5,
      "startTime": "00:15",
      "endTime": "00:18",
      "textOriginal": "получится совсем не то, что мы ожидали увидеть.",
      "textVietnamese": "kết quả sẽ không giống như chúng ta mong đợi."
    },
    {
      "id": 6,
      "startTime": "00:18",
      "endTime": "00:20",
      "textOriginal": "А причин здесь несколько, но",
      "textVietnamese": "Có một vài lý do, nhưng"
    },
    {
      "id": 7,
      "startTime": "00:20",
      "endTime": "00:23",
      "textOriginal": "мы сделаем просто немножечко по-другому.",
      "textVietnamese": "chúng ta sẽ làm theo một cách khác."
    },
    {
      "id": 8,
      "startTime": "00:23",
      "endTime": "00:30",
      "textOriginal": "Мы можем откатить её до состояния до нашего первого, когда мы её просто продублировали.",
      "textVietnamese": "Chúng ta có thể quay lại trạng thái ban đầu, khi chúng ta chỉ đơn giản là nhân đôi nó."
    },
    {
      "id": 9,
      "startTime": "00:30",
      "endTime": "00:36",
      "textOriginal": "Если у вас уже здесь не сохранилась история, просто продублируйте",
      "textVietnamese": "Nếu lịch sử chưa được lưu ở đây, chỉ cần nhân đôi"
    },
    {
      "id": 10,
      "startTime": "00:36",
      "endTime": "00:40",
      "textOriginal": "а ту первую базу, с которой мы начали. И всё.",
      "textVietnamese": "cơ sở ban đầu mà chúng ta đã bắt đầu. Thế là xong."
    },
    {
      "id": 11,
      "startTime": "00:41",
      "endTime": "00:43",
      "textOriginal": "Что нам теперь нужно сделать, так это",
      "textVietnamese": "Bây giờ chúng ta cần làm là"
    },
    {
      "id": 12,
      "startTime": "00:44",
      "endTime": "00:48",
      "textOriginal": "удалить спрятанное, потому что, скорее всего, оно там было.",
      "textVietnamese": "xóa phần ẩn đi, vì rất có thể nó đã ở đó."
    },
    {
      "id": 13,
      "startTime": "00:48",
      "endTime": "00:50",
      "textOriginal": "Если не было, то не удалится.",
      "textVietnamese": "Nếu không có thì sẽ không bị xóa."
    },
    {
      "id": 14,
      "startTime": "00:51",
      "endTime": "00:54",
      "textOriginal": "А просто нажимаем Ctrl+A, чтобы выделить всё.",
      "textVietnamese": "Chỉ cần nhấn Ctrl+A để chọn tất cả."
    },
    {
      "id": 15,
      "startTime": "00:54",
      "endTime": "00:56",
      "textOriginal": "И, не поверите, снова нажимаем Extact.",
      "textVietnamese": "Và, bạn không thể tin được, chúng ta nhấn Extract một lần nữa."
    },
    {
      "id": 16,
      "startTime": "00:59",
      "endTime": "01:01",
      "textOriginal": "Принимаем.",
      "textVietnamese": "Chấp nhận."
    },
    {
      "id": 17,
      "startTime": "01:03",
      "endTime": "01:07",
      "textOriginal": "И, кстати, ровная поверхность тоже смотрится достаточно неплохо.",
      "textVietnamese": "Và, nhân tiện, bề mặt phẳng trông cũng khá tốt."
    },
    {
      "id": 18,
      "startTime": "01:07",
      "endTime": "01:14",
      "textOriginal": "Её можно будет сделать, так сказать, вариант просто с металлическим щитом.",
      "textVietnamese": "Nó có thể được thực hiện, bạn có thể nói, một phiên bản chỉ với một chiếc khiên kim loại."
    },
    {
      "id": 19,
      "startTime": "01:15",
      "endTime": "01:21",
      "textOriginal": "Вот, но у нас получилось, так сказать, интереснее. У нас с деревянным.",
      "textVietnamese": "Đây, nhưng chúng ta đã làm cho nó thú vị hơn, bạn thấy đấy. Chúng ta có một cái bằng gỗ."
    },
    {
      "id": 20,
      "startTime": "01:23",
      "endTime": "01:27",
      "textOriginal": "Так, отодвигаем всё это дело назад.",
      "textVietnamese": "Được rồi, chúng ta đẩy mọi thứ này ra sau."
    },
    {
      "id": 21,
      "startTime": "01:28",
      "endTime": "01:30",
      "textOriginal": "Увеличиваем.",
      "textVietnamese": "Phóng to."
    },
    {
      "id": 22,
      "startTime": "01:34",
      "endTime": "01:41",
      "textOriginal": "Пусть оно сейчас так выпирает, это нормально. Угу.",
      "textVietnamese": "Cứ để nó nhô ra như thế, không sao đâu. Ừm."
    },
    {
      "id": 23,
      "startTime": "01:44",
      "endTime": "01:47",
      "textOriginal": "А, ради интереса попробую её сгладить. И",
      "textVietnamese": "À, vì tò mò, tôi sẽ thử làm mịn nó. Và"
    },
    {
      "id": 24,
      "startTime": "01:48",
      "endTime": "01:50",
      "textOriginal": "отлично, прямо то, что нужно.",
      "textVietnamese": "hoàn hảo, chính xác là những gì chúng ta cần."
    },
    {
      "id": 25,
      "startTime": "01:51",
      "endTime": "01:56",
      "textOriginal": "Значит, что мы делаем? Включаем симметрию, радиальную, само собой.",
      "textVietnamese": "Vậy, chúng ta làm gì? Bật tính năng đối xứng, đối xứng xuyên tâm, tất nhiên rồi."
    },
    {
      "id": 26,
      "startTime": "01:57",
      "endTime": "02:00",
      "textOriginal": "по нужной оси, много-много точек.",
      "textVietnamese": "theo trục mong muốn, rất nhiều điểm."
    },
    {
      "id": 27,
      "startTime": "02:00",
      "endTime": "02:05",
      "textOriginal": "И теперь нам нужно применить сначала Dynamesh.",
      "textVietnamese": "Và bây giờ chúng ta cần áp dụng Dynamesh trước."
    },
    {
      "id": 28,
      "startTime": "02:07",
      "endTime": "02:09",
      "textOriginal": "Ага, отлично.",
      "textVietnamese": "À há, tuyệt vời."
    },
    {
      "id": 29,
      "startTime": "02:10",
      "endTime": "02:15",
      "textOriginal": "Сглаживаем. У нас здесь появились вот такие вот отверстия. Пока что ничего страшного, мы это сейчас исправим.",
      "textVietnamese": "Làm mịn. Chúng ta có những lỗ hổng như thế này ở đây. Hiện tại không sao cả, chúng ta sẽ khắc phục điều đó ngay bây giờ."
    },
    {
      "id": 30,
      "startTime": "02:18",
      "endTime": "02:20",
      "textOriginal": "Применяем ещё раз. Всё, исправили.",
      "textVietnamese": "Áp dụng lại. Xong, đã sửa."
    },
    {
      "id": 31,
      "startTime": "02:24",
      "endTime": "02:25",
      "textOriginal": "Вот так.",
      "textVietnamese": "Như thế này."
    },
    {
      "id": 32,
      "startTime": "02:30",
      "endTime": "02:39",
      "textOriginal": "Можно попробовать её немножко вытянуть. Отлично.",
      "textVietnamese": "Chúng ta có thể thử kéo dài nó một chút. Tuyệt vời."
    },
    {
      "id": 33,
      "startTime": "02:42",
      "endTime": "02:46",
      "textOriginal": "Так он будет смотреться интереснее со всех сторон абсолютно.",
      "textVietnamese": "Bằng cách này, nó sẽ trông thú vị hơn từ mọi góc độ."
    },
    {
      "id": 34,
      "startTime": "02:47",
      "endTime": "02:51",
      "textOriginal": "А снова применяем Dynamesh, но уже побольше разрешение делаем.",
      "textVietnamese": "Và chúng ta áp dụng Dynamesh một lần nữa, nhưng với độ phân giải cao hơn."
    },
    {
      "id": 35,
      "startTime": "02:51",
      "endTime": "02:54",
      "textOriginal": "Сглаживаем. И теперь у нас здесь",
      "textVietnamese": "Làm mịn. Và bây giờ chúng ta cần"
    },
    {
      "id": 36,
      "startTime": "02:57",
      "endTime": "03:00",
      "textOriginal": "необходимо сделать текстурку. Можно отключать симметрию.",
      "textVietnamese": "tạo một họa tiết ở đây. Bạn có thể tắt tính năng đối xứng."
    },
    {
      "id": 37,
      "startTime": "03:01",
      "endTime": "03:09",
      "textOriginal": "Я буду использовать стандартную кисть, отключу у Backface Mask, потому что без Backface есть подозрение, что она будет действовать сразу на две стороны.",
      "textVietnamese": "Tôi sẽ sử dụng cọ tiêu chuẩn, tắt Backface Mask, vì tôi nghi ngờ rằng nếu không có Backface, nó sẽ hoạt động trên cả hai mặt cùng một lúc."
    },
    {
      "id": 38,
      "startTime": "03:10",
      "endTime": "03:15",
      "textOriginal": "Как это, например, делает обычно Claybuildup. Вот здесь уже пошло проецирование.",
      "textVietnamese": "Giống như cách Claybuildup thường làm. Đây, việc chiếu đã bắt đầu."
    },
    {
      "id": 39,
      "startTime": "03:20",
      "endTime": "03:26",
      "textOriginal": "Вот, ну, в принципе, если мы будем делать небольшие такие вдавливания, то ничего страшного не будет.",
      "textVietnamese": "Chà, về nguyên tắc, nếu chúng ta tạo những vết lõm nhỏ, thì sẽ không có vấn đề gì."
    },
    {
      "id": 40,
      "startTime": "03:26",
      "endTime": "03:28",
      "textOriginal": "Хотя нет, будет.",
      "textVietnamese": "Mặc dù không, sẽ có."
    },
    {
      "id": 41,
      "startTime": "03:29",
      "endTime": "03:30",
      "textOriginal": "Ну, в любом случае их не будет видно.",
      "textVietnamese": "Dù sao thì bạn cũng sẽ không thấy chúng."
    },
    {
      "id": 42,
      "startTime": "03:30",
      "endTime": "03:34",
      "textOriginal": "С Backface Mask у нас такой фигни не произойдёт.",
      "textVietnamese": "Với Backface Mask, điều đó sẽ không xảy ra."
    },
    {
      "id": 43,
      "startTime": "03:39",
      "endTime": "03:39",
      "textOriginal": "Отлично.",
      "textVietnamese": "Tuyệt vời."
    },
    {
      "id": 44,
      "startTime": "03:44",
      "endTime": "03:55",
      "textOriginal": "достаточно большим диаметром и небольшой интенсивностью, зажатым Alt, будем просто вот так вот вдавливать.",
      "textVietnamese": "với đường kính khá lớn và cường độ thấp, giữ Alt, chúng ta sẽ chỉ đẩy vào như thế này."
    },
    {
      "id": 45,
      "startTime": "03:55",
      "endTime": "04:02",
      "textOriginal": "Ну-ка. Тут виднее, наверное, будет. Ещё это нужно делать через Claybuildup, но выбрать здесь круглую альфу.",
      "textVietnamese": "Nào. Có lẽ bạn sẽ thấy rõ hơn ở đây. Chúng ta cũng cần làm điều này bằng Claybuildup, nhưng hãy chọn alpha tròn ở đây."
    },
    {
      "id": 46,
      "startTime": "04:09",
      "endTime": "04:18",
      "textOriginal": "Тогда этот процесс будет идти быстрее, и саму текстуру, так сказать, мы сможем сделать поинтересней.",
      "textVietnamese": "Khi đó quá trình này sẽ diễn ra nhanh hơn, và chúng ta có thể làm cho bản thân kết cấu thú vị hơn."
    },
    {
      "id": 47,
      "startTime": "04:21",
      "endTime": "04:24",
      "textOriginal": "Потом всё это дело размываем. Можно просто через Polish.",
      "textVietnamese": "Sau đó, chúng ta làm mờ tất cả những điều này. Chúng ta có thể chỉ cần sử dụng Polish."
    },
    {
      "id": 48,
      "startTime": "04:30",
      "endTime": "04:34",
      "textOriginal": "И снова стандартом. достаточно большим диаметром",
      "textVietnamese": "Và lại bằng tiêu chuẩn. với đường kính khá lớn"
    },
    {
      "id": 49,
      "startTime": "04:44",
      "endTime": "04:48",
      "textOriginal": "Так, уже что-то интересненькое. достаточно большим диаметром",
      "textVietnamese": "Chà, đã có gì đó thú vị rồi. với đường kính khá lớn"
    },
    {
      "id": 50,
      "startTime": "05:00",
      "endTime": "05:13",
      "textOriginal": "А также через стандарт нужно и можно будет добавить сюда всякие переходы, так сказать, за границами вот этих вот деталей.",
      "textVietnamese": "Ngoài ra, thông qua tiêu chuẩn, chúng ta nên và có thể thêm các chuyển tiếp khác nhau ở đây, bạn có thể nói, ngoài ranh giới của những chi tiết này."
    },
    {
      "id": 51,
      "startTime": "05:13",
      "endTime": "05:25",
      "textOriginal": "Но пока что это придётся сделать достаточно а скетчево, потому что сами эти детали тоже предстоит нам ещё сделать точнее по форме. Поэтому сейчас",
      "textVietnamese": "Nhưng hiện tại, chúng ta sẽ phải làm điều này một cách khá sơ sài, bởi vì bản thân những chi tiết này cũng cần chúng ta làm cho chúng chính xác hơn về hình dạng. Vì vậy bây giờ"
    },
    {
      "id": 52,
      "startTime": "05:30",
      "endTime": "05:31",
      "textOriginal": "пока что особо нет смысла.",
      "textVietnamese": "không có nhiều ý nghĩa."
    },
    {
      "id": 53,
      "startTime": "05:31",
      "endTime": "05:37",
      "textOriginal": "Я просто пока что здесь примерно обведу их площадь. Потому что это лишним уж точно не будет.",
      "textVietnamese": "Tôi chỉ phác thảo sơ qua khu vực của chúng ở đây. Bởi vì điều này chắc chắn sẽ không thừa."
    },
    {
      "id": 54,
      "startTime": "05:57",
      "endTime": "06:03",
      "textOriginal": "Ну, где-то можно подрезать Dam Standardом. достаточно большим диаметром",
      "textVietnamese": "Chà, ở đâu đó bạn có thể cắt bằng Dam Standard. với đường kính khá lớn"
    },
    {
      "id": 55,
      "startTime": "06:10",
      "endTime": "06:15",
      "textOriginal": "И на некоторых сторонах можно прямо сделать такие подтянутости. Тоже будет достаточно неплохо смотреться.",
      "textVietnamese": "Và ở một số mặt, bạn có thể tạo những vết căng như vậy. Điều đó cũng sẽ trông khá đẹp."
    },
    {
      "id": 56,
      "startTime": "06:33",
      "endTime": "06:47",
      "textOriginal": "Вот мы как бы видим А также через стандарт И снова стандартом.",
      "textVietnamese": "Chúng ta có thể thấy hình dạng tổng thể. Ngoài ra, thông qua tiêu chuẩn Và lại bằng tiêu chuẩn."
    },
    {
      "id": 57,
      "startTime": "07:18",
      "endTime": "07:20",
      "textOriginal": "Так. А Claybuildup-то у меня без Backface Mask стоял.",
      "textVietnamese": "Vậy. Ồ, Claybuildup của tôi đã được đặt mà không có Backface Mask."
    },
    {
      "id": 58,
      "startTime": "07:24",
      "endTime": "07:29",
      "textOriginal": "Поэтому здесь он с двух сторон. Ну, в принципе, это ничего страшного, её всё равно не видно.",
      "textVietnamese": "Vì vậy ở đây nó ở cả hai bên. Chà, về cơ bản thì không sao cả, dù sao thì bạn cũng không thể thấy nó."
    },
    {
      "id": 59,
      "startTime": "07:32",
      "endTime": "07:40",
      "textOriginal": "А здесь можно мелким Dam Standardом такие очень тонкие прорисовать штучки.",
      "textVietnamese": "Và ở đây, bạn có thể sử dụng Dam Standard nhỏ để phác thảo những chi tiết rất nhỏ."
    },
    {
      "id": 60,
      "startTime": "08:02",
      "endTime": "08:11",
      "textOriginal": "А как вариант, можно сделать их сильнее, чтобы, например, показать, что это шитые там куски кожи.",
      "textVietnamese": "Hoặc một lựa chọn khác là làm cho chúng mạnh hơn để cho thấy rằng chúng là những miếng da được khâu lại."
    },
    {
      "id": 61,
      "startTime": "08:11",
      "endTime": "08:14",
      "textOriginal": "Тогда она будет лучше читаться. Ну, это так, для примера.",
      "textVietnamese": "Sau đó nó sẽ dễ đọc hơn. Chà, đây chỉ là một ví dụ."
    },
    {
      "id": 62,
      "startTime": "08:31",
      "endTime": "08:35",
      "textOriginal": "Да и в принципе, тоже вариант неплохой, я думаю.",
      "textVietnamese": "Và về nguyên tắc, đây cũng là một lựa chọn tốt, tôi nghĩ vậy."
    },
    {
      "id": 63,
      "startTime": "08:36",
      "endTime": "08:41",
      "textOriginal": "Только единственное, это надо сделать другим способом, куда более аккуратным.",
      "textVietnamese": "Chỉ có điều, điều này cần được thực hiện theo một cách khác, cẩn thận hơn nhiều."
    },
    {
      "id": 64,
      "startTime": "08:44",
      "endTime": "08:46",
      "textOriginal": "Сейчас сделаем.",
      "textVietnamese": "Chúng ta sẽ làm điều đó ngay bây giờ."
    },
    {
      "id": 65,
      "startTime": "08:48",
      "endTime": "08:57",
      "textOriginal": "Так, оставляем такие глубокие следы.",
      "textVietnamese": "Được rồi, chúng ta để lại những vết hằn sâu như vậy."
    },
    {
      "id": 66,
      "startTime": "09:03",
      "endTime": "09:03",
      "textOriginal": "Так.",
      "textVietnamese": "Vậy."
    },
    {
      "id": 67,
      "startTime": "09:10",
      "endTime": "09:16",
      "textOriginal": "Теперь берём стандартную кисть. И прямо по краю так вот проходимся.",
      "textVietnamese": "Bây giờ chúng ta lấy cọ tiêu chuẩn. Và chúng ta đi dọc theo cạnh như thế này."
    },
    {
      "id": 68,
      "startTime": "09:21",
      "endTime": "09:22",
      "textOriginal": "Как бы надуваем её.",
      "textVietnamese": "Giống như thổi phồng nó lên."
    },
    {
      "id": 69,
      "startTime": "09:28",
      "endTime": "09:41",
      "textOriginal": "А также это можно сделать через Inflat. Оно он их как бы начинает тогда а скукоживать вместе. Это не всегда нужно.",
      "textVietnamese": "Bạn cũng có thể làm điều này bằng Inflat. Nó giống như bắt đầu co chúng lại với nhau. Điều này không phải lúc nào cũng cần thiết."
    },
    {
      "id": 70,
      "startTime": "09:42",
      "endTime": "09:44",
      "textOriginal": "А вот стандарт он их просто надувает.",
      "textVietnamese": "Còn tiêu chuẩn thì chỉ đơn giản là thổi phồng chúng lên."
    },
    {
      "id": 71,
      "startTime": "09:50",
      "endTime": "09:56",
      "textOriginal": "Можно по одной стороне. Для более точной, так сказать.",
      "textVietnamese": "Bạn có thể làm từng mặt. Để chính xác hơn, bạn có thể nói."
    },
    {
      "id": 72,
      "startTime": "10:00",
      "endTime": "10:05",
      "textOriginal": "Если сильно размыли, то добавляем стандарта. Всё.",
      "textVietnamese": "Nếu bạn làm mờ quá nhiều, hãy thêm tiêu chuẩn. Xong."
    },
    {
      "id": 73,
      "startTime": "10:29",
      "endTime": "10:37",
      "textOriginal": "Так, И снова стандарта.",
      "textVietnamese": "Vậy, Và lại bằng tiêu chuẩn."
    },
    {
      "id": 74,
      "startTime": "11:00",
      "endTime": "11:03",
      "textOriginal": "И снова стандартом.",
      "textVietnamese": "Và lại bằng tiêu chuẩn."
    },
    {
      "id": 75,
      "startTime": "11:20",
      "endTime": "11:23",
      "textOriginal": "Так, и осталось добавить сюда стежки. Сделать это можно разными способами:",
      "textVietnamese": "Được rồi, và còn lại là thêm các mũi khâu vào đây. Bạn có thể làm điều này theo nhiều cách khác nhau:"
    },
    {
      "id": 76,
      "startTime": "11:23",
      "endTime": "11:27",
      "textOriginal": "через альфу, через специальную кисть.",
      "textVietnamese": "thông qua alpha, thông qua một chiếc cọ đặc biệt."
    },
    {
      "id": 77,
      "startTime": "11:29",
      "endTime": "11:31",
      "textOriginal": "Ну, мы сейчас сделаем всё намного проще и быстрее.",
      "textVietnamese": "Chà, bây giờ chúng ta sẽ làm mọi thứ đơn giản và nhanh hơn nhiều."
    },
    {
      "id": 78,
      "startTime": "11:34",
      "endTime": "11:39",
      "textOriginal": "Единственное, что здесь ещё немножко добавлю складок.",
      "textVietnamese": "Điều duy nhất là tôi sẽ thêm một vài nếp nhăn ở đây."
    },
    {
      "id": 79,
      "startTime": "12:20",
      "endTime": "12:23",
      "textOriginal": "Так, уже можно переключиться обратно на светлый материал.",
      "textVietnamese": "Được rồi, chúng ta có thể chuyển lại sang vật liệu sáng."
    },
    {
      "id": 80,
      "startTime": "12:24",
      "endTime": "12:25",
      "textOriginal": "Собственно, стежочки.",
      "textVietnamese": "Về cơ bản là các mũi khâu."
    },
    {
      "id": 81,
      "startTime": "12:28",
      "endTime": "12:31",
      "textOriginal": "Включаем кисть, добавляющую примитивы. И у нас тут есть примитив \"Капсула\".",
      "textVietnamese": "Chúng ta bật cọ thêm nguyên thủy. Và chúng ta có hình nguyên thủy \"Capsule\" ở đây."
    },
    {
      "id": 82,
      "startTime": "12:36",
      "endTime": "12:38",
      "textOriginal": "Вот, он-то нам, в принципе, и нужен.",
      "textVietnamese": "Chà, đó là thứ chúng ta cần."
    },
    {
      "id": 83,
      "startTime": "12:39",
      "endTime": "12:43",
      "textOriginal": "Мы его немножко растягиваем. И отсекаем.",
      "textVietnamese": "Chúng ta kéo dài nó một chút. Và cắt nó ra."
    },
    {
      "id": 84,
      "startTime": "12:48",
      "endTime": "12:50",
      "textOriginal": "Переключаемся на него через зажатый Alt.",
      "textVietnamese": "Chuyển sang nó bằng cách giữ Alt."
    },
    {
      "id": 85,
      "startTime": "12:56",
      "endTime": "13:00",
      "textOriginal": "И превращаем его, собственно, в стежок.",
      "textVietnamese": "Và biến nó thành một mũi khâu."
    },
    {
      "id": 86,
      "startTime": "13:25",
      "endTime": "13:31",
      "textOriginal": "Здесь у нас тоже есть два варианта. Либо сделать из него а одинарные такие стежки,",
      "textVietnamese": "Ở đây chúng ta cũng có hai lựa chọn. Hoặc là biến nó thành các mũi khâu đơn như thế này,"
    },
    {
      "id": 87,
      "startTime": "13:42",
      "endTime": "13:45",
      "textOriginal": "и делать уже такие стежки.",
      "textVietnamese": "và tạo các mũi khâu như thế này."
    },
    {
      "id": 88,
      "startTime": "13:46",
      "endTime": "13:50",
      "textOriginal": "На мой взгляд, они выглядят намного интереснее, поэтому лучше бы добавить такие.",
      "textVietnamese": "Theo tôi, chúng trông thú vị hơn nhiều, vì vậy tốt hơn là nên thêm những cái này."
    },
    {
      "id": 89,
      "startTime": "13:54",
      "endTime": "13:58",
      "textOriginal": "Так, и сделаем пересечение чуть более аккуратным. А берём кисть Move Topological.",
      "textVietnamese": "Được rồi, và chúng ta sẽ làm cho giao điểm gọn gàng hơn một chút. Chúng ta lấy cọ Move Topological."
    },
    {
      "id": 90,
      "startTime": "14:07",
      "endTime": "14:11",
      "textOriginal": "И тянем. Не то. Всё.",
      "textVietnamese": "Và kéo. Không phải cái đó. Xong."
    },
    {
      "id": 91,
      "startTime": "14:19",
      "endTime": "14:27",
      "textOriginal": "И теперь эти стежки, удерживая Ctrl, мы можем дублировать и помещать туда, куда нам надо.",
      "textVietnamese": "Và bây giờ những mũi khâu này, giữ Ctrl, chúng ta có thể nhân đôi và đặt chúng ở nơi chúng ta cần."
    },
    {
      "id": 92,
      "startTime": "14:32",
      "endTime": "14:40",
      "textOriginal": "Сильно близко их не надо ставить, иначе будет шумно и некрасиво.",
      "textVietnamese": "Không cần đặt chúng quá gần nhau, nếu không sẽ lộn xộn và không đẹp."
    },
    {
      "id": 93,
      "startTime": "14:41",
      "endTime": "14:49",
      "textOriginal": "Можно их даже немного там делать больше, меньше. Хотя нет,",
      "textVietnamese": "Bạn thậm chí có thể làm cho chúng lớn hơn hoặc nhỏ hơn một chút. Mặc dù không,"
    },
    {
      "id": 94,
      "startTime": "14:50",
      "endTime": "14:54",
      "textOriginal": "лучше не стоит. И можно легко увлечься и переборщить.",
      "textVietnamese": "tốt hơn là không nên. Bạn có thể dễ dàng bị cuốn đi và làm quá."
    },
    {
      "id": 95,
      "startTime": "15:05",
      "endTime": "15:12",
      "textOriginal": "Примерно одинаковое расстояние стараемся выдерживать, но помним, что прямо до идеала выводить не надо ничего.",
      "textVietnamese": "Chúng ta cố gắng giữ khoảng cách xấp xỉ nhau, nhưng hãy nhớ rằng không cần phải hoàn hảo."
    },
    {
      "id": 96,
      "startTime": "15:46",
      "endTime": "15:53",
      "textOriginal": "Думаю, здесь больше шести стежков не надо. Можно будет добавить вот сюда один, но не крестик.",
      "textVietnamese": "Tôi nghĩ không cần nhiều hơn sáu mũi khâu ở đây. Bạn có thể thêm một cái vào đây, nhưng không phải hình chữ thập."
    },
    {
      "id": 97,
      "startTime": "15:54",
      "endTime": "15:56",
      "textOriginal": "А может, и вообще ничего не придётся добавлять.",
      "textVietnamese": "Hoặc có lẽ sẽ không cần phải thêm gì cả."
    },
    {
      "id": 98,
      "startTime": "15:57",
      "endTime": "16:06",
      "textOriginal": "А плюс в том, что мы можем при необходимости спрятать эти стежки. Мы их как бы не сливаем.",
      "textVietnamese": "Ưu điểm là chúng ta có thể ẩn các mũi khâu này nếu cần. Chúng ta không hợp nhất chúng."
    },
    {
      "id": 99,
      "startTime": "16:08",
      "endTime": "16:11",
      "textOriginal": "Теперь в другую сторону.",
      "textVietnamese": "Bây giờ sang phía bên kia."
    },
    {
      "id": 100,
      "startTime": "17:03",
      "endTime": "17:06",
      "textOriginal": "Так, отлично, с верхней забрались.",
      "textVietnamese": "Được rồi, tốt, chúng ta đã giải quyết xong phần trên."
    },
    {
      "id": 101,
      "startTime": "17:06",
      "endTime": "17:15",
      "textOriginal": "А что делать, если вдруг сняли маску, и при нажатии Ctrl будете сразу всё вот этого рау скопировать?",
      "textVietnamese": "Chuyện gì xảy ra nếu bạn vô tình tháo mặt nạ ra, và khi nhấn Ctrl, bạn sẽ ngay lập tức sao chép toàn bộ khu vực này?"
    },
    {
      "id": 102,
      "startTime": "17:15",
      "endTime": "17:25",
      "textOriginal": "Собственно, ничего сложного в этом нет. Просто, удерживая Ctrl, выбираем нужную нам, а, нужный нам элемент, нужный стежок.",
      "textVietnamese": "Thực ra, điều đó không khó. Chỉ cần giữ Ctrl và chọn yếu tố bạn cần, mũi khâu bạn cần."
    },
    {
      "id": 103,
      "startTime": "17:25",
      "endTime": "17:33",
      "textOriginal": "Инвертируем, просто держим Ctrl и левую кнопку мыши, либо пером в свободном месте, не по модели. И всё.",
      "textVietnamese": "Đảo ngược, chỉ cần giữ Ctrl và chuột trái, hoặc bút ở một khu vực trống, không phải trên mô hình. Và thế là xong."
    },
    {
      "id": 104,
      "startTime": "17:50",
      "endTime": "17:51",
      "textOriginal": "Так.",
      "textVietnamese": "Vậy."
    },
    {
      "id": 105,
      "startTime": "18:00",
      "endTime": "18:05",
      "textOriginal": "Так, в принципе, можно сказать, что уже закончил я с этой штукой.",
      "textVietnamese": "Chà, về cơ bản, tôi có thể nói rằng tôi đã hoàn thành với cái này rồi."
    },
    {
      "id": 106,
      "startTime": "18:06",
      "endTime": "18:11",
      "textOriginal": "Разве что ещё как я и хотел, добавить",
      "textVietnamese": "Có lẽ như tôi muốn, hãy thêm"
    },
    {
      "id": 107,
      "startTime": "18:13",
      "endTime": "18:15",
      "textOriginal": "Да что ж ты будешь делать?",
      "textVietnamese": "Bạn sẽ làm gì đây?"
    },
    {
      "id": 108,
      "startTime": "18:47",
      "endTime": "18:56",
      "textOriginal": "Отлично. Всё-таки чуть притопить. Вот так.",
      "textVietnamese": "Tuyệt vời. Dù sao thì cũng nhấn chìm nó một chút. Như thế này."
    },
    {
      "id": 109,
      "startTime": "18:57",
      "endTime": "19:03",
      "textOriginal": "А если хочется прямо совсем заморочиться, то можно взять стандартную кисть. Приблизить.",
      "textVietnamese": "Nếu bạn thực sự muốn đi sâu vào chi tiết, bạn có thể lấy cọ tiêu chuẩn. Phóng to."
    },
    {
      "id": 110,
      "startTime": "19:06",
      "endTime": "19:12",
      "textOriginal": "И под каждой этой штукой, под каждым стежком сделать такие вот ямки.",
      "textVietnamese": "Và dưới mỗi thứ này, dưới mỗi mũi khâu, hãy tạo những vết lõm như thế này."
    },
    {
      "id": 111,
      "startTime": "19:13",
      "endTime": "19:22",
      "textOriginal": "Как бы по-хорошему это и надо сделать, но это такая вещь, которую не всегда видно. И на которую, скорее всего, никто не обратит внимание, но",
      "textVietnamese": "Về lý thuyết thì nên làm, nhưng đó là thứ không phải lúc nào cũng thấy. Và rất có thể không ai sẽ chú ý đến nó, nhưng"
    },
    {
      "id": 112,
      "startTime": "19:25",
      "endTime": "19:30",
      "textOriginal": "которая будет как бы дополнять образ и будет делать его более правдоподобным.",
      "textVietnamese": "điều đó sẽ bổ sung cho hình ảnh và làm cho nó trông chân thực hơn."
    },
    {
      "id": 113,
      "startTime": "19:44",
      "endTime": "19:46",
      "textOriginal": "И, возможно, даже такой вариант будет лучше.",
      "textVietnamese": "Và có lẽ lựa chọn này thậm chí còn tốt hơn."
    },
    {
      "id": 114,
      "startTime": "19:49",
      "endTime": "19:53",
      "textOriginal": "Главное это на последнем понять. Ну да, всё-таки такой вариант поинтереснее смотрится.",
      "textVietnamese": "Điều quan trọng là phải nhận ra điều này ở cuối. Chà, vâng, tùy chọn này trông vẫn thú vị hơn."
    },
    {
      "id": 115,
      "startTime": "20:21",
      "endTime": "20:26",
      "textOriginal": "Что это всё равно будет видно только издалека. Точнее, наоборот, только вблизи,",
      "textVietnamese": "Điều này dù sao cũng chỉ thấy được từ xa. Đúng hơn, chỉ thấy gần,"
    },
    {
      "id": 116,
      "startTime": "20:31",
      "endTime": "20:36",
      "textOriginal": "а издалека этого видно не будет. Ну, практически.",
      "textVietnamese": "và từ xa sẽ không thấy. Chà, gần như vậy."
    },
    {
      "id": 117,
      "startTime": "20:37",
      "endTime": "20:46",
      "textOriginal": "Вот мы как бы видим общее очертание, но нам достаточно этого. Нам не кажется с такого расстояния, что здесь как-то маловато полигонов.",
      "textVietnamese": "Chúng ta có thể thấy hình dạng tổng thể, nhưng nhiêu đó là đủ. Ở khoảng cách này, chúng ta không nghĩ rằng có quá ít đa giác ở đây."
    },
    {
      "id": 118,
      "startTime": "20:51",
      "endTime": "20:53",
      "textOriginal": "А вот вблизи уже видать.",
      "textVietnamese": "Nhưng có thể thấy rõ khi nhìn gần."
    },
    {
      "id": 119,
      "startTime": "21:05",
      "endTime": "21:11",
      "textOriginal": "Так, и на этом с кожей можно, в принципе-то, и заканчивать.",
      "textVietnamese": "Được rồi, và về cơ bản, chúng ta có thể kết thúc với phần da này."
    },
    {
      "id": 120,
      "startTime": "21:20",
      "endTime": "21:47",
      "textOriginal": "Она уже не выглядит такой плотной, на самом деле, из-за вот таких вот маленьких складок. Поэтому чем больше будет маленьких складок, тем тоньше будет выглядеть сам материал. И наоборот, если он будет, например, из вот таких вот больших,",
      "textVietnamese": "Trên thực tế, nó không còn trông dày đặc như vậy nữa, vì những nếp nhăn nhỏ này. Vì vậy, càng có nhiều nếp nhăn nhỏ, vật liệu sẽ càng trông mỏng hơn. Và ngược lại, nếu nó được làm từ những nếp nhăn lớn như thế này,"
    },
    {
      "id": 121,
      "startTime": "21:47",
      "endTime": "21:52",
      "textOriginal": "то она будет выглядеть более плотной. Кстати, неплохо смотрится.",
      "textVietnamese": "thì nó sẽ trông dày đặc hơn. Nhân tiện, trông cũng không tệ."
    },
    {
      "id": 122,
      "startTime": "22:15",
      "endTime": "22:21",
      "textOriginal": "Отлично. С кожей закончили. Осталось сделать только эти ручки и ремень.",
      "textVietnamese": "Tuyệt vời. Xong phần da. Chỉ còn lại tay cầm và dây đeo này."
    }
  ],
  "notes": [
    {
      "timestamp": "00:03",
      "title": "Chuẩn bị mặt sau của khiên",
      "content": "Để điêu khắc chi tiết mặt sau của khiên (bao gồm tay cầm), nên quay lại phiên bản blockout ban đầu. Sử dụng chức năng Duplicate (Nhân đôi) nếu lịch sử không còn để đảm bảo hình dạng cơ sở (base mesh) ban đầu."
    },
    {
      "timestamp": "00:41",
      "title": "Kỹ thuật Extract và Dynamesh",
      "content": "Sau khi chuẩn bị base mesh, sử dụng Ctrl+A để chọn toàn bộ và áp dụng Extract để tạo chi tiết mới. Dynamesh được sử dụng để tái tạo lưới đa giác (polygons) nhằm cải thiện khả năng điêu khắc và loại bỏ các vấn đề về lưới."
    },
    {
      "timestamp": "01:51",
      "title": "Thêm chi tiết và Đối xứng xuyên tâm",
      "content": "Bật Radial Symmetry (Đối xứng xuyên tâm) theo trục Z để điêu khắc các chi tiết đối xứng. Áp dụng Dynamesh với độ phân giải cao hơn để giữ lại các chi tiết nhỏ hơn."
    },
    {
      "timestamp": "03:01",
      "title": "Điêu khắc kết cấu da và Backface Mask",
      "content": "Sử dụng cọ tiêu chuẩn (standard brush) và tắt Backface Mask để đảm bảo thao tác điêu khắc chỉ ảnh hưởng đến mặt trước của bề mặt, tránh làm biến dạng mặt sau. Áp dụng Alt kết hợp với cọ để tạo các vết lõm (indentations), mô phỏng kết cấu da (leather texture) hoặc các nếp nhăn (wrinkles)."
    },
    {
      "timestamp": "12:28",
      "title": "Tạo các Mũi khâu",
      "content": "Sử dụng cọ Insert Mesh (như Capsule) để thêm các đối tượng nguyên thủy (primitives) dưới dạng các mũi khâu. Sử dụng các thao tác Transform (Di chuyển, Xoay) và Duplicate (giữ Ctrl) để nhân bản và sắp xếp các mũi khâu thành hàng."
    },
    {
      "timestamp": "18:57",
      "title": "Tinh chỉnh Chi tiết Da và Hiệu ứng",
      "content": "Sử dụng cọ tiêu chuẩn với cường độ thấp (ví dụ: Z Intensity 9) để tạo các vết lõm nhỏ (dips) xung quanh các mũi khâu, giúp mô phỏng hiệu ứng da bị kéo căng và làm cho vật liệu trông mỏng hơn, tăng tính chân thực khi nhìn gần."
    }
  ],
  "flashcards": [
    {
      "id": "dynamesh",
      "term": "Dynamesh",
      "definition": "Kỹ thuật trong ZBrush cho phép tái tạo lưới đa giác của một đối tượng để điêu khắc tự do hơn mà không lo về topology.",
      "context": "ZBrush technique that allows regenerating the polygon mesh of an object for more fluid sculpting without worrying about about topology."
    },
    {
      "id": "extract",
      "term": "Extract",
      "definition": "Chức năng trong ZBrush cho phép tạo một Subtool (công cụ phụ) mới bằng cách trích xuất (extruding) một khu vực đã được che mặt nạ (masked area).",
      "context": "A ZBrush function allowing the creation of a new Subtool by extruding a masked area."
    },
    {
      "id": "blockout",
      "term": "Blockout",
      "definition": "Giai đoạn tạo hình dạng và tỷ lệ thô ban đầu của mô hình.",
      "context": "The initial stage of modeling where rough shape and proportions are established."
    },
    {
      "id": "subtool",
      "term": "Subtool",
      "definition": "Các thành phần riêng lẻ tạo nên một mô hình phức tạp trong ZBrush, có thể được quản lý độc lập.",
      "context": "Individual components that make up a complex model in ZBrush, manageable independently."
    },
    {
      "id": "radial_symmetry",
      "term": "Radial Symmetry",
      "definition": "Chế độ đối xứng cho phép lặp lại thao tác điêu khắc quanh một trục cố định (thường là trục Z), hữu ích khi tạo các vật thể tròn như khiên.",
      "context": "A symmetry mode that repeats sculpting actions around a fixed axis (usually Z-axis), useful for round objects like shields."
    },
    {
      "id": "backface_mask",
      "term": "Backface Mask",
      "definition": "Tùy chọn cọ trong ZBrush ngăn các thao tác điêu khắc ảnh hưởng đến mặt sau của mô hình.",
      "context": "A brush option in ZBrush that prevents sculpting actions from affecting the back face of the model."
    },
    {
      "id": "claybuildup",
      "term": "Claybuildup",
      "definition": "Loại cọ thường dùng trong ZBrush để nhanh chóng thêm khối lượng và tạo các nếp nhăn hoặc kết cấu thô.",
      "context": "A common ZBrush brush used to rapidly add volume and create folds or rough textures."
    },
    {
      "id": "dam_standard",
      "term": "Dam Standard",
      "definition": "Cọ dùng để tạo các đường cắt, vết nứt hoặc chi tiết sắc nét và sâu trên bề mặt mô hình.",
      "context": "A brush used to create deep, sharp cuts, cracks, or fine details on a model's surface."
    },
    {
      "id": "inflate",
      "term": "Inflate",
      "definition": "Chức năng hoặc cọ giúp thổi phồng/làm căng bề mặt của mô hình.",
      "context": "A function or brush that inflates or bulges the surface of the model."
    },
    {
      "id": "insert_mesh_brush",
      "term": "Insert Mesh Brush (IMM)",
      "definition": "Cọ cho phép người dùng chèn các Subtool nguyên thủy hoặc tùy chỉnh (như các mũi khâu) vào mô hình hiện tại.",
      "context": "A brush that allows users to insert primitive or custom Subtools (like stitches) onto the current model."
    }
  ]
}
  },
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
