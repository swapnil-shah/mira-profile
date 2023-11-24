/* --- Scroll text right to left --- */

console.clear();

gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".smooth-scroll"),
  smooth: true,
  lerp: 0.05, // Linear Interpolation, 0 > 1 // Try 0.01
  multiplier: 1, // Effect Multiplier 1.4
  reloadOnContextChange: true,
  touchMultiplier: 3, //2
  smoothMobile: 0,
  smartphone: {
    smooth: !0,
    breakpoint: 767,
  },
  tablet: {
    smooth: !0, //1
    breakpoint: 1024,
  },
});

// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".smooth-scroll", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  // LocomotiveScroll handles things completely differently on mobile devices
  // - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters,
  // we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied
  // to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(".smooth-scroll").style.transform
    ? "transform"
    : "fixed",
});

const sections = gsap.utils.toArray("section");

sections.forEach(function (section) {
  const inner = section.classList.contains("sectionLeftAndRight")
    ? section.querySelector(".leftText")
    : section.querySelector(".section-inner");

  if (!section.classList.contains("horizontalScrolling")) {
    ScrollTrigger.create({
      scroller: ".smooth-scroll",
      trigger: section,
      start:
        section.scrollHeight <= window.innerHeight
          ? "top top"
          : "bottom bottom",
      end: "+=100%",
      pin: inner,
      pinSpacing: false,
      pinType: "transform",
    });
  } else {
    const scroll = section.querySelector("[data-scroll-in-section]");

    // the tween and the pinning have two different ScrollTriggers, because the will need different durations for that overlaying-effect to show

    ScrollTrigger.create({
      scroller: ".smooth-scroll",
      trigger: section,
      start: "center center",
      end: () => `+=${section.scrollWidth + window.innerHeight}`, // added an extra window.innerHeight to the end here in comparison to the tween
      pin: inner,
      pinSpacing: true,
      pinType: "transform",
      anticipatePin: 1,
    });

    gsap.to(scroll, {
      x: () =>
        `${-(section.scrollWidth - document.documentElement.clientWidth)}px`,
      ease: "none",
      scrollTrigger: {
        trigger: scroll,
        scroller: ".smooth-scroll",
        start: "top center",
        end: () => `+=${section.scrollWidth}`,
        markers: false, //true to view markers
        scrub: true,
      },
    });
  }
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

//split
Splitting();
