import React, { useState, useEffect, useCallback } from "react";
import { HistoryEra } from "@/src/types";
import { circusAudio } from "@/src/utils/audio";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/context/LanguageContext";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Compass
} from "lucide-react";
import { HistoryHome } from "@/src/components/history/HistoryHome";
import { MilestonePage } from "@/src/components/history/MilestonePage";

interface CircusHistoryProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const HISTORY_ERAS: HistoryEra[] = [
  {
    id: "ancient-circus",
    sectionNumber: "1",
    era: "Nguồn gốc Xiếc thời Cổ đại (2000 TCN – TK 6 TCN – Thời Trung Cổ)",
    eraEn: "Origin of Circus (Ancient Times: 2000 BC – 6th C. BC – Middle Ages)",
    period: "2000 TCN - TK 6 TCN - Trung Cổ",
    periodEn: "2000 BC - 6th C. BC - Middle Ages",
    title: "Nguồn gốc Xiếc thời Cổ đại (2000 TCN – TK 6 TCN – Thời Trung Cổ)",
    titleEn: "Origin of Circus (Ancient Times: 2000 BC – 6th C. BC – Middle Ages)",
    summary: "Từ \"Circus\" trong tiếng Latinh nghĩa là \"vòng tròn\" bắt nguồn từ đấu trường Circus Maximus tại La Mã Cổ đại (Thế kỷ 6 TCN). Song song đó, các kỹ thuật tạp kỹ đỉnh cao đã được ghi nhận trên tranh tường lăng mộ Ai Cập (2000 TCN) và nghệ thuật \"Bách Hý\" (trăm trò) rực rỡ thời Hán (Trung Quốc, TK 2 TCN). Sau khi La Mã sụp đổ, các nghệ sĩ hợp thành gánh hát rong lưu động biểu diễn tại hội chợ Trung Cổ châu Âu. Toàn bộ trò diễn cổ đại này chính là nguồn chất liệu kỹ thuật đắt giá để Philip Astley tổng hợp thành mô hình Rạp Xiếc Cổ điển vào năm 1768 tại Anh.",
    summaryEn: "The word \"Circus\" stems from the Latin word for \"circle\" at the Circus Maximus arena in Ancient Rome (6th Century BC). Concurrently, master acrobatic feats were depicted in Ancient Egyptian tomb frescoes (2000 BC) and the dazzling \"Hundred Games\" (Bách Hý) flourished during the Han Dynasty (China, 2nd Century BC). Following Rome's fall, medieval wandering troupes performed at European folk fairs. These ancient disciplines provided the vital technical foundation for Philip Astley to synthesize the Classical Circus in 1768 in England.",
    highlights: [
      "Khởi nguồn tên gọi từ La Mã Cổ đại (Thế kỷ 6 TCN): Từ \"Circus\" trong tiếng Latinh nghĩa là \"vòng tròn\". Người La Mã đã xây dựng đấu trường Circus Maximus để tổ chức đua xe ngựa, chọi thú và thi đấu thể thao.",
      "Kỹ thuật tạp kỹ tại Ai Cập Cổ đại (2000 TCN): Bức họa lăng mộ cổ đã ghi lại các động tác nhào lộn, uốn dẻo và kỹ thuật tung hứng nhiều quả bóng điêu luyện.",
      "Kỹ thuật Bách Hý tại Trung Quốc Cổ đại (Thế kỷ 2 TCN - Thời Hán): Phát triển loại hình \"Bách Hý\" (trăm trò) phong phú gồm uốn dẻo, đi dây, đu bay, nuốt kiếm và múa đĩa.",
      "Châu Âu thời Trung Cổ: Sau khi La Mã sụp đổ, các nghệ sĩ hợp thành gánh hát rong lưu động, biểu diễn tung hứng, phun lửa và xiếc thú nhỏ tại các hội chợ dân gian.",
      "Đúc kết lịch sử: Trò diễn cổ đại sau này chính là nguồn chất liệu kỹ thuật then chốt để Philip Astley tổng hợp thành mô hình Rạp Xiếc Cổ điển vào năm 1768 tại Anh."
    ],
    highlightsEn: [
      "Etymological origin in Ancient Rome (6th Century BC): \"Circus\" in Latin means \"circle\". The Romans erected the monumental Circus Maximus for chariot races, wild animal events, and athletic games.",
      "Acrobatic prowess in Ancient Egypt (2000 BC): Ancient tomb murals documented intricate acrobatics, physical contortion, and juggling dexterity.",
      "Chinese \"Hundred Games\" (2nd Century BC - Han Dynasty): Flourished with diverse disciplines including contortion, tightrope walking, flying trapeze, sword swallowing, and plate spinning.",
      "Medieval Europe: Following Rome's collapse, performers formed itinerant troupes, entertaining folk fairs with juggling, fire-breathing, and small animal acts.",
      "Historical synthesis: Ancient folk spectacles directly furnished the technical disciplines Philip Astley combined into the Classical Circus model in 1768."
    ],
    keyFigures: [
      "Đấu trường Circus Maximus (La Mã Cổ Đại)",
      "Nghệ nhân tạp kỹ Ai Cập (2000 TCN)",
      "Phường trò Bách Hý thời Hán (Trung Quốc)",
      "Gánh hát rong Trung Cổ châu Âu"
    ],
    keyFiguresEn: [
      "Circus Maximus Arena (Ancient Rome)",
      "Ancient Egyptian Acrobats (2000 BC)",
      "Han Dynasty \"Hundred Games\" Artisans",
      "Medieval European Wandering Troupes"
    ],
    quote: "Trò diễn cổ đại sau này chính là nguồn chất liệu kỹ thuật để Philip Astley tổng hợp thành mô hình Rạp Xiếc Cổ điển vào năm 1768 tại Anh.",
    quoteEn: "Ancient spectacles provided the vital technical repertoire for Philip Astley to synthesize into the Classical Circus model in 1768 in England.",
    imageIcon: "🏛️"
  },
  {
    id: "classical-circus",
    sectionNumber: "2",
    era: "Nguồn gốc Xiếc Cổ điển (Thế kỷ XVIII – 1768)",
    eraEn: "Classical Circus (18th Century – 1768)",
    period: "Thế kỷ XVIII (1768)",
    periodEn: "18th Century (1768)",
    title: "Nguồn gốc Xiếc Cổ điển (Thế kỷ XVIII – 1768)",
    titleEn: "Classical Circus (18th Century – 1768)",
    summary: "Đến thế kỷ XVIII, tại châu Âu, xiếc bắt đầu bước sang một giai đoạn mới. Philip Astley - một kỵ sĩ người Anh, được xem là người đặt nền móng cho xiếc cổ điển (Modern Circus). Năm 1768, ông bắt đầu biểu diễn tại London với những màn cưỡi ngựa đầy kỹ thuật trong một vòng diễn hình tròn đường kính 13 mét (trở thành tiêu chuẩn cho xiếc truyền thống đến tận ngày nay). Sau đó, Astley đưa thêm các tiết mục như nhào lộn, tung hứng, đi dây và hài kịch vào chương trình, dần tạo nên một hình thức biểu diễn tổng hợp rất gần với xiếc mà chúng ta biết ngày nay.",
    summaryEn: "In 18th-century Europe, circus entered a revolutionary chapter. Philip Astley, an English equestrian officer, is recognized as the father of classical (modern) circus. In 1768 London, he introduced master horsemanship within an open 13-meter diameter ring—a dimension that established the worldwide standard for circus arenas to this day. Astley subsequently integrated acrobatics, juggling, tightrope walking, and clown comedy into the spectacle, creating the multi-act circus performance known today.",
    highlights: [
      "Năm 1768: Philip Astley bắt đầu biểu diễn tại London với những màn cưỡi ngựa đầy kỹ thuật trong vòng diễn tròn.",
      "Vòng tròn chuẩn mực 13 mét: Đường kính 13 mét (42 feet) do Philip Astley tính toán tạo lực ly tâm tối ưu giúp người cưỡi ngựa giữ thăng bằng hoàn hảo khi ngựa phi nước đại, trở thành tiêu chuẩn bất biến cho mọi rạp xiếc truyền thống.",
      "Nghệ thuật biểu diễn tổng hợp: Astley khéo léo đan cài các tiết mục nhào lộn trên không, tung hứng, đi dây thăng bằng và hài kịch (clown) giữa các màn kỵ mã.",
      "Ra đời rạp xiếc mái che Amphitheatre: Xây dựng nhà hát cưỡi ngựa tại London, mở đường cho mô hình rạp lều bạt Big Top lưu động khắp châu Âu và toàn cầu."
    ],
    highlightsEn: [
      "1768 London: Philip Astley debuted acrobatic equestrian performances inside a custom circular ring.",
      "Universal 13-meter ring diameter: The 13m (42 ft) diameter generated optimal centrifugal force for riders to stand upright on galloping horses, becoming the enduring standard for circus rings worldwide.",
      "Multi-act variety synthesis: Astley seamlessly alternated acrobatic aerials, juggling, tightrope balancing, and clown comedy between equestrian stunts.",
      "Invention of the covered circus: Astley's Amphitheatre in London paved the way for touring Big Top tent circuses across Europe and the Americas."
    ],
    keyFigures: [
      "Philip Astley (1742 - 1814, Cha đẻ Xiếc Cổ điển)",
      "Astley's Amphitheatre (London, Anh)",
      "Các kỵ sĩ và nghệ sĩ hề tiên phong châu Âu"
    ],
    keyFiguresEn: [
      "Philip Astley (1742 - 1814, Father of Classical Circus)",
      "Astley's Amphitheatre (London, UK)",
      "Pioneering European equestrians and comic clowns"
    ],
    quote: "Philip Astley đã sáng tạo nên vòng diễn tròn 13 mét định hình rạp xiếc cổ điển cho toàn nhân loại suốt hơn 250 năm qua.",
    quoteEn: "Philip Astley created the 13-meter circular ring that defined classical circus for all humanity for over 250 years.",
    imageIcon: "🎠"
  },
  {
    id: "contemporary-circus",
    sectionNumber: "3",
    era: "Nguồn gốc Xiếc Đương đại (Thập niên 1970 – 1984 – Nay)",
    eraEn: "Contemporary Circus (1970s – 1984 – Present)",
    period: "Thập niên 1970 - Nay",
    periodEn: "1970s - Present",
    title: "Nguồn gốc Xiếc Đương đại (Thập niên 1970 – 1984 – Nay)",
    titleEn: "Contemporary Circus (1970s – 1984 – Present)",
    summary: "Cần lưu ý rằng Philip Astley là cha đẻ của Xiếc Cổ điển, còn Xiếc Đương đại ra đời muộn hơn, khởi nguồn từ phong trào nghệ thuật mới vào những năm 1970 tại Pháp, Úc (với các gánh xiếc tiên phong như Le Cirque Bonjour, Circus Oz, Pickle Family Circus) và sau đó đạt đỉnh cao thế giới với Cirque du Soleil (Canada - 1984). Vào những năm 1960, các rạp xiếc truyền thống dần mất đi sức hút do sự bùng nổ của truyền hình và điện ảnh. Đồng thời, làn sóng bảo vệ quyền động vật dâng cao khiến công chúng không còn mặn mà với các màn xiếc thú hoang dã. Các nghệ sĩ trẻ mong muốn tìm kiếm một hướng đi mới, biến xiếc từ một hình thức giải trí tạp kỹ thành một bộ môn nghệ thuật biểu diễn có chiều sâu, kịch bản xuyên suốt, âm nhạc sống và hoàn toàn không sử dụng động vật.",
    summaryEn: "While Philip Astley founded classical circus, Contemporary Circus (Nouveau Cirque) emerged from the artistic movement of the 1970s across France and Australia (Le Cirque Bonjour, Circus Oz, Pickle Family Circus) and peaked globally with Cirque du Soleil (Canada, 1984). In the 1960s, traditional circuses faced declining attendance amidst television competition, while ethical awareness fueled widespread opposition to wild animal acts. Visionary young performers transformed circus from disjointed physical stunts into profound theatrical art with narrative story arcs, contemporary choreography, live original scores, and zero animal exploitation.",
    highlights: [
      "Bối cảnh chuyển đổi thẩm mỹ (Thập niên 1960): Sự trỗi dậy của điện ảnh, truyền hình cùng làn sóng bảo vệ quyền động vật khiến công chúng không còn mặn mà với xiếc thú hoang dã.",
      "Phong trào Nouveau Cirque (Thập niên 1970): Các gánh xiếc tiên phong Le Cirque Bonjour (Pháp), Circus Oz (Úc), Pickle Family Circus (Mỹ) mở đường cho cuộc cách mạng diện mạo xiếc toàn cầu.",
      "Đỉnh cao Cirque du Soleil (Canada - 1984): Đưa xiếc đương đại lên tầm cao toàn cầu với các siêu phẩm nghệ thuật kết hợp phục trang lộng lẫy, ánh sáng huyền ảo và dàn nhạc giao hưởng sống.",
      "Trụ cột 1 - Kịch nghệ và cốt truyện: Mỗi buổi diễn đều có chủ đề, thông điệp hoặc một câu chuyện xuyên suốt.",
      "Trụ cột 2 - Vũ đạo đương đại và âm nhạc sống: Âm nhạc được biên soạn riêng theo tâm trạng nhân vật thay vì các bản nhạc hành khúc rộn rã kiểu cũ.",
      "Trụ cột 3 - Không sử dụng động vật: Hoàn toàn tôn vinh vẻ đẹp, sự dẻo dai và lòng dũng cảm thuần khiết của con người."
    ],
    highlightsEn: [
      "1960s transformation: Cinema and TV emergence paired with animal welfare ethics prompted audiences to turn away from wild animal exploitation.",
      "Nouveau Cirque pioneers (1970s): Le Cirque Bonjour (France), Circus Oz (Australia), and Pickle Family Circus (USA) laid the foundation for narrative-driven circus.",
      "Cirque du Soleil pinnacle (Canada - 1984): Propelled contemporary circus into international renown through visual spectacles with live orchestration, original costumes, and atmospheric lighting.",
      "Pillar 1 - Theatrical narrative: Every performance weaves an overarching theme, message, or dramatic story.",
      "Pillar 2 - Contemporary dance & live score: Bespoke music composed to reflect character psychology rather than old brass marches.",
      "Pillar 3 - Animal-free ethics: Solely honoring human agility, physical brilliance, and artistic perseverance."
    ],
    keyFigures: [
      "Cirque du Soleil (Canada - 1984)",
      "Le Cirque Bonjour (Pháp - 1971)",
      "Circus Oz (Úc - 1977)",
      "Pickle Family Circus (Mỹ - 1974)"
    ],
    keyFiguresEn: [
      "Cirque du Soleil (Canada - 1984)",
      "Le Cirque Bonjour (France - 1971)",
      "Circus Oz (Australia - 1977)",
      "Pickle Family Circus (USA - 1974)"
    ],
    quote: "Xiếc đương đại biến xiếc từ một hình thức giải trí tạp kỹ thành bộ môn nghệ thuật biểu diễn có chiều sâu, mang thông điệp nhân văn và hoàn toàn không sử dụng động vật.",
    quoteEn: "Contemporary circus elevates physical tricks into profound theatrical art with narrative depth, live original music, and an ethical animal-free philosophy.",
    imageIcon: "🎪",
    referenceLinks: [
      {
        title: "History of Circus (Lịch sử Xiếc Thế Giới)",
        url: "https://www.historyofcircus.com/"
      },
      {
        title: "The Story of Circus - Victoria and Albert Museum (V&A London)",
        url: "https://www.vam.ac.uk/articles/the-story-of-circus"
      }
    ]
  },
  {
    id: "vietnam-century-circus",
    sectionNumber: "4",
    era: "Hành trình 100 năm: Sự hình thành các gánh xiếc bản địa (Thập niên 1910 – 1920)",
    eraEn: "100-Year Journey: Formation of Indigenous Troupes (1910s – 1920s)",
    period: "Thập niên 1920 - Nay",
    periodEn: "1920s - Present",
    title: "Hành trình 100 năm: Sự hình thành các gánh xiếc bản địa (Thập niên 1910 – 1920)",
    titleEn: "100-Year Journey: Formation of Indigenous Troupes (1910s – 1920s)",
    summary: "Hành trình 100 năm Xiếc Việt Nam là bản anh hùng ca kiên cường và tài hoa: Khởi nguồn từ các gánh xiếc bản địa đầu thế kỷ 20 với dấu mốc rực rỡ ngày 5/12/1922 của Cụ Tạ Duy Hiển tại chợ Hàng Da, qua giai đoạn đào tạo hàn lâm tại Mátxcơva và Đông Âu phục vụ tiền tuyến, đến kỷ nguyên đương đại hòa quyện múa rối (MƠ SHOW), xiếc tre (À Ố SHOW) và những kỷ lục Guinness thế giới cùng giải thưởng quốc tế danh giá.",
    summaryEn: "The 100-year saga of Vietnamese circus is a story of resilience and artistry: From indigenous troupes in the early 20th century marked by Master Ta Duy Hien's premiere on Dec 5, 1922 at Hang Da Market, through rigorous academic training at Moscow and Eastern European schools during the war, to a thriving contemporary era uniting puppetry (MƠ SHOW), bamboo spectacles (À Ố SHOW), and global Guinness World Records.",
    highlights: [
      "Hành trình thế kỷ: Khởi nguồn từ thập niên 1910-1920, qua 1950-1980 đến thời kỳ đương đại rực rỡ ngày nay.",
      "Gánh xiếc bản địa: Cụ Tạ Duy Hiển công diễn ngày 5/12/1922 tại chợ Hàng Da (Hà Nội), khẳng định tên gọi Đoàn Xiếc Việt Nam.",
      "Đào tạo hàn lâm: Đội Xiếc Trung ương thành lập 16/1/1956, đào tạo chính quy tại Trường Xiếc Mátxcơva.",
      "Nghệ thuật đương đại: MƠ SHOW kết hợp múa rối, À Ố SHOW & Làng Tôi đưa xiếc tre chu du khắp 5 châu.",
      "Kỷ lục Guinness thế giới: 3 kỷ lục chồng đầu của anh em Quốc Cơ - Quốc Nghiệp tại Tây Ban Nha và Ý.",
      "Giải thưởng quốc tế: Vương miện Bạc Monte Carlo 1989 (Tiến Cường - Trần Mạnh Cường) và hàng loạt HCV tại Pháp, Nga, Cuba, Trung Quốc."
    ],
    highlightsEn: [
      "Century odyssey: Spanning early indigenous pioneers (1910s-1920s), academic state institutions (1950-1980), to contemporary global accolades.",
      "Indigenous troupe milestone: Master Ta Duy Hien's historic debut on Dec 5, 1922 at Hang Da Market (Hanoi) founding Vietnam Circus Troupe.",
      "Academic excellence: Central Circus Troupe founded Jan 16, 1956 with elite training at Moscow Circus School.",
      "Contemporary fusion: MƠ SHOW combining puppetry, À Ố SHOW & My Village touring bamboo artistry to over 50 nations.",
      "Guinness World Records: 3 head-to-head balancing records by the Giang Brothers in Spain and Italy.",
      "International laurels: 1989 Silver Clown at Monte Carlo and multiple Gold Medals in France, Russia, Cuba, and China."
    ],
    keyFigures: [
      "Cụ Tạ Duy Hiển (Cụ tổ ngành Xiếc Việt Nam)",
      "Đội Xiếc Trung ương (Liên đoàn Xiếc Việt Nam)",
      "NSƯT Quốc Cơ & NSƯT Quốc Nghiệp (Kỷ lục Guinness)",
      "NSƯT Tiến Cường & NSƯT Trần Mạnh Cường (Vương miện Bạc Monte Carlo)",
      "MƠ SHOW, À Ố SHOW, Làng Tôi, Teh Dar"
    ],
    keyFiguresEn: [
      "Master Ta Duy Hien (Founding Father)",
      "Vietnam Circus Federation",
      "Quoc Co & Quoc Nghiệp (Guinness Records)",
      "Tien Cuong & Tran Manh Cuong (Monte Carlo Silver Clown)",
      "MƠ SHOW, À Ố SHOW, My Village, Teh Dar"
    ],
    quote: "Xiếc Việt Nam không chỉ kế thừa truyền thống vẻ vang mà còn vươn ra thế giới với nhiều kỷ lục Guinness và giải thưởng danh giá, khẳng định tài hoa và ý chí con người Việt Nam.",
    quoteEn: "Vietnamese circus honors historical heritage while conquering the international arena with Guinness records and prestigious laurels, affirming the artistry and spirit of Vietnam.",
    featuredQuotes: [
      {
        quote: "Họ say \"men\" nghề, hết lòng cống hiến phục vụ đồng bào, bộ đội. Gian khổ vô cùng những cũng cực kỳ thăng hoa.",
        quoteEn: "They were intoxicated with theatrical passion, devoting their entire hearts to serving fellow countrymen and soldiers. Boundless in hardship, yet exceedingly sublime in artistry.",
        author: "Nghệ sỹ Tạ Duy Ánh",
        authorEn: "Artist Tạ Duy Ánh",
        context: "Giai đoạn phục vụ đồng bào & người lính trên các chiến trường (1950 - 1980)",
        contextEn: "Serving the nation and soldiers on the battlefields (1950 - 1980)"
      },
      {
        quote: "Kỹ thuật xiếc thì ở đâu cũng giống nhau, để làm nên bản sắc riêng thì xiếc Việt Nam phải giữ được hồn dân tộc.",
        quoteEn: "Circus technique is the same everywhere; to forge its own identity, Vietnamese circus must preserve the national soul.",
        author: "Nghệ sĩ nhân dân Tống Toàn Thắng",
        authorEn: "People's Artist Tống Toàn Thắng",
        context: "Định vị bản sắc và hồn cốt dân tộc trong kỷ nguyên xiếc đương đại",
        contextEn: "Forging distinctive national identity in contemporary circus"
      }
    ],
    imageIcon: "🎋",
    videoUrl: "https://youtu.be/df-9MrHOTaU?si=f9WHCBRHIVn5ECxn",
    videoTitle: "Màn trình diễn đỉnh cao ở đêm chung kết Got Talent của hai anh em Quốc Cơ - Quốc Nghiệp",
    subsections: [
      {
        id: "early-troupes",
        tag: "Tiểu mục 4.1",
        tagEn: "Sub-section 4.1",
        title: "Sự Hình Thành Các Gánh Xiếc Bản Địa (Thập Niên 1910 - 1920)",
        titleEn: "Early Troupes (1910s - 1920s)",
        period: "1910 - 1922",
        periodEn: "1910 - 1922",
        icon: "🎪",
        description: "Trước sự kiện các đoàn xiếc phương Tây ồ ạt vào Việt Nam, các nghệ nhân xiếc trong nước đã tập hợp nhau lại mở lò luyện xiếc, góp vốn mở các gánh xiếc. Trong khi các nhóm xiếc này đều có những cái tên mang tính cá nhân như gánh xiếc André Thận ở Sa Đéc (1917), gánh xiếc Năm Tú ở Mỹ Tho (1918), Sáu Súng ở Nam bộ (1919)…, thì riêng ông Tạ Duy Hiển đặt cho \"đứa con tinh thần\" của mình một cái tên chất chứa niềm tự hào dân tộc là Đoàn Xiếc Việt Nam.\n\nDần dần, các gánh xiếc được mở rộng nhiều hơn. Và ngày 5 tháng 12 năm 1922, cụ Tạ Duy Hiển - cụ tổ ngành Xiếc Việt Nam đã công diễn tại chợ Hàng Da (Hà Nội), mở đầu cho trào lưu xiếc bản địa có quy mô lớn với dàn diễn viên đông đảo cùng đoàn xiếc thú gồm: Voi, hổ, gấu, ngựa, dê, chó, khỉ,… báo hiệu sự bắt đầu cho một thời kỳ mới của xiếc Việt Nam – Xiếc Việt Nam hiện đại.",
        descriptionEn: "Confronting the influx of Western circus companies, Vietnamese artisans united to establish local circus training arenas and pooled capital to form indigenous troupes. While early troupes carried individual names such as the André Thận Troupe in Sa Đéc (1917), Năm Tú Troupe in Mỹ Tho (1918), and Sáu Súng Troupe in Southern Vietnam (1919), Master Ta Duy Hien uniquely gave his troupe a name infused with patriotic pride: Vietnam Circus Troupe.\n\nGradually, these indigenous troupes expanded. On December 5, 1922, Master Ta Duy Hien—the Founding Father of Vietnamese Circus—officially premiered at Hang Da Market (Hanoi). This marked the dawn of large-scale domestic circus with an extensive ensemble and an animal entourage of elephants, tigers, bears, horses, goats, dogs, and monkeys, heralding modern Vietnamese circus.",
        highlights: [
          "Thập niên 1910: Sự hình thành các gánh xiếc bản địa đầu tiên: gánh André Thận (Sa Đéc, 1917), gánh Năm Tú (Mỹ Tho, 1918), gánh Sáu Súng (Nam Bộ, 1919).",
          "Khát vọng độc lập dân tộc: Cụ Tạ Duy Hiển kiên quyết đặt tên đoàn là \"Đoàn Xiếc Việt Nam\" để khẳng định chủ quyền văn hóa nghệ thuật của nước nhà.",
          "Mốc son lịch sử ngày 5 tháng 12 năm 1922: Cụ Tạ Duy Hiển - cụ tổ ngành Xiếc Việt Nam công diễn tại chợ Hàng Da (Hà Nội) với quy mô hoành tráng.",
          "Đoàn xiếc thú và diễn viên hùng hậu: Voi, hổ, gấu, ngựa, dê, chó, khỉ... biểu diễn kỹ nghệ thuần dưỡng và nhào lộn điêu luyện.",
          "Khai sinh Xiếc Việt Nam hiện đại: Đặt nền móng vững chắc cho nền nghệ thuật xiếc chuyên nghiệp bản địa phát triển suốt thế kỷ qua."
        ],
        highlightsEn: [
          "Wave of indigenous troupes (1910s): Domestic artisans founded training arenas and early troupes: André Thận in Sa Đéc (1917), Năm Tú in Mỹ Tho (1918), Sáu Súng in Southern Vietnam (1919).",
          "National pride and identity: Master Ta Duy Hien uniquely titled his troupe \"Vietnam Circus Troupe\", asserting national cultural identity against foreign touring companies.",
          "Historic milestone Dec 5, 1922: Master Ta Duy Hien—the Founding Father of Vietnamese Circus—formally premiered at Hang Da Market (Hanoi).",
          "Grand cast & animal entourage: A comprehensive ensemble featuring trained elephants, tigers, bears, horses, goats, dogs, and monkeys.",
          "Dawn of modern circus: Laid the enduring foundation for a century of indigenous circus artistry."
        ],
        figures: [
          "Cụ Tạ Duy Hiển (1889 - 1967, Cụ tổ ngành Xiếc Việt Nam)",
          "Gánh André Thận (Sa Đéc, 1917)",
          "Gánh Năm Tú (Mỹ Tho, 1918)",
          "Gánh Sáu Súng (Nam Bộ, 1919)"
        ],
        figuresEn: [
          "Master Ta Duy Hien (1889 - 1967, Founding Father)",
          "André Thận Troupe (Sa Đéc, 1917)",
          "Năm Tú Troupe (Mỹ Tho, 1918)",
          "Sáu Súng Troupe (Southern Vietnam, 1919)"
        ]
      },
      {
        id: "academic-training",
        tag: "Tiểu mục 4.2",
        tagEn: "Sub-section 4.2",
        title: "Giai Đoạn Đào Tạo Hàn Lâm & Định Hình Nhà Nước (1950 - 1980)",
        titleEn: "Academic Training (1950 - 1980)",
        period: "1950 - 1980",
        periodEn: "1950 - 1980",
        icon: "🎓",
        description: "Ngày 16/1/1956, Đội Xiếc Trung ương (tiền thân của Liên đoàn Xiếc Việt Nam ngày nay) chính thức được thành lập theo quyết định của Bác Hồ và Nhà nước.\n\nTrong thập niên 1960–1980, hàng loạt thế hệ nghệ sĩ xiếc Việt Nam được cử sang đào tạo bài bản tại Trường Xiếc Mátxcơva (Liên Xô) và các nước Đông Âu, mang kỹ thuật xiếc hàn lâm chuẩn quốc tế về phục vụ đất nước. Các nghệ sĩ đã đem tiếng cười và tinh thần lạc quan quả cảm phục vụ đồng bào, chiến sĩ tại chiến hào Điện Biên, đường Trường Sơn và các mặt trận khói lửa.",
        descriptionEn: "On January 16, 1956, the Central Circus Troupe (precursor to today's Vietnam Circus Federation) was officially established under the vision of President Ho Chi Minh and the government.\n\nFrom the 1960s to the 1980s, generations of talented Vietnamese circus artists were sent to the world-renowned Moscow State Circus School (USSR) and Eastern European academies, acquiring international classical standards to serve the nation. Artists courageously performed in trenches, along the Ho Chi Minh Trail, and in evacuated areas to uplift national morale.",
        highlights: [
          "Ngày 16/1/1956: Thành lập Đội Xiếc Trung ương tại Hà Nội, định hình tổ chức xiếc quốc gia chuyên nghiệp đầu tiên của nước Việt Nam Dân chủ Cộng hòa.",
          "Du học hàn lâm tại Trường Xiếc Mátxcơva: Tiếp thu phương pháp sư phạm và kỹ thuật xiếc đỉnh cao của Liên bang Xô Viết và các nước Đông Âu.",
          "Chuẩn hóa kỹ thuật quốc tế: Nâng tầm các bộ môn đu bay, uốn dẻo, nhào lộn, thăng bằng trên dây dải và đế kiếm lên chuẩn mực thi đấu quốc tế.",
          "Xiếc phục vụ kháng chiến: Nghệ sĩ - chiến sĩ mang tiếng cười lạc quan vào tận hầm hào chiến trường khói lửa khốc liệt."
        ],
        highlightsEn: [
          "January 16, 1956: Central Circus Troupe founded in Hanoi, establishing the nation's premier professional state circus organization.",
          "Moscow State Circus School training: Immersed in the pedagogy and technical mastery of the Soviet Union and Eastern European academies.",
          "Standardizing international disciplines: Elevating aerial trapeze, contortion, acrobatics, slack wire, and sword balancing to global competitive standards.",
          "Circus on the frontlines: Artist-soldiers performed directly in battlefield trenches along the Truong Son Trail."
        ],
        figures: [
          "Đội Xiếc Trung ương (Thành lập 16/1/1956)",
          "Liên đoàn Xiếc Việt Nam",
          "Nghệ sỹ Tạ Duy Ánh (Nguyên Giám đốc Liên đoàn Xiếc Việt Nam)",
          "Trường Xiếc Mátxcơva (Liên bang Xô Viết)",
          "Thế hệ nghệ sĩ du học Đông Âu"
        ],
        figuresEn: [
          "Central Circus Troupe (Founded Jan 16, 1956)",
          "Vietnam Circus Federation",
          "Artist Tạ Duy Ánh (Former Director, Vietnam Circus Federation)",
          "Moscow State Circus School (USSR)",
          "Generations of artists trained in Eastern Europe"
        ],
        quote: "Họ say \"men\" nghề, hết lòng cống hiến phục vụ đồng bào, bộ đội. Gian khổ vô cùng những cũng cực kỳ thăng hoa.",
        quoteAuthor: "Nghệ sỹ Tạ Duy Ánh",
        quoteEn: "They were intoxicated with theatrical passion, devoting their entire hearts to serving fellow countrymen and soldiers. Boundless in hardship, yet exceedingly sublime in artistry.",
        quoteAuthorEn: "Artist Tạ Duy Ánh"
      },
      {
        id: "modern-artistic-era",
        tag: "Tiểu mục 4.3",
        tagEn: "Sub-section 4.3",
        title: "Kỷ Nguyên Nghệ Thuật Đương Đại & Đỉnh Cao Quốc Tế",
        titleEn: "Modern Artistic Era (Contemporary Arts & World Records)",
        period: "Hiện Đại & Đương Đại",
        periodEn: "Modern & Contemporary Era",
        icon: "🏆",
        description: "Ngày nay, với sự phát triển của ngành xiếc, xiếc hiện nay không chỉ dừng lại ở xiếc thú, nhào lộn, tung hứng… mà đã được biến tấu thành một sân khấu xiếc kết hợp với múa rối (MƠ SHOW), các vật dụng gắn liền với văn hóa đậm chất Việt Nam (À Ố SHOW, Làng Tôi, Teh Dar)... cùng với kịch bản được dàn dựng tỉ mỉ, chi tiết, được thổi hồn vào những câu chuyện đời thường sâu lắng chạm đến trái tim khán giả. Và đó gọi là Nghệ thuật Xiếc đương đại Việt Nam.\n\nĐồng thời, Xiếc Việt Nam đã vươn ra thế giới với nhiều kỷ lục Guinness và giải thưởng danh giá tại các liên hoan quốc tế đỉnh cao, được bạn bè năm châu thán phục.",
        descriptionEn: "Today, Vietnamese circus extends far beyond traditional stunts into theatrical visual productions combining circus with puppetry (MƠ SHOW), iconic Vietnamese cultural elements (À Ố SHOW, My Village, Teh Dar with bamboo poles, woven baskets, and gongs), and meticulously crafted storylines touching the deepest emotions of audiences. This is Vietnamese Contemporary Circus.\n\nConcurrently, Vietnamese circus artists have conquered the world stage with legendary Guinness World Records and top international festival awards, earning global admiration.",
        structuredSections: [
          {
            number: 1,
            title: "Nghệ thuật Xiếc đương đại Việt Nam",
            titleEn: "Vietnamese Contemporary Circus Art",
            categoryBadge: "Nghệ Thuật Xiếc Đương Đại",
            categoryBadgeEn: "Contemporary Circus Art",
            icon: "🎋",
            summary: "Ngày nay, với sự phát triển của ngành xiếc, xiếc hiện nay không chỉ dừng lại ở xiếc thú, nhào lộn, tung hứng… mà đã được biến tấu thành một sân khấu xiếc kết hợp với múa rối (MƠ SHOW), các vật dụng gắn liền với văn hóa đậm chất Việt Nam (À Ố SHOW, Làng Tôi, Teh Dar)... cùng với kịch bản được dàn dựng tỉ mỉ, chi tiết, được thổi hồn vào những câu chuyện đời thường sâu lắng chạm đến trái tim khán giả. Và đó gọi là Nghệ thuật Xiếc đương đại Việt Nam.",
            summaryEn: "Today, with the advancement of circus arts, circus no longer confines itself to animal acts, acrobatics, or juggling... but has transformed into a theatrical circus stage combined with puppetry (MƠ SHOW), and objects deeply rooted in Vietnamese culture (À Ố SHOW, My Village, Teh Dar)... paired with meticulously crafted storylines breathing soul into touching everyday stories that reach the hearts of audiences. And that is called Vietnamese Contemporary Circus Art.",
            items: [
              {
                name: "Sân khấu xiếc kết hợp múa rối: MƠ SHOW",
                nameEn: "Circus Fused with Puppetry: MƠ SHOW",
                artists: "Nhà hát Múa rối Việt Nam & Liên đoàn Xiếc Việt Nam",
                artistsEn: "Vietnam Puppetry Theatre & Vietnam Circus Federation",
                achievement: "Sự kết hợp hoàn hảo giữa sân khấu múa rối truyền thống và nghệ thuật xiếc đương đại đỉnh cao, tạo nên dấu ấn độc bản trong đời sống sân khấu biểu diễn Việt Nam.",
                achievementEn: "A magnificent synthesis of traditional puppetry and contemporary circus acrobatics, creating a unique signature in Vietnamese performing arts.",
                badge: "Hòa quyện Xiếc & Múa rối",
                badgeEn: "Circus & Puppetry Fusion"
              },
              {
                name: "Xiếc tre đậm chất Việt Nam: À Ố SHOW, Làng Tôi (My Village), Teh Dar",
                nameEn: "Bamboo Contemporary Circus: À Ố SHOW, My Village, Teh Dar",
                artists: "Lune Production (Đạo diễn Tuấn Lê, Nhạc sĩ Nhất Lý, Nguyễn Lân)",
                artistsEn: "Lune Production (Director Tuan Le, Nhat Ly, Nguyen Lan)",
                achievement: "Đưa cây tre, thúng lượn, cồng chiêng và âm nhạc dân tộc chu du lưu diễn thành công tại hơn 50 quốc gia khắp 5 châu lục, biểu diễn tại những nhà hát danh giá nhất thế giới.",
                achievementEn: "Elevating bamboo poles, woven baskets, and ethnic gongs with live folk music across 50+ countries worldwide, touring renowned international opera houses.",
                badge: "Lưu diễn 50+ Quốc Gia",
                badgeEn: "Touring 50+ Nations"
              }
            ]
          },
          {
            number: 2,
            title: "Các kỷ lục thế giới và giải thưởng quốc tế đỉnh cao",
            titleEn: "World Records & Prestigious International Awards",
            categoryBadge: "Kỷ Lục & Giải Thưởng Đỉnh Cao",
            categoryBadgeEn: "World Records & Top Honors",
            icon: "🏆",
            summary: "Xiếc Việt Nam không chỉ kế thừa truyền thống mà còn vươn ra thế giới với nhiều kỷ lục Guinness và giải thưởng danh giá tại các liên hoan quốc tế.",
            summaryEn: "Vietnam Circus not only inherits rich traditions but has conquered the world stage with multiple Guinness World Records and prestigious awards at top international festivals.",
            items: [
              {
                name: "Kỷ lục Guinness 1 (2016): Chồng đầu đi lên nhiều bậc thang nhất",
                nameEn: "Guinness Record 1 (2016): Most Stairs Climbed Head-to-Head",
                artists: "NSƯT Giang Quốc Cơ & NSƯT Giang Quốc Nghiệp",
                artistsEn: "Merited Artists Giang Quoc Co & Giang Quoc Nghiep",
                achievement: "Lập tại Nhà thờ Chính tòa Girona (Tây Ban Nha) với 90 bậc thang trong 52 giây.",
                achievementEn: "Set at Girona Cathedral (Spain) with 90 stairs climbed head-to-head in 52 seconds.",
                badge: "Guinness 2016 (Tây Ban Nha)",
                badgeEn: "Guinness 2016 (Spain)"
              },
              {
                name: "Kỷ lục Guinness 2 (2018): Chồng đầu bịt mắt đi lên/xuống bậc thang",
                nameEn: "Guinness Record 2 (2018): Blindfolded Head-to-Head Stairs",
                artists: "NSƯT Giang Quốc Cơ & NSƯT Giang Quốc Nghiệp",
                artistsEn: "Merited Artists Giang Quoc Co & Giang Quoc Nghiep",
                achievement: "Lập tại Ý với thành tích bước lên và xuống 10 bậc thang trong 53 giây khi bịt mắt.",
                achievementEn: "Set in Italy, ascending and descending 10 stairs in 53 seconds while completely blindfolded.",
                badge: "Guinness 2018 (Ý)",
                badgeEn: "Guinness 2018 (Italy)"
              },
              {
                name: "Kỷ lục Guinness 3 (2021): Chồng đầu đi trên giàn gót nhọn / Cột cân bằng",
                nameEn: "Guinness Record 3 (2021): Head-to-Head on Balancing Pedestals",
                artists: "NSƯT Giang Quốc Cơ & NSƯT Giang Quốc Nghiệp",
                artistsEn: "Merited Artists Giang Quoc Co & Giang Quoc Nghiep",
                achievement: "Lập tại Tây Ban Nha khi chồng đầu đi lên 10 bậc thang rộng 50cm trong thời gian kỷ lục.",
                achievementEn: "Set in Spain, balancing head-to-head across 10 narrow 50cm-wide pedestals in record-shattering time.",
                badge: "Guinness 2021 (Tây Ban Nha)",
                badgeEn: "Guinness 2021 (Spain)"
              },
              {
                name: "Giải Vương miện Bạc (Silver Clown) tại Liên hoan Xiếc Quốc tế Monte Carlo (Monaco, 1989)",
                nameEn: "Silver Clown Award ('Oscar of Circus') at Monte Carlo International Festival (Monaco, 1989)",
                artists: "NSƯT Tiến Cường & NSƯT Trần Mạnh Cường",
                artistsEn: "Merited Artists Tien Cuong & Tran Manh Cuong",
                achievement: "Giải thưởng được coi là \"Oscar của ngành Xiếc\" với tiết mục \"Đu xà đôi\".",
                achievementEn: "Regarded as the 'Oscar of Circus Arts' worldwide for the historic act \"Double Trapeze\".",
                badge: "Silver Clown 1989 (Monaco)",
                badgeEn: "Silver Clown 1989 (Monaco)"
              },
              {
                name: "Huy chương Vàng & Giải thưởng Giám khảo Quốc tế: Tiết mục \"Sức mạnh đôi tay\"",
                nameEn: "International Gold Medal & Special Jury Prize: \"Strength of Hands\"",
                artists: "NSƯT Giang Quốc Cơ & NSƯT Giang Quốc Nghiệp",
                artistsEn: "Merited Artists Giang Quoc Co & Giang Quoc Nghiep",
                achievement: "Đạt Huy chương Vàng tại Circus de Massy (Pháp, 2011) và Giải thưởng Đặc biệt của Ban Giám khảo tại Monte Carlo lần thứ 41 (Monaco, 2017).",
                achievementEn: "Gold Medal at Circus de Massy (France, 2011) & Special Jury Prize at the 41st Monte Carlo Circus Festival (Monaco, 2017).",
                badge: "HCV Pháp 2011 & Monte Carlo 2017",
                badgeEn: "Gold France 2011 & Monte Carlo 2017"
              },
              {
                name: "Huy chương Vàng Quốc tế: Tiết mục \"Đu nón\" / \"Thăng bằng trên dây dải\"",
                nameEn: "International Gold Medal: \"Conical Hat Trapeze\" / \"Slack Wire Balance\"",
                artists: "NSƯT Bùi Thu Hường, NSƯT Nguyễn Thị Hà và các nữ nghệ sĩ Liên đoàn Xiếc Việt Nam",
                artistsEn: "Merited Artists Bui Thu Huong, Nguyen Thi Ha & Female Artists of Vietnam Circus Federation",
                achievement: "Đạt Huy chương Vàng tại Festival Mondial du Cirque de Demain (Pháp) và Liên hoan \"Công chúa Xiếc\" (Nga).",
                achievementEn: "Gold Medal at Festival Mondial du Cirque de Demain (France) & \"Princess of Circus\" World Festival (Russia).",
                badge: "HCV Demain (Pháp) & Công Chúa Xiếc (Nga)",
                badgeEn: "Gold Demain (France) & Princess (Russia)"
              },
              {
                name: "Huy chương Vàng Quốc tế: Tiết mục \"Đế kiếm trên dây thép chao\"",
                nameEn: "International Gold Medal: \"Sword Balancing on Slack Wire\"",
                artists: "NSƯT Hoàng An / Tạ Duy Nhẫn",
                artistsEn: "Merited Artists Hoang An / Ta Duy Nhan",
                achievement: "Đạt Huy chương Vàng tại Liên hoan Xiếc Quốc tế Ngũ Kiều - Wuqiao (Trung Quốc) và Rome (Ý).",
                achievementEn: "Gold Medal at Wuqiao International Circus Festival (China) and Rome International Circus Festival (Italy).",
                badge: "HCV Ngũ Kiều (Trung Quốc) & Rome (Ý)",
                badgeEn: "Gold Wuqiao (China) & Rome (Italy)"
              },
              {
                name: "Huy chương Vàng Quốc tế: Tiết mục \"Tạo hình trên dây da\"",
                nameEn: "International Gold Medal: \"Aerial Straps Gymnastics\"",
                artists: "NSƯT Nguyễn Văn Thái & NSƯT Trịnh Toàn",
                artistsEn: "Merited Artists Nguyen Van Thai & Trinh Toan",
                achievement: "Đạt Huy chương Vàng tại Festival Mondial du Cirque de Demain (Pháp).",
                achievementEn: "Gold Medal at Festival Mondial du Cirque de Demain (Paris, France).",
                badge: "HCV Festival Demain (Pháp)",
                badgeEn: "Gold Festival Demain (France)"
              },
              {
                name: "Huy chương Vàng Quốc tế: Tiết mục \"Uốn dẻo gánh gốm\"",
                nameEn: "International Gold Medal: \"Ceramic Pot Contortion\"",
                artists: "NSƯT Phạm Thị Hướng & NSƯT Đinh Thị Thúy Hằng",
                artistsEn: "Merited Artists Pham Thi Huong & Dinh Thi Thuy Hang",
                achievement: "Đạt Huy chương Vàng tại Liên hoan Xiếc \"Công chúa Xiếc\" (Nga) và Havana (Cuba).",
                achievementEn: "Gold Medal at Princess of Circus Festival (Russia) & Havana International Circus Festival (Cuba).",
                badge: "HCV Công Chúa Xiếc (Nga) & Havana (Cuba)",
                badgeEn: "Gold Princess (Russia) & Havana (Cuba)"
              }
            ]
          }
        ],
        highlights: [
          "Mục 1: Nghệ thuật Xiếc đương đại Việt Nam - Sân khấu kết hợp múa rối (MƠ SHOW) và xiếc tre văn hóa Việt (À Ố SHOW, Làng Tôi, Teh Dar).",
          "Mục 2: Các kỷ lục thế giới và giải thưởng quốc tế đỉnh cao - 3 Kỷ lục Guinness của Quốc Cơ - Quốc Nghiệp, Giải Vương miện Bạc Monte Carlo và 5 giải HCV thế giới."
        ],
        highlightsEn: [
          "Section 1: Vietnamese Contemporary Circus - Fusing puppetry (MƠ SHOW) and bamboo cultural theater (À Ố SHOW, My Village, Teh Dar).",
          "Section 2: World Records & Prestigious International Awards - 3 Guinness World Records by Giang Brothers, Silver Clown at Monte Carlo, and 5 top World Gold Medals."
        ],
        figures: [
          "NSND Tống Toàn Thắng (Giám đốc Liên đoàn Xiếc Việt Nam)",
          "NSƯT Quốc Cơ & NSƯT Quốc Nghiệp (3 Kỷ lục Guinness thế giới)",
          "NSƯT Tiến Cường & NSƯT Trần Mạnh Cường (Vương miện Bạc Monte Carlo)",
          "NSƯT Bùi Thu Hường & NSƯT Nguyễn Thị Hà (HCV Pháp & Nga)",
          "MƠ SHOW, À Ố SHOW, Làng Tôi, Teh Dar (Lune Production)",
          "Đạo diễn Tuấn Lê & Liên đoàn Xiếc Việt Nam"
        ],
        figuresEn: [
          "People's Artist Tống Toàn Thắng (Director, Vietnam Circus Federation)",
          "Quốc Cơ & Quốc Nghiệp (3 Guinness World Records)",
          "Tiến Cường & Trần Mạnh Cường (Monte Carlo Silver Clown)",
          "Bùi Thu Hường & Nguyễn Thị Hà (Gold in France & Russia)",
          "MƠ SHOW, À Ố SHOW, My Village, Teh Dar (Lune Production)",
          "Director Tuan Le & Vietnam Circus Federation"
        ],
        quote: "Kỹ thuật xiếc thì ở đâu cũng giống nhau, để làm nên bản sắc riêng thì xiếc Việt Nam phải giữ được hồn dân tộc.",
        quoteAuthor: "Nghệ sĩ nhân dân Tống Toàn Thắng",
        quoteEn: "Circus technique is the same everywhere; to forge its own identity, Vietnamese circus must preserve the national soul.",
        quoteAuthorEn: "People's Artist Tống Toàn Thắng"
      }
    ]
  }
];

