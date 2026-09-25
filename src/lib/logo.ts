import officialCircusLogo from "../assets/images/official_circus_logo.jpg";
import { OFFICIAL_CIRCUS_LOGO_BASE64 } from "./logoData";

/**
 * The permanent official loaded logo of Rạp Xiếc Bỏ Túi.
 * Base64 data URI guarantees that when printing (window.print())
 * or saving image/PDF, the logo is instantly and synchronously present
 * without relying on network fetching or cache.
 */
export const OFFICIAL_CIRCUS_LOGO: string = OFFICIAL_CIRCUS_LOGO_BASE64 || officialCircusLogo;
export const OFFICIAL_CIRCUS_LOGO_URL: string = officialCircusLogo;
