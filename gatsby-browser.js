// custom typefaces
import './src/styles/global.scss';

// window.addEventListener('DOMContentLoaded', (event) => {
//   let scrollpos = window.scrollY;
//   const header = document.querySelector('header');
//   console.log(header);
//   const header_height = header.offsetHeight;

//   const add_class_on_scroll = () => header.classList.add('scrolled');
//   const remove_class_on_scroll = () => header.classList.remove('scrolled');

//   window.addEventListener('scroll', function () {
//     scrollpos = window.scrollY;

//     if (scrollpos >= header_height) {
//       add_class_on_scroll();
//     } else {
//       remove_class_on_scroll();
//     }

//     console.log(scrollpos);
//   });
// });

let styleElement = document.createElement('style');
document.head.appendChild(styleElement);

const animation = `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        animation-name: reveal-light;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark;
      }
      @keyframes reveal-dark {
        from {
          clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
        }
        to {
          clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
        }
      }
      @keyframes reveal-light {
        from {
          clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
        }
        to {
          clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
        }
      }
    `;

if (!document.startViewTransition) {
  switchTheme();
} else {
  document.startViewTransition(() => {
    styleElement.textContent = css;
  });
}