// Navigation Bar visible at the top of every page
const HistoryNavigation: React.FC<{
  onBack: () => void;
  readEras: string[];
  isEn: boolean;
  currentPath: string;
  onNavigatePath: (path: string) => void;
}> = ({ onBack, readEras, isEn, currentPath, onNavigatePath }) => {
  const navItems = [
    {
      path: "/",
      number: null,
      label: isEn ? "Overview" : "Tổng quan",
      icon: "📜",
      id: "overview",
    },
    {
      path: "/moc-1",
      number: "1",
      label: isEn ? "Ancient (2000 BC)" : "Mốc 1: Cổ Đại",
      icon: "🏛️",
      id: "ancient-circus",
    },
    {
      path: "/moc-2",
      number: "2",
      label: isEn ? "Classical (1768)" : "Mốc 2: Cổ Điển",
      icon: "🎠",
      id: "classical-circus",
    },
    {
      path: "/moc-3",
      number: "3",
      label: isEn ? "Contemporary" : "Mốc 3: Đương Đại",
      icon: "🎪",
      id: "contemporary-circus",
    },
    {
      path: "/moc-4",
      number: "4",
      label: isEn ? "100Y Vietnam" : "Mốc 4: 100 Năm Xiếc Việt",
      icon: "🎋",
      id: "vietnam-century-circus",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header: Back & Progress Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            circusAudio.playBambooStep();
            window.location.hash = "";
            onBack();
          }}
          className="flex items-center gap-2 bg-white shadow-xs cursor-pointer border-amber-300 hover:bg-amber-50 w-fit"
        >
          <ArrowLeft className="size-4 text-amber-900" />
          <span className="font-semibold text-amber-950">{isEn ? "Back to Main Stage" : "Về Sân Khấu Chính"}</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-950 bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 shadow-xs">
            <BookOpen className="size-3.5 text-amber-700" />
            <span>
              {isEn
                ? `Exploration Progress: ${readEras.length}/${HISTORY_ERAS.length} milestones`
                : `Tiến trình khám phá: ${readEras.length}/${HISTORY_ERAS.length} mốc lịch sử`}
            </span>
          </div>

          {readEras.length === HISTORY_ERAS.length && (
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-300 animate-pulse">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>{isEn ? "Circus Scholar Unlocked!" : "Đã mở khóa Sử Học Rạp Xiếc!"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Milestone Navigation Bar across all pages */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-200 shadow-sm sticky top-2 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-500 mb-2 px-1">
          <span className="uppercase tracking-wider flex items-center gap-1.5 text-amber-900">
            <Compass className="size-3.5 text-amber-600" />
            <span>{isEn ? "Milestone Navigation (Real Route)" : "Điều Hướng 4 Cột Mốc Lịch Sử"}</span>
          </span>
          <span className="text-[11px] text-amber-700 hidden sm:inline">
            {isEn ? "Click milestone to open dedicated page" : "Bấm mốc để chuyển sang trang riêng biệt"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const isRead = item.id !== "overview" && readEras.includes(item.id);

            return (
              <button
                key={item.path}
                onClick={() => {
                  circusAudio.playBambooStep();
                  onNavigatePath(item.path);
                }}
                className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-md font-bold ring-2 ring-amber-300/50"
                    : "bg-amber-50/60 hover:bg-amber-100/80 text-neutral-800 border-amber-200"
                }`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-900">
                      {item.number ? `Mốc ${item.number}` : (isEn ? "Home" : "Tổng quan")}
                    </span>
                    {isRead && <CheckCircle2 className="size-3 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {item.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CircusHistory: React.FC<CircusHistoryProps> = ({
  onBack,
  onUnlockBadge,
}) => {
  const { isEn } = useLanguage();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.startsWith("/moc-") || hash === "/") {
        return hash;
      }
    }
    return "/";
  });

  const handleNavigatePath = useCallback((path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (typeof document !== "undefined") {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.startsWith("/moc-") || hash === "/") {
        setCurrentPath(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Read milestones state
  const [readEras, setReadEras] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("circus_history_read_milestones");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [HISTORY_ERAS[0].id];
  });

  // Independent applause counts per milestone
  const [applauseCounts, setApplauseCounts] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("circus_history_applause_counts");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      "ancient-circus": 128,
      "classical-circus": 245,
      "contemporary-circus": 196,
      "vietnam-century-circus": 482,
    };
  });

  // Active subsection state for Milestone 4
  const [activeSubsectionId, setActiveSubsectionId] = useState<string>("early-troupes");

  const handleApplause = useCallback((eraId: string) => {
    circusAudio.playApplause();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
    });

    setApplauseCounts((prev) => {
      const updated = {
        ...prev,
        [eraId]: (prev[eraId] || 0) + 1,
      };
      try {
        localStorage.setItem("circus_history_applause_counts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const handleMarkRead = useCallback(
    (eraId: string) => {
      setReadEras((prev) => {
        if (prev.includes(eraId)) return prev;
        const next = [...prev, eraId];
        try {
          localStorage.setItem("circus_history_read_milestones", JSON.stringify(next));
        } catch {}

        if (next.length === HISTORY_ERAS.length) {
          onUnlockBadge("circus-scholar");
          circusAudio.playFanfare();
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return next;
      });
    },
    [onUnlockBadge]
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16 select-none">
      <HistoryNavigation
        onBack={onBack}
        readEras={readEras}
        isEn={isEn}
        currentPath={currentPath}
        onNavigatePath={handleNavigatePath}
      />

      {currentPath === "/" && (
        <HistoryHome
          eras={HISTORY_ERAS}
          readEras={readEras}
          applauseCounts={applauseCounts}
          isEn={isEn}
          onSelectMilestone={handleNavigatePath}
        />
      )}

      {currentPath === "/moc-1" && (
        <MilestonePage
          era={HISTORY_ERAS[0]}
          index={0}
          prevPath={null}
          prevTitle={null}
          nextPath="/moc-2"
          nextTitle={isEn ? "Classical (1768)" : "Mốc 2: Cổ Điển"}
          applauseCount={applauseCounts[HISTORY_ERAS[0].id] || 0}
          onApplause={() => handleApplause(HISTORY_ERAS[0].id)}
          onMarkRead={handleMarkRead}
          isEn={isEn}
          activeSubsectionId={activeSubsectionId}
          setActiveSubsectionId={setActiveSubsectionId}
          onNavigate={handleNavigatePath}
        />
      )}

      {currentPath === "/moc-2" && (
        <MilestonePage
          era={HISTORY_ERAS[1]}
          index={1}
          prevPath="/moc-1"
          prevTitle={isEn ? "Ancient (2000 BC)" : "Mốc 1: Cổ Đại"}
          nextPath="/moc-3"
          nextTitle={isEn ? "Contemporary (1970s)" : "Mốc 3: Đương Đại"}
          applauseCount={applauseCounts[HISTORY_ERAS[1].id] || 0}
          onApplause={() => handleApplause(HISTORY_ERAS[1].id)}
          onMarkRead={handleMarkRead}
          isEn={isEn}
          activeSubsectionId={activeSubsectionId}
          setActiveSubsectionId={setActiveSubsectionId}
          onNavigate={handleNavigatePath}
        />
      )}

      {currentPath === "/moc-3" && (
        <MilestonePage
          era={HISTORY_ERAS[2]}
          index={2}
          prevPath="/moc-2"
          prevTitle={isEn ? "Classical (1768)" : "Mốc 2: Cổ Điển"}
          nextPath="/moc-4"
          nextTitle={isEn ? "100 Years of VN Circus" : "Mốc 4: 100 Năm Xiếc Việt"}
          applauseCount={applauseCounts[HISTORY_ERAS[2].id] || 0}
          onApplause={() => handleApplause(HISTORY_ERAS[2].id)}
          onMarkRead={handleMarkRead}
          isEn={isEn}
          activeSubsectionId={activeSubsectionId}
          setActiveSubsectionId={setActiveSubsectionId}
          onNavigate={handleNavigatePath}
        />
      )}

      {currentPath === "/moc-4" && (
        <MilestonePage
          era={HISTORY_ERAS[3]}
          index={3}
          prevPath="/moc-3"
          prevTitle={isEn ? "Contemporary (1970s)" : "Mốc 3: Đương Đại"}
          nextPath={null}
          nextTitle={null}
          applauseCount={applauseCounts[HISTORY_ERAS[3].id] || 0}
          onApplause={() => handleApplause(HISTORY_ERAS[3].id)}
          onMarkRead={handleMarkRead}
          isEn={isEn}
          activeSubsectionId={activeSubsectionId}
          setActiveSubsectionId={setActiveSubsectionId}
          onNavigate={handleNavigatePath}
        />
      )}
    </div>
  );
};
