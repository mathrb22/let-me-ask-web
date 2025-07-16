/** biome-ignore-all lint/performance/noImgElement: not using Nextjs */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const documentHasDarkClass =
        document.documentElement.classList.contains('dark');
      setIsDark(documentHasDarkClass);
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const logoSrc = isDark
    ? '/letmeask-logo-white.svg'
    : '/letmeask-logo-dark.svg';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-border border-b bg-background/75 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 max-w-[1000px] items-center justify-between px-4 lg:px-0">
        <Link className="flex items-center" to="/">
          <img alt="Let me ask" className="h-12 w-auto" src={logoSrc} />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
