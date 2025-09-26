import React from "react";

const AiIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="17" height="16" x="1" y="18" fill="#E04F16" rx="2" />
      <path
        fill="#fff"
        d="M6.244 30H4.596l2.511-7.273h1.982L11.596 30H9.948l-1.822-5.61H8.07zm-.103-2.859h3.892v1.2H6.141zm7.868-4.414V30H12.47v-7.273z"
      />
    </svg>
  );
};

export default AiIcon;
