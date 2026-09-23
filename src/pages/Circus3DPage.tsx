import React, { useEffect } from 'react'
import { CircusExperience } from '@/components/circus/circus-experience'

export const Circus3DPage: React.FC = () => {
  useEffect(() => {
    const originalTitle = document.title
    document.title = 'Mô Hình Rạp Xiếc 3D | Rạp Xiếc Bỏ Túi'
    return () => {
      document.title = originalTitle
    }
  }, [])

  return <CircusExperience />
}

export default Circus3DPage
