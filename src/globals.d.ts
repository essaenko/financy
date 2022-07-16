// eslint-disable-next-line @typescript-eslint/ban-types
declare type ReactComponent = {};

declare module '*.svg' {
  const content: string;

  export { ReactComponent };
  export default content;
}

declare module '*.module.css' {
  const styles: { [className: string]: string };

  export default styles;
}

declare module '*.png' {
  const image: string;

  export default image;
}

declare module '@fortawesome/fontawesome-free/svgs/brands/*';
declare module '@fortawesome/fontawesome-free/svgs/regular/*';
declare module '@fortawesome/fontawesome-free/svgs/solid/*';
