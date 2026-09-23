export type Vec3 = [number, number, number]

export interface Hotspot {
  id: string
  title: string
  subtitle: string
  /** World position of the marker in the 3D scene */
  position: Vec3
  /** Camera framing when this hotspot is focused */
  camera: {
    position: Vec3
    target: Vec3
  }
  description: string
  facts: string[]
  /** Local image path shown in the info panel */
  image?: string
  imageAlt?: string
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'san-khau',
    title: 'Sân khấu trung tâm',
    subtitle: 'Vòng tròn biểu diễn',
    position: [0, 1.4, 0],
    camera: { position: [0, 5, 15], target: [0, 1.5, 0] },
    description:
      'Nằm ở vị trí trung tâm của rạp xiếc, sân khấu hình tròn với mặt sàn gỗ sáng và hệ thống đèn LED bao quanh tạo nên điểm hội tụ của mọi màn trình diễn. Thiết kế vòng tròn giúp nghệ sĩ có thể biểu diễn theo nhiều hướng, đồng thời mang đến cho khán giả ở mọi vị trí một góc nhìn gần như trọn vẹn về sân khấu.',
    facts: [
      'Đường kính sân khấu: khoảng 12–13 m theo chuẩn sân khấu xiếc truyền thống.',
      'Viền sân khấu: tích hợp đèn LED đổi màu theo tiết mục',
      'Mặt sàn: được làm bằng gỗ chống trơn, đàn hồi nhẹ để đỡ lực nghệ sĩ khi tiếp đất. ',
    ],
    image: '/images/circus-stage.png',
    imageAlt: 'Sân khấu trung tâm rạp xiếc',
  },
  {
    id: 'nghe-si',
    title: 'Nghệ sĩ biểu diễn',
    subtitle: 'Tung hứng & thăng bằng',
    position: [-4.6, 1.6, 1],
    camera: { position: [-9, 4, 10], target: [-3, 1.6, 0] },
    description:
      'Nghệ sĩ xiếc đương đại kể chuyện bằng cơ thể qua sự kết hợp giữa kỹ thuật hình thể, múa và kịch nghệ sân khấu. Vượt xa những màn mạo hiểm đơn thuần, mỗi tiết mục của họ là một tác phẩm nghệ thuật sáng tạo và giàu cảm xúc. Bằng việc không ngừng vượt qua giới hạn bản thân, họ tôn vinh vẻ đẹp kiên cường và sức sống mãnh liệt của con người.',
    facts: [
      'Nghệ sĩ xiếc học ngã an toàn trước khi luyện tập bay lượn.',
      'Họ phối hợp với bạn diễn qua nhịp thở và lực căng cơ.',
      'Trí nhớ cơ bắp điều khiển mọi động tác mạo hiểm tốc độ cao.',
    ],
    image: '/images/circus-performers.png',
    imageAlt: 'Nghệ sĩ biểu diễn xiếc',
  },
  {
    id: 'du-day',
    title: 'Nhào lộn trên không',
    subtitle: 'Dây lụa & vòng treo',
    position: [0, 9.5, -1.5],
    camera: { position: [0, 9, 14], target: [0, 8.5, -1] },
    description:
      'Lơ lửng giữa không trung, các nghệ sĩ uốn mình qua những dải lụa mềm hay chiếc vòng treo để thực hiện hàng loạt động tác xoay người, dốc ngược đầy ngoạn mục. Là một trong những tiết mục giàu cảm xúc và kịch tính nhất, đây là sự hòa quyện hoàn hảo giữa sức mạnh thể chất, độ dẻo dai cùng ngôn ngữ hình thể đỉnh cao',
    facts: [
      'Đạo cụ phổ biến: Lụa và vòng treo là hai đạo cụ trên không quen thuộc nhất.',
      'Không dây bảo hiểm: Nghệ sĩ tự dùng lực cơ thể để khóa mình vào dải lụa.',
      'Tính toán chính xác: Mỗi động tác đều được tính lực tỉ mỉ để bảo vệ cơ khớp.',
    ],
    image: '/images/circus-aerial.png',
    imageAlt: 'Nhào lộn trên không & đu dây',
  },
  {
    id: 'anh-sang',
    title: 'Hiệu ứng ánh sáng',
    subtitle: 'Khung treo đèn sân khấu',
    position: [5.5, 12.5, 4],
    camera: { position: [10, 12, 12], target: [0, 11, 0] },
    description:
      'Treo lơ lửng trên hệ khung truss, hàng loạt đèn spotlight chiếu tập trung xuống sân khấu, bao trùm không gian bằng sắc vàng ấm áp. Không chỉ dắt dẫn ánh nhìn của khán giả, ánh sáng còn thổi hồn vào kịch bản để tạo nên một bầu không khí đầy kịch tính.',
    facts: [
      'Đèn follow spot: Đèn chiếu luôn bám sát theo từng bước di chuyển của nghệ sĩ.',
      'Ánh sáng khán đài: Đèn khán đài được hạ dịu xuống để tăng chiều sâu sân khấu.',
      'Biến đổi linh hoạt: Màu sắc và cường độ sáng luôn thay đổi theo cảm xúc tiết mục.',
    ],
    image: '/images/circus-lighting.png',
    imageAlt: 'Hiệu ứng ánh sáng rạp xiếc',
  },
  {
    id: 'am-thanh',
    title: 'Âm thanh & Hiệu ứng',
    subtitle: 'Loa và thiết bị biểu diễn',
    position: [-6, 11.8, -3],
    camera: { position: [-11, 11, 9], target: [-3, 10.5, -2] },
    description:
      'Âm thanh và hiệu ứng sân khấu hòa quyện cùng từng chuyển động của nghệ sĩ, từ nhịp nhạc, tiếng trống đến những khoảnh khắc cao trào, góp phần tạo nên nhịp điệu và cảm xúc cho cả màn diễn.',
    facts: [
      'Nhạc không giới hạn : Xiếc đương đại có thể kết hợp nhiều thể loại âm nhạc khác nhau.',
      'Âm thanh phủ đều : Hệ thống loa được bố trí để âm thanh truyền đến nhiều khu vực khán đài.',
      'Hiệu ứng trên sân khấu : Khói, ánh sáng và các hiệu ứng đặc biệt góp phần tạo điểm nhấn và tăng sức cuốn hút cho tiết mục.',
    ],
    image: '/images/circus-sound.png',
    imageAlt: 'Âm thanh & thiết bị biểu diễn',
  },
  {
    id: 'khan-dai',
    title: 'Khán đài',
    subtitle: 'Ghế ngồi hình vòng cung',
    position: [0, 3.2, 15],
    camera: { position: [0, 8, 24], target: [0, 3, 6] },
    description:
      'Khán đài được bố trí theo hình vòng cung đồng tâm, bao quanh sân khấu và chia thành nhiều tầng ghế. Các hàng ghế được nâng dần về phía sau, giúp khán giả có tầm nhìn thoáng và dễ dàng theo dõi từng chuyển động của nghệ sĩ. Lối đi và cầu thang được sắp xếp xen kẽ, tạo thuận tiện cho việc di chuyển.',
    facts: [
      'Nhiều khu vực – nhiều mức giá : Khán đài thường chia thành các khu A, B, C… với mức giá vé khác nhau.',
      'Ngồi đâu cũng dễ xem : Ghế được xếp theo tầng, giúp hạn chế che khuất tầm nhìn.',
      'Góc nhìn 360°: Sân khấu trung tâm giúp khán giả có thể theo dõi tiết mục từ nhiều hướng.',
    ],
    image: '/images/circus-seating.png',
    imageAlt: 'Khán đài và ghế ngồi',
  },
]

export const DEFAULT_CAMERA = {
  // Pulled back to reveal the staircases flanking the stage while keeping the
  // original downward pitch so the ring stays centered in frame.
  position: [0, 14, 21] as Vec3,
  target: [0, 2.4, -1.5] as Vec3,
}
