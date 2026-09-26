import type { RetrievedSource } from '../types/chat'

export const CIRCUS_VENUES_AND_TICKETS_ANSWER = `🌟HCM🌟

📍RẠP XIẾC VÀ BIỂU DIỄN ĐA NĂNG PHÚ THỌ
Địa chỉ: https://maps.app.goo.gl/GFoJWHMCsHR8g4qT7?g_st=ipc
🖇️Rạp xiếc và Biểu diễn đa năng Phú Thọ hiện đang diễn ra vở diễn nghệ thuật xiếc đương đại “Mơ Show - Dreamscape Show”, bạn có thể đặt vé trên website của Nhà hát Phương Nam.
⏰Với thời lượng 70 phút, các bạn sẽ bước vào thế giới sự trưởng thành của một đứa bé từ những cảm nhận đầu tiên về ánh sáng, màu sắc, sự sống đến khi khám phá và gọi tên các cung bậc cảm xúc của mình.

📍RẠP XIẾC CÔNG VIÊN GIA ĐỊNH
Địa chỉ: https://maps.app.goo.gl/A8933G8p7LjdwKXV8?g_st=ipc
🖇️Rạp xiếc Công viên Gia Định hiện đang diễn ra vở diễn nghệ thuật xiếc “Vùng Đất Kỳ Bí - Phiên bản Pro max”, bạn có thể đặt vé trên website của Nhà hát Phương Nam.
⏰Với thời lượng 120 phút, các bạn sẽ theo chân hành trình của từng nguyên tố Ngũ hành, từ sự tranh đấu cho đến khi học cách kết nối, hòa hợp để mang lại sự cân bằng, đưa thiên nhiên trở lại trạng thái hoàn mỹ.

📍NHÀ HÁT THÀNH PHỐ HỒ CHÍ MINH
Địa chỉ: https://maps.app.goo.gl/WWLX2kTfvQx3e65L8?g_st=ipc
🖇️Nhà hát Thành Phố Hồ Chí Minh hiện đang diễn ra vở diễn nghệ thuật xiếc “À Ố SHOW”, bạn có thể đặt vé trên website chính thức Lune Production
⏰Với 60 phút, các bạn sẽ thưởng thức một bản hoà âm dân dã của đồng quê Việt pha trộn với giai điệu trẻ trung rất đời của đô thị Việt Nam. Sử dụng các đạo cụ “cây nhà lá vườn” mộc mạc, gần gũi như thuyền thúng, rổ tre,... À Ố Show tạo nên một bức tranh bình dị nhưng đẹp đến ngỡ ngàng.

📍RẠP XIẾC ĐẦM SEN
Địa chỉ: https://maps.app.goo.gl/RAFRuHhQpeE1mLsQ7?g_st=ipc
🖇️Rạp xiếc Đầm Sen hiện đang có vở diễn nghệ thuật xiếc “Huyền Sử Rồng Tiên”, bạn có thể đặt vé trên website Nhà hát Phương Nam. Vở diễn này chỉ diễn vào những dịp đặc biệt và không diễn ra thường xuyên, các bạn cân nhắc nhé!
⏰Với 90 phút, các bạn sẽ được khám phá Huyền sử với biểu tượng cho sức mạnh - “Cha Rồng” và “Mẹ Tiên” - một biểu tượng cho tình yêu và sự dịu dàng.

🌟HN🌟

📍RẠP XIẾC TRUNG ƯƠNG
Địa chỉ: https://maps.app.goo.gl/zi3RkNzbFGENHH737?g_st=ipc
🖇️Rạp xiếc Trung ương đã thực hiện vở diễn nghệ thuật xiếc “Vó Ngựa Biên Cương” nhằm tôn vinh lực lượng Bộ đội Biên phòng và tri ân các anh hùng liệt sĩ nhân dịp kỷ niệm 79 năm Ngày Thương binh - Liệt sĩ.

📍NHÀ HÁT NGHỆ THUẬT XIẾC VÀ TẠP KỸ HÀ NỘI
Địa chỉ: https://maps.app.goo.gl/MkSpPy2LpmKy2Zi5A?g_st=ipc
Nhà hát nghệ thuật xiếc và tạp kỹ Hà Nội thường tổ chức các chương trình Nghệ thuật tổng hợp (Xiếc - Tạp kỹ - Ca múa nhạc) hoặc các vở diễn theo chiến dịch, sự kiện.`

