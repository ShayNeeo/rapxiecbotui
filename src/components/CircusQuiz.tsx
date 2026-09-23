import React, { useState } from "react";
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
  Shuffle
} from "lucide-react";

interface CircusQuizProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Ai được tôn vinh là 'Cha đẻ - Ông tổ ngành Xiếc hiện đại Việt Nam' thành lập gánh xiếc đầu tiên năm 1921?",
    questionEn: "Who is revered as the 'Father and Founder of Modern Vietnamese Circus', establishing the first troupe in 1921?",
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
    explanation: "Ngày 5/12/1921, cụ Tạ Duy Hiển đã thành lập gánh xiếc tư nhân đầu tiên tại Chợ Hôm (Hà Nội), quy tụ thú nuôi, xe đạp và nhào lộn, mở đầu lịch sử xiếc hiện đại Việt Nam.",
    explanationEn: "On Dec 5, 1921, Master Ta Duy Hien founded the first private circus at Hom Market (Hanoi), featuring trained animals, trick cycling, and acrobatics, inaugurating modern Vietnamese circus.",
    triviaFact: "Cụ Tạ Duy Hiển từng đóng bè đưa cả đoàn xiếc chu du biểu diễn xuyên Đông Dương và Hồng Kông.",
    triviaFactEn: "Master Ta Duy Hien built custom wooden rafts to navigate entire circus troupes across Indochina and Hong Kong."
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
    triviaFact: "Cây tre Việt Nam vừa dẻo dai vừa chịu lực cực tốt, biểu trưng cho ý chí và sức mạnh bền bỉ của người Việt.",
    triviaFactEn: "Vietnamese bamboo is remarkably flexible yet sturdy, symbolizing the enduring willpower of the Vietnamese soul."
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
    explanation: "Người dân miền duyên hải sáng chế ra đôi cà kheo tre cao 2 - 3 mét để đi lội nước săn cá, quăng chài ngoài lộng biển sâu mà không bị ướt áo.",
    explanationEn: "Coastal villagers crafted 2-3 meter bamboo stilts to wade through ocean surf, casting fishing nets in deep water without drenching their clothes.",
    triviaFact: "Ngày nay, các đoàn nghệ nhân cà kheo Hải Hậu (Nam Định) thường xuyên tham gia biểu diễn tại các kỳ Festival Huế và lễ hội quốc tế.",
    triviaFactEn: "Today, Hai Hau stilt-walking troupes regularly star in the Hue Festival and global cultural carnivals."
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
    triviaFact: "Màn biểu diễn này đòi hỏi lực cơ cổ và sự cân bằng tuyệt đối đến từng mili-giây giữa hai người.",
    triviaFactEn: "This performance requires formidable neck muscle strength and microsecond synchronized equilibrium."
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
    explanation: "Rạp Xiếc Trung Ương nằm tại phố Trần Nhân Tông, ngay trong khuôn viên Công viên Thống Nhất (Hà Nội), với sức chứa hơn 1.200 chỗ ngồi hiện đại.",
    explanationEn: "The National Circus Theater is located on Tran Nhan Tong Street inside Thong Nhat Park (Hanoi), accommodating over 1,200 spectators.",
    triviaFact: "Đây là 'thánh đường' xiếc quốc gia, nơi tổ chức các kỳ Liên hoan Xiếc Quốc tế tại Việt Nam.",
    triviaFactEn: "It is the national sanctuary of circus art, frequently hosting International Circus Festivals in Vietnam."
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
    explanation: "NSND Tâm Chính nổi danh với tiết mục thăng bằng trên con lăn và kiếm múa, là một trong những huyền thoại lớn nhất của nghệ thuật xiếc nước nhà.",
    explanationEn: "People's Artist Tam Chinh gained renown for her roller-balancing and sword displays, standing as one of the country's greatest circus legends.",
    triviaFact: "Bà sinh ra trong một gia đình có truyền thống nghệ thuật và cống hiến trọn đời cho sự phát triển của xiếc Việt Nam.",
    triviaFactEn: "Born into an artistic family, she devoted her entire life to nurturing Vietnamese circus culture."
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
    explanation: "Chim bồ câu trắng thuần thục, lanh lợi và là biểu tượng toàn cầu của hòa bình, may mắn và vẻ đẹp tinh khiết trên sân khấu xiếc.",
    explanationEn: "White doves are gentle, agile, and globally recognized symbols of peace, fortune, and poetic grace in stage illusions.",
    triviaFact: "Nghệ sĩ xiếc huấn luyện bồ câu bằng tình yêu thương và sự kiên trì trong suốt nhiều tháng liền.",
    triviaFactEn: "Circus illusionists train doves through months of patience and gentle mutual trust."
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
    triviaFactEn: "They scaled 100 steps of Girona Cathedral (Spain) in just 53 seconds while maintaining flawless head-to-head balance."
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
    explanation: "NSND Tống Toàn Thắng nổi danh là 'Hoàng tử Trăn' với nghệ thuật huấn luyện xiếc thú điêu luyện, đồng thời là đạo diễn tài hoa dàn dựng nhiều chương trình xiếc sử thi, kịch xiếc đương đại lớn của Liên đoàn Xiếc Việt Nam.",
    explanationEn: "People's Artist Tong Toan Thang earned fame as the 'Python Prince' for his master animal circus artistry, while also directing numerous landmark epic and contemporary circus revues as Director of the Vietnam Circus Federation.",
    triviaFact: "Tiết mục diễn cùng trăn của ông đã đi lưu diễn ở hàng chục quốc gia khắp năm châu và đạt nhiều giải thưởng quốc tế cao quý.",
    triviaFactEn: "His signature python performance toured across dozens of countries worldwide, earning numerous prestigious international awards."
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
    triviaFactEn: "Cirque du Soleil has performed before more than 365 million spectators across over 90 countries worldwide."
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
    explanation: "Các tác phẩm do Lune Production thực hiện (như Làng Tôi, À Ố Show) là những bước tiến tiên phong của xiếc đương đại Việt Nam, kết hợp kỹ thuật xiếc, múa, âm nhạc dân tộc và đạo cụ từ tre nứa để truyền tải văn hóa Việt Nam ra thế giới.",
    explanationEn: "Productions created by Lune Production (such as 'My Village' and 'À Ố Show') are groundbreaking milestones of contemporary Vietnamese circus, marrying acrobatic stunts, dance, live traditional music, and rustic bamboo props.",
    triviaFact: "Vở diễn 'Làng Tôi' từng đi lưu diễn liên tục hàng trăm buổi tại các nhà hát kịch nghệ và opera danh giá khắp Châu Âu và Châu Á.",
    triviaFactEn: "'My Village' toured hundreds of continuous dates across prestigious theaters and opera houses throughout Europe and Asia."
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
    triviaFact: "Lều Big Top lớn nhất lịch sử từng che phủ diện tích hơn 9.000 mét vuông với sức chứa lên tới 10.000 khán giả.",
    triviaFactEn: "Historically, the largest circus Big Top tents covered over 9,000 square meters and accommodated up to 10,000 spectators."
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
    explanation: "Philip Astley (1742–1814) là một kỵ sĩ người Anh. Năm 1768, ông thành lập trường dạy cưỡi ngựa tại London và nhận ra rằng việc cho ngựa chạy theo đường tròn tạo ra lực ly tâm giúp ông dễ giữ thăng bằng trên lưng ngựa hơn. Ông sau đó thêm vào các tiết mục hề, nhào lộn, nhạc công để giải trí cho khán giả, đặt nền móng cho mô hình xiếc hiện đại.",
    explanationEn: "Philip Astley (1742–1814), an English equestrian, established a riding school in London in 1768. Discovering centrifugal force helped him balance on horseback in a circular ring, he added acrobats, clowns, and musicians, birthing modern circus.",
    triviaFact: "Đường kính 13 mét của vòng tròn sân khấu do Philip Astley tính toán năm 1768 vẫn là quy chuẩn quốc tế của mọi rạp xiếc ngày nay.",
    triviaFactEn: "The 13-meter diameter ring engineered by Philip Astley in 1768 remains the standard dimension in circus arenas worldwide today."
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
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                  selectedAnswer === currentQ.correctIndex
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {selectedAnswer === currentQ.correctIndex 
                    ? (isEn ? "Correct! +10 Points" : "Chính Xác! +10 Điểm") 
                    : (isEn ? "Not quite!" : "Chưa Đúng Rồi!")}
                </span>
                <span className="text-xs text-neutral-600 font-medium">
                  {isEn ? "Detailed Explanation:" : "Lời giải thích chi tiết:"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                {isEn ? (currentQ.explanationEn || currentQ.explanation) : currentQ.explanation}
              </p>

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
                  ? (isEn ? "Grandmaster 🏆" : "Xuất Sắc 🏆")
                  : score >= 120
                  ? (isEn ? "Expert ⭐" : "Khá Giỏi ⭐")
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

