import fs from 'node:fs'
import path from 'node:path'

interface RawChunkDefinition {
  id: string
  title: string
  category: 'history' | 'concept' | 'career' | 'artistry' | 'venues_hcm' | 'venues_hn' | 'ethics'
  keywords: string[]
  rawContent: string
}

const RAW_CHUNKS: RawChunkDefinition[] = [
  {
    id: 'circus-history-founder-ta-duy-hien',
    title: 'Lịch sử hình thành xiếc Việt Nam và NSND Tạ Duy Hiển',
    category: 'history',
    keywords: ['Tạ Duy Hiển', 'lịch sử', 'đặt nền móng', 'Đoàn Xiếc Thống Nhất', 'Liên đoàn Xiếc Việt Nam', '1922'],
    rawContent: `Tại Việt Nam, nghệ thuật xiếc bắt đầu hình thành và phát triển từ đầu thế kỷ XX. Trong tiến trình xây dựng nền xiếc chuyên nghiệp, NSND Tạ Duy Hiển (1889–1967) được ghi nhận là người đặt nền móng cho nghệ thuật xiếc Việt Nam hiện đại. Năm 1922, ông thành lập gánh xiếc do người Việt tổ chức và biểu diễn chuyên nghiệp đầu tiên, mở ra bước phát triển mới cho nghệ thuật xiếc nước ta. Sau Cách mạng Tháng Tám, ông tiếp tục tham gia xây dựng Đoàn Xiếc Thống Nhất, tiền thân của Liên đoàn Xiếc Việt Nam, góp phần đào tạo nhiều thế hệ nghệ sĩ và đặt nền tảng cho sự phát triển của nghệ thuật xiếc chuyên nghiệp tại Việt Nam. Những đóng góp của ông Tạ Duy Hiển có ý nghĩa quan trọng trong việc bảo tồn, phát huy nghệ thuật xiếc dân tộc và tạo tiền đề để xiếc Việt Nam từng bước hội nhập với xu hướng phát triển của nghệ thuật xiếc thế giới.
Tài liệu video tham khảo: https://youtu.be/rS_aUw4UvKg`
  },
  {
    id: 'circus-concept-contemporary-nouveau',
    title: 'Nguồn gốc và khái niệm Xiếc đương đại (Contemporary Circus)',
    category: 'concept',
    keywords: ['xiếc đương đại', 'Contemporary Circus', 'Nouveau Cirque', 'Pháp', '1970', 'nghệ thuật biểu diễn'],
    rawContent: `Trên cơ sở kế thừa những giá trị của xiếc truyền thống, từ cuối thập niên 1960 và phát triển mạnh từ những năm 1970, một xu hướng đổi mới trong nghệ thuật xiếc bắt đầu hình thành tại châu Âu với tên gọi xiếc đương đại (Contemporary Circus hoặc Contemporary Circus Arts). Loại hình này chịu ảnh hưởng từ phong trào Nouveau Cirque tại Pháp, hướng đến việc đổi mới tư duy sáng tạo trong nghệ thuật biểu diễn, giảm dần sự phụ thuộc vào các tiết mục trình diễn động vật và tăng cường khả năng biểu đạt của cơ thể con người thông qua sự kết hợp giữa kỹ thuật xiếc với các yếu tố sân khấu, múa đương đại, âm nhạc, mỹ thuật, ánh sáng và nghệ thuật kể chuyện.`
  },
  {
    id: 'circus-comparison-traditional-vs-contemporary',
    title: 'Sự khác biệt giữa xiếc truyền thống và xiếc đương đại Việt Nam',
    category: 'concept',
    keywords: ['so sánh', 'xiếc truyền thống', 'xiếc đương đại', 'À Ố Show', 'Mơ Show', 'đạo cụ dân tộc'],
    rawContent: `Sự khác biệt giữa xiếc truyền thống và xiếc đương đại Việt Nam:
1. Xiếc truyền thống: Tập trung chủ yếu vào các kỹ thuật đơn lẻ và thể lực như nhào lộn, tung hứng, thăng bằng, hoặc các tiểu xảo, tiết mục xiếc thú, xiếc vòng phục vụ giải trí cho trẻ em.
2. Nghệ thuật xiếc đương đại Việt Nam: Không chỉ dừng lại ở từng kỹ thuật đơn lẻ mà mỗi tiết mục là một câu chuyện mang thông điệp nhân văn sâu sắc. Tiết mục được kết hợp chặt chẽ với các đạo cụ truyền thống Việt Nam (thuyền thúng, rổ tre, gậy tre...), tái hiện các câu chuyện thân thuộc như làng quê Việt Nam (À Ố SHOW), sự trưởng thành của một đứa trẻ và những cảm nhận đầu đời về ánh sáng, màu sắc (MƠ SHOW). Tác phẩm truyền tải thông điệp văn hóa, khơi gợi ký ức và chạm tới cảm xúc người xem.
Video minh họa xiếc đương đại: https://youtu.be/gT8aKTdl60Q
Video minh họa xiếc truyền thống: https://youtu.be/SDrrtc0AFeU`
  },
  {
    id: 'circus-career-training-duration',
    title: 'Thời gian khổ luyện và đào tạo để trở thành diễn viên xiếc đương đại',
    category: 'career',
    keywords: ['đào tạo', 'khổ luyện', 'thời gian', 'Nguyễn Khánh Linh', 'Đoàn xiếc TPHCM', 'À Ố Show', '20 năm'],
    rawContent: `Để đứng trên sân khấu biểu diễn, diễn viên xiếc thường mất bao lâu để thành thạo:
Theo chia sẻ từ nghệ sĩ xiếc đương đại Nguyễn Khánh Linh: Nghệ sĩ bắt đầu học xiếc từ năm 11 tuổi, trải qua 5 năm rèn luyện khổ luyện khắt khe trong trường lớp mới có thể được đứng trên sân khấu biểu diễn chuyên nghiệp. Tính cả thời gian tập luyện và hoạt động biểu diễn liên tục là hơn 20 năm. Ban đầu là diễn viên tại Đoàn xiếc TP.HCM hơn 3 năm, sau đó chuyển sang Đoàn xiếc Đương đại tham gia các vở diễn lớn như À Ố Show.`
  },
  {
    id: 'circus-career-challenges-teamwork',
    title: 'Khó khăn và thách thức lớn nhất của diễn viên xiếc',
    category: 'career',
    keywords: ['thách thức', 'khó khăn', 'làm việc nhóm', 'tập luyện', 'Nguyễn Khánh Linh', 'xung đột'],
    rawContent: `Khó khăn và thách thức lớn nhất của một diễn viên xiếc:
Theo nghệ sĩ xiếc đương đại Nguyễn Khánh Linh: Trong quá trình tập luyện cá nhân, điều gian nan nhất là sự khổ luyện khắc nghiệt về thể lực và kỹ thuật. Tuy nhiên, trong công việc biểu diễn tập thể, thách thức lớn nhất là làm việc nhóm. Mọi động tác xiếc đều đòi hỏi sự phối hợp nhịp nhàng, chuẩn xác từng giây. Việc các thành viên xảy ra bất đồng, xung đột trong quá trình luyện tập là điều khó tránh khỏi, nhưng khi mọi người đều hướng tới mục tiêu chung là hoàn thành bài diễn trọn vẹn và thăng hoa nhất thì mọi khó khăn đều được tháo gỡ.`
  },
  {
    id: 'circus-artistry-decisive-factors',
    title: 'Yếu tố quyết định giá trị nghệ thuật của một tác phẩm xiếc đương đại',
    category: 'artistry',
    keywords: ['yếu tố quyết định', 'giá trị nghệ thuật', 'kỹ thuật', 'cảm xúc', 'chạm đến cảm xúc', 'À Ố Show'],
    rawContent: `Những yếu tố quyết định giá trị nghệ thuật của một tác phẩm xiếc đương đại:
Theo nghệ sĩ xiếc đương đại Nguyễn Khánh Linh: Đó là sự cân bằng hài hòa giữa kỹ thuật biểu diễn điêu luyện và cảm xúc mà tiết mục mang lại cho khán giả. Một vở diễn xiếc đương đại thành công khi vừa có kỹ thuật đủ bất ngờ, ngoạn mục đúng chất xiếc, vừa chạm sâu vào trái tim người xem, khiến khán giả xúc động rơi nước mắt. Ví dụ khi vở diễn tái hiện khung cảnh làng quê bình dị trong À Ố SHOW, nó gợi nhắc ký ức tuổi thơ thân thương, mở khóa cảm xúc lắng đọng của khán giả.`
  },
  {
    id: 'circus-artistry-technique-and-emotion',
    title: 'Mối quan hệ giữa kỹ thuật khó và cảm xúc trong xiếc đương đại',
    category: 'artistry',
    keywords: ['kỹ thuật khó', 'cảm xúc', 'tiết mục hay', 'cân bằng', 'Nguyễn Khánh Linh'],
    rawContent: `Kỹ thuật khó có quyết định một tiết mục xiếc đương đại hay không?
Trả lời: Kỹ thuật khó là điều kiện cần nhưng chưa đủ. Để tạo nên một tác phẩm xiếc đương đại xuất sắc, kỹ thuật biểu diễn bắt buộc phải song hành với cảm xúc. Kỹ thuật đỉnh cao mang lại sự thán phục, hồi hộp, nhưng chính câu chuyện, âm nhạc và linh hồn của vở diễn mới là thứ chạm vào trái tim và lưu lại lâu dài trong tâm trí người thưởng thức.`
  },
  {
    id: 'circus-history-cultural-influences',
    title: 'Các nền văn hóa ảnh hưởng đến nghệ thuật xiếc Việt Nam',
    category: 'history',
    keywords: ['ảnh hưởng văn hóa', 'xiếc Nga', 'xiếc Trung Quốc', 'bản sắc dân tộc', '100 năm'],
    rawContent: `Xiếc Việt Nam chịu ảnh hưởng từ những nền văn hóa nào?
Trả lời: Xiếc Việt Nam từng tiếp thu và chịu ảnh hưởng từ các trường phái xiếc lớn có bề dày lịch sử như xiếc Nga (Liên Xô) và xiếc Trung Quốc. Tuy nhiên, trải qua hành trình hơn 100 năm phát triển, các thế hệ nghệ sĩ, đạo diễn và diễn viên Việt Nam đã bồi đắp và sáng tạo thêm những màu sắc, đường nét đậm đà bản sắc văn hóa dân tộc, tạo nên phong cách xiếc Việt Nam độc đáo và giàu hồn cốt quê hương.`
  },
  {
    id: 'circus-history-world-origins',
    title: 'Khởi nguồn lịch sử của nghệ thuật xiếc hiện đại thế giới',
    category: 'history',
    keywords: ['khởi nguồn xiếc', 'thế giới', 'Philip Astley', '1768', 'London', 'thế kỷ XVIII'],
    rawContent: `Xiếc thế giới bắt đầu từ khi nào?
Trả lời: Vào thế kỷ XVIII tại châu Âu, nghệ thuật xiếc bước sang một kỷ nguyên phát triển mới. Philip Astley - một nghệ sĩ cưỡi ngựa tài ba người Anh - được công nhận là một trong những người đặt nền móng cho xiếc hiện đại. Năm 1768 tại London, ông bắt đầu biểu diễn các màn cưỡi ngựa kỹ thuật cao bên trong một vòng tròn (ring). Sau đó, Astley đưa thêm các tiết mục nhào lộn, tung hứng, đi dây thăng bằng và hài kịch vào chương trình, hình thành nên mô hình biểu diễn nghệ thuật xiếc tổng hợp mà chúng ta biết ngày nay.`
  },
  {
    id: 'circus-history-vn-development-stages',
    title: 'Các giai đoạn phát triển lịch sử của xiếc Việt Nam từ năm 1918 đến nay',
    category: 'history',
    keywords: ['giai đoạn phát triển', 'gánh xiếc Năm Tú', 'Sáu Súng', 'Tân Nam Việt', 'Tạ Duy Hiển 1922', 'chợ Hàng Da', 'Lưu Khánh Vân'],
    rawContent: `Các giai đoạn phát triển chính trong lịch sử xiếc Việt Nam:
1. Giai đoạn mở đầu (1918–1924): Trước sự du nhập của các đoàn xiếc phương Tây, nghệ nhân xiếc trong nước đã liên kết mở lò luyện xiếc và thành lập các gánh xiếc bản địa: gánh xiếc Năm Tú ở Mỹ Tho (1918), Sáu Súng ở Nam Bộ (1919), gánh xiếc Tân Nam Việt tại Sài Gòn (1922), gánh xiếc Việt Nam của Tạ Duy Hiển ở Hà Nội (1922), gánh xiếc Đại Nam của Lưu Khánh Vân (1924)...
2. Sự kiện bước ngoặt (05/12/1922): Cụ Tạ Duy Hiển công diễn buổi biểu diễn quy mô lớn đầu tiên tại chợ Hàng Da (Hà Nội) với dàn nghệ sĩ đông đảo và đoàn xiếc thú (voi, hổ, gấu, ngựa, dê, chó, khỉ...), đánh dấu sự mở đầu chính thức cho thời kỳ Xiếc Việt Nam hiện đại.
3. Giai đoạn đương đại: Ngày nay, xiếc Việt Nam vượt ra ngoài khuôn khổ kỹ thuật thuần túy, kết hợp tinh tế cùng múa rối (MƠ SHOW), đạo cụ tre nứa đậm chất văn hóa dân gian (À Ố SHOW), cùng kịch bản sân khấu được dàn dựng công phu, tạo nên Nghệ thuật xiếc đương đại Việt Nam.`
  },
  {
    id: 'circus-venue-hcm-phutho-mo-show',
    title: 'Địa điểm biểu diễn tại TP.HCM: Rạp xiếc Phú Thọ và vở diễn Mơ Show',
    category: 'venues_hcm',
    keywords: ['Phú Thọ', 'TP.HCM', 'Mơ Show', 'Dreamscape Show', '70 phút', 'Nhà hát Phương Nam', 'đặt vé'],
    rawContent: `Rạp xiếc và Biểu diễn đa năng Phú Thọ (TP. Hồ Chí Minh):
- Vở diễn tiêu biểu: Mơ Show - Dreamscape Show (nghệ thuật xiếc đương đại kết hợp hiệu ứng thị giác).
- Thời lượng biểu diễn: 70 phút.
- Nội dung: Tác phẩm đưa khán giả vào hành trình trưởng thành của một đứa trẻ, từ những cảm nhận đầu tiên về ánh sáng, màu sắc và sự sống cho đến khi khám phá, định hình các cung bậc cảm xúc tâm hồn.
- Đặt vé: Trực tuyến trên website chính thức của Nhà hát Nghệ thuật Phương Nam.
- Bản đồ: https://maps.app.goo.gl/GFoJWHMCsHR8g4qT7`
  },
  {
    id: 'circus-venue-hcm-giadinh-vung-dat-ky-bi',
    title: 'Địa điểm biểu diễn tại TP.HCM: Rạp xiếc Công viên Gia Định và vở Vùng Đất Kỳ Bí',
    category: 'venues_hcm',
    keywords: ['Gia Định', 'Công viên Gia Định', 'TP.HCM', 'Vùng Đất Kỳ Bí', '120 phút', 'Ngũ hành', 'Phương Nam'],
    rawContent: `Rạp xiếc Công viên Gia Định (TP. Hồ Chí Minh):
- Vở diễn tiêu biểu: Vùng Đất Kỳ Bí - Phiên bản Pro max.
- Thời lượng biểu diễn: 120 phút.
- Nội dung: Vở diễn theo chân hành trình của các nguyên tố trong Ngũ hành, từ sự đối đầu, tranh đấu cho đến khi các nguyên tố học cách thấu hiểu, kết nối và hòa hợp nhằm tái lập sự cân bằng hoàn mỹ cho thiên nhiên.
- Đặt vé: Trực tuyến trên website của Nhà hát Nghệ thuật Phương Nam.
- Bản đồ: https://maps.app.goo.gl/A8933G8p7LjdwKXV8`
  },
  {
    id: 'circus-venue-hcm-operahouse-a-o-show',
    title: 'Địa điểm biểu diễn tại TP.HCM: Nhà hát Thành phố và À Ố Show',
    category: 'venues_hcm',
    keywords: ['Nhà hát Thành phố', 'TP.HCM', 'À Ố Show', 'Lune Production', '60 phút', 'thuyền thúng', 'rổ tre'],
    rawContent: `Nhà hát Thành phố Hồ Chí Minh (Opera House):
- Vở diễn tiêu biểu: À Ố SHOW (thuộc Lune Production).
- Thời lượng biểu diễn: 60 phút.
- Nội dung: Bản hòa âm mộc mạc giữa vẻ đẹp yên bình của làng quê Việt Nam và nhịp sống trẻ trung, sôi động nơi đô thị hiện đại. Sử dụng đạo cụ tre nứa thân thuộc như thuyền thúng, rổ tre, gậy tre kết hợp kỹ thuật nhào lộn xiếc đương đại và âm nhạc dân tộc sống động.
- Đặt vé: Trực tuyến trên website chính thức của Lune Production.
- Bản đồ: https://maps.app.goo.gl/WWLX2kTfvQx3e65L8`
  },
  {
    id: 'circus-venue-hcm-damsen-huyen-su-rong-tien',
    title: 'Địa điểm biểu diễn tại TP.HCM: Rạp xiếc Đầm Sen và vở Huyền Sử Rồng Tiên',
    category: 'venues_hcm',
    keywords: ['Đầm Sen', 'TP.HCM', 'Huyền Sử Rồng Tiên', '90 phút', 'Cha Rồng Mẹ Tiên', 'dịp lễ'],
    rawContent: `Rạp xiếc Đầm Sen (TP. Hồ Chí Minh):
- Vở diễn tiêu biểu: Huyền Sử Rồng Tiên.
- Thời lượng biểu diễn: 90 phút.
- Nội dung: Tái hiện truyền thuyết cội nguồn dân tộc với biểu tượng Cha Rồng đại diện cho sức mạnh và Mẹ Tiên đại diện cho tình mẫu tử, lòng nhân hậu và sự dịu dàng.
- Lưu ý biểu diễn: Vở diễn thường chỉ phục vụ vào những dịp lễ hoặc sự kiện văn hóa đặc biệt, không diễn ra cố định hàng tuần.
- Đặt vé: Thông qua website của Nhà hát Phương Nam.
- Bản đồ: https://maps.app.goo.gl/RAFRuHhQpeE1mLsQ7`
  },
  {
    id: 'circus-venue-hn-central-vo-ngua-bien-cuong',
    title: 'Địa điểm biểu diễn tại Hà Nội: Rạp xiếc Trung ương và vở Vó Ngựa Biên Cương',
    category: 'venues_hn',
    keywords: ['Rạp xiếc Trung ương', 'Hà Nội', 'Vó Ngựa Biên Cương', 'Bộ đội Biên phòng', 'Tri ân liệt sĩ', '79 năm'],
    rawContent: `Rạp xiếc Trung ương (Hà Nội):
- Vở diễn tiêu biểu: Vó Ngựa Biên Cương.
- Ý nghĩa: Tác phẩm xiếc nghệ thuật dàn dựng nhằm tôn vinh sự hy sinh thầm lặng của lực lượng Bộ đội Biên phòng và tri ân các anh hùng liệt sĩ nhân dịp kỷ niệm 79 năm Ngày Thương binh - Liệt sĩ.
- Đơn vị quản lý: Liên đoàn Xiếc Việt Nam.
- Bản đồ: https://maps.app.goo.gl/zi3RkNzbFGENHH737`
  },
  {
    id: 'circus-venue-hn-circus-theatre',
    title: 'Địa điểm biểu diễn tại Hà Nội: Nhà hát Nghệ thuật Xiếc và Tạp kỹ Hà Nội',
    category: 'venues_hn',
    keywords: ['Nhà hát Xiếc Tạp kỹ Hà Nội', 'Hà Nội', 'nghệ thuật tổng hợp', 'sự kiện', 'ca múa nhạc'],
    rawContent: `Nhà hát Nghệ thuật Xiếc và Tạp kỹ Hà Nội:
- Loại hình hoạt động: Thường xuyên tổ chức các chương trình nghệ thuật tổng hợp (kết hợp Xiếc, Tạp kỹ, Ca múa nhạc) phục vụ các chiến dịch văn hóa, ngày lễ lớn và các sự kiện của thủ đô và cả nước.
- Bản đồ: https://maps.app.goo.gl/MkSpPy2LpmKy2Zi5A`
  },
  {
    id: 'circus-ethics-animal-welfare-transition',
    title: 'Lý do các chương trình xiếc ngày nay chuyển dịch không còn dùng động vật',
    category: 'ethics',
    keywords: ['xiếc thú', 'quyền động vật', 'chuyển dịch', '1960', 'bảo vệ động vật', 'xiếc đương đại'],
    rawContent: `Vì sao ngày nay nhiều chương trình xiếc không còn sử dụng động vật hoang dã?
Trả lời: 
1. Bối cảnh lịch sử: Từ những năm 1960, các rạp xiếc truyền thống dần đối mặt với sự sụt giảm khán giả do sự phát triển của truyền hình và điện ảnh.
2. Nâng cao nhận thức xã hội: Làn sóng bảo vệ quyền động vật toàn cầu dâng cao khiến công chúng ngày càng không ủng hộ việc huấn luyện và sử dụng động vật hoang dã để biểu diễn giải trí.
3. Xu hướng nghệ thuật đương đại: Các thế hệ nghệ sĩ trẻ khao khát tìm hướng đi mới, biến xiếc từ trò diễn tạp kỹ thành một bộ môn nghệ thuật sân khấu có chiều sâu văn hóa và cảm xúc. Vì vậy, xiếc đương đại tập trung vào khả năng kỳ diệu của cơ thể con người, kết hợp kịch bản, âm nhạc, đạo cụ dân gian mà không cần dựa vào thú vật.`
  }
]

