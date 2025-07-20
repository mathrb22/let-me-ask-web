import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadAudio(audio: Blob) {
  const url = URL.createObjectURL(audio);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function scrollToQuestions() {
  try {
    const questionsSection = document.getElementById('questions-section');
    if (!questionsSection) {
      return;
    }

    const elementPosition = questionsSection.offsetTop;
    const offsetPosition = Math.max(0, elementPosition - 120); // Ensure non-negative value

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  } catch {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