/**
 * Chuẩn hóa chuỗi tiếng Việt không dấu, loại bỏ ký tự đặc biệt để so khớp chính xác
 */
export function normalizeVietnamese(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Kiểm tra xem câu hỏi có thuộc nhóm địa điểm biểu diễn xiếc / mua vé hay không
 * Bao gồm các câu hỏi chỉ định:
 * - "Các đoàn xiếc Việt Nam thường biểu diễn ở đâu?"
 * - "địa điểm biểu diễn xiếc"
 * - "mua vé ở đâu"
 * cùng các biến thể thông dụng.
 */
export function matchCircusVenuesQuestion(query: string): boolean {
  const norm = normalizeVietnamese(query)
  if (!norm) return false

  // Danh sách các mẫu câu khớp trực tiếp
  const exactPatterns = [
    'cac doan xiec viet nam thuong bieu dien o dau',
    'cac doan xiec viet nam bieu dien o dau',
    'doan xiec viet nam thuong bieu dien o dau',
    'doan xiec viet nam bieu dien o dau',
    'cac doan xiec bieu dien o dau',
    'doan xiec bieu dien o dau',
    'dia diem bieu dien xiec',
    'dia diem bieu dien',
    'dia diem dien xiec',
    'dia diem xem xiec',
    'dia diem rap xiec',
    'bieu dien o dau',
    'dien o dau',
    'mua ve o dau',
    'mua ve xem xiec o dau',
    'mua ve xiec o dau',
    'mua ve xiec',
    'mua ve',
    'dat ve o dau',
    'dat ve xiec o dau',
    'dat ve xiec',
    'dat ve',
    'ban ve o dau',
    'rap xiec o dau',
    'xem xiec o dau',
    'dia chi cac rap xiec',
    'dia chi rap xiec',
    'rap xiec bieu dien o dau',
  ]

  for (const pattern of exactPatterns) {
    if (norm === pattern || norm.includes(pattern)) {
      return true
    }
  }

  // Khớp theo tổ hợp từ khóa liên quan đến xiếc + địa điểm/mua vé
  const hasCircus = norm.includes('xiec') || norm.includes('rap') || norm.includes('doan')
  const hasTicket = norm.includes('ve') || norm.includes('mua ve') || norm.includes('dat ve')
  const hasLocation =
    norm.includes('o dau') ||
    norm.includes('dia diem') ||
    norm.includes('dia chi') ||
    norm.includes('noi nao') ||
    norm.includes('cho nao')
  const hasPerform = norm.includes('bieu dien') || norm.includes('dien') || norm.includes('xem')

  if (hasTicket && (hasCircus || hasLocation || norm === 'mua ve' || norm.startsWith('mua ve'))) {
    return true
  }

  if (hasCircus && (hasLocation || hasPerform) && (norm.includes('dau') || norm.includes('dia diem'))) {
    return true
  }

  return false
}

export const CIRCUS_VENUES_SOURCE: RetrievedSource = {
  id: 'circus-venues-and-tickets-official',
  title: 'Địa điểm biểu diễn và hướng dẫn mua vé các Rạp Xiếc Việt Nam',
  category: 'venues',
  similarity: 1.0,
  content: CIRCUS_VENUES_AND_TICKETS_ANSWER,
}

export function getPredefinedAnswer(query: string): {
  answer: string
  sources: RetrievedSource[]
} | null {
  if (matchCircusVenuesQuestion(query)) {
    return {
      answer: CIRCUS_VENUES_AND_TICKETS_ANSWER,
      sources: [CIRCUS_VENUES_SOURCE],
    }
  }
  return null
}
