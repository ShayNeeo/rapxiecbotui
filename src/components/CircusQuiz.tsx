import React, { useState } from "react";
import { Icon } from "@/src/components/Icon";
import { QuizQuestion } from "@/src/types";
import { circusAudio } from "@/src/utils/audio";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/context/LanguageContext";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Award, 
  RotateCcw, 
  ChevronRight,
  Flame,
  Brain,
  Shuffle,
  ExternalLink
} from "lucide-react";
import quizCoverImg from "@/src/assets/images/quiz_kien_thuc_cover_vung_dat_ky_bi.jpg";
import taDuyHienPortraitImg from "@/src/assets/images/ta_duy_hien_portrait.jpg";
import taDuyHienBacHoImg from "@/src/assets/images/ta_duy_hien_bac_ho.jpg";
import quocCoQuocNghiepImg from "@/src/assets/images/quoc_co_quoc_nghiep_suc_manh_doi_tay.jpg";
import quocCoQuocNghiepBacThangImg from "@/src/assets/images/quoc_co_quoc_nghiep_chong_dau_bac_thang.jpg";
import quocCoQuocNghiepBgtImg from "@/src/assets/images/quoc_co_quoc_nghiep_britains_got_talent.jpg";
import cirqueDuSoleilStage1Img from "@/src/assets/images/cirque_du_soleil_stage_1.jpg";
import cirqueDuSoleilStage2Img from "@/src/assets/images/cirque_du_soleil_stage_2.jpg";
import aoThuatChimBoCauImg from "@/src/assets/images/ao_thuat_chim_bo_cau.jpg";
import congVienThongNhatNhaNamImg from "@/src/assets/images/cong_vien_thong_nhat_nha_nam.jpg";
import congVienThongNhatHoNuocImg from "@/src/assets/images/cong_vien_thong_nhat_ho_nuoc.jpg";
import caKheoThinhLongImg from "@/src/assets/images/ca_kheo_dan_gian_thinh_long.jpg";
import caKheoHaiHauImg from "@/src/assets/images/ca_kheo_hai_hau_hoi_lang.jpg";
import langToiShowTungHungImg from "@/src/assets/images/lang_toi_show_tung_hung_thung_tre.jpg";
import langToiShowUonDeoImg from "@/src/assets/images/lang_toi_show_uon_deo_cay_tre.jpg";
import nsndTamChinhCoHangGiaiKhatImg from "@/src/assets/images/nsnd_tam_chinh_co_hang_giai_khat.jpg";
import nsndTamChinhChanDungImg from "@/src/assets/images/nsnd_tam_chinh_chan_dung.jpg";
import philipAstleySketchImg from "@/src/assets/images/philip_astley_portrait_sketch.jpg";
import nsndTongToanThangHoangTuTranImg from "@/src/assets/images/nsnd_tong_toan_thang_hoang_tu_tran_1.jpg";
import nsndTongToanThangKichXiecImg from "@/src/assets/images/nsnd_tong_toan_thang_kich_xiec_2.jpg";
import treThungMayTreDanImg from "@/src/assets/images/tre_thung_may_tre_dan_1.jpg";
import cayTreVietNamImg from "@/src/assets/images/cay_tre_viet_nam_2.jpg";
import rapBatBigTopLuuDongImg from "@/src/assets/images/rap_bat_big_top_luu_dong.jpg";
import quocCoQuocNghiepAoDaiDoImg from "@/src/assets/images/quoc_co_quoc_nghiep_ao_dai_do_1.jpg";
import quocCoQuocNghiepSoMiTrangImg from "@/src/assets/images/quoc_co_quoc_nghiep_so_mi_trang_2.jpg";

