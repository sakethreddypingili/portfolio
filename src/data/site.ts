import type { Experience, Project, SkillCategory, SocialLink } from '@/types'

export const site = {
  name: 'Saketh Reddy Pingili',
  headline: 'Building resilient web systems with modern stacks and generative AI.',
  description:
    'Undergrad engineer focused on full-stack architecture, clean API design, and practical AI automation. Passionate about competitive algorithms and turning complex logic into snappy, real-world products.',
  email: 'sakethreddypingili@gmail.com',
  phone: '+91 9281013527',
  location: 'Greater Bengaluru Area',
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/sakethreddypingili', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sakethreddypingili', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:sakethreddypingili@gmail.com', icon: 'email' },
]

export const projects: Project[] = [
  {
    id: 'quizmarix',
    title: 'Quizmarix',
    description:
      'A scalable Node.js platform for real-time technical assessments with automated scoring algorithms, secure database operations, and an intuitive UI to track user performance.',
    tags: ['Node.js', 'HTML', 'CSS', 'JavaScript'],
    repoUrl: 'https://github.com/sakethreddypingili',
  },
  {
    id: 'garuda-wish-wall',
    title: 'Garuda Wish Wall',
    description:
      'A full-stack social platform for anonymous posting with JWT authentication, RESTful APIs, and MongoDB — built for sharing wishes safely.',
    tags: ['MongoDB', 'Node.js', 'HTML', 'CSS', 'JWT'],
    repoUrl: 'https://github.com/sakethreddypingili',
  },
  {
    id: 'garuda-pay',
    title: 'Garuda Pay',
    description:
      'A digital payment platform supporting secure wallet management, transaction validation, and receipt generation.',
    tags: ['Node.js', 'MongoDB', 'JavaScript'],
    repoUrl: 'https://github.com/sakethreddypingili',
  },
]

export const experiences: Experience[] = [
  {
    id: 'outskill',
    role: 'AI Prompt Engineering & Automation',
    company: 'Outskill (Remote)',
    period: '6 Months',
    summary:
      'Industrial learning program mastering Generative AI and prompt engineering to optimize LLM outputs for complex tasks — requiring close attention to instructions and output accuracy.',
    highlights: [
      'Selected as an Outskill Scholar',
      '2nd place in the college-level Hackathon',
    ],
  },
]

export const skills: SkillCategory[] = [
  {
    name: 'Languages',
    items: ['C', 'C++', 'Java', 'JavaScript', 'SQL', 'Telugu', 'English'],
  },
  {
    name: 'Frontend',
    items: ['HTML', 'CSS', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Backend & Data',
    items: ['Node.js', 'MongoDB', 'REST APIs', 'JWT'],
  },
  {
    name: 'Tools & AI',
    items: ['Git/GitHub', 'VS Code', 'Prompt Engineering', 'Generative AI'],
  },
]
