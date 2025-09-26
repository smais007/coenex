import React from "react";

const AepIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="27" height="16" x="1" y="18" fill="#6938EF" rx="2" />
      <path
        fill="#fff"
        d="M6.347 30H4.699l2.51-7.273h1.982L11.698 30H10.05l-1.82-5.61h-.057zm-.103-2.859h3.892v1.2H6.244zM12.574 30v-7.273h4.9v1.268h-3.363v1.733h3.11v1.268h-3.11v1.736h3.377V30zm6.123 0v-7.273h2.869q.827 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278-.906.863q-.59.309-1.427.309h-1.829V26.41h1.58q.444 0 .732-.153.29-.156.433-.43.146-.276.146-.635 0-.363-.146-.632a.97.97 0 0 0-.433-.423q-.29-.153-.739-.153h-1.037V30z"
      />
    </svg>
  );
};

export default AepIcon;
