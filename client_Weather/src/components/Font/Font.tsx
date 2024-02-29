import { Global } from "@emotion/react";
const Fonts = () => (
  <Global
    styles={`
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400&display=swap');

    @font-face {
      font-family: 'Bangkokbankset-bold';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}bangkokbankset-bold.woff') format('woff');
    }

    @font-face {
      font-family: 'Bangkokbankset-light';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}bangkokbankset-light.woff') format('woff');
    }


    @font-face {
      font-family: 'Bangkokbankset-regular';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}bangkokbankset-regular.woff') format('woff');
    }


    @font-face {
      font-family: 'KrungthaiFastWeb-Bold';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}KrungthaiFastWeb-Bold.woff') format('woff');
    }

    @font-face {
      font-family: 'KrungthaiFastWeb-Regular';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}KrungthaiFastWeb-Regular.woff') format('woff');
    }

    @font-face {
      font-family: 'KrungthaiFastWeb-ExtraBold';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}KrungthaiFastWeb-ExtraBold.woff') format('woff');
    }

    @font-face {
      font-family: 'Kanit-Light';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}Kanit-Light.woff') format('woff');
    }

    @font-face {
      font-family: 'Ttb-bold';
      src: url('${import.meta.env.VITE_API_ASSETS_FONT}ttb-bold.woff2') format('woff2');
    }

    `}
  />
);

export default Fonts;