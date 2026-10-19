export type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  image?: string
}

export type Experience = {
  id: string
  role: string
  company: string
  period: string
  summary: string
  highlights?: string[]
}

export type SkillCategory = {
  name: string
  items: string[]
}

export type SocialLink = {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'twitter' | 'email'
}
