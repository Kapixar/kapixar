/*
    * Scroller Class
    Uses the Lenis library for smooth scrolling.
    * Detects native smooth scrolling and can disable Lenis if needed.

*/
const scrollContainer = document.querySelector('.paralaxContainer');

class Scroller {
  constructor(domtoolsInstanceArg) {
    this.domtoolsInstance = domtoolsInstanceArg;

    // Array to store scroll callback functions.
    this.scrollCallbacks = [];

    // Lenis instance (if activated) or null.
    this.lenisInstance = null;

    // Bound handlers to allow removal from event listeners.
    this.handleNativeScroll = (event) => {
      this.executeScrollCallbacks();
    };

    this.handleLenisScroll = (info) => {
      this.executeScrollCallbacks();
    };

    // Attach the native scroll listener by default.
    this.attachNativeScrollListener();
  }

  /**
   * Detects whether native smooth scrolling is enabled.
   */
  async detectNativeSmoothScroll() {
    const sampleSize = 10;
    const acceptableDeltaDifference = 3;
    const minimumSmoothRatio = 0.75;
  
    const eventDeltas = [];
  
    return new Promise((resolve) => {
      function onWheel(event) {
        eventDeltas.push(event.deltaY);
  
        if (eventDeltas.length >= sampleSize) {
          window.removeEventListener('wheel', onWheel);
          analyzeEvents();
        }
      }
  
      function analyzeEvents() {
        const totalDiffs = eventDeltas.length - 1;
        let smallDiffCount = 0;
  
        for (let i = 0; i < totalDiffs; i++) {
          const diff = Math.abs(eventDeltas[i + 1] - eventDeltas[i]);
          if (diff <= acceptableDeltaDifference) {
            smallDiffCount++;
          }
        }
  
        const smoothRatio = smallDiffCount / totalDiffs;
        if (smoothRatio >= minimumSmoothRatio) {
            console.log('Smooth scrolling NOT detected.');
            resolve(false);
        } else {
            console.log('Smooth scrolling detected.');
            resolve(true);
        }
      }
  
      window.addEventListener('wheel', onWheel);
    });
  }

  /**
   * Enables Lenis scrolling.
   * If optionsArg.disableOnNativeSmoothScroll is true and native smooth scrolling is detected,
   * Lenis will be destroyed immediately.
   */
  async enableLenisScroll(optionsArg) {
    const lenis = new Lenis({
      autoRaf: true,
      wrapper: scrollContainer,
      anchors: true
    });

    document.querySelectorAll('a[href^="#"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault()
            const id = el.getAttribute('href')?.slice(1)
            if (!id) return
            const target = document.getElementById(id)
            if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
            }
        })
        })
    

    if (optionsArg?.disableOnNativeSmoothScroll) {
      if (await this.detectNativeSmoothScroll()) {
        lenis.destroy();
        return;
      }
    }

    // Activate Lenis scrolling.
    this.lenisInstance = lenis;
    // Switch from native scroll listener to Lenis scroll listener.
    this.detachNativeScrollListener();
    this.attachLenisScrollListener();

    // Monkey-patch the destroy method so that when Lenis is destroyed,
    // the native scroll listener is reattached.
    const originalDestroy = lenis.destroy.bind(lenis);
    lenis.destroy = () => {
      originalDestroy();
      this.detachLenisScrollListener();
      this.attachNativeScrollListener();
      this.lenisInstance = null;
    };
  }

  /**
   * Registers a callback to be executed on scroll.
   * @param callback A function to execute on each scroll event.
   */
  onScroll(callback) {
    this.scrollCallbacks.push(callback);
  }

  /**
   * Executes all registered scroll callbacks concurrently.
   */
  executeScrollCallbacks() {
    // Execute all callbacks in parallel.
    this.scrollCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error('Error in scroll callback:', error);
      }
    });
  }

  /**
   * Attaches the native scroll event listener.
   */
  attachNativeScrollListener() {
    window.addEventListener('scroll', this.handleNativeScroll);
  }

  /**
   * Detaches the native scroll event listener.
   */
  detachNativeScrollListener() {
    window.removeEventListener('scroll', this.handleNativeScroll);
  }

  /**
   * Attaches the Lenis scroll event listener.
   */
  attachLenisScrollListener() {
    if (this.lenisInstance) {
      // Assuming that Lenis exposes an `on` method to listen to scroll events.
      this.lenisInstance.on('scroll', this.handleLenisScroll);
    }
  }

  /**
   * Detaches the Lenis scroll event listener.
   */
  detachLenisScrollListener() {
    if (this.lenisInstance) {
      // Assuming that Lenis exposes an `off` method to remove scroll event listeners.
      this.lenisInstance.off('scroll', this.handleLenisScroll);
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
    // Create an instance of the Scroller class.
    const scroller = new Scroller(/* pass any required arguments here */);

    // Register a scroll callback.
    // scroller.onScroll(() => {
    //   console.log('Scroll event detected!');
    // });

    // Optionally, enable Lenis scrolling.
    scroller.enableLenisScroll({
      disableOnNativeSmoothScroll: true
    }).then(() => {
      console.log('Lenis scrolling enabled.');
    }).catch((error) => {
      console.error('Error enabling Lenis scrolling:', error);
    });
  });