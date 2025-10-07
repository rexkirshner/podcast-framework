/**
 * Carousel navigation controller with auto-progression
 * Handles horizontal scrolling carousel with prev/next buttons, dot indicators, and auto-play
 */

interface CarouselElements {
  container: HTMLElement;
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  dots: NodeListOf<HTMLElement>;
}

interface CarouselConfig {
  autoProgressInterval: number; // milliseconds
  itemsPerView: number;
}

const DEFAULT_CONFIG: CarouselConfig = {
  autoProgressInterval: 6000, // 6 seconds
  itemsPerView: 1,
};

export class Carousel {
  private currentIndex: number = 0;
  private autoProgressTimer: number | null = null;
  private elements: CarouselElements;
  private config: CarouselConfig;
  private totalItems: number;

  constructor(elements: CarouselElements, config: Partial<CarouselConfig> = {}) {
    this.elements = elements;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.totalItems = elements.dots.length;

    this.init();
  }

  private init(): void {
    this.attachEventListeners();
    this.updateCarousel();
    this.startAutoProgress();
  }

  private attachEventListeners(): void {
    this.elements.prevBtn.addEventListener('click', () => this.handlePrev());
    this.elements.nextBtn.addEventListener('click', () => this.handleNext());

    this.elements.dots.forEach((dot) => {
      dot.addEventListener('click', (e) => this.handleDotClick(e));
    });

    window.addEventListener('resize', () => this.updateCarousel());
  }

  private handlePrev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
      this.resetAutoProgress();
    }
  }

  private handleNext(): void {
    const maxIndex = this.getMaxIndex();
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    } else {
      // Loop back to start
      this.currentIndex = 0;
    }
    this.updateCarousel();
    this.resetAutoProgress();
  }

  private handleDotClick(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    const index = parseInt(target.dataset.index || '0', 10);
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoProgress();
  }

  private nextSlide(): void {
    const maxIndex = this.getMaxIndex();
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateCarousel();
  }

  private updateCarousel(): void {
    const maxIndex = this.getMaxIndex();
    this.currentIndex = Math.min(this.currentIndex, maxIndex);

    const cardWidth = this.getCardWidth();
    const offset = -(this.currentIndex * cardWidth);

    this.elements.container.style.transform = `translateX(${offset}px)`;

    this.updateButtonStates(maxIndex);
    this.updateDotIndicators();
  }

  private updateButtonStates(maxIndex: number): void {
    this.elements.prevBtn.disabled = this.currentIndex === 0;
    this.elements.nextBtn.disabled = this.currentIndex >= maxIndex;
  }

  private updateDotIndicators(): void {
    this.elements.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('bg-blue-600', 'w-8');
        dot.classList.remove('bg-gray-300');
      } else {
        dot.classList.remove('bg-blue-600', 'w-8');
        dot.classList.add('bg-gray-300');
      }
    });
  }

  private getCardWidth(): number {
    const firstCard = this.elements.container.children[0];
    return firstCard?.getBoundingClientRect().width || 0;
  }

  private getMaxIndex(): number {
    return Math.max(0, this.totalItems - this.config.itemsPerView);
  }

  private startAutoProgress(): void {
    this.autoProgressTimer = window.setInterval(
      () => this.nextSlide(),
      this.config.autoProgressInterval
    );
  }

  private resetAutoProgress(): void {
    if (this.autoProgressTimer !== null) {
      clearInterval(this.autoProgressTimer);
    }
    this.startAutoProgress();
  }

  /**
   * Clean up event listeners and timers
   */
  public destroy(): void {
    if (this.autoProgressTimer !== null) {
      clearInterval(this.autoProgressTimer);
    }
    window.removeEventListener('resize', () => this.updateCarousel());
  }
}

/**
 * Initialize carousel from DOM elements
 */
export function initCarousel(
  containerId: string = 'carousel-container',
  prevBtnId: string = 'carousel-prev',
  nextBtnId: string = 'carousel-next',
  dotSelector: string = '.carousel-dot'
): Carousel | null {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId) as HTMLButtonElement;
  const nextBtn = document.getElementById(nextBtnId) as HTMLButtonElement;
  const dots = document.querySelectorAll<HTMLElement>(dotSelector);

  if (!container || !prevBtn || !nextBtn || dots.length === 0) {
    console.warn('Carousel: Required DOM elements not found');
    return null;
  }

  return new Carousel({
    container,
    prevBtn,
    nextBtn,
    dots,
  });
}
