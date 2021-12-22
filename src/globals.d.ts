declare module "*.svg" {
  const content: any;

  export {
    ReactComponent,
  };
  export default content;
}

declare module "*.module.css" {
  const styles: { [className: string]: string };

  export default styles;
}

declare module '@fortawesome/fontawesome-free/svgs/brands/*';
declare module '@fortawesome/fontawesome-free/svgs/regular/*' {
 const src: string;

 return src;
}
declare module '@fortawesome/fontawesome-free/svgs/solid/*';