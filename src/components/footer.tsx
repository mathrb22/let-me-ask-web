import { IoLogoGithub } from 'react-icons/io';

/** biome-ignore-all lint/performance/noImgElement: <explanation> */
export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1000px] px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Desenvolvido com 💚 por
            </span>
            <a
              className="inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-accent-foreground hover:underline"
              href="https://github.com/mathrb22"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IoLogoGithub size={16} />
              mathrb22
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
