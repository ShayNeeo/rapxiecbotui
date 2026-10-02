import React, { useEffect } from 'react'
import { CircusExperience } from '@/components/circus/circus-experience'
import { useLanguage } from '@/src/context/LanguageContext'

export const Circus3DPage: React.FC = () => {
  const { isEn } = useLanguage()

  useEffect(() => {
    const originalTitle = document.title
    document.title = isEn 
      ? '3D Circus Model | Pocket Circus' 
      : 'Mô Hình Rạp Xiếc 3D | Rạp Xiếc Bỏ Túi'
    return () => {
      document.title = originalTitle
    }
  }, [isEn])

  return <CircusExperience />
}

export default Circus3DPage
