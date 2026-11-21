import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"

export default function BrandLogo({ to = "/", className = "" }) {
  return (
    <Link to={to} className={`brand-logo ${className}`.trim()} aria-label="PasteMe">
      <img src={logo} alt="" />
      <span>PasteMe</span>
    </Link>
  );
}