// Function to clean text: strip emojis, decorative symbols, HTML entities, and broken markdown escapes
function cleanText(text: string): string {
  return text
    // Remove emojis using standard unicode property escapes
    .replace(/\p{Extended_Pictographic}/gu, '')
    // Remove skin tone modifiers and variation selectors
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
    .replace(/[\uFE00-\uFE0F]/g, '')
    .replace(/\u200D/g, '')
    // Remove arrow symbols
    .replace(/[→]/g, '')
    // Clean HTML entities
    .replace(/&nbsp;/gi, ' ')
    // Clean markdown escapes
    .replace(/\\_/g, '_')
    .replace(/\\-/g, '-')
    .replace(/\\\./g, '.')
    // Normalize spaces and line breaks
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim()
}

async function getGeminiEmbedding(text: string, apiKey: string): Promise<number[]> {
  const model = 'gemini-embedding-2'
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${encodeURIComponent(apiKey)}`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      content: {
        parts: [{ text }],
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Embedding API failed (${res.status}): ${errText}`)
  }

  const json = (await res.json()) as { embedding?: { values?: number[] } }
  if (!json.embedding?.values) {
    throw new Error('No embedding values returned')
  }

  return json.embedding.values
}

async function main() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || ''
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY environment variable is required to vectorize chunks.')
  }
  console.log(`Starting RAG data preparation...`)
  console.log(`API Key: ${apiKey.slice(0, 8)}... (${apiKey.length} chars)`)
  console.log(`Embedding Model: gemini-embedding-2`)

  const cleanKnowledgeBaseMd: string[] = [
    '# CƠ SỞ DỮ LIỆU TRI THỨC: XIẾC ĐƯƠNG ĐẠI VIỆT NAM (Dành cho RAG)',
    '*(Đã làm sạch toàn bộ icon, chuẩn hóa định dạng và chia thành các chunk ngữ nghĩa)*\n',
  ]

  const processedChunks = []

  for (let i = 0; i < RAW_CHUNKS.length; i++) {
    const chunkDef = RAW_CHUNKS[i]
    const cleanContent = cleanText(chunkDef.rawContent)
    const embeddingInput = `Tiêu đề: ${chunkDef.title}\nChủ đề: ${chunkDef.category}\nNội dung:\n${cleanContent}`

    console.log(`[${i + 1}/${RAW_CHUNKS.length}] Vectorizing chunk: ${chunkDef.id}...`)
    
    // Call gemini-embedding-2 API
    const embedding = await getGeminiEmbedding(embeddingInput, apiKey)

    processedChunks.push({
      id: chunkDef.id,
      title: chunkDef.title,
      category: chunkDef.category,
      keywords: chunkDef.keywords,
      content: cleanContent,
      embeddingLength: embedding.length,
      embedding,
    })

    cleanKnowledgeBaseMd.push(`## ${i + 1}. [${chunkDef.category.toUpperCase()}] ${chunkDef.title}`)
    cleanKnowledgeBaseMd.push(`**ID:** \`${chunkDef.id}\``)
    cleanKnowledgeBaseMd.push(`**Keywords:** ${chunkDef.keywords.join(', ')}`)
    cleanKnowledgeBaseMd.push(`\n${cleanContent}\n`)
    cleanKnowledgeBaseMd.push('---\n')
  }

  const outDir = path.resolve(import.meta.dirname, '../src/data')
  fs.mkdirSync(outDir, { recursive: true })

  // 1. Save vector knowledge base JSON
  const jsonPath = path.join(outDir, 'rag_knowledge_base.json')
  fs.writeFileSync(jsonPath, JSON.stringify(processedChunks, null, 2), 'utf-8')
  console.log(`Successfully saved ${processedChunks.length} vectorized chunks to: ${jsonPath}`)

  // 2. Save clean markdown version for inspection
  const mdPath = path.join(outDir, 'clean_knowledge_base.md')
  fs.writeFileSync(mdPath, cleanKnowledgeBaseMd.join('\n'), 'utf-8')
  console.log(`Successfully saved clean human-readable markdown to: ${mdPath}`)

  console.log(`RAG preparation complete! Embedding vector dimensions: ${processedChunks[0].embedding.length}`)
}

main().catch((err) => {
  console.error('Fatal error during RAG preparation:', err)
  process.exit(1)
})
