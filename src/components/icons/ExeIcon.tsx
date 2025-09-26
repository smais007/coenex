import React from "react";

const ExeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  const defaultClass = "w-8 h-8";
  const mergedClass = className ? `${defaultClass} ${className}` : defaultClass;

  return (
    <svg className={mergedClass} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" {...props}>
      <path
        stroke="#D5D7DA"
        strokeWidth="1.5"
        d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z"
      />
      <path stroke="#D5D7DA" strokeWidth="1.5" d="M27 .5V8a4 4 0 0 0 4 4h7.5" />
      <rect width="26" height="16" x="1" y="18" fill="#444CE7" rx="2" />
      <path
        fill="#fff"
        d="M4.935 30v-7.273h4.9v1.268H6.472v1.733h3.111v1.268h-3.11v1.736H9.85V30zm7.565-7.273 1.466 2.479h.057l1.474-2.479h1.736l-2.22 3.637L17.284 30h-1.768l-1.492-2.482h-.057L12.475 30h-1.762l2.277-3.636-2.234-3.637zM18.206 30v-7.273h4.9v1.268h-3.362v1.733h3.11v1.268h-3.11v1.736h3.377V30z"
      />
    </svg>
  );
};

export default ExeIcon;
