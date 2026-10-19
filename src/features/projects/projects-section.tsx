import { ExternalLink, GitFork } from "lucide-react"
import { projects } from '@/data/site'
import { Reveal } from '@/components/motion/reveal'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { hoverLift, transition } from '@/lib/motion'

export function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="mt-2 text-muted-foreground">A selection of things I've built recently.</p>
      </Reveal>
      <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem
            key={project.id}
            whileHover={hoverLift}
            transition={transition.fast}
            className="h-full"
          >
            <Card className="group h-full transition-colors hover:border-foreground/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  {project.title}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} source`}
                      className="text-muted-foreground transition-all hover:scale-110 hover:text-foreground"
                    >
                      <GitFork className="size-4" />
                    </a>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Live <ExternalLink className="size-3" />
                  </a>
                )}
              </CardFooter>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
