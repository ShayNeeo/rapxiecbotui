import React from "react";
import { Button } from "@/src/components/ui/button";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import { 
  ArrowLeft, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  BookOpen, 
  Globe2, 
  Compass, 
  Award, 
  Users, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Target,
  ExternalLink
} from "lucide-react";

interface CircusAboutProps {
  onBack: () => void;
  onNavigateTo: (act: 'promo' | 'history' | 'circus3d' | 'stage') => void;
}

export const CircusAbout: React.FC<CircusAboutProps> = ({
  onBack,
  onNavigateTo,
}) => {
  const { isEn } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in-50 duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-amber-300/80">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            circusAudio.playBambooStep();
            onBack();
          }}
          className="bg-white/80 border-amber-400 text-amber-950 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="size-4 text-red-700" />
          <span>{isEn ? "Back to Stage" : "Quay Lại Sân Khấu"}</span>
        </Button>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full shadow-xs">
          <Sparkles className="size-3.5 text-amber-600" />
          <span>{isEn ? "School Cultural Project & Digital Art Showcase" : "Dự Án Văn Hóa Học Đường & Nghệ Thuật Số"}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-400 bg-gradient-to-br from-[#801414] via-[#590d0d] to-[#260505] p-6 sm:p-10 text-white text-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-circus-tent" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span>{isEn ? "🎪 About Us • Project Overview" : "🎪 Về Chúng Tôi • About Us"}</span>
          </div>

          <h1 className="font-circus text-3xl sm:text-5xl text-amber-300 tracking-wide drop-shadow-md">
            {isEn ? "VIETNAM POCKET CIRCUS" : "RẠP XIẾC BỎ TÚI VIỆT NAM"}
          </h1>

          <p className="text-base sm:text-lg text-amber-100 font-medium leading-relaxed max-w-2xl mx-auto">
            {isEn ? "Nurturing Heritage - Harmonizing with the Digital Age" : "Nuôi dưỡng tinh hoa - Hoà cầu nhịp số"}
          </p>

          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-xl mx-auto pt-2">
            {isEn
              ? "A digitized experiential space created with passion to bring circus arts closer to students, the younger generation, and connect the beauty of contemporary Vietnamese circus to the world."
              : "Không gian trải nghiệm số hóa ra đời với tâm huyết đưa nghệ thuật xiếc đến gần hơn với thế hệ trẻ, học sinh, sinh viên và kết nối vẻ đẹp xiếc đương đại Việt Nam ra thế giới."}
          </p>
        </div>
      </div>

      {/* Introduction: Who We Are / Chúng mình là ai */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-bold shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              {isEn ? "Opening Words" : "Lời Ngỏ Đầu Tiên"}
            </span>
            <h2 className="font-circus text-xl sm:text-2xl text-neutral-900">
              {isEn ? "Who We Are?" : "Chúng Mình Là Ai?"}
            </h2>
          </div>
        </div>

        <div className="prose prose-sm text-neutral-700 leading-relaxed space-y-3 pt-2">
          {isEn ? (
            <>
              <p>
                Hello! We are the founding team of the <strong>"Pocket Circus"</strong> project - where young people with a deep passion for contemporary circus connect to raise awareness and spread the beauty of this performing art through digital storytelling.
              </p>
              <p>
                Amidst the fast pace of modern life and countless entertainment options, circus can sometimes feel unfamiliar or overlooked in its true value. We believe that contemporary circus is not just entertainment, but a magnificent treasure of performing arts - crystallized from sweat, courage, and the extraordinary perseverance of artists.
              </p>
            </>
          ) : (
            <>
              <p>
                Chào bạn! Chúng mình là nhóm sáng lập dự án <strong>"Rạp Xiếc Bỏ Túi"</strong> - nơi những người trẻ mang niềm đam mê sâu sắc với xiếc đương đại cùng kết nối để nâng cao nhận thức và lan tỏa vẻ đẹp của bộ môn nghệ thuật này qua ngôn ngữ số.
              </p>
              <p>
                Giữa nhịp sống hối hả và vô vàn lựa chọn giải trí hiện đại, xiếc đôi khi trở nên xa lạ hoặc bị nhìn nhận chưa đúng với giá trị vốn có. Chúng mình tin rằng, xiếc đương đại không chỉ là những màn trình diễn giải trí, mà là một kho tàng nghệ thuật rực rỡ - nơi kết tinh từ mồ hôi, lòng dũng cảm và tinh thần khổ luyện phi thường của các nghệ sĩ.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Dual Core Purpose / Mục Đích & Sứ Mệnh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purpose 1: Raise awareness among students */}
        <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="size-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
              <GraduationCap className="size-6" />
            </div>

            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                {isEn ? "Purpose 01 • School & Education" : "Mục Đích 01 • Học Đường"}
              </span>
              <h3 className="font-circus text-xl text-neutral-900 mt-1">
                {isEn ? "Raising Awareness Among Students & Youth" : "Nâng Cao Nhận Thức Học Sinh & Sinh Viên"}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {isEn
                ? "Xây dựng cầu nối giữa nghệ thuật xiếc và thế hệ trẻ. Chúng mình mong muốn giúp các bạn có cái nhìn gần gũi và toàn diện hơn về xiếc Việt Nam - từ những giá trị được gìn giữ qua thời gian đến sự đổi mới, sáng tạo của xiếc đương đại hôm nay. Không chỉ tìm hiểu, các bạn còn có thể trực tiếp khám phá và trải nghiệm nghệ thuật xiếc qua những hình thức tương tác mới mẻ, từ đó hiểu hơn, cảm nhận hơn và thêm hứng thú với nghệ thuật xiếc Việt Nam."
                : "Xây dựng cầu nối giữa nghệ thuật xiếc và thế hệ trẻ. Chúng mình mong muốn giúp các bạn có cái nhìn gần gũi và toàn diện hơn về xiếc Việt Nam - từ những giá trị được gìn giữ qua thời gian đến sự đổi mới, sáng tạo của xiếc đương đại hôm nay. Không chỉ tìm hiểu, các bạn còn có thể trực tiếp khám phá và trải nghiệm nghệ thuật xiếc qua những hình thức tương tác mới mẻ, từ đó hiểu hơn, cảm nhận hơn và thêm hứng thú với nghệ thuật xiếc Việt Nam."}
            </p>

            {isEn ? (
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                (Building a bridge between circus arts and the younger generation: offering an intimate, holistic appreciation of Vietnamese circus from heritage to contemporary innovation through rich multimedia interactivity.)
              </p>
            ) : null}

            <ul className="space-y-2 pt-2 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Digitizing historical archives and lessons into visual interactive multimedia."
                    : "Số hóa tư liệu lịch sử, bài học thành hình thức tương tác đa phương tiện trực quan."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Equipping knowledge through exciting Quiz challenges and circus history exploration."
                    : "Trang bị kiến thức thông qua các thử thách Quiz thú vị và phần khám phá lịch sử về Xiếc."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Providing handy guides and practical show recommendations friendly to student budgets."
                    : "Cung cấp cẩm nang và gợi ý vé trải nghiệm thực tế thân thiện với ngân sách sinh viên."}
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-amber-200">
            <span className="text-[11px] font-semibold text-amber-900 italic">
              {isEn
                ? '"Connecting contemporary circus with youth through intuitive, accessible digital experiences."'
                : '"Kết nối xiếc đương đại với giới trẻ qua những trải nghiệm số gần gũi và trực quan."'}
            </span>
          </div>
        </div>

        {/* Purpose 2: Promote Contemporary Circus Art */}
        <div className="bg-gradient-to-br from-red-50/80 to-pink-50/50 rounded-3xl p-6 sm:p-8 border-2 border-red-300 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="size-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="size-6" />
            </div>

            <div>
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
                {isEn ? "Purpose 02 • Contemporary Circus" : "Mục Đích 02 • Đương Đại"}
              </span>
              <a
                href="https://canva.link/t1yoszd541vjc3z"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => circusAudio.playBambooStep()}
                className="group/t inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                title={isEn ? "Open promotional brochure on Canva" : "Mở brochure quảng bá trên Canva"}
              >
                <h3 className="font-circus text-xl text-neutral-900 group-hover/t:text-red-800 mt-1 transition-colors">
                  {isEn ? "Outreach & Celebrating Contemporary Circus" : "Lan Tỏa & Quảng Bá Xiếc Đương Đại"}
                </h3>
                <ExternalLink className="size-4 text-red-700 opacity-75 group-hover/t:opacity-100" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {isEn
                ? "Celebrating the transformation of contemporary Vietnamese circus: From standalone acts, circus today continuously expands its artistic vocabulary, blending acrobatics, music, scenography, lighting, visual arts, and authentic traditional cultural elements to create fresh, emotionally resonant experiences. From À Ố Show, Làng Tôi to Teh Dar..., Vietnamese circus is becoming increasingly rich in storytelling and expression, step by step bringing circus arts closer to domestic and international audiences."
                : "Tôn vinh bước chuyển mình của xiếc Việt Nam đương đại: Từ những tiết mục biểu diễn đơn thuần, xiếc ngày nay không ngừng mở rộng ngôn ngữ nghệ thuật, kết hợp chuyển động, âm nhạc, sân khấu, ánh sáng, nghệ thuật thị giác và cả những chất liệu văn hóa truyền thống để tạo nên những trải nghiệm mới mẻ, giàu cảm xúc. Từ À Ố Show, Làng Tôi đến Teh Dar..., xiếc Việt Nam đang ngày càng đa dạng trong cách kể chuyện và biểu đạt, từng bước đưa nghệ thuật xiếc đến gần hơn với khán giả trong nước và quốc tế."}
            </p>

            <ul className="space-y-2 pt-2 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Discover the new face of contemporary Vietnamese circus through diverse art forms."
                    : "Khám phá diện mạo mới của xiếc Việt Nam đương đại qua nhiều hình thức nghệ thuật đa dạng."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Learn about the prominent milestones of Vietnamese circus on domestic and international stages."
                    : "Tìm hiểu những dấu ấn nổi bật của xiếc Việt Nam trên sân khấu trong nước và quốc tế."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  {isEn ? "Experience circus art through " : "Trải nghiệm nghệ thuật xiếc qua "}
                  <a
                    href="https://canva.link/t1yoszd541vjc3z"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => circusAudio.playBambooStep()}
                    className="underline font-bold text-red-700 hover:text-red-900 inline-flex items-center gap-1"
                    title={isEn ? "Open brochure on Canva" : "Mở brochure trên Canva"}
                  >
                    {isEn ? "digital brochure" : "brochure số"}
                    <ExternalLink className="size-3" />
                  </a>{" "}
                  {isEn ? "and interactive visual content." : "và các nội dung tương tác trực quan."}
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-red-200">
            <span className="text-[11px] font-semibold text-red-900 italic">
              {isEn
                ? '"Firmly asserting Vietnamese performing arts identity on the world stage."'
                : '"Khẳng định bản sắc nghệ thuật biểu diễn Việt Nam vững vàng trên bản đồ thế giới."'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            {isEn ? "Core Values" : "Giá Trị Cốt Lõi"}
          </span>
          <h3 className="font-circus text-2xl text-neutral-900">
            {isEn ? "3 Pillars of 'Pocket Circus'" : '3 Trụ Cột Của "Rạp Xiếc Bỏ Túi"'}
          </h3>
          <p className="text-xs text-neutral-600">
            {isEn ? "Creative principles guiding our online cultural space" : "Phương châm sáng tạo và phát triển không gian văn hóa trực tuyến"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2">
            <div className="text-3xl">🎋</div>
            <h4 className="font-circus text-base text-red-900">
              {isEn ? "Heritage Essence" : "Tinh Hoa Bản Sắc"}
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {isEn
                ? "Preserving the national spirit, honoring history, and truthfully portraying the arduous devotion of circus masters."
                : "Gìn giữ linh hồn dân tộc, tôn trọng lịch sử và khắc họa chân thực đời sống khổ luyện của nghệ nhân xiếc."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50 border border-red-200/80 space-y-2">
            <div className="text-3xl">🌐</div>
            <h4 className="font-circus text-base text-red-900">
              {isEn ? "Digital Innovation" : "Sáng Tạo Số Hóa"}
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {isEn
                ? "Applying 3D technology, Web Audio interactive soundscapes, and intuitive UI to bring cultural heritage vibrantly alive."
                : "Ứng dụng công nghệ 3D, âm thanh tương tác Web Audio và giao diện trực quan biến di sản thành trải nghiệm sống động."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
            <div className="text-3xl">🤝</div>
            <h4 className="font-circus text-base text-red-900">
              {isEn ? "Connecting Generations" : "Kết Nối Thế Hệ"}
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {isEn
                ? "Uniting students, youth, and art enthusiasts into a dedicated community that cherishes homegrown culture."
                : "Gắn kết học sinh, sinh viên và công chúng yêu nghệ thuật thành một cộng đồng khán giả trân trọng văn hóa nước nhà."}
            </p>
          </div>
        </div>
      </div>

      {/* Action Next Steps */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-3xl p-6 sm:p-8 text-neutral-950 shadow-lg border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/15 text-amber-950 text-xs font-bold">
            <FileText className="size-3.5" />
            <span>{isEn ? "Special Publication For You" : "Ấn Phẩm Dành Riêng Cho Bạn"}</span>
          </div>

          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="group/title flex items-center justify-center md:justify-start gap-2 cursor-pointer"
            title={isEn ? "Click to open brochure on Canva" : "Nhấn để mở Brochure Quảng Bá trên Canva"}
          >
            <h3 className="font-circus text-xl sm:text-2xl text-neutral-950 group-hover/title:text-red-900 transition-colors underline decoration-amber-950/40 underline-offset-4">
              {isEn ? 'Explore the "Promoting Vietnamese Circus" Publication' : 'Khám Phá Ấn Phẩm "Quảng Bá Xiếc Việt"'}
            </h3>
            <ExternalLink className="size-5 text-neutral-900 group-hover/title:scale-110 transition-transform" />
          </a>

          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="block text-xs sm:text-sm text-neutral-900/90 hover:text-red-900 max-w-xl italic cursor-pointer transition-colors"
            title={isEn ? "Click to open brochure on Canva" : "Nhấn vào dòng này để mở Brochure trên Canva"}
          >
            {isEn
              ? '"A special brochure for you and every guest who wishes to discover the beauty of Vietnamese circus arts."'
              : '"Một brochure nhỏ dành cho bạn và những vị khách muốn khám phá vẻ đẹp của nghệ thuật xiếc Việt Nam."'}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-800 hover:bg-red-700 text-white font-circus font-normal tracking-wide shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
            title={isEn ? "Open Promotional Brochure on Canva" : "Mở Brochure Quảng Bá trên Canva"}
          >
            <FileText className="size-4" />
            <span>{isEn ? "Open Digital Brochure" : "Mở Brochure Quảng Bá"}</span>
            <ExternalLink className="size-4" />
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              circusAudio.playBambooStep();
              onNavigateTo('history');
            }}
            className="bg-white/90 border-amber-950/30 text-amber-950 hover:bg-white font-medium text-xs sm:text-sm cursor-pointer"
          >
            <span>{isEn ? "Explore Circus History" : "Xem Lịch Sử Xiếc Việt"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

