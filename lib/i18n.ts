import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources: Resource = {
  en: {
    translation: {
      // Auth
      login: 'Login',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signInWith: 'Sign in with',
      google: 'Google',
      microsoft: 'Microsoft',
      
      // Dashboard
      dashboard: 'Dashboard',
      overview: 'Overview',
      totalInterviews: 'Total Interviews',
      thisWeekInterviews: 'This Week',
      pendingCandidates: 'Pending Candidates',
      completedInterviews: 'Completed',
      averageScore: 'Average Score',
      mostActivePosition: 'Most Active Position',
      upcomingInterviews: 'Upcoming Interviews',
      recentInterviews: 'Recent Interviews',
      recentTemplates: 'Recent Templates',
      
      // Interview
      interviews: 'Interviews',
      createInterview: 'Create Interview',
      interviewDetails: 'Interview Details',
      candidateName: 'Candidate Name',
      position: 'Position',
      interviewDate: 'Interview Date',
      interviewType: 'Interview Type',
      status: 'Status',
      score: 'Score',
      notes: 'Notes',
      assessment: 'Assessment',
      videoInterview: 'Video Interview',
      combo: 'Assessment + Video',
      pending: 'Pending',
      completed: 'Completed',
      awaitingResponse: 'Awaiting Response',
      
      // Templates
      templates: 'Question Templates',
      createTemplate: 'Create Template',
      templateName: 'Template Name',
      questions: 'Questions',
      createdDate: 'Created Date',
      createdBy: 'Created By',
      usageCount: 'Usage Count',
      duplicate: 'Duplicate',
      edit: 'Edit',
      delete: 'Delete',
      addToFavorites: 'Add to Favorites',
      
      // Common
      search: 'Search',
      filter: 'Filter',
      save: 'Save',
      cancel: 'Cancel',
      actions: 'Actions',
      view: 'View',
      download: 'Download',
      report: 'Report',
      calendar: 'Calendar',
      settings: 'Settings',
      logout: 'Logout',
      loading: 'Loading...',
    },
  },
  tr: {
    translation: {
      // Auth
      login: 'Giriş Yap',
      email: 'E-posta',
      password: 'Şifre',
      rememberMe: 'Beni hatırla',
      forgotPassword: 'Şifremi unuttum?',
      signInWith: 'ile giriş yap',
      google: 'Google',
      microsoft: 'Microsoft',
      
      // Dashboard
      dashboard: 'Gösterge Paneli',
      overview: 'Genel Bakış',
      totalInterviews: 'Toplam Görüşme',
      thisWeekInterviews: 'Bu Hafta',
      pendingCandidates: 'Bekleyen Adaylar',
      completedInterviews: 'Tamamlanan',
      averageScore: 'Ortalama Puan',
      mostActivePosition: 'En Aktif Pozisyon',
      upcomingInterviews: 'Yaklaşan Görüşmeler',
      recentInterviews: 'Son Görüşmeler',
      recentTemplates: 'Son Şablonlar',
      
      // Interview
      interviews: 'Görüşmeler',
      createInterview: 'Görüşme Oluştur',
      interviewDetails: 'Görüşme Detayları',
      candidateName: 'Aday Adı',
      position: 'Pozisyon',
      interviewDate: 'Görüşme Tarihi',
      interviewType: 'Görüşme Tipi',
      status: 'Durum',
      score: 'Puan',
      notes: 'Notlar',
      assessment: 'Değerlendirme',
      videoInterview: 'Video Görüşme',
      combo: 'Değerlendirme + Video',
      pending: 'Beklemede',
      completed: 'Tamamlandı',
      awaitingResponse: 'Yanıt Bekleniyor',
      
      // Templates
      templates: 'Soru Şablonları',
      createTemplate: 'Şablon Oluştur',
      templateName: 'Şablon Adı',
      questions: 'Sorular',
      createdDate: 'Oluşturulma Tarihi',
      createdBy: 'Oluşturan',
      usageCount: 'Kullanım Sayısı',
      duplicate: 'Kopyala',
      edit: 'Düzenle',
      delete: 'Sil',
      addToFavorites: 'Favorilere Ekle',
      
      // Common
      search: 'Ara',
      filter: 'Filtrele',
      save: 'Kaydet',
      cancel: 'İptal',
      actions: 'İşlemler',
      view: 'Görüntüle',
      download: 'İndir',
      report: 'Rapor',
      calendar: 'Takvim',
      settings: 'Ayarlar',
      logout: 'Çıkış Yap',
      loading: 'Yükleniyor...',
    },
  },
}

export type SupportedLanguage = keyof typeof resources

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
