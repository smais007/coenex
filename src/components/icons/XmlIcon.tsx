import React from "react";

const XmlIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="28" height="16" x="1" y="18" fill="#444CE7" rx="2" />
      <path
        fill="#fff"
        d="m6.088 22.727 1.466 2.479h.057l1.474-2.479h1.736l-2.22 3.637L10.872 30h-1.77l-1.491-2.482h-.057L6.063 30H4.3l2.277-3.636-2.234-3.637zm5.706 0h1.896l2.003 4.887h.086l2.002-4.887h1.897V30h-1.492v-4.734h-.06l-1.882 4.699h-1.016l-1.882-4.716h-.06V30h-1.492zM20.944 30v-7.273h1.538v6.005H25.6V30z"
      />
    </svg>
  );
};

export default XmlIcon;
