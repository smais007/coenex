import React from "react";

const WavIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="30" height="16" x="1" y="18" fill="#DD2590" rx="2" />
      <path
        fill="#fff"
        d="m6.428 30-2.08-7.273h1.68l1.203 5.054h.06l1.328-5.054h1.439l1.324 5.064h.064l1.204-5.064h1.68L12.249 30H10.75l-1.385-4.755h-.057L7.927 30zm9.246 0h-1.648l2.51-7.273h1.982L21.025 30h-1.647l-1.822-5.61h-.057zm-.103-2.859h3.892v1.2H15.57zm6.735-4.414 1.758 5.526h.068l1.761-5.526h1.705L25.09 30h-1.98l-2.51-7.273z"
      />
    </svg>
  );
};

export default WavIcon;
