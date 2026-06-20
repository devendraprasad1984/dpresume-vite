import localFont from "next/font/local";

const SofiaPro = localFont({
    src: [{
        path: "../public/fonts/sofia-pro.woff2",
        weight: "400",
        style: "normal",
    }],
    preload: true,
    display: "swap",
    variable: "--font-sofia-pro",
});


export {SofiaPro}