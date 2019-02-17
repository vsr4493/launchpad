import flipTo from 'shared/utils/flipTo';
import anime from 'animejs';

let Hammer: any = null;
if(typeof window !== 'undefined' && Hammer === null) {
  Hammer = require('hammerjs');
}

export const MODES = {
  DEV: 'dev',
  PROD: 'prod',
}

export const SLIDE_EVENTS = {
  HOOK_TOGGLE: 1,
  SLIDE_CHANGE: 2,
};

export const SLIDER_MODES = {
  ACTIVE: 1,
  INACTIVE: 0,
}

export const mappable = (value: any) => (fn: Function) => fn(value);

const getSlider = ( 
  $target: HTMLElement, 
  { 
    mode = MODES.DEV as string, 
    gutterSize = 40 as number, 
    slideCount = 0 as number, 
    slideRefs = [] as Array<HTMLElement>, 
    slideHookRefs = [] as Array<HTMLElement>,    
    slideHeight = document.documentElement.clientHeight as number, 
    slideWidth = document.body.clientWidth as number, 
  } = {}, 
  { 
    initialTranslateX = 0 as number,
    initialTranslateY = 0 as number,

  } = {},
) => {

  const PAN_MODES = {
    'SLIDE_UP': 1, 
    'SLIDE_DOWN': 2,
    'SLIDE_HORIZONTAL': 4,
  };
  // Get the adequate Raf handler
  const raf = window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback: Function) {
    window.setTimeout(callback, 1000 / 60);
  };

  /*
    - State will be stored and namespaced by context into hopefully shallow objects
    - Ideally our state should dictate how the slider behaves when up call requestSlideUpdate or init 
  */

  // Subscribers
  const subscribers = {
    [SLIDE_EVENTS.HOOK_TOGGLE]: [] as Array<Function>,
    [SLIDE_EVENTS.SLIDE_CHANGE]: [] as Array<Function>,
  };

  interface SettingsConfig {
    $target: HTMLElement,
    slideHeight: number,
    slideWidth: number,
    slideCount: number,
    slideRefs: Array<HTMLElement>,
    slideHookRefs: Array<HTMLElement>,
    gutterSize: number,
    isSliderActive: boolean,
  };

  /**
   * Defines the sort-of global settings for the slider
   * @type {SettingsConfig}
   */
  const settings: SettingsConfig = {
    $target: $target,
    slideHeight,
    slideWidth,
    slideCount,
    slideRefs,
    slideHookRefs,
    gutterSize,
    isSliderActive: true,
  };

  /**
   * Handlers shouldn't accept any events while disabled. Note that this doesn't mean the slider is inactive
   * @type {boolean}
   */
  let areHandlersPaused: boolean = false;
  /**
   * Avoid RAF callbacks when an animation is already in progress
   * @type {boolean}
   */
  let isAnimating: boolean = false;
  
  // Explicit interface definitions are not needed with 'as' operatior in TS for literals
  /**
   * Defines the state for the current page
   * @type {Object}
   */
  const pageState = {
    translateX: initialTranslateX as number,
    translateY: initialTranslateY as number,
    panMode: -1 as number,
    current: 0 as number,
  };

  /**
   * Defines the state for the slider track
   * @type {Object}
   */
  const trackState = {
    translateX: 0 as number,
    translateY: 0 as number,
  };

  const hookState = {
    transform: {
      translateY: 0 as number,
    },
    opacity: 1 as number,
  };

  /*
    Utility
  */
  const log = mode === MODES.DEV ? console.log : () => {};

  const stylesToString = ({ translateX = 0 as number, translateY = 0 as number, rotateZ = 0 }, inverseRotation = false) => 
    `translate3d(${translateX}px, ${translateY}px, 0) rotateZ(${rotateZ}deg)`;

  function updateTarget($target: HTMLElement, transformStyles: string, opacity?: number, transformOrigin?: string) {
    $target.style.webkitTransform = transformStyles;
    $target.style.mozTransform = transformStyles;
    $target.style.transform = transformStyles;
    if(opacity) {
      $target.style.opacity = String(opacity);  
    }
    if(transformOrigin) {
      $target.style.transformOrigin = transformOrigin;   
    }
  }

  const MAX_ANGLE = 30;

  function updateSlideRotation() {
    const slideRefs = settings.slideRefs;
    const direction = trackState.direction;
    const current = slideRefs[pageState.current];
    const adjacent = slideRefs[pageState.current + direction];
    updateTarget(current, `rotateZ(-${trackState.angle * MAX_ANGLE}deg)`, 1, `${direction > 0 ? 'left' : 'right'} bottom`);
    if(adjacent) {
      updateTarget(adjacent, `rotateZ(${MAX_ANGLE - trackState.angle * MAX_ANGLE}deg)`, 1, `${direction > 0 ? 'right' : 'left'} bottom`);  
    }
  }

  /**
   * Updates the slider track position based on hookState | trackState
   */
  function updateView() {
    // Pan mode is explicitly supplied while updating page counter
    // If direction is upwards, move the hook instead of moving the entire slide
    switch(pageState.panMode) {
      case PAN_MODES.SLIDE_UP: {
        const transformStyles = stylesToString(hookState.transform);
        updateTarget(settings.slideHookRefs[pageState.current], transformStyles, hookState.opacity);
        break;
      }
      case PAN_MODES.SLIDE_DOWN:
      case PAN_MODES.SLIDE_HORIZONTAL: {
        const transformStyles = stylesToString(trackState);
        updateTarget(settings.$target, transformStyles);
        updateSlideRotation();
      }
    }
    // Ready for more animations!
    isAnimating = false;
  }

  /**
   * More of a gatekeeper for initiating view updates, check if an animation is not already in progress
   */
  function requestViewUpdate() {
    if (!isAnimating) {
      raf(updateView);
      isAnimating = true;
    }
  }

  /**
   * Teardown for when slideTo is finished
   */
  function postSlideToAnimation() {
    updateTarget(settings.$target, stylesToString(trackState));
    areHandlersPaused = false;    
  }

  /**
   * Slide to the given element
   * @param {number} slideIndex = 0 - Index of the slide to scroll to
   * @param {number} deltaTime  = 200 - Time that the animation for the slide should take
   */
  function slideTo(slideIndex = 0, deltaTime = 200) {
    areHandlersPaused = true;
    const last = settings.slideCount - 1;
    const outerSlideWidth = slideWidth + gutterSize;
    // Can't be less than 0 or more than n - 1
    const nextSlideIndex = slideIndex < 0 ? 0 : (slideIndex > last ? last : slideIndex); 
    // Set the base translate value for the page (Based on the updated slide count)
    pageState.translateX = nextSlideIndex * outerSlideWidth * -1; 
    pageState.current = nextSlideIndex;
    const currentStyleString = stylesToString(trackState);
    // Update trackState, clean slate y'all!
    trackState.translateX = pageState.translateX;
    trackState.translateY = pageState.translateY;
    const nextStyleString = stylesToString(trackState);

    // Add classes
    settings.$target.classList.add('is-animating');
    // Start animating to next slide
    updateTarget(settings.$target, stylesToString(trackState));
    //const animation = $target.animate([{ transform: currentStyleString }, { transform: nextStyleString }], deltaTime);
    // Animate individual slides to next or previous
    const currentSlide = settings.slideRefs[pageState.current];
    const adjacentSlide = settings.slideRefs[pageState.current + trackState.direction];

    currentSlide.style.transform = 'none';
    currentSlide.classList.add('is-animating')
    if(adjacentSlide) {
      adjacentSlide.style.transform = 'none';  
      adjacentSlide.classList.add('is-animating')
    }

    /*anime({
      targets: adjacentSlide ? [currentSlide, adjacentSlide] : currentSlide,
      rotateZ: 0,
      duration: 250,
    });*/

    // Call teardown handler once done!
    //animation.onfinish = postSlideToAnimation;
  }

  /**
   * Spring the hook back into place
   */
  function postResetHook() {
    const $hookStyle = settings.slideHookRefs[pageState.current].style;
    $hookStyle.transform = '';
    $hookStyle.opacity = String(hookState.opacity);
    areHandlersPaused = false;
  }
  function resetHook(animate: boolean) {
    areHandlersPaused = true;
    const $hook = settings.slideHookRefs[pageState.current];
    // Reset transform state
    hookState.transform.translateY = 0;
    hookState.opacity = 1;
    // If animation is needed
    if(animate) {
      // Fire event on wrapper
      const animation = $hook.animate([{
        transform: $hook.style.transform,
        opacity: $hook.style.opacity,
      }, {
        transform: stylesToString(hookState.transform),
        opacity: hookState.opacity,
      }], 250);
      animation.onfinish = postResetHook;
    } else {
      // Jump back to original position
      requestViewUpdate();
      postResetHook();
    }
  }

  function getPanMode(direction: number) {
    if(direction & Hammer.DIRECTION_UP) {
      return PAN_MODES.SLIDE_UP;
    } else if (direction & Hammer.DIRECTION_VERTICAL) {
      return PAN_MODES.SLIDE_DOWN;
    }
    return PAN_MODES.SLIDE_HORIZONTAL;
  }

  const touchActionHandlers = {
    // 'any' type? For shame! 
    pan(e: any) {
      if (areHandlersPaused) {
        return;
      }
      // Ensure that for the current gesture, our animations are limited to a single axis
      if (e.type === 'panstart') {
        pageState.panMode = getPanMode(e.direction);
      }
      // Update state according to the active mode
      switch(pageState.panMode) {
        case PAN_MODES.SLIDE_UP: {
          hookState.transform.translateY = e.deltaY;
          hookState.opacity = 1 - (e.distance * 3 / slideHeight)//(slideHeight / (e.distance * 10));
          break;
        }
        case PAN_MODES.SLIDE_DOWN: {
          trackState.translateY = pageState.translateY + e.deltaY;
          break;
        }
        case PAN_MODES.SLIDE_HORIZONTAL: {
          trackState.translateX = pageState.translateX + e.deltaX;
          // Get the current and previous slide, and animate them both
          trackState.angle = Math.abs((e.deltaX / slideWidth));
          trackState.direction = 1;
          break;
        }
      }
      // Update the view based on the changed parameters
      requestViewUpdate();
      log(e.type);
    },
    panEnd(e: any) {
      if (areHandlersPaused) {
        return;
      }
      // Reset pan mode
      switch(pageState.panMode) {
        case PAN_MODES.SLIDE_HORIZONTAL: {
          slideTo(
            e.deltaX < 0 
              ? pageState.current + 1 
              : pageState.current - 1,
            // Ensure that animation duration is between 150 - 250
            Math.min(250, Math.max(150, e.deltaTime))
          );
          break;
        }
        case PAN_MODES.SLIDE_DOWN: {
          const thresholdExceeded = Math.abs(e.deltaY) > slideHeight / 4;
          slideTo(thresholdExceeded ? pageState.current + 1 : pageState.current, 250);
          break;  
        } 
        case PAN_MODES.SLIDE_UP: {
          const thresholdExceeded = Math.abs(e.deltaY) > slideHeight / 4;
          if (thresholdExceeded) {
            // Toggle slider view
            subscribers[SLIDE_EVENTS.HOOK_TOGGLE].map(mappable({
              activeSlide: pageState.current,
              $slide: slideRefs[pageState.current],
              $hook: settings.slideHookRefs[pageState.current],
            }));
          } else {
            // Spring the hook back to its position
            resetHook(true);
          }
          break;
        }
      }
      pageState.panMode = -1;
    },
    swipe(e: any) {
      if (areHandlersPaused) {
        return;
      }
      log("Swipe detected");
    },
    tap(e: any) {
      if(areHandlersPaused) {
        return;
      }
      const xPos = e.center.x;
      // Ensure that the xPosition lies in either left corridor or right corridor
      if(xPos <  slideWidth * .4 || xPos > slideWidth *.6) {
        // Depending on which half the xPos falls in, switch to next/previous slide
        slideTo(xPos > slideWidth / 2 ? pageState.current + 1 : pageState.current - 1, 0);
      }
    }
  }

  // Can't touch this, todododo!
  const hammertime = new Hammer.Manager($target, {
    touchAction: 'none',
  });

  // Maaaaan, you can't touch this... Setup recognizers for event detection
  hammertime.add(new Hammer.Pan({ threshold: 50, pointers: 1 }));
  hammertime.add(new Hammer.Swipe()).recognizeWith(hammertime.get('pan'));
  hammertime.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(hammertime.get('pan'));
  hammertime.add(new Hammer.Tap({ threshold: 10, time: 250 }));

  // Attach event handlers
  hammertime.on("panstart panmove", touchActionHandlers.pan);
  hammertime.on("panend pancancel", touchActionHandlers.panEnd);
  hammertime.on("tap", touchActionHandlers.tap);
  hammertime.on("swipe", touchActionHandlers.swipe);

  /**
   * Transition slider modes and dispatch appropriate events
   */
  // Store the current styles internally when slider is toggled off, and restore them when toggling on
  function toggleSliderState() {
    resetHook(false);
    settings.isSliderActive = !settings.isSliderActive;
    areHandlersPaused = !settings.isSliderActive;
    Object.assign(settings.$target.style, {
      height: `${settings.isSliderActive ? settings.slideHeight : (settings.slideHeight / 2)}px`,
    });
  }

  // Public methods be down there!

  /**
   * Initialize/Re-initialize the slider
   */
  function initialize() {
    const { $target, slideWidth, slideHeight, slideCount, gutterSize } = settings;
    // Set initial styles on the slider
    Object.assign($target.style, {
      width: `${(slideWidth * slideCount) + (slideCount - 1) * gutterSize}px`,
      height: `${slideHeight}px`,
      opacity: 1,
    });
  }

  function subscribe(subscriptionType: string, handler: Function) {
    if(!subscribers[subscriptionType]) {
      return;
    }
    subscribers[subscriptionType].push(handler);
  }

  function stopSlider() {
    // Do teardown stuff here
    hammertime.destroy();
  }

  function setSliderState(state ?: boolean) {
    areHandlersPaused = typeof state === 'boolean' ? state : !areHandlersPaused;
  }

  return {
    init: initialize,
    on: subscribe,
    stop: stopSlider,
    setSliderState: setSliderState,
    toggleSliderState,
  };
}

export default getSlider;