interface CircusQuizProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Ai được tôn vinh là 'Cha đẻ - Ông tổ ngành Xiếc hiện đại Việt Nam' thành lập gánh xiếc đầu tiên năm 1921–1922?",
    questionEn: "Who is revered as the 'Father and Founder of Modern Vietnamese Circus', establishing the first troupe in 1921–1922?",
    options: [
      "Cụ Tạ Duy Hiển",
      "Cụ Nguyễn Khuyến",
      "Nghệ sĩ Tạ Duy Nhẫn",
      "NSND Đào Đức"
    ],
    optionsEn: [
      "Master Ta Duy Hien",
      "Poet Nguyen Khuyen",
      "Artist Ta Duy Nhan",
      "People's Artist Dao Duc"
    ],
    correctIndex: 0,
    explanation: "NSND Tạ Duy Hiển (1889 – 1967) được suy tôn là người đặt nền móng và sáng lập ngành Xiếc Việt Nam hiện đại. Năm 1922, ông tập hợp con cháu gia đình họ Tạ thành lập Gánh xiếc Việt Nam – gánh xiếc chuyên nghiệp đầu tiên do chính người Việt Nam làm chủ. Chương trình ra mắt ngày 5/12/1922 tại phố Hàng Da (Hà Nội) với dàn nghệ sĩ hùng hậu và đoàn xiếc thú phong phú đã chính thức mở ra trang sử vẻ vang cho xiếc nước nhà.",
    explanationEn: "People's Artist Ta Duy Hien (1889–1967) is revered as the father and pioneer of modern Vietnamese circus. In 1922, he rallied family artists to form the Vietnam Circus Troupe - the first professional troupe fully conceived and managed by Vietnamese. Their grand premiere on Dec 5, 1922 at Hang Da Market (Hanoi) opened a radiant new epoch for national circus arts.",
    triviaFact: "Sau khi cụ qua đời năm 1967, Chủ tịch Hồ Chí Minh đã gửi thư chia buồn: 'Được biết cụ Tạ Duy Hiển vừa qua đời. Bác rất thương tiếc. Bác thân ái gởi lời chia buồn đến gia quyến cụ Tạ và Đoàn xiếc Nhân dân Trung ương'. Năm 1984, cụ được truy tặng danh hiệu Nghệ sĩ Nhân dân (đợt 1).",
    triviaFactEn: "Upon his passing in 1967, President Ho Chi Minh sent a heartfelt letter of condolences. He was posthumously honored as People's Artist in the inaugural batch (1984).",
    image: taDuyHienPortraitImg,
    imageAlt: "Chân dung NSND Tạ Duy Hiển - Người sáng lập ngành Xiếc Việt Nam hiện đại",
    imageCaption: "NSND Tạ Duy Hiển (1889 - 1967) • Ông tổ ngành Xiếc Việt Nam",
    imageCaptionEn: "People's Artist Ta Duy Hien (1889 - 1967) • Founder of Modern Vietnamese Circus",
    sourceUrl: "https://vi.wikipedia.org/wiki/T%E1%BA%A1_Duy_Hi%E1%BB%83n",
    sourceTitle: "Wikipedia: Tạ Duy Hiển",
    gallery: [
      {
        src: taDuyHienPortraitImg,
        alt: "Chân dung NSND Tạ Duy Hiển - Ông tổ ngành Xiếc Việt Nam",
        caption: "NSND Tạ Duy Hiển (1889 - 1967) • Ông tổ ngành Xiếc Việt Nam",
        captionEn: "People's Artist Ta Duy Hien (1889 - 1967) • Founder of Modern Vietnamese Circus",
        sourceUrl: "https://vi.wikipedia.org/wiki/T%E1%BA%A1_Duy_Hi%E1%BB%83n",
        sourceTitle: "Wikipedia: Tạ Duy Hiển"
      },
      {
        src: taDuyHienBacHoImg,
        alt: "Bác Hồ đến thăm đoàn xiếc của Nghệ sĩ xiếc Tạ Duy Hiển",
        caption: "Bác Hồ đến thăm đoàn xiếc của Nghệ sĩ xiếc Tạ Duy Hiển",
        captionEn: "President Ho Chi Minh visiting the circus troupe of Master Ta Duy Hien",
        sourceUrl: "https://nguoinoitieng.tv/nghe-nghiep/nghe-si-xiec/ta-duy-hien/xv",
        sourceTitle: "Nguoinoitieng.tv: Nghệ sĩ xiếc Tạ Duy Hiển"
      }
    ],
    interestingFacts: [
      "Bậc thầy dạy thú: Cụ Tạ Duy Hiển có biệt tài thuần dưỡng thú dữ xuất chúng; ông huấn luyện thuần thục từ khỉ, chó, gấu cho đến hổ, sư tử, voi, ngựa... khiến muôn loài thú dữ đều vâng lời.",
      "Đưa hồn cốt dân tộc vào xiếc: Sáng tạo những tiết mục độc nhất vô nhị như 'Phi ngựa đánh đàn tứ', 'Uốn dẻo trên trống cái', 'Voi quắp dùi gõ trống' trên nền các bản nhạc cổ truyền dân tộc như Bình bán, Lưu thủy, Hành vân...",
      "Lưu diễn quốc tế & mở rộng tầm vóc: Gánh xiếc của cụ lưu diễn xuyên Đông Dương (Việt Nam, Lào, Campuchia), sang Thái Lan, Miến Điện (Myanmar), Hồng Kông và miền Nam Trung Quốc. Năm 1933, cụ mua lại trọn vẹn dàn thú của gánh xiếc Amstrong (Anh) khi gánh này giải thể tại Việt Nam.",
      "Hiến trọn cơ nghiệp cho Tổ quốc: Sau Cách mạng, cụ ủng hộ tiền của cho kháng chiến. Năm 1958, cụ đem toàn bộ gánh xiếc gia nhập Đoàn xiếc Trung ương (tiền thân Liên đoàn Xiếc Việt Nam hiện nay) và trực tiếp giữ chức Trưởng đoàn.",
      "Đúc tượng đồng lưu danh muôn thuở: Cụ được đúc tượng đồng đặt trang trọng ngay giữa tiền sảnh rạp bạt của Liên đoàn Xiếc Việt Nam tại Hà Nội để các thế hệ nghệ sĩ và khán giả đời đời nhớ ơn."
    ],
    interestingFactsEn: [
      "Master animal trainer: Wonderfully gifted at domesticating and taming wild beasts, training tigers, lions, bears, elephants, and horses to perform with grace.",
      "Rooted in national culture: Pioneered unique acts such as 'Horseback rider playing traditional Tu lute', 'Contortion atop traditional drums', and 'Elephant drumming with its trunk' accompanied by Vietnamese classical melodies.",
      "International tours & expansion: Toured throughout Indochina, Thailand, Myanmar, Hong Kong, and Southern China. In 1933, he acquired the entire animal ensemble of Britain's Amstrong Circus.",
      "Dedicated entire troupe to the nation: Supported the revolution generously. In 1958, he merged his entire troupe into the Central National Circus Troupe (now Vietnam Circus Federation) as its troupe leader.",
      "Commemorated with a bronze statue: A bronze statue honoring him stands prominently in the main foyer of the Vietnam Circus Federation theater in Hanoi."
    ]
  },
  {
    id: 2,
    question: "Chất liệu truyền thống mộc mạc nào của Việt Nam là linh hồn trong các vở xiếc đương đại nổi tiếng toàn cầu như 'À Ố Show', 'Làng Tôi'?",
    questionEn: "Which rustic traditional Vietnamese material serves as the soul of world-renowned contemporary circus productions such as 'À Ố Show' and 'My Village'?",
    options: [
      "Gỗ lim",
      "Cây tre và thúng lượn",
      "Vải lụa Hà Đông",
      "Gốm Bát Tràng"
    ],
    optionsEn: [
      "Ironwood timber",
      "Bamboo poles & woven coracles",
      "Ha Dong silk",
      "Bat Trang ceramics"
    ],
    correctIndex: 1,
    explanation: "Xiếc Tre Việt Nam đã biến thân tre, bọng tre, thúng lượn thành đạo cụ nhào lộn và kiến trúc sân khấu diệu kỳ, làm say đắm khán giả tại hơn 50 quốc gia.",
    explanationEn: "Vietnamese Bamboo Circus turned raw bamboo stalks and woven basket boats into magical acrobatic props and stage architecture, captivating audiences in over 50 nations.",
    gallery: [
      {
        src: treThungMayTreDanImg,
        alt: "Thúng, mẹt, rổ rá tre đan truyền thống Việt Nam",
        caption: "Thúng, mẹt tre đan mộc mạc – Từ vật dụng thân thuộc của thôn quê trở thành đạo cụ nhào lộn, tung hứng ngoạn mục",
        captionEn: "Woven bamboo baskets and coracles – Familiar rustic village items transformed into spectacular acrobatic and juggling props"
      },
      {
        src: cayTreVietNamImg,
        alt: "Thân cây tre mộc mạc của làng quê Việt Nam",
        caption: "Cây tre Việt Nam – Biểu tượng của sự dẻo dai, bền bỉ, tạo nên những dàn khung không gian sống động trên sân khấu xiếc",
        captionEn: "Vietnamese bamboo poles – Symbols of resilience and flexibility, constructing dynamic living architectural spaces on stage"
      }
    ],
    triviaFact: "Cây tre Việt Nam vừa dẻo dai vừa chịu lực cực tốt, biểu trưng cho ý chí và sức mạnh bền bỉ của người Việt.",
    triviaFactEn: "Vietnamese bamboo is remarkably flexible yet sturdy, symbolizing the enduring willpower of the Vietnamese soul.",
    interestingFacts: [
      "Nguyên liệu tự nhiên thuần Việt: Tất cả thân tre và thúng lượn được chọn lọc kỹ lưỡng từ các vùng quê Việt Nam, xử lý thủ công để giữ được độ đàn hồi và màu sắc tự nhiên mộc mạc.",
      "Đạo cụ đa biến hóa phi thường: Trên sân khấu, cây tre không cố định mà biến thành cầu khỉ, dòng sông, ngôi nhà, ngọn đồi hay những chiếc xích đu nhào lộn trên không.",
      "Sự kết hợp hoàn hảo giữa độ dẻo và sức chịu tải: Tre có độ uốn cong độc đáo và độ dai bền vượt trội, cho phép các nghệ sĩ biểu diễn những cú nhào lộn thót tim mà không cần đến giàn thép kim loại nặng nề.",
      "Mang linh hồn làng quê ra thế giới: Cây tre và chiếc thúng đã đại diện cho tâm hồn người Việt, chinh phục hàng triệu khán giả quốc tế qua các chuyến lưu diễn toàn cầu của 'Làng Tôi', 'À Ố Show', 'Teh Dar'."
    ],
    interestingFactsEn: [
      "Pure authentic Vietnamese material: Bamboo trunks and coracles are handpicked from traditional craft villages, seasoned naturally to preserve flexibility and organic texture.",
      "Extraordinary metamorphic props: On stage, bamboo poles dynamically transform into monkey bridges, rivers, thatched roofs, hilltops, or high-flying trapeze swings.",
      "Remarkable synergy of strength and elasticity: Bamboo's exceptional tensile strength allows daring acrobats to perform breathtaking stunts without relying on heavy industrial steel trusses.",
      "Carrying Vietnam's village soul to the world: Bamboo and woven baskets carry the Vietnamese cultural spirit across the globe through international tours of 'My Village', 'A O Show', and 'Teh Dar'."
    ]
  },
  {
    id: 3,
    question: "Nghệ thuật xiếc dân gian nào vốn xuất phát từ công việc lội nước bắt cá ven biển của ngư dân Nam Định, Hải Phòng?",
    questionEn: "Which folk circus art originated from coastal fishermen wading into deep waters to catch fish in Nam Dinh and Hai Phong?",
    options: [
      "Uốn dẻo",
      "Đi cà kheo tre",
      "Nuốt kiếm",
      "Đi dây thừng"
    ],
    optionsEn: [
      "Contortion",
      "Bamboo stilt-walking",
      "Sword swallowing",
      "Tightrope walking"
    ],
    correctIndex: 1,
    explanation: "Người dân miền duyên hải sáng chế ra đôi cà kheo tre cao 2 - 3 mét để đi lội nước săn cá, quăng chài ngoài lộng biển sâu mà không bị ướt áo. Từ một công cụ mưu sinh vượt sóng gió, cà kheo đã được nâng tầm thành một môn nghệ thuật xiếc dân gian độc đáo, vừa đòi hỏi kỹ năng giữ thăng bằng điêu luyện vừa rực rỡ sắc màu lễ hội.",
    explanationEn: "Coastal villagers crafted 2-3 meter bamboo stilts to wade through ocean surf, casting fishing nets in deep water without drenching their clothes. Born out of seafaring livelihood, stilt-walking evolved into an extraordinary folk circus discipline demanding phenomenal balance and theatrical agility.",
    triviaFact: "Ngày nay, các đoàn nghệ nhân cà kheo Hải Hậu (Nam Định) thường xuyên tham gia biểu diễn tại các kỳ Festival Huế và lễ hội quốc tế.",
    triviaFactEn: "Today, Hai Hau stilt-walking troupes regularly star in the Hue Festival and global cultural carnivals.",
    image: caKheoThinhLongImg,
    imageAlt: "Nghệ nhân đi cà kheo biểu diễn trang phục truyền thống rực rỡ tại lễ hội Thịnh Long",
    imageCaption: "Đi cà kheo dân gian • Đỉnh cao thăng bằng từ công cụ mưu sinh miền biển",
    imageCaptionEn: "Folk stilt-walking • Acrobatic balance born from coastal seafaring life",
    sourceUrl: "https://vov.vn/du-lich/kham-pha-vu-dieu-ca-kheo-tren-song-cua-ngu-dan-vung-bien-thinh-long-ninh-binh-post1296597.vov",
    sourceTitle: "VOV Du Lịch",
    gallery: [
      {
        src: caKheoThinhLongImg,
        alt: "Nghệ nhân biểu diễn cà kheo rực rỡ sắc màu tại vùng biển Thịnh Long",
        caption: "Vũ điệu cà kheo trên sóng nước của ngư dân vùng biển Thịnh Long",
        captionEn: "The coastal dance of stilt-walkers in Thinh Long waters",
        sourceUrl: "https://vov.vn/du-lich/kham-pha-vu-dieu-ca-kheo-tren-song-cua-ngu-dan-vung-bien-thinh-long-ninh-binh-post1296597.vov",
        sourceTitle: "VOV Du Lịch"
      },
      {
        src: caKheoHaiHauImg,
        alt: "Đoàn nghệ nhân cà kheo biểu diễn múa lân, thổi kèn, đánh trống rộn ràng tại lễ hội Hải Hậu",
        caption: "Nghệ nhân cà kheo Hải Hậu biểu diễn múa lân, thổi kèn và múa rồng tại ngày hội văn hóa",
        captionEn: "Hai Hau stilt-walkers performing lion dance, trumpets, and drums at folk festivals",
        sourceUrl: "https://reatimes.vn/news-20214026.htm",
        sourceTitle: "Tạp chí Reatimes"
      }
    ],
    interestingFacts: [
      "Xuất xứ từ kế mưu sinh 'đứng trên sóng dữ': Ngư dân vùng biển Hải Hậu, Quất Lâm (Nam Định) và ven biển Cát Hải (Hải Phòng) chế tác cà kheo từ tre già để lội nước sâu tới ngực, quăng chài, giăng lưới, vớt moi và câu tôm cá mà không sợ sóng cuốn trôi.",
      "Kỹ thuật thăng bằng điêu luyện bậc thầy: Để điều khiển đôi 'chân tre' cao từ 1,5 đến hơn 3 mét vững vàng trên nền cát lún hoặc sóng dập dềnh, nghệ nhân phải buộc chặt chân vào bàn đạp và dùng toàn bộ cơ hông, đùi để chuyển trọng tâm nhịp nhàng.",
      "Biến tấu thành nghệ thuật xiếc đường phố đặc sắc: Không chỉ bước đi thăng bằng, các nghệ nhân còn có thể đá bóng, nhào lộn, nhảy múa, múa lân - sư - rồng, thổi kèn đồng và đánh trống ngay trên đôi cà kheo cao ngút ngàn.",
      "Rạng danh văn hóa Việt Nam tại các Festival quốc tế: Đoàn nghệ thuật cà kheo Hải Hậu đã trở thành thương hiệu văn hóa độc nhất vô nhị, từng lưu diễn biểu diễn phục vụ các kỳ Festival Huế, Lễ hội biển và giao lưu văn hóa quốc tế, gây ấn tượng mạnh với bạn bè năm châu."
    ],
    interestingFactsEn: [
      "Origins in coastal seafaring survival: Fishermen in Hai Hau, Quat Lam (Nam Dinh) and Cat Hai (Hai Phong) crafted stilts from seasoned bamboo to wade deep into coastal tides, casting nets and harvesting sea mollusks above treacherous waves.",
      "Masterful kinetic equilibrium: Balancing on 1.5 to 3+ meter bamboo 'stilts' over sinking sands or surging surf requires tightly lashing the feet to footrests and maneuvering hip and thigh momentum with pinpoint precision.",
      "Evolution into high-energy street circus acrobatics: Beyond walking, master performers kick soccer balls, perform martial arts routines, dance lion and dragon puppets, and play brass horns and drums high in the air.",
      "Celebrating Vietnamese folk heritage globally: Hai Hau's stilt-walking troupes have become a treasured cultural hallmark, headlining Hue Festivals and international cultural carnivals to immense global admiration."
    ]
  },
  {
    id: 4,
    question: "Hai anh em nghệ nhân xiếc Việt Nam nào đã lập kỷ lục Guinness thế giới với màn chồng đầu bước lên 100 bậc thang?",
    questionEn: "Which two Vietnamese circus brothers achieved a Guinness World Record by ascending 100 stairs with a head-to-head balance?",
    options: [
      "Quốc Cơ - Quốc Nghiệp",
      "Tạ Duy Hiển - Tạ Duy Nhẫn",
      "Đức Hoàn - Đăng Triều",
      "Tống Toàn Thắng - Thanh Thủy"
    ],
    optionsEn: [
      "Quoc Co - Quoc Nghiep (Giang Brothers)",
      "Ta Duy Hien - Ta Duy Nhan",
      "Duc Hoan - Dang Trieu",
      "Tong Toan Thang - Thanh Thuy"
    ],
    correctIndex: 0,
    explanation: "NSƯT Quốc Cơ và NSƯT Quốc Nghiệp đã chinh phục thế giới với tiết mục 'Sức mạnh đôi tay' và màn chồng đầu thăng bằng bước lên 100 bậc thang trong 53 giây tại Tây Ban Nha.",
    explanationEn: "Meritorious Artists Quoc Co and Quoc Nghiep astonished the world with 'Power of the Hands' and scaling 100 cathedral steps in head-to-head balance in 53 seconds in Spain.",
    gallery: [
      {
        src: quocCoQuocNghiepAoDaiDoImg,
        alt: "Quốc Cơ - Quốc Nghiệp trong trang phục áo dài truyền thống rạng rỡ",
        caption: "Quốc Cơ - Quốc Nghiệp rạng rỡ trong tà áo dài truyền thống – Mang bản sắc và niềm tự hào Việt Nam ra đấu trường quốc tế",
        captionEn: "Quoc Co & Quoc Nghiep proudly in traditional Ao Dai – Bringing Vietnamese cultural identity and pride to the world stage",
        sourceUrl: "https://www.kkday.com/vi/blog/54942/lang-toi-show-dam-minh-vao-tinh-hoa-lang-que-bac-bo/?srsltid=AU7gw4UfsDwTzb_8FeL41w-Sp0JqpsL-OQOB8NptK5x-VHqLrKEvJRGl",
        sourceTitle: "KKday Blog"
      },
      {
        src: quocCoQuocNghiepSoMiTrangImg,
        alt: "Hai anh em nghệ sĩ xiếc Quốc Cơ và Quốc Nghiệp",
        caption: "Hai anh em nghệ sĩ tài hoa Quốc Cơ – Quốc Nghiệp với tinh thần thép vượt qua vô vàn chấn thương hiểm nghèo",
        captionEn: "The talented brothers Quoc Co – Quoc Nghiep with an iron will, overcoming countless perilous injuries",
        sourceUrl: "https://thanhnien.vn/quoc-co-quoc-nghiep-gap-su-co-truoc-ngay-lap-ky-luc-guinness-o-y-18523020312023383.htm",
        sourceTitle: "Báo Thanh Niên"
      }
    ],
    triviaFact: "Màn biểu diễn này đòi hỏi lực cơ cổ và sự cân bằng tuyệt đối đến từng mili-giây giữa hai người.",
    triviaFactEn: "This performance requires formidable neck muscle strength and microsecond synchronized equilibrium.",
    interestingFacts: [
      "Bộ sưu tập kỷ lục Guinness chấn động thế giới: Lập kỷ lục bước lên 90 bậc thang trong 52 giây (2016) và phá kỷ lục của chính mình khi bước lên 100 bậc thang trong 53 giây tại Nhà thờ Girona (Tây Ban Nha, 2021).",
      "Kỷ lục bịt mắt chồng đầu lịch sử tại Ý: Năm 2023 tại Milan (Ý), Quốc Cơ bịt mắt cõng Quốc Nghiệp chồng đầu bước lên bậc thang chỉ rộng 50cm, xác lập kỷ lục thế giới cuối cùng trước khi chính thức khép lại sự nghiệp thi đấu quốc tế.",
      "Vượt qua sự cố chấn thương ngay trước ngày thi đấu: Trong buổi tập sát giờ lập kỷ lục tại Ý, Quốc Nghiệp từng bị ngã trượt khỏi bậc thang gây đau đớn dữ dội, nhưng với ý chí kiên cường, cả hai vẫn bước lên bục vinh quang.",
      "Gia tộc võ thuật và truyền thống y học cổ truyền: Cả hai sinh ra trong gia đình có gốc gác võ sư và thầy thuốc y học cổ truyền tại Chợ Lớn (TP.HCM), rèn luyện thể lực thép và đạo đức nghề nghiệp từ năm 4-5 tuổi.",
      "Những đại sứ quảng bá xiếc và văn hóa Việt Nam: Bất kỳ khi nào lưu diễn hay thi đấu quốc tế, hai anh em luôn chọn trang phục mang họa tiết dân tộc, góp phần đưa tinh thần kiên cường của con người Việt Nam lan tỏa khắp năm châu."
    ],
    interestingFactsEn: [
      "Sensational Guinness World Records collection: Conquered 90 stairs in 52 seconds (2016) and broke their own record with 100 stairs in 53 seconds at Girona Cathedral (Spain, 2021).",
      "Historic blindfolded head-to-head record in Italy: In 2023 in Milan (Italy), Quoc Co performed head-to-head stair climbing while completely blindfolded on a 50cm-wide beam, sealing their glorious career finale.",
      "Triumphing over perilous falls on the eve of record day: During training in Italy right before the attempt, Quoc Nghiep suffered a severe slip and injury, yet their unshakeable fortitude carried them to victory.",
      "Rooted in martial arts & Eastern medicine heritage: Born into a respected traditional healing and martial arts family in Cho Lon (HCMC), rigorous training began at age 4-5.",
      "Proud ambassadors of Vietnamese circus & culture: Whether competing on Britain's Got Talent or setting Guinness feats, the brothers consistently showcased traditional cultural motifs to global audiences."
    ]
  },
  {
    id: 5,
    question: "Đường kính tiêu chuẩn quốc tế của một vòng tròn sân khấu rạp xiếc (Circus Ring) là bao nhiêu?",
    questionEn: "What is the international standard diameter of a circular circus ring arena?",
    options: [
      "10 mét",
      "13 mét (42 feet)",
      "18 mét",
      "25 mét"
    ],
    optionsEn: [
      "10 meters",
      "13 meters (42 feet)",
      "18 meters",
      "25 meters"
    ],
    correctIndex: 1,
    explanation: "Đường kính 13 mét (42 feet) do Philip Astley xác lập từ năm 1768, là kích thước lý tưởng để lực ly tâm giữ thăng bằng cho ngựa chạy tròn và tầm mắt khán giả bao quát tối ưu.",
    explanationEn: "The 13-meter (42-foot) diameter established by Philip Astley in 1768 allows centrifugal force to stabilize cantering horses while providing optimal audience sightlines.",
    triviaFact: "Bất kể rạp xiếc lớn tại Moscow, Paris hay Hà Nội, lòng sân khấu biểu diễn luôn giữ chuẩn mực 13 mét này.",
    triviaFactEn: "Whether in Moscow, Paris, or Hanoi, standard big top arenas adhere faithfully to this 13-meter dimension."
  },
  {
    id: 6,
    question: "Rạp Xiếc Trung Ương mái vòm tròn khang trang của Liên đoàn Xiếc Việt Nam tọa lạc tại công viên nào ở Thủ đô Hà Nội?",
    questionEn: "In which park in Hanoi is the Vietnam National Circus domed theater located?",
    options: [
      "Công viên Thủ Lệ",
      "Công viên Cầu Giấy",
      "Công viên Thống Nhất",
      "Công viên Yên Sở"
    ],
    optionsEn: [
      "Thu Le Park",
      "Cau Giay Park",
      "Thong Nhat Park",
      "Yen So Park"
    ],
    correctIndex: 2,
    explanation: "Rạp Xiếc Trung Ương nằm tại phố Trần Nhân Tông, ngay trong khuôn viên Công viên Thống Nhất (Hà Nội), với sức chứa hơn 1.200 chỗ ngồi hiện đại. Đây là công viên cây xanh lớn bậc nhất trung tâm Thủ đô, sở hữu hồ Bảy Mẫu thoáng đãng và những hàng cây rợp bóng mát, tạo nên không gian văn hóa nghệ thuật và sinh hoạt cộng đồng lý tưởng.",
    explanationEn: "The Vietnam National Circus domed theater is situated on Tran Nhan Tong Street inside Thong Nhat Park (Hanoi), seating over 1,200 spectators. As one of the capital's largest green lungs featuring Bay Mau Lake and lush walking paths, it offers an idyllic artistic and communal haven.",
    triviaFact: "Đây là 'thánh đường' xiếc quốc gia, nơi tổ chức các kỳ Liên hoan Xiếc Quốc tế lớn tại Việt Nam.",
    triviaFactEn: "It is the national sanctuary of circus art, frequently hosting prestigious International Circus Festivals in Vietnam.",
    image: congVienThongNhatNhaNamImg,
    imageAlt: "Nhà nấm nghỉ chân thơ mộng trong Công viên Thống Nhất Hà Nội",
    imageCaption: "Công viên Thống Nhất • 'Lá phổi xanh' thanh bình ôm trọn Rạp Xiếc Trung Ương",
    imageCaptionEn: "Thong Nhat Park • Tranquil green sanctuary embracing the National Circus",
    gallery: [
      {
        src: congVienThongNhatNhaNamImg,
        alt: "Nhà nấm nghỉ chân vàng tươi rợp bóng cây trong Công viên Thống Nhất",
        caption: "Kiến trúc nhà nấm nghỉ chân đặc trưng giữa tán cây xanh Công viên Thống Nhất",
        captionEn: "Iconic mushroom rest pavilion beneath lush canopy in Thong Nhat Park"
      },
      {
        src: congVienThongNhatHoNuocImg,
        alt: "Con đường ven hồ Bảy Mẫu êm đềm với hàng phi lao và ghế đá trong công viên",
        caption: "Bờ hồ Bảy Mẫu êm đềm rợp bóng cây râm mát – Không gian dạo chơi lý tưởng",
        captionEn: "Tranquil Bay Mau lake promenade shaded by whispering pine trees"
      }
    ],
    interestingFacts: [
      "Xây dựng bằng lao động công ích lịch sử (1958 - 1961): Công viên được hình thành từ ngày thứ Bảy lao động xã hội chủ nghĩa của hàng vạn người dân và thanh thiếu niên Thủ đô, mang tên 'Thống Nhất' thể hiện khát vọng non sông liền một dải.",
      "'Lá phổi xanh' rộng hơn 50 hecta: Bao bọc hồ Bảy Mẫu thơ mộng, công viên là không gian xanh lý tưởng cho người dân tập dưỡng sinh, chạy bộ, picnic và thư giãn giữa lòng Hà Nội.",
      "Thánh đường của nghệ thuật xiếc đỉnh cao: Tòa nhà Rạp Xiếc Trung Ương hình vòm tròn với mái chóp cao vút nằm tiếp giáp mặt phố Trần Nhân Tông, là công trình xiếc kiên cố và hiện đại bậc nhất cả nước, nơi quy tụ dàn nghệ sĩ tài hoa của Liên đoàn Xiếc Việt Nam.",
      "Không gian mở không rào chắn: Những năm gần đây, hàng rào bao quanh công viên phía đường Trần Nhân Tông đã được tháo dỡ để kết nối trực tiếp với tuyến phố đi bộ, tạo nên quần thể văn hóa - nghệ thuật - du lịch sống động cho người dân và du khách."
    ],
    interestingFactsEn: [
      "Built through historic civic solidarity (1958 - 1961): Created through voluntary weekend labor by tens of thousands of Hanoi citizens, named 'Thong Nhat' (Reunification) symbolizing the yearning for national unity.",
      "Green sanctuary spanning over 50 hectares: Encompassing scenic Bay Mau Lake, the park serves as an essential urban haven for jogging, outdoor yoga, and family picnics in central Hanoi.",
      "National citadel of circus arts: The domed National Circus Theater on Tran Nhan Tong Street stands as Vietnam's premier permanent circus auditorium, housing landmark performances by the Vietnam Circus Federation.",
      "Open parkland concept: In recent years, park fences along Tran Nhan Tong Street were removed to integrate seamlessly with the pedestrian promenade, forging a vibrant open cultural and arts precinct."
    ]
  },
  {
    id: 7,
    question: "Nữ nghệ sĩ xiếc Việt Nam đầu tiên được phong tặng danh hiệu NSND và từng giữ chức Giám đốc Liên đoàn Xiếc Việt Nam là ai?",
    questionEn: "Who was the first female Vietnamese circus artist honored as People's Artist and former Director of the Vietnam Circus Federation?",
    options: [
      "NSND Tâm Chính",
      "NSND Trà Giang",
      "NSND Hồng Vân",
      "NSND Hoàng Cúc"
    ],
    optionsEn: [
      "People's Artist Tam Chinh",
      "People's Artist Tra Giang",
      "People's Artist Hong Van",
      "People's Artist Hoang Cuc"
    ],
    correctIndex: 0,
    explanation: "NSND Tâm Chính (sinh năm 1945 tại Thanh Hóa) là nữ nghệ sĩ xiếc Việt Nam đầu tiên được phong tặng danh hiệu Nghệ sĩ Nhân dân (đợt 2, năm 1988) và từng giữ cương vị Giám đốc Liên đoàn Xiếc Việt Nam (1987 - 2004). Bà là cánh chim đầu đàn, đưa xiếc Việt Nam vươn tầm quốc tế với tài năng thăng bằng đỉnh cao và cống hiến trọn đời cho nghệ thuật xiếc dân tộc.",
    explanationEn: "People's Artist Tam Chinh (born 1945 in Thanh Hoa) was the first female Vietnamese circus artist honored as People's Artist (1988) and served as Director of the Vietnam Circus Federation (1987-2004). She remains a towering pioneer who elevated Vietnamese circus globally through supreme balancing artistry and lifelong dedication.",
    triviaFact: "Từ cô thôn nữ nghèo làm đồng ở Thanh Hóa, bằng ý chí phi thường và khổ luyện vượt bậc, bà đã vươn lên trở thành huyền thoại rạng danh của xiếc Việt Nam và được tặng thưởng danh hiệu Anh hùng Lao động.",
    triviaFactEn: "From a rural farming girl in Thanh Hoa, through extraordinary grit, she rose to become a revered circus legend and Labor Hero of Vietnam.",
    image: nsndTamChinhChanDungImg,
    imageAlt: "Chân dung NSND Tâm Chính - Nữ nghệ sĩ xiếc Việt Nam đầu tiên được phong tặng danh hiệu NSND",
    imageCaption: "NSND Tâm Chính • Cánh chim đầu đàn và cựu Giám đốc Liên đoàn Xiếc Việt Nam",
    imageCaptionEn: "People's Artist Tam Chinh • Pioneer & Former Director of Vietnam Circus Federation",
    sourceUrl: "https://arttimes.vn/san-khau-dien-anh/chuyen-ve-nu-anh-hung-dau-tien-cua-nganh-xiec-viet-c17a24254.html",
    sourceTitle: "Thời báo Văn học Nghệ thuật: NSND Tâm Chính",
    interestingFacts: [
      "Xuất thân từ cô thôn nữ làng quê nghèo: Sinh ra trong gia đình thuần nông tại Nga Sơn (Thanh Hóa), trước khi đến với xiếc bà chỉ quen việc cấy lúa, gánh phân, chưa từng biết xiếc là gì cho đến khi trúng tuyển vào Trường Xiếc năm 1959.",
      "Kỹ thuật thăng bằng đỉnh cao: Khổ luyện không ngừng để làm chủ kỹ thuật thăng bằng con lăn phức tạp trên nhiều tầng xếp chồng mà không hề dao động, khẳng định bản lĩnh của người phụ nữ Việt Nam.",
      "Vinh dự nhiều lần biểu diễn cho Bác Hồ xem: Bà vinh dự được biểu diễn phục vụ Bác Hồ tại Phủ Chủ tịch; Bác đã thân tình khen ngợi, tặng hoa và động viên các nghệ sĩ xiếc mang nghệ thuật phục vụ nhân dân.",
      "Lưu diễn quốc tế & giải thưởng danh giá: Tiết mục của bà đã đoạt Huy chương Bạc tại Liên hoan Xiếc quốc tế Warsaw (Ba Lan) năm 1980 và lưu diễn qua hàng chục quốc gia khắp năm châu.",
      "Gia đình 'đại gia đình xiếc' lừng danh: Chồng bà là NSƯT Lê Thể (bậc thầy hề xiếc và huấn luyện thú), các con cháu như NSƯT Thắng Bế, nghệ sĩ Phương Thảo đều nối nghiệp, trở thành gia tộc xiếc tiêu biểu của Việt Nam."
    ],
    interestingFactsEn: [
      "From rural farming roots to national glory: Born to a humble peasant family in Nga Son (Thanh Hoa), knew nothing of acrobatics until passing the circus entrance audition in 1959.",
      "Supreme balancing mastery: Relentless discipline to master complex multi-tiered rolling cylinder balance acts without faltering, asserting Vietnamese women's resilience.",
      "Honored to perform before President Ho Chi Minh: Repeatedly performed at the Presidential Palace for President Ho Chi Minh, receiving his personal flowers and praise.",
      "Global acclaim & international Silver Medal: Captured the Silver Medal at the prestigious Warsaw International Circus Festival (Poland) in 1980, touring dozens of countries worldwide.",
      "Patriarch of a revered circus dynasty: Her husband Meritorious Artist Le The, and children/grandchildren (including Meritorious Artist Thang Be) carry forward an extraordinary multigenerational circus legacy."
    ]
  },
  {
    id: 8,
    question: "Trong nghệ thuật ảo thuật cổ điển và hiện đại, loài chim nào thường được nghệ sĩ 'biến hóa' xuất hiện từ nón lá hoặc khăn tay?",
    questionEn: "In both classical and modern illusion acts, which bird is traditionally produced from conical hats or silk scarves?",
    options: [
      "Chim sẻ",
      "Chim bồ câu trắng",
      "Chim đại bàng",
      "Chim công"
    ],
    optionsEn: [
      "Sparrows",
      "White doves",
      "Eagles",
      "Peacocks"
    ],
    correctIndex: 1,
    explanation: "Chim bồ câu trắng thuần thục, lanh lợi và là biểu tượng toàn cầu của hòa bình, may mắn và vẻ đẹp tinh khiết trên sân khấu xiếc. Trong các màn ảo thuật cổ điển lẫn hiện đại, hình ảnh chú chim bồ câu trắng tung cánh bay vút ra từ chiếc mũ dạ, nón lá hay chiếc khăn lụa luôn tạo nên khoảnh khắc bất ngờ và thơ mộng đầy cảm xúc cho người xem.",
    explanationEn: "White doves are gentle, agile, and globally recognized symbols of peace, fortune, and poetic grace in stage illusions. Across classical and contemporary magic, a snow-white dove bursting into flight from a top hat, conical hat, or silk scarf produces an enchanting and poetic spectacle.",
    triviaFact: "Nghệ sĩ xiếc huấn luyện bồ câu bằng tình yêu thương và sự kiên trì trong suốt nhiều tháng liền, tạo nên sự gắn kết thấu hiểu tuyệt đối giữa người và chim.",
    triviaFactEn: "Circus illusionists train doves through months of patience and gentle mutual trust, forging a profound communicative bond between artist and bird.",
    image: aoThuatChimBoCauImg,
    imageAlt: "Chim bồ câu trắng tung cánh bay lên từ chiếc mũ ảo thuật trên sân khấu xiếc",
    imageCaption: "Biến hóa chim bồ câu trắng • Biểu tượng kinh điển của nghệ thuật ảo thuật & xiếc",
    imageCaptionEn: "White dove production • The timeless hallmark of magical illusions & circus arts",
    interestingFacts: [
      "Biểu tượng kinh điển của ảo thuật thế giới: Tiết mục biến hóa bồ câu được khởi xướng và nâng tầm thành đỉnh cao bởi ảo thuật gia lừng danh Channing Pollock vào thập niên 1950, trở thành chuẩn mực mẫu mực cho mọi nghệ sĩ ảo thuật quốc tế.",
      "Huấn luyện bằng tình thương và sự kiên nhẫn: Chim bồ câu được chọn thường là bồ câu trắng Java (Java Dove) vì bản tính hiền hòa, thông minh và không hoảng sợ trước ánh đèn sân khấu hay tiếng vỗ tay rộn rã của khán giả.",
      "Kỹ thuật giấu chim tinh tế: Trang phục và đạo cụ của nghệ sĩ được thiết kế công phu với các túi lụa đặc biệt thoáng khí, đảm bảo chim luôn thoải mái, an toàn tuyệt đối và có thể sải cánh bay vút nhẹ nhàng khi xuất hiện.",
      "Gắn liền với văn hóa biểu diễn Việt Nam: Ở Việt Nam, các nghệ sĩ ảo thuật xiếc còn sáng tạo kết hợp biến chim bồ câu từ chiếc nón lá, làn hoa hoặc chiếc quạt nan truyền thống, mang đậm bản sắc văn hóa dân tộc."
    ],
    interestingFactsEn: [
      "Timeless classic of global illusions: Popularized and elevated to world-class elegance by legendary magician Channing Pollock in the 1950s, setting the gold standard for stage dove magic.",
      "Trained with devotion & gentleness: Artists predominantly work with Java Doves due to their docile temperament, high intelligence, and calm composure under theatrical spotlights and loud applause.",
      "Gentle and humane prop engineering: Costumes and props feature custom breathable silk pockets designed for maximum comfort and safety, allowing birds to burst into flight unharmed.",
      "Vietnamese cultural adaptations: Vietnamese illusionists creatively produce doves from traditional conical hats (nón lá), woven flower baskets, and bamboo fans, blending classic wizardry with folk heritage."
    ]
  },
  {
    id: 9,
    question: "Nghệ thuật xiếc được cho là xuất hiện từ khoảng thời gian nào?",
    questionEn: "Around what time period is the art of circus believed to have first appeared?",
    options: [
      "Thời kỳ Hy Lạp và La Mã cổ đại",
      "Khoảng 2.000–3.000 năm trước ở Ai Cập, Trung Quốc và Hy Lạp",
      "Thế kỷ XIX tại Việt Nam",
      "Sau Chiến tranh thế giới thứ hai"
    ],
    optionsEn: [
      "During the ancient Greek and Roman periods",
      "Around 2,000–3,000 years ago in Egypt, China, and Greece",
      "During the 19th century in Vietnam",
      "After World War II"
    ],
    correctIndex: 1,
    explanation: "Các chứng tích khảo cổ học cho thấy nghệ thuật xiếc (uốn dẻo, tung hứng, thăng bằng) đã có từ 2.000–3.000 năm trước tại Ai Cập cổ, triều đại nhà Hán ở Trung Quốc và Hy Lạp cổ đại.",
    explanationEn: "Archaeological records show circus arts (contortion, juggling, equilibrium balance) originated 2,000–3,000 years ago in ancient Egypt, the Han Dynasty in China, and ancient Greece.",
    triviaFact: "Các bức vẽ trên lăng mộ Beni Hasan tại Ai Cập có niên đại hơn 4.000 năm đã khắc họa các nghệ nhân đang tung hứng nhiều quả bóng trên không.",
    triviaFactEn: "Paintings in Egypt's Beni Hasan tombs dating back over 4,000 years depict acrobats juggling multiple balls in midair."
  },
  {
    id: 10,
    question: "Xiếc đương đại Việt Nam khác với xiếc truyền thống ở điểm nổi bật nào?",
    questionEn: "What is the primary defining difference between contemporary Vietnamese circus and traditional circus?",
    options: [
      "Chỉ biểu diễn các tiết mục riêng lẻ, không có nội dung liên kết",
      "Chỉ tập trung vào kỹ thuật nhào lộn",
      "Kết hợp kỹ thuật xiếc với sân khấu, âm nhạc, múa và kể chuyện",
      "Không sử dụng âm nhạc trong biểu diễn"
    ],
    optionsEn: [
      "Only presenting separate acts without thematic connection",
      "Solely focusing on acrobatic tumbling tricks",
      "Integrating circus technique with theater, music, dance, and storytelling",
      "Performing without music"
    ],
    correctIndex: 2,
    explanation: "Xiếc đương đại Việt Nam vượt qua khuôn khổ các màn diễn kỹ thuật đơn lẻ để kết hợp kịch nghệ, múa đương đại, âm nhạc dân tộc diễn sống và xây dựng đường dây kịch bản kể chuyện truyền cảm hứng.",
    explanationEn: "Contemporary Vietnamese circus transcends isolated technical stunts by uniting dramatic arts, contemporary dance, live ethnic music, and evocative narrative storytelling.",
    triviaFact: "Các vở diễn như 'À Ố Show' và 'Làng Tôi' đã đưa ngôn ngữ xiếc kịch đương đại Việt Nam biểu diễn tại hơn 50 quốc gia trên thế giới.",
    triviaFactEn: "Landmark productions like 'À Ố Show' and 'My Village' have toured contemporary Vietnamese circus across more than 50 nations globally."
  },
  {
    id: 11,
    question: "Đối tượng khán giả của xiếc đương đại Việt Nam muốn hướng đến?",
    questionEn: "Which audience demographic does contemporary Vietnamese circus primarily aim to reach?",
    options: [
      "Chỉ trẻ em",
      "Chỉ học sinh, sinh viên",
      "Mọi lứa tuổi, tùy theo nội dung chương trình",
      "Chỉ người lớn yêu thích nghệ thuật"
    ],
    optionsEn: [
      "Children only",
      "High school and university students only",
      "Audiences of all ages, depending on the production theme",
      "Adult art enthusiasts only"
    ],
    correctIndex: 2,
    explanation: "Xiếc đương đại Việt Nam hướng đến phục vụ mọi thế hệ khán giả: từ thiếu nhi thích kỳ ảo, thanh niên yêu văn hóa mới, cho đến người cao tuổi và du khách quốc tế tìm kiếm chiều sâu bản sắc.",
    explanationEn: "Contemporary Vietnamese circus welcomes spectators of all generations: children charmed by wonder, youth inspired by innovation, and elders and global travelers seeking cultural depth.",
    triviaFact: "Nhờ có cốt truyện và tầng nghĩa nhân văn, khán giả ở mọi độ tuổi đều tìm thấy sự đồng điệu và cảm xúc riêng khi thưởng thức.",
    triviaFactEn: "With rich narratives and humanistic layers, viewers across every age group find their own emotional connection."
  },
  {
    id: 12,
    question: "Yếu tố âm nhạc và đạo cụ nào tạo nên bản sắc độc đáo của các tác phẩm xiếc đương đại Việt Nam (như À Ố Show, Làng Tôi)?",
    questionEn: "Which musical and prop element creates the unique identity of contemporary Vietnamese circus productions (such as À Ố Show, My Village)?",
    options: [
      "Nhạc cụ điện tử hiện đại kết hợp đạo cụ kim loại công nghiệp",
      "Sử dụng nhạc cụ dân tộc biểu diễn sống kết hợp đạo cụ tre nứa truyền thống",
      "Hoàn toàn không sử dụng âm nhạc và đạo cụ",
      "Chỉ sử dụng băng đĩa thu sẵn từ nước ngoài"
    ],
    optionsEn: [
      "Modern electronic music combined with industrial metal props",
      "Live ethnic traditional instruments combined with authentic bamboo props",
      "Completely performing without any music or props",
      "Only using pre-recorded foreign soundtracks"
    ],
    correctIndex: 1,
    explanation: "Sự kết hợp giữa nhạc cụ truyền thống (đàn môi, sáo trúc, đàn bầu, trống hội) diễn sống ngay trên sân khấu cùng các đạo cụ thuần Việt từ tre, nứa, thúng mủng là linh hồn tạo nên thương hiệu của xiếc đương đại Việt Nam.",
    explanationEn: "The synthesis of live traditional ethnic instrumentation (bamboo flutes, jaw harps, monochord) with authentic folk bamboo and coracle props defines the world-renowned Vietnamese contemporary circus identity.",
    triviaFact: "Mỗi khúc tre dùng làm đạo cụ đều được tuyển chọn kỹ lưỡng để vừa có độ cong dẻo, vừa chịu được sức nặng nhào lộn của nhiều nghệ sĩ cùng lúc.",
    triviaFactEn: "Each bamboo stalk is meticulously cured to guarantee both aesthetic flexibility and load-bearing safety for multiple simultaneous acrobats."
  },
  {
    id: 13,
    question: "Điểm nào sau đây đúng về xiếc đương đại Việt Nam?",
    questionEn: "Which statement accurately describes contemporary Vietnamese circus?",
    options: [
      "Không có nội dung xuyên suốt",
      "Chỉ đề cao kỹ thuật biểu diễn",
      "Có cốt truyện và truyền tải thông điệp",
      "Chỉ phù hợp với khán giả thiếu nhi"
    ],
    optionsEn: [
      "Lacks cohesive overarching content",
      "Only emphasizes physical technical feats",
      "Possesses a storyline and conveys meaningful messages",
      "Only suitable for young children"
    ],
    correctIndex: 2,
    explanation: "Xiếc đương đại xây dựng cốt truyện hoàn chỉnh với thông điệp về con người, văn hóa, tình yêu quê hương đất nước qua ngôn ngữ hình thể và âm thanh giàu cảm xúc.",
    explanationEn: "Contemporary circus crafts complete thematic storylines delivering messages on humanity, culture, and love of heritage through expressive physical and auditory art.",
    triviaFact: "Mỗi màn biểu diễn nhào lộn hay thăng bằng đều đóng vai trò như một phân cảnh điện ảnh để đẩy cao trào cảm xúc cho câu chuyện.",
    triviaFactEn: "Every acrobatic or balancing feat functions like a cinematic scene to heighten emotional drama in the story."
  },
  {
    id: 14,
    question: "Thành công của Quốc Cơ – Quốc Nghiệp trên sân khấu quốc tế chủ yếu gắn với kỹ thuật nào?",
    questionEn: "The international acclaim of Quoc Co and Quoc Nghiep on global stages is primarily associated with which technique?",
    options: [
      "Thăng bằng kết hợp chồng người",
      "Tung hứng kết hợp nhào lộn",
      "Uốn dẻo kết hợp nhào lộn",
      "Đu dây kết hợp tung hứng"
    ],
    optionsEn: [
      "Equilibrium balance combined with head-to-head pyramids",
      "Juggling combined with tumbling",
      "Contortion combined with acrobatics",
      "Aerial trapeze combined with juggling"
    ],
    correctIndex: 0,
    explanation: "Hai nghệ sĩ ưu tú Quốc Cơ – Quốc Nghiệp lừng danh thế giới với tiết mục 'Sức mạnh đôi tay' và các kỷ lục Guinness thăng bằng chồng đầu đi lên bậc thang mà không dùng dây bảo hiểm.",
    explanationEn: "Meritorious Artists Quoc Co and Quoc Nghiep achieved international fame with 'Power of the Hands' and Guinness World Records for ascending stairs in head-to-head balance without safety ropes.",
    triviaFact: "Họ từng bước lên 100 bậc thang của Nhà thờ chính tòa Girona (Tây Ban Nha) chỉ trong 53 giây trong tư thế chồng đầu thăng bằng.",
    triviaFactEn: "They scaled 100 steps of Girona Cathedral (Spain) in just 53 seconds while maintaining flawless head-to-head balance.",
    image: quocCoQuocNghiepImg,
    imageAlt: "Quốc Cơ - Quốc Nghiệp biểu diễn tiết mục Sức mạnh đôi tay thăng bằng chồng đầu",
    imageCaption: "NSƯT Quốc Cơ - Quốc Nghiệp • Đỉnh cao thăng bằng chồng đầu 'Sức mạnh đôi tay'",
    imageCaptionEn: "Meritorious Artists Quoc Co & Quoc Nghiep • Iconic head-to-head balance in 'Power of the Hands'",
    sourceUrl: "https://tuoitre.vn/nld/van-nghe/quoc-co-quoc-nghiep-chung-toi-tung-danh-nhau-khi-tap-luyen-20190617091049955.htm",
    sourceTitle: "Tuổi Trẻ Online: Quốc Cơ - Quốc Nghiệp",
    gallery: [
      {
        src: quocCoQuocNghiepImg,
        alt: "NSƯT Quốc Cơ - Quốc Nghiệp biểu diễn tiết mục Sức mạnh đôi tay",
        caption: "NSƯT Quốc Cơ - Quốc Nghiệp • Màn trình diễn đỉnh cao 'Sức mạnh đôi tay'",
        captionEn: "Meritorious Artists Quoc Co & Quoc Nghiep • 'Power of the Hands'",
        sourceUrl: "https://tuoitre.vn/nld/van-nghe/quoc-co-quoc-nghiep-chung-toi-tung-danh-nhau-khi-tap-luyen-20190617091049955.htm",
        sourceTitle: "Tuổi Trẻ Online"
      },
      {
        src: quocCoQuocNghiepBacThangImg,
        alt: "Quốc Cơ - Quốc Nghiệp thăng bằng chồng đầu bước lên bậc thang không bảo hiểm",
        caption: "Quốc Cơ - Quốc Nghiệp • Thăng bằng chồng đầu bước lên bậc thang không dây bảo hiểm",
        captionEn: "Quoc Co & Quoc Nghiep • Head-to-head stair climbing without safety ropes",
        sourceUrl: "https://dantri.com.vn/van-hoa/noi-am-anh-kinh-hoang-cua-quoc-co-quoc-nghiep-moi-lan-gap-tai-nan-2017111014350192.htm",
        sourceTitle: "Báo Dân Trí"
      },
      {
        src: quocCoQuocNghiepBgtImg,
        alt: "Quốc Cơ - Quốc Nghiệp tại bán kết Britain's Got Talent 2018",
        caption: "Quốc Cơ - Quốc Nghiệp • Tỏa sáng tại bán kết & chung kết Britain's Got Talent 2018",
        captionEn: "Quoc Co & Quoc Nghiep • Britain's Got Talent 2018 Semi-finals & Finals",
        sourceUrl: "https://www.24h.com.vn/doi-song-showbiz/quoc-co-quoc-nghiep-he-lo-tiet-muc-moi-cho-vong-ban-ket-britains-got-talent-2018-c729a963418.html",
        sourceTitle: "24h.com.vn"
      }
    ],
    interestingFacts: [
      "Xuất thân gia đình nhà nòi võ thuật & y học cổ truyền: Cả hai sinh ra trong gia đình có truyền thống võ thuật và lương y người Hoa tại Chợ Lớn (TP.HCM). Ông nội là lương y kiêm võ sư danh tiếng, cha cũng là võ sư, giúp hai anh em có nền tảng thể lực và ý chí phi thường từ thuở ấu thơ.",
      "Tập luyện gian khổ đẫm mồ hôi & nước mắt: Để đạt đến sự đồng điệu tuyệt đối trong động tác chồng đầu, hai anh em từng luyện tập hàng chục năm ròng rã, thậm chí có những lúc va chạm, cãi vã và suýt bỏ cuộc trước áp lực tột cùng.",
      "Đối mặt hiểm nguy & nỗi ám ảnh tai nạn rợn người: Trong quá trình biểu diễn không dây bảo hộ, Quốc Nghiệp từng gặp tai nạn ngã từ trên cao cắm đầu xuống đất khiến đốt sống cổ bị tổn thương nặng nề, nhiều lần bác sĩ cảnh báo nguy cơ bại liệt nếu tiếp tục, nhưng cả hai vẫn kiên cường trở lại sân khấu.",
      "Khoảnh khắc sinh tử tại chung kết Britain's Got Talent 2018: Sau sự cố ngã chấn thương ngay trong buổi tập sát giờ thi, hai anh em vẫn quyết định thực hiện cú nhảy sinh tử qua các bục cao không dây bảo hộ, khiến ban giám khảo Simon Cowell và hàng triệu khán giả quốc tế bật dậy thán phục.",
      "Bộ sưu tập kỷ lục Guinness vô tiền khoáng hậu: Liên tục xác lập các kỷ lục thế giới về thăng bằng chồng đầu đi lên bậc thang (90 bậc, 100 bậc tại Girona - Tây Ban Nha và kỷ lục bịt mắt chồng đầu đi lên xuống bậc thang tại Milan - Ý), khẳng định vị thế đỉnh cao của xiếc Việt Nam."
    ],
    interestingFactsEn: [
      "Martial arts & traditional medicine heritage: Born into a respected traditional medicine and martial arts family in Cho Lon (HCMC), inherited profound physical resilience and discipline from their grandfather and father.",
      "Decades of grueling training: Perfecting absolute synchronization in head-to-head pyramids required decades of relentless practice, enduring conflicts and mental exhaustion before achieving seamless harmony.",
      "Defying life-threatening injuries & doctor warnings: Performing without safety ropes led to harrowing falls where Quoc Nghiep suffered severe cervical spine trauma; despite medical warnings of paralysis, their passion brought them back.",
      "Heroic leap at Britain's Got Talent 2018 Finals: Hours after a traumatic rehearsal fall, they boldly performed the iconic leap across raised platforms without safety nets, moving Simon Cowell and millions of global viewers to their feet.",
      "Legendary Guinness World Records legacy: Repeatedly established and shattered world records for stair-climbing balance in Girona (Spain) and blindfolded head-to-head balance in Milan (Italy), crowning Vietnamese circus on the world stage."
    ]
  },
  {
    id: 15,
    question: "NSƯT - NSND Tống Toàn Thắng được biết đến nhiều với những đóng góp nào cho nghệ thuật xiếc Việt Nam?",
    questionEn: "Which notable contributions is Meritorious & People's Artist Tong Toan Thang most recognized for in Vietnamese circus?",
    options: [
      "Phát triển xiếc thú và dàn dựng nhiều chương trình",
      "Phát triển xiếc dây và đào tạo nhiều nghệ sĩ trẻ",
      "Phát triển xiếc lửa và sáng tạo nhiều tiết mục mới",
      "Phát triển xiếc nhào lộn và nghiên cứu sân khấu"
    ],
    optionsEn: [
      "Developing animal circus acts and staging major landmark productions",
      "Developing tightwire arts and training young performers",
      "Developing fire manipulation acts and creating new routines",
      "Developing acrobatic tumbling and stage research"
    ],
    correctIndex: 0,
    explanation: "NSND Tống Toàn Thắng nổi danh khắp năm châu với biệt danh 'Hoàng tử Trăn' nhờ nghệ thuật huấn luyện xiếc trăn điêu luyện, hòa quyện giữa sức mạnh hoang dã và sự mềm mại, tinh tế của con người. Trên cương vị Giám đốc Liên đoàn Xiếc Việt Nam, ông còn là đạo diễn và nhà quản lý tiên phong, dàn dựng nhiều tác phẩm kịch xiếc đương đại và sử thi đồ sộ, đưa xiếc Việt Nam vươn tầm thời đại.",
    explanationEn: "People's Artist Tong Toan Thang is celebrated internationally as the 'Python Prince' for his masterly python partnership blending primal majesty with refined human poise. As Director of the Vietnam Circus Federation, he is a visionary director staging monumental epic circuses and contemporary theatrical masterpieces.",
    triviaFact: "Tiết mục biểu diễn cùng đại trăn của ông đã lưu diễn qua hàng chục quốc gia khắp năm châu, chinh phục khán giả tại nhiều kỳ Festival xiếc danh giá quốc tế.",
    triviaFactEn: "His signature python act toured across dozens of countries worldwide, captivating audiences at prestigious international circus festivals.",
    image: nsndTongToanThangHoangTuTranImg,
    imageAlt: "NSND Tống Toàn Thắng trong tiết mục biểu diễn trăn huyền thoại Hoàng tử Trăn",
    imageCaption: "NSND Tống Toàn Thắng • Huyền thoại 'Hoàng tử Trăn' của xiếc Việt Nam",
    imageCaptionEn: "People's Artist Tong Toan Thang • Vietnam's legendary 'Python Prince'",
    sourceUrl: "https://tuoitre.vn/nld/van-nghe/nsnd-tong-toan-thang-lan-toa-yeu-thuong-20231007210446817.htm",
    sourceTitle: "Tuổi Trẻ Online: NSND Tống Toàn Thắng - Lan tỏa yêu thương",
    gallery: [
      {
        src: nsndTongToanThangHoangTuTranImg,
        alt: "NSND Tống Toàn Thắng biểu diễn cùng chú trăn khổng lồ trong trang phục Thạch Sanh dũng mãnh",
        caption: "NSND Tống Toàn Thắng trong hình tượng 'Hoàng tử Trăn' dũng mãnh – Đỉnh cao xiếc thú Việt Nam",
        captionEn: "The 'Python Prince' in his iconic stage persona – Zenith of Vietnamese animal circus",
        sourceUrl: "https://tuoitre.vn/nld/van-nghe/nsnd-tong-toan-thang-lan-toa-yeu-thuong-20231007210446817.htm",
        sourceTitle: "Tuổi Trẻ Online"
      },
      {
        src: nsndTongToanThangKichXiecImg,
        alt: "NSND Tống Toàn Thắng biểu diễn trong vở kịch xiếc đương đại trên sân khấu Rạp Xiếc Trung Ương",
        caption: "Sáng tạo nghệ thuật không ngừng: Đưa xiếc trăn hòa quyện vào các vở kịch xiếc đương đại và sử thi",
        captionEn: "Artistic innovation: Blending python artistry into contemporary circus dramas and epics",
        sourceUrl: "https://tuoitre.vn/nld/van-nghe/nsnd-tong-toan-thang-lan-toa-yeu-thuong-20231007210446817.htm",
        sourceTitle: "Tuổi Trẻ Online"
      }
    ],
    interestingFacts: [
      "Xuất phát điểm từ hình tượng Thạch Sanh (1990): Tiết mục biểu diễn cùng trăn được ông ấp ủ và ra mắt lần đầu năm 1990 dựa trên câu chuyện cổ tích Thạch Sanh đánh trăn tinh, biến nỗi sợ hãi loài bò sát thành một tác phẩm nghệ thuật cuốn hút đầy tính nhân văn.",
      "Tình bạn gắn bó tri kỷ với loài trăn: Ông từng tự tay chăm sóc, tắm rửa, ủ ấm và bầu bạn cùng những chú trăn nặng từ 40 đến 80kg trong suốt hàng chục năm; trăn của ông luôn thuần thục và biểu diễn theo nhịp thở của người nghệ sĩ.",
      "Vang danh quốc tế và 'thôi miên' khán giả năm châu: Tiết mục 'Hoàng tử Trăn' đã lưu diễn hơn 20 quốc gia (Pháp, Đức, Nga, Bỉ, Trung Quốc, Đài Loan...), từng vinh dự biểu diễn tại Festival Xiếc Quốc tế Monte Carlo và Nhà hát Xiếc Quốc gia Moscow.",
      "Nhà quản lý & Đạo diễn tiên phong đổi mới: Trên cương vị Giám đốc Liên đoàn Xiếc Việt Nam, ông đã mở đường cho xu hướng kết hợp xiếc với cải lương, rock, múa ballet và dàn dựng các vở kịch xiếc đồ sộ như 'Thần Điêu Đại Hiệp', 'Huyền sử Đinh Bộ Lĩnh'...",
      "Trái tim thiện nguyện lan tỏa yêu thương: Ông luôn duy trì các chương trình biểu diễn xiếc miễn phí phục vụ trẻ em mồ côi, trẻ em khuyết tật, bệnh nhi và bà con vùng sâu vùng xa, coi xiếc là sứ mệnh đem lại niềm tin và nụ cười cho cộng đồng."
    ],
    interestingFactsEn: [
      "Born from the Thach Sanh folktale (1990): Conceived in 1990 inspired by the fairy tale of Thach Sanh battling the giant serpent, converting primal fear into a spellbinding, humane theatrical experience.",
      "A lifelong bond of trust with pythons: Spent decades hand-raising, warming, and nurturing giant pythons weighing 40-80kg, establishing a gentle rapport synchronized with the artist's natural breath.",
      "Global fame across 20+ countries: The 'Python Prince' captivated audiences across France, Germany, Russia, Belgium, and Taiwan, including prestigious showcases at Monte Carlo and Moscow State Circus.",
      "Pioneering visionary & theater director: As Director of the Vietnam Circus Federation, spearheaded ground-breaking fusions of circus with traditional Cai Luong opera, rock music, and ballet.",
      "A compassionate heart for the community: Tirelessly organizes free charity performances for orphaned children, cancer patients, and underserved communities, using circus to sow joy and hope."
    ]
  },
  {
    id: 16,
    question: "Đoàn xiếc đương đại nổi tiếng toàn cầu 'Cirque du Soleil' (Xiếc Mặt Trời) có nguồn gốc từ quốc gia nào?",
    questionEn: "From which country does the globally renowned contemporary circus company 'Cirque du Soleil' (Circus of the Sun) originate?",
    options: [
      "Pháp",
      "Mỹ",
      "Canada",
      "Nga"
    ],
    optionsEn: [
      "France",
      "United States",
      "Canada",
      "Russia"
    ],
    correctIndex: 2,
    explanation: "Cirque du Soleil được thành lập vào năm 1984 tại Baie-Saint-Paul (Quebec, Canada) bởi Guy Laliberté và Gilles Ste-Croix. Đây được xem là biểu tượng đỉnh cao của nghệ thuật xiếc đương đại thế giới.",
    explanationEn: "Cirque du Soleil was founded in 1984 in Baie-Saint-Paul (Quebec, Canada) by Guy Laliberté and Gilles Ste-Croix. It is celebrated worldwide as a landmark summit of contemporary circus without animal acts.",
    triviaFact: "Cirque du Soleil đã biểu diễn phục vụ hơn 365 triệu khán giả tại hơn 90 quốc gia trên khắp thế giới.",
    triviaFactEn: "Cirque du Soleil has performed before more than 365 million spectators across over 90 countries worldwide.",
    image: cirqueDuSoleilStage1Img,
    imageAlt: "Biểu diễn sân khấu đỉnh cao của đoàn xiếc Cirque du Soleil",
    imageCaption: "Cirque du Soleil • Đỉnh cao nghệ thuật xiếc đương đại thế giới",
    imageCaptionEn: "Cirque du Soleil • Global zenith of contemporary circus arts",
    sourceUrl: "https://tuoitre.vn/doan-xiec-toan-cau-cirque-du-soleil-nop-don-pha-san-vi-covid-19-20200630153223791.htm",
    sourceTitle: "Tuổi Trẻ Online: Đoàn xiếc toàn cầu Cirque du Soleil",
    gallery: [
      {
        src: cirqueDuSoleilStage1Img,
        alt: "Vở diễn nghệ thuật kỳ ảo của Cirque du Soleil với thiết kế sân khấu hoành tráng",
        caption: "Cirque du Soleil • Không gian sân khấu kỳ ảo và kỹ xảo ánh sáng đỉnh cao",
        captionEn: "Cirque du Soleil • Surreal stage architecture & transcendent lighting",
        sourceUrl: "https://tuoitre.vn/doan-xiec-toan-cau-cirque-du-soleil-nop-don-pha-san-vi-covid-19-20200630153223791.htm",
        sourceTitle: "Tuổi Trẻ Online"
      },
      {
        src: cirqueDuSoleilStage2Img,
        alt: "Màn biểu diễn tháp người nhào lộn đặc trưng trong các show diễn của Cirque du Soleil",
        caption: "Cirque du Soleil • Kỹ thuật nhào lộn và vũ đạo kết hợp âm nhạc kịch tính",
        captionEn: "Cirque du Soleil • Acrobatic pyramids & theatrical choreography",
        sourceUrl: "https://tuoitre.vn/doan-xiec-toan-cau-cirque-du-soleil-nop-don-pha-san-vi-covid-19-20200630153223791.htm",
        sourceTitle: "Tuổi Trẻ Online"
      }
    ],
    interestingFacts: [
      "Khởi đầu từ nghệ sĩ đường phố (1984): Đoàn xiếc ban đầu chỉ là một nhóm nghệ sĩ biểu diễn đường phố tại một thị trấn nhỏ ở Quebec (Canada), đi cà kheo, nuốt lửa và chơi nhạc rong.",
      "Cuộc cách mạng 'Xiếc không động vật': Cirque du Soleil đã tiên phong loại bỏ hoàn toàn các tiết mục xiếc thú truyền thống, thay vào đó tập trung vào kỹ năng con người, nghệ thuật kể chuyện sân khấu, âm nhạc sống và phục trang may đo thủ công tinh xảo.",
      "Quy mô toàn cầu khổng lồ: Từng quy tụ hơn 4.900 nhân viên đến từ gần 50 quốc gia, đồng thời tổ chức hàng chục show diễn lưu diễn và cố định cùng lúc tại Las Vegas, Macau, Tokyo...",
      "Vượt qua cuộc khủng hoảng lịch sử: Trong đại dịch COVID-19 năm 2020, đoàn từng phải hủy toàn bộ 44 chương trình trên khắp thế giới và nộp đơn bảo hộ phá sản, trước khi tái cấu trúc tài chính thành công và trở lại rực rỡ với khán giả toàn cầu.",
      "Âm nhạc độc bản và trang phục tự thiết kế: Mỗi chương trình đều có album nhạc sống sáng tác riêng biệt và xưởng chế tác trang phục tại Montreal với hàng triệu mét vải được nhuộm thủ công."
    ],
    interestingFactsEn: [
      "Born from street performers (1984): Originally started as a spirited troupe of stilt-walkers, fire-breathers, and buskers in Baie-Saint-Paul, Quebec, Canada.",
      "The 'Animal-Free' circus revolution: Revolutionized modern circus by completely eliminating animal exploitation, replacing it with human acrobatic feats, theatrical narratives, original live music, and bespoke haute-couture costume design.",
      "Massive global empire: At its height, employed over 4,900 individuals from nearly 50 nationalities, staging dozens of touring and permanent residencies concurrently across Las Vegas, Macau, and Tokyo.",
      "Resilience through historic crisis: During the 2020 COVID-19 pandemic, cancelled all 44 concurrent shows worldwide and filed for bankruptcy protection, before successfully restructuring and making a triumphant global comeback.",
      "Original live score & custom couture: Every single production features exclusive live orchestral musical scores and hand-dyed bespoke costumes crafted in Montreal workshops."
    ]
  },
  {
    id: 17,
    question: "Tác phẩm xiếc đương đại Việt Nam nào dưới đây đã gặt hái thành công vang dội trên thế giới, sử dụng chất liệu tre làm đạo cụ chính để kể câu chuyện về văn hóa và con người Việt Nam?",
    questionEn: "Which contemporary Vietnamese circus production achieved international acclaim, using bamboo as its primary prop to tell the story of Vietnamese culture and people?",
    options: [
      "Làng Tôi",
      "Tấm Cám",
      "Sương Sớm",
      "Chuyện Tình Khau Vai"
    ],
    optionsEn: [
      "My Village (Làng Tôi)",
      "Tam Cam",
      "The Mist (Sương Sớm)",
      "Khau Vai Love Story"
    ],
    correctIndex: 0,
    explanation: "Các tác phẩm do Lune Production thực hiện (như Làng Tôi, À Ố Show) là những bước tiến tiên phong của xiếc đương đại Việt Nam, kết hợp kỹ thuật xiếc, múa, âm nhạc dân tộc và đạo cụ từ tre nứa để truyền tải văn hóa Việt Nam ra thế giới. Vở diễn 'Làng Tôi' (My Village) tái hiện bức tranh sinh hoạt làng quê Bắc Bộ mộc mạc và đầy thi vị thông qua ngôn ngữ xiếc tre độc bản.",
    explanationEn: "Productions created by Lune Production (such as 'My Village' and 'À Ố Show') are groundbreaking milestones of contemporary Vietnamese circus, marrying acrobatic stunts, dance, live traditional music, and rustic bamboo props. 'My Village' poetically resurrects the soul and daily rhythm of Northern Vietnamese rural life through the singular medium of bamboo circus.",
    triviaFact: "Vở diễn 'Làng Tôi' từng đi lưu diễn liên tục hàng trăm buổi tại các nhà hát kịch nghệ và opera danh giá khắp Châu Âu và Châu Á.",
    triviaFactEn: "'My Village' toured hundreds of continuous dates across prestigious theaters and opera houses throughout Europe and Asia.",
    image: langToiShowTungHungImg,
    imageAlt: "Nghệ sĩ tung hứng thúng tre và nhào lộn trên giàn tre trong vở xiếc Làng Tôi",
    imageCaption: "Vở xiếc 'Làng Tôi' • Đỉnh cao xiếc tre đương đại đậm hồn quê Bắc Bộ",
    imageCaptionEn: "My Village (Làng Tôi) • Pinnacle of Vietnamese contemporary bamboo circus",
    sourceUrl: "https://www.kkday.com/vi/blog/54942/lang-toi-show-dam-minh-vao-tinh-hoa-lang-que-bac-bo/?srsltid=AU7gw4UfsDwTzb_8FeL41w-Sp0JqpsL-OQOB8NptK5x-VHqLrKEvJRGl",
    sourceTitle: "KKday: Làng Tôi Show",
    gallery: [
      {
        src: langToiShowTungHungImg,
        alt: "Nghệ sĩ tung hứng thúng tre nhịp nhàng trên giàn tre dựng đứng trong vở Làng Tôi",
        caption: "Nghệ sĩ tung hứng thúng tre và bay lượn trên giàn tre – Bức tranh mùa gặt rộn ràng",
        captionEn: "Artistic juggling of woven bamboo coracles amid towering bamboo scaffoldings",
        sourceUrl: "https://www.kkday.com/vi/blog/54942/lang-toi-show-dam-minh-vao-tinh-hoa-lang-que-bac-bo/?srsltid=AU7gw4UfsDwTzb_8FeL41w-Sp0JqpsL-OQOB8NptK5x-VHqLrKEvJRGl",
        sourceTitle: "KKday: Làng Tôi Show"
      },
      {
        src: langToiShowUonDeoImg,
        alt: "Động tác uốn dẻo thăng bằng ngoạn mục trên thân tre uốn cong của các nghệ sĩ Làng Tôi",
        caption: "Màn uốn dẻo thăng bằng thót tim trên thân tre giữa không trung đầy chất thơ",
        captionEn: "Breathtaking contortion balance across curved bamboo poles suspended in air",
        sourceUrl: "https://www.kkday.com/vi/blog/54942/lang-toi-show-dam-minh-vao-tinh-hoa-lang-que-bac-bo/?srsltid=AU7gw4UfsDwTzb_8FeL41w-Sp0JqpsL-OQOB8NptK5x-VHqLrKEvJRGl",
        sourceTitle: "KKday: Làng Tôi Show"
      }
    ],
    interestingFacts: [
      "Ngôn ngữ sân khấu 'Xiếc Tre' độc nhất vô nhị: Toàn bộ cấu trúc sân khấu, từ cầu tre, mái nhà, dòng sông cho đến giàn giáo nhào lộn đều được tạo dựng linh hoạt từ những thân tre tầm vông mộc mạc, không dùng đinh ốc hay khung sắt hiện đại.",
      "Âm nhạc sống truyền thống từ hơn 20 loại nhạc cụ dân tộc: Các nghệ sĩ vừa diễn xiếc vừa được đệm nhạc trực tiếp bởi dàn nhạc dân tộc với đàn bầu, đàn tranh, sáo trúc, cồng chiêng, trống da trâu và tiếng hát ru Bắc Bộ mộc mạc.",
      "Lưu diễn quốc tế chinh phục hơn 300 suất diễn tại Châu Âu: Từ năm 2009 - 2012, 'Làng Tôi' đã lưu diễn qua Pháp, Hà Lan, Bỉ, Tây Ban Nha, Đức, Hy Lạp... nhận được những tràng pháo tay tán thưởng kéo dài hàng chục phút từ khán giả quốc tế.",
      "Tái hiện sinh động nếp sống làng quê Việt: Vở diễn đưa khán giả qua từng cung bậc cảm xúc của ngày hội làng, tình yêu đôi lứa bên lũy tre xanh, mùa gặt bận rộn và tiếng ve kêu râm ran ngày hè.",
      "Được dàn dựng bởi các đạo diễn tài hoa: Tác phẩm do bộ ba đạo diễn Nhất Lý, Tuấn Lê, Nguyễn Lân sáng tạo cùng nghệ sĩ xiếc Nguyễn Nhật Lý, định hình dòng 'Xiếc kể chuyện' (Cirque Nouveau) đỉnh cao của Việt Nam."
    ],
    interestingFactsEn: [
      "Pioneering 'Bamboo Circus' theatrical vocabulary: The entire dynamic set - bridges, riverbanks, village roofs, and high-wire apparatus - is organically built using raw bamboo stalks without nails or metal bolts.",
      "Live authentic acoustic score with 20+ ethnic instruments: Accompanied live on stage by master musicians playing Dan Bau (monochord), Dan Tranh (zither), bamboo flutes, gongs, and folk lullabies.",
      "International triumph with 300+ shows across Europe: From 2009 to 2012, 'My Village' toured France, the Netherlands, Belgium, Spain, Germany, and Greece, receiving standing ovations at prestigious opera houses.",
      "Vivid narrative of traditional Vietnamese village life: Effortlessly guides spectators through village festivities, pastoral romance beside bamboo groves, bustling harvests, and twilight tranquility.",
      "Visionary creative team: Conceived and directed by Tuấn Lê, Nhất Lý, Nguyễn Lân, and circus artist Nhật Lý, establishing a world-class benchmark for contemporary Vietnamese storytelling circus."
    ]
  },
  {
    id: 18,
    question: "Trong từ vựng ngành xiếc, thuật ngữ 'Big Top' dùng để chỉ điều gì?",
    questionEn: "In traditional circus terminology, what does the term 'Big Top' refer to?",
    options: [
      "Tiết mục biểu diễn ở độ cao lớn nhất",
      "Lều bạt khổng lồ dựng di động làm nhà thi đấu/sàn diễn",
      "Diễn viên chính đảm nhận tiết mục kết màn",
      "Chiếc gậy giữ thăng bằng của diễn viên đi trên dây"
    ],
    optionsEn: [
      "The stunt performed at the highest altitude",
      "The colossal portable canvas tent serving as the circus arena",
      "The principal star artist performing the grand finale",
      "The balancing pole used by tightrope walkers"
    ],
    correctIndex: 1,
    explanation: "'Big Top' là từ lóng tiếng Anh chỉ chiếc lều bạt màu sắc khổng lồ được các gánh xiếc dựng lên mỗi khi di chuyển đến một thành phố mới để biểu diễn.",
    explanationEn: "'Big Top' is the classic English term for the colossal, colorful traveling tent erected as an auditorium and arena for a touring circus.",
    image: rapBatBigTopLuuDongImg,
    imageAlt: "Rạp lều bạt Big Top sọc đỏ trắng truyền thống",
    imageCaption: "Rạp lều bạt 'Big Top' sọc đỏ trắng lưu động – Biểu tượng bất hủ của các gánh xiếc trên toàn thế giới",
    imageCaptionEn: "The classic red-and-white striped 'Big Top' touring tent – An immortal symbol of nomadic circus culture worldwide",
    triviaFact: "Lều Big Top lớn nhất lịch sử từng che phủ diện tích hơn 9.000 mét vuông với sức chứa lên tới 10.000 khán giả.",
    triviaFactEn: "Historically, the largest circus Big Top tents covered over 9,000 square meters and accommodated up to 10,000 spectators.",
    interestingFacts: [
      "Biểu tượng mái vòm di động: Khái niệm rạp bạt lưu động 'Big Top' ra đời vào đầu thế kỷ 19 tại Mỹ (bởi Joshua Purdy Brown), giải phóng các đoàn xiếc khỏi các nhà hát cố định để đem niềm vui đi khắp muôn nơi.",
      "Kỳ quan dựng rạp thần tốc: Các đoàn xiếc lớn thời kỳ hoàng kim có thể hạ trại, kéo căng hàng nghìn mét vuông bạt bạt và cột trụ khổng lồ chỉ trong vài giờ ngắn ngủi, rồi tháo dỡ trong đêm để lên chuyến tàu tiếp theo.",
      "Màu sắc kinh điển đỏ - trắng hoặc xanh - vàng: Họa tiết sọc rực rỡ từ xa đã báo hiệu ngày hội xiếc náo nhiệt sắp bắt đầu, trở thành ký ức tuổi thơ của nhiều thế hệ khán giả toàn cầu.",
      "Kiến trúc âm thanh và ánh sáng vòm tròn: Kết cấu mái chóp nón giúp hội tụ âm thanh tiếng trống, tiếng kèn và tạo độ cao lý tưởng (12 - 15m) cho các tiết mục đu bay và nhào lộn trên không."
    ],
    interestingFactsEn: [
      "Nomadic Big Top dome icon: The portable canvas tent concept emerged in early 19th-century America (pioneered by Joshua Purdy Brown), liberating troupes from fixed theaters to tour the globe.",
      "Lightning-fast setup marvel: Golden-age circus crews could erect giant poles and raise thousands of square meters of heavy canvas in mere hours, then pack down overnight to board the next train.",
      "Classic red-and-white or yellow-blue stripes: The vibrant candy-striped canopy served as an unmistakable beacon visible from miles away, signaling the arrival of a wondrous carnival.",
      "Conical acoustics & aerial height: The high conical vaulted ceiling amplified brass fanfare and circus drums while providing crucial 12-15 meter clearance for trapeze flyers and aerialists."
    ]
  },
  {
    id: 19,
    question: "Ai được lịch sử ghi nhận là 'Cha đẻ của xiếc hiện đại' nhờ việc kết hợp kỹ thuật nhào lộn, hề, âm nhạc và tạo ra sàn diễn hình tròn đầu tiên vào thế kỷ 18?",
    questionEn: "Who is historically recognized as the 'Father of Modern Circus' for combining acrobatics, clowns, music, and creating the first circular ring in the 18th century?",
    options: [
      "Phineas Taylor Barnum",
      "Philip Astley",
      "Jules Léotard",
      "Guy Laliberté"
    ],
    optionsEn: [
      "Phineas Taylor Barnum",
      "Philip Astley",
      "Jules Léotard",
      "Guy Laliberté"
    ],
    correctIndex: 1,
    explanation: "Philip Astley (1742–1814) là một kỵ sĩ tài ba và cựu sĩ quan kỵ binh người Anh, được suy tôn là 'Cha đẻ của ngành Xiếc hiện đại'. Năm 1768, ông thành lập trường cưỡi ngựa tại London và phát hiện rằng khi cho ngựa phi theo đường tròn, lực ly tâm sẽ hỗ trợ giữ thăng bằng hoàn hảo trên lưng ngựa. Ông đã kết hợp biểu diễn cưỡi ngựa với các tiết mục hề, nhào lộn, uốn dẻo và dàn nhạc kèn đồng, khai sinh ra mô hình rạp xiếc tròn chuẩn mực cho toàn thế giới.",
    explanationEn: "Philip Astley (1742–1814), a decorated British cavalry officer and equestrian master, is celebrated as the 'Father of Modern Circus'. In 1768, he created a riding ring in London and discovered that circular motion generated centrifugal force enabling riders to maintain balance. By combining trick horse riding with acrobats, clowns, contortionists, and live brass music, he established the archetype of modern circus.",
    triviaFact: "Đường kính 13 mét (42 feet) của vòng tròn sân khấu do Philip Astley tính toán năm 1768 vẫn là quy chuẩn quốc tế bất biến của mọi rạp xiếc khắp năm châu ngày nay.",
    triviaFactEn: "The 13-meter (42-foot) circular ring diameter engineered by Philip Astley in 1768 remains the universal international standard of all circus arenas worldwide today.",
    image: philipAstleySketchImg,
    imageAlt: "Tranh khắc họa chân dung Philip Astley - Cha đẻ của xiếc hiện đại",
    imageCaption: "Bản vẽ khắc chân dung Philip Astley (1742–1814) • Cha đẻ của ngành Xiếc hiện đại",
    imageCaptionEn: "Historical etching portrait of Philip Astley (1742–1814) • Father of Modern Circus",
    sourceUrl: "https://vi.wikipedia.org/wiki/Philip_Astley",
    sourceTitle: "Wikipedia: Philip Astley",
    interestingFacts: [
      "Lý giải về bức vẽ minh họa: Philip Astley qua đời năm 1814 – trước khi công nghệ nhiếp ảnh bằng máy ảnh được phát minh (khoảng năm 1826 - 1839). Vì vậy, hậu thế không có bất kỳ bức ảnh chụp thật nào bằng máy ảnh của ông; mọi hình ảnh lưu truyền về chân dung ông cho tới nay đều là các bức tranh vẽ khắc gỗ và bản in thủ công thời bấy giờ.",
      "Phát minh vĩ đại về sàn diễn tròn 13 mét: Ông là người đầu tiên chứng minh bằng thực nghiệm rằng đường kính tròn 42 feet (khoảng 13 mét) là kích thước lý tưởng nhất để lực ly tâm giữ cho người cưỡi đứng thăng bằng vững vàng trên lưng ngựa khi chạy nước đại.",
      "Người đầu tiên mang 'chú hề' vào xiếc: Để giúp khán giả thư giãn giữa các màn nhào lộn kỵ mã căng thẳng, Astley đã mời các nghệ sĩ hề (clown) và người chơi đàn biểu diễn xen kẽ, sáng tạo nên cấu trúc tiết mục kinh điển của rạp xiếc.",
      "Nhà hát xiếc đầu tiên 'Astley's Amphitheatre': Ông dựng nên rạp xiếc cố định đầu tiên tại London bên bờ sông Thames, sau đó mang mô hình này sang Paris (Pháp) và được vua Louis XV hết sức tán thưởng.",
      "Di sản trường tồn hơn 250 năm: Từ phát kiến của Philip Astley năm 1768, nghệ thuật xiếc đã phát triển rực rỡ và lan tỏa thành loại hình giải trí đại chúng được yêu thích bậc nhất trên toàn cầu."
    ],
    interestingFactsEn: [
      "Historical note on his portrait: Philip Astley passed away in 1814 - before the invention of camera photography (circa 1826–1839). Consequently, no actual photographic portraits exist; all historical representations of him are contemporary copper etchings and woodcuts.",
      "The ingenious 13-meter circular ring: He proved empirically that a 42-foot (13-meter) circular ring generates optimal centrifugal force to sustain a rider standing erect upon a cantering horse.",
      "First to integrate clowns and music into the ring: To provide comic relief between high-intensity equestrian stunts, Astley introduced clowns, jugglers, and live musicians, establishing the foundational circus format.",
      "The first amphitheater - Astley's Amphitheatre: Erected the world's first permanent circus amphitheater near Westminster Bridge in London, later touring Paris with high acclaim from King Louis XV.",
      "A 250+ year enduring legacy: Beginning in 1768, Astley's invention blossomed into one of the most beloved and universal performing arts in human history."
    ]
  },
  {
    id: 20,
    question: "Trong xiếc đương đại, nghệ sĩ thường được xem là gì ngoài một người biểu diễn kỹ thuật?",
    questionEn: "In contemporary circus, what are performers considered in addition to technical acrobats?",
    options: [
      "Vũ công",
      "Diễn viên",
      "Người kể chuyện/người sáng tạo",
      "Tất cả các đáp án trên"
    ],
    optionsEn: [
      "Dancers",
      "Actors",
      "Storytellers / Creators",
      "All of the above"
    ],
    correctIndex: 3,
    explanation: "Trong xiếc đương đại, nghệ sĩ không chỉ phô diễn kỹ năng nhào lộn cơ học mà còn kết hợp diễn xuất sân khấu, ngôn ngữ múa hình thể và kể những câu chuyện nhân văn sâu sắc bằng cả tâm hồn.",
    explanationEn: "In contemporary circus, artists transcend raw mechanical acrobatics to act as dramatic actors, fluid physical dancers, and creative narrative storytellers.",
    triviaFact: "Nhiều diễn viên xiếc đương đại phải trải qua các khóa đào tạo kịch nghệ và múa đương đại song song với rèn luyện thể lực khắc nghiệt.",
    triviaFactEn: "Contemporary circus performers undergo intensive training across classical drama and modern choreography alongside athletic conditioning."
  }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const CircusQuiz: React.FC<CircusQuizProps> = ({
  onBack,
  onUnlockBadge,
}) => {
  const { isEn } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffleArray(QUIZ_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      circusAudio.playMagicChime();
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } else {
      circusAudio.playBambooStep();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    circusAudio.playBambooStep();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (typeof document !== 'undefined') {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Completed quiz (20 questions)
      setIsCompleted(true);
      circusAudio.playFanfare();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 }
      });

      // User instruction: "If you complete 20 quizzes, you will receive a badge."
      onUnlockBadge('circus-quiz-master');
    }
  };

  const handleRestartQuiz = () => {
    circusAudio.playBambooStep();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (typeof document !== 'undefined') {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
    setQuestions(shuffleArray(QUIZ_QUESTIONS));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  const handleShuffleQuiz = () => {
    circusAudio.playBambooStep();
    setQuestions(shuffleArray(QUIZ_QUESTIONS));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 select-none">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 bg-white shadow-xs cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>{isEn ? "Back to Main Stage" : "Về Sân Khấu Chính"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffleQuiz}
            className="flex items-center gap-1.5 bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs cursor-pointer"
            title={isEn ? "Shuffle questions order (20 questions)" : "Xáo trộn thứ tự 20 câu hỏi"}
          >
            <Shuffle className="size-3.5 text-amber-700" />
            <span>{isEn ? "Shuffle (20 Questions)" : "Trộn 20 Câu Hỏi"}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-300 animate-pulse">
              <Flame className="size-3.5 text-red-600 fill-red-600" />
              <span>{isEn ? `Streak x${streak}!` : `Chuỗi đúng x${streak}!`}</span>
            </div>
          )}

          <div className="text-xs font-black bg-red-700 text-yellow-300 px-3.5 py-1.5 rounded-full border-2 border-amber-300 shadow-xs">
            {isEn ? `Score: ${score}` : `Điểm: ${score}`}
          </div>
        </div>
      </div>

      {/* Featured Cover Banner / Ảnh bìa Quiz Kiến Thức */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-xl shrink-0 group select-none">
        <img
          src={quizCoverImg}
          alt="Quiz Kiến Thức Xiếc Việt Nam"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="absolute bottom-4 left-5 sm:left-7 right-5 sm:right-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/80 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-emerald-400/50 shadow-xs">
              <Sparkles className="size-3 text-amber-300" />
              <span>{isEn ? "Cover Photo • Knowledge Quiz" : "Ảnh Bìa • Quiz Kiến Thức"}</span>
            </span>
            <h2 className="font-circus text-xl sm:text-3xl text-amber-300 drop-shadow-md leading-tight">
              {isEn ? "VIETNAMESE CIRCUS KNOWLEDGE CHALLENGE" : "THỬ TÀI KIẾN THỨC XIẾC VIỆT NAM"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 drop-shadow-sm font-light">
              {isEn
                ? "Explore 20 fascinating trivia questions about circus history, legendary masters, and contemporary spectacles."
                : "Khám phá 20 câu hỏi thử tài lý thú về lịch sử trăm năm, các nghệ nhân huyền thoại và những vở đại vũ kịch xiếc đương đại rực rỡ."}
            </p>
          </div>
          <div className="text-xs text-emerald-200/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/40 flex items-center gap-2 shrink-0">
            <Award className="size-3.5 text-amber-400" />
            <span>{isEn ? "20 Questions • Receive Badge" : "20 Câu Hỏi • Nhận Huy Hiệu"}</span>
          </div>
        </div>

        {/* Source link cited in a neat corner */}
        <a
          href="https://bazaarvietnam.vn/vung-dat-ky-bi-vo-xiec-viral-dau-nam-2025-thay-doi-nhan-dinh-nao-cua-khan-gia-ve-xiec-viet/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            circusAudio.playBambooStep();
          }}
          className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 text-[10px] text-amber-200/90 hover:text-white bg-black/75 hover:bg-black/90 px-2.5 py-1 rounded-full border border-white/20 transition-all backdrop-blur-xs shadow-md"
          title={isEn ? "Source: Harper's Bazaar Vietnam" : "Nguồn ảnh: Bazaar Vietnam"}
        >
          <span>{isEn ? "Source: Bazaar Vietnam" : "Nguồn: Bazaar Vietnam"}</span>
          <ExternalLink className="size-2.5 text-amber-300" />
        </a>
      </div>

      {!isCompleted ? (
        /* Active Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-xl space-y-6">
          {/* Progress and Question Number */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
              <Brain className="size-4 text-amber-600" />
              <span>
                {isEn
                  ? `Question ${currentIndex + 1} of ${questions.length}`
                  : `Câu hỏi số ${currentIndex + 1} / ${questions.length}`}
              </span>
            </span>

            {/* Progress bar */}
            <div className="w-32 sm:w-48 bg-neutral-100 rounded-full h-2.5 overflow-hidden border border-neutral-200">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="font-circus text-lg sm:text-2xl text-neutral-900 leading-snug">
              {isEn ? (currentQ.questionEn || currentQ.question) : currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(isEn && currentQ.optionsEn ? currentQ.optionsEn : currentQ.options).map((opt, idx) => {
              const isChosen = selectedAnswer === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;
              
              let btnStyle = "bg-amber-50/70 hover:bg-amber-100/80 border-amber-200 text-neutral-800";
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-sm";
                } else if (isChosen) {
                  btnStyle = "bg-red-100 border-red-500 text-red-950 font-medium";
                } else {
                  btnStyle = "bg-neutral-50 border-neutral-200 text-neutral-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="size-6 rounded-full bg-amber-200 text-amber-950 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-semibold leading-relaxed flex-1">
                    {opt}
                  </span>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isChosen && !isCorrectOpt && (
                    <XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation & Fun Fact Banner */}
          {isAnswered && (
            <div className="bg-amber-50/95 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                    selectedAnswer === currentQ.correctIndex
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-red-600 text-white shadow-xs'
                  }`}>
                    {selectedAnswer === currentQ.correctIndex 
                      ? (isEn ? "Correct! +10 Points" : "Chính Xác! +10 Điểm") 
                      : (isEn ? "Not quite!" : "Chưa Đúng Rồi!")}
                  </span>
                  <span className="text-xs text-neutral-800 font-bold">
                    {isEn ? "Detailed Explanation:" : "Lời giải thích chi tiết:"}
                  </span>
                </div>

                {currentQ.sourceUrl && (
                  <a
                    href={currentQ.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-800 hover:text-white bg-red-100 hover:bg-red-700 px-3 py-1 rounded-full border border-red-300 transition-all shadow-2xs group cursor-pointer"
                    title={currentQ.sourceTitle || (isEn ? "Read source article" : "Xem nguồn bài viết")}
                  >
                    <span>{currentQ.sourceTitle ? `${isEn ? 'Source: ' : 'Nguồn: '}${currentQ.sourceTitle}` : (isEn ? "Source: Wikipedia" : "Nguồn: Wikipedia")}</span>
                    <ExternalLink className="size-3 text-red-600 group-hover:text-white transition-colors" />
                  </a>
                )}
              </div>

              {/* Illustration Images & Explanation */}
              {currentQ.gallery && currentQ.gallery.length > 0 ? (
                <div className="space-y-3">
                  <div className={`grid grid-cols-1 ${currentQ.gallery.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'} gap-3.5`}>
                    {currentQ.gallery.map((imgItem, gIdx) => (
                      <div 
                        key={gIdx}
                        className="flex flex-col bg-white/95 rounded-xl border border-amber-300/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="relative aspect-4/3 w-full overflow-hidden bg-amber-950/15">
                          <img
                            src={imgItem.src}
                            alt={imgItem.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-amber-50/60 to-amber-100/40">
                          <p className="text-[11px] font-semibold text-neutral-800 leading-snug mb-2">
                            {isEn ? (imgItem.captionEn || imgItem.caption) : imgItem.caption}
                          </p>
                          {imgItem.sourceUrl && (
                            <a
                              href={imgItem.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-900 underline underline-offset-2 self-start mt-auto"
                            >
                              <span>{isEn ? `Source: ${imgItem.sourceTitle || 'Link'}` : `Nguồn: ${imgItem.sourceTitle || 'Link'}`}</span>
                              <ExternalLink className="size-3 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/90 p-3.5 sm:p-4 rounded-xl border border-amber-300/80 shadow-xs">
                    <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                      {isEn ? (currentQ.explanationEn || currentQ.explanation) : currentQ.explanation}
                    </p>
                  </div>
                </div>
              ) : currentQ.image ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-white/90 p-3.5 sm:p-4 rounded-xl border border-amber-300/80 shadow-xs">
                  <div className="shrink-0 w-32 sm:w-36 overflow-hidden rounded-xl border-2 border-amber-400 shadow-md bg-amber-950/10 group">
                    <img
                      src={currentQ.image}
                      alt={currentQ.imageAlt || currentQ.question}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {(currentQ.imageCaption || currentQ.imageCaptionEn) && (
                      <div className="p-1.5 bg-[#2b0808] text-[10px] text-amber-200 text-center font-medium leading-tight">
                        {isEn ? (currentQ.imageCaptionEn || currentQ.imageCaption) : currentQ.imageCaption}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                      {isEn ? (currentQ.explanationEn || currentQ.explanation) : currentQ.explanation}
                    </p>
                    {currentQ.sourceUrl && (
                      <div className="pt-1">
                        <a
                          href={currentQ.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 font-semibold underline underline-offset-2"
                        >
                          <span>{currentQ.sourceTitle ? (isEn ? `Source: ${currentQ.sourceTitle}` : `Nguồn: ${currentQ.sourceTitle}`) : (isEn ? "Source: Reference" : "Nguồn bài viết")}</span>
                          <ExternalLink className="size-3 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                  {isEn ? (currentQ.explanationEn || currentQ.explanation) : currentQ.explanation}
                </p>
              )}

              {/* Interesting Facts Highlights */}
              {currentQ.interestingFacts && currentQ.interestingFacts.length > 0 && (
                <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-3.5 sm:p-4 space-y-2.5">
                  <h5 className="font-circus text-xs text-red-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="size-3.5 text-amber-600" />
                    <span>
                      {currentQ.id === 1 
                        ? (isEn ? "Fascinating Historical Highlights about Master Ta Duy Hien:" : "Thông tin thú vị về Cụ Tạ Duy Hiển:")
                        : currentQ.id === 2
                        ? (isEn ? "The Soul of Vietnamese Bamboo Circus:" : "Hồn cốt Xiếc Tre & Đạo cụ Tre Đan Việt Nam:")
                        : currentQ.id === 3
                        ? (isEn ? "The Heritage of Coastal Bamboo Stilt-Walking:" : "Nghệ thuật xiếc dân gian đi cà kheo miền duyên hải:")
                        : currentQ.id === 4
                        ? (isEn ? "Guinness World Records & Resilience of Quoc Co - Quoc Nghiep:" : "Kỷ lục Guinness Thế giới & Bản lĩnh Quốc Cơ - Quốc Nghiệp:")
                        : currentQ.id === 6
                        ? (isEn ? "Highlights of Thong Nhat Park & National Circus Theater:" : "Thông tin thú vị về Công viên Thống Nhất & Rạp Xiếc:")
                        : currentQ.id === 7
                        ? (isEn ? "The Legendary Journey of People's Artist Tam Chinh:" : "Huyền thoại cuộc đời NSND Tâm Chính:")
                        : currentQ.id === 8
                        ? (isEn ? "The Art of Dove Illusions in Circus Magic:" : "Nghệ thuật ảo thuật biến hóa chim bồ câu:")
                        : currentQ.id === 14
                        ? (isEn ? "Highlights & Resilience of Quoc Co - Quoc Nghiep:" : "Thông tin thú vị về Quốc Cơ - Quốc Nghiệp:")
                        : currentQ.id === 15
                        ? (isEn ? "The Artistry & Dedication of People's Artist Tong Toan Thang:" : "Nghệ thuật & Cống hiến của NSND Tống Toàn Thắng:")
                        : currentQ.id === 16
                        ? (isEn ? "Fascinating Facts about Cirque du Soleil:" : "Thông tin thú vị về Cirque du Soleil:")
                        : currentQ.id === 17
                        ? (isEn ? "Fascinating Highlights of 'My Village' (Làng Tôi):" : "Thông tin thú vị về vở xiếc 'Làng Tôi':")
                        : currentQ.id === 18
                        ? (isEn ? "Fascinating Lore of Circus 'Big Top' Tents:" : "Chuyện thú vị về Rạp Lều Bạt 'Big Top' Lưu Động:")
                        : currentQ.id === 19
                        ? (isEn ? "Historical Facts about Philip Astley & the Birth of Modern Circus:" : "Thông tin lịch sử về Philip Astley & Nguồn gốc Xiếc hiện đại:")
                        : (isEn ? "Fascinating Highlights:" : "Thông tin thú vị thêm:")}
                    </span>
                  </h5>
                  <ul className="space-y-2 text-xs text-neutral-800">
                    {(isEn && currentQ.interestingFactsEn ? currentQ.interestingFactsEn : currentQ.interestingFacts).map((fact, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-red-600 font-bold text-xs shrink-0 mt-0.5">★</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs text-amber-900 bg-amber-200/60 p-2.5 rounded-xl border border-amber-300/80 flex items-start gap-2">
                <Sparkles className="size-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>{isEn ? "Fun Trivia:" : "Góc thú vị:"}</strong> {isEn ? (currentQ.triviaFactEn || currentQ.triviaFact) : currentQ.triviaFact}
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="carnival"
                  size="sm"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {currentIndex < QUIZ_QUESTIONS.length - 1 
                      ? (isEn ? "Next Question" : "Câu Tiếp Theo") 
                      : (isEn ? "See Results" : "Xem Kết Quả")}
                  </span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Victory Screen */
        <div className="bg-white rounded-3xl p-8 border-4 border-amber-400 shadow-2xl text-center space-y-6">
          <div className="size-20 rounded-full bg-amber-400 border-4 border-amber-300 text-4xl flex items-center justify-center mx-auto shadow-md animate-bounce">
            🎪
          </div>

          <div className="space-y-2">
            <h3 className="font-circus text-2xl sm:text-3xl text-neutral-900">
              {isEn ? "KNOWLEDGE CHALLENGE COMPLETE!" : "HOÀN THÀNH THỬ THÁCH KIẾN THỨC!"}
            </h3>
            <p className="text-neutral-600 text-sm">
              {isEn
                ? "You demonstrated wonderful understanding of Vietnamese and global circus art"
                : "Bạn đã thể hiện sự am hiểu tuyệt vời về nghệ thuật xiếc Việt Nam và thế giới"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-2">
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <span className="text-xs text-neutral-500 font-medium">{isEn ? "Total Score" : "Tổng điểm"}</span>
              <p className="font-circus text-2xl text-red-700">{score} / {questions.length * 10}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <span className="text-xs text-neutral-500 font-medium">{isEn ? "Accuracy" : "Tỷ lệ đúng"}</span>
              <p className="font-circus text-2xl text-emerald-700">
                {Math.round((score / (questions.length * 10)) * 100)}%
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <span className="text-xs text-neutral-500 font-medium">{isEn ? "Your Title" : "Danh hiệu của bạn"}</span>
              <p className="font-bold text-sm text-amber-900 mt-1">
                {score >= 160
                  ? (isEn ? <>Grandmaster <Icon name="bi bi-trophy" /></> : <>Xuất Sắc <Icon name="bi bi-trophy" /></>)
                  : score >= 120
                  ? (isEn ? <>Expert <Icon name="bi bi-star-fill" /></> : <>Khá Giỏi <Icon name="bi bi-star-fill" /></>)
                  : (isEn ? "Apprentice 🎪" : "Tập Sự 🎪")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-900 bg-amber-100/90 py-2.5 px-4 rounded-2xl border-2 border-amber-300 max-w-md mx-auto shadow-xs">
            <Award className="size-5 text-amber-600" />
            <span>
              {isEn 
                ? "🎖️ Badge Unlocked: Circus Quiz Master (Completed 20 Questions)!" 
                : "🎖️ Đã nhận huy hiệu: Bậc Thầy Kiến Thức Xiếc (Hoàn thành 20 câu hỏi)!"}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestartQuiz}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>{isEn ? "Retake Quiz" : "Làm Lại Quiz"}</span>
            </Button>

            <Button
              variant="carnival"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isEn ? "Back to Main Stage" : "Về Sân Khấu Chính"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

