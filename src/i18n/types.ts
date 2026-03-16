export type Locale = 'en' | 'zh-TW' | 'zh-CN'

export type Messages = {
  app: {
    title: string
    subtitle: string
    openDraft: string
  }
  steps: {
    personal: string
    introduction: string
    experience: string
    education: string
    skills: string
    preview: string
  }
  common: {
    back: string
    next: string
    nextToPreview: string
    add: string
    remove: string
    optional: string
    untitled: string
  }
  personal: {
    heading: string
    legalName: string
    preferredName: string
    email: string
    phone: string
    address: string
    links: string
    showFullUrls: string
    showPreferredName: string
    addLink: string
    placeholderFullName: string
    placeholderPreferred: string
    placeholderEmail: string
    placeholderPhone: string
    placeholderAddress: string
    placeholderLinkLabel: string
    placeholderLinkUrl: string
  }
  introduction: {
    heading: string
    wordHint: string
    placeholder: string
    words: string
  }
  experience: {
    heading: string
    emptyHint: string
    work: string
    project: string
    companyPlaceholder: string
    titlePlaceholder: string
    timePlaceholder: string
    subtitlePlaceholder: string
    detailsLabel: string
    addBullet: string
  }
  education: {
    heading: string
    emptyHint: string
    schoolPlaceholder: string
    degreePlaceholder: string
    timePlaceholder: string
    subtitlePlaceholder: string
    detailsLabel: string
    addBullet: string
  }
  skills: {
    heading: string
    upTo: string
    hint: string
    addSkill: string
    skillPlaceholder: string
  }
  preview: {
    heading: string
    dragHint: string
    reorderExperience: string
    reorderEducation: string
    resumePreview: string
    saveDraft: string
    saving: string
    exportPdf: string
    exporting: string
    saveOnlyDesktop: string
    exportOnlyDesktop: string
    savedTo: string
    exportTo: string
    saveFailed: string
    exportFailed: string
  }
  resume: {
    introduction: string
    experience: string
    education: string
    skills: string
  }
  a11y: {
    dragToReorder: string
  }
}
