import throttle from 'lodash/throttle';
import AccentTypographyBuild from "./accent-typography-build";


const animationIntroTitle = new AccentTypographyBuild(`.intro__title`, 500, `active`, `transform`);
const animationHistoryTitle = new AccentTypographyBuild(`.slider__item-title`, 500, `active`, `transform`);
const animationIntroDate = new AccentTypographyBuild(`.intro__date`, 500, `active`, `transform`);
const animationRulesTitle = new AccentTypographyBuild(`.rules__title`, 500, `active`, `transform`);
const animationFooterDate = new AccentTypographyBuild(`.screen__footer-date`, 500, `active`, `transform`);
const animationPrizeTitle = new AccentTypographyBuild(`.prizes__title`, 500, `active`, `transform`);
const animationGameTitle = new AccentTypographyBuild(`.game__title`, 500, `active`, `transform`);

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, { trailing: true }));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();

    animationIntroTitle.runAnimation();
    animationHistoryTitle.runAnimation();
    animationRulesTitle.runAnimation();
    animationFooterDate.runAnimation();
    animationPrizeTitle.runAnimation();
    animationGameTitle.runAnimation();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();

  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    this.screenElements[this.activeScreen].classList.add(`active`);
    if (this.screenElements[this.activeScreen].classList.contains('screen--intro')) {
      setTimeout(() => {
        animationIntroDate.runAnimation();
      }, 700);
    } else {
      animationIntroDate.destroyAnimation();
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
