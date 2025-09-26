import React from "react";

const Mp4Icon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="29" height="16" x="1" y="18" fill="#155EEF" rx="2" />
      <path
        fill="#fff"
        d="M4.93 22.727h1.897l2.003 4.887h.085l2.003-4.887h1.897V30h-1.492v-4.734h-.06L9.38 29.965H8.365l-1.882-4.716h-.06V30H4.93zM14.082 30v-7.273h2.87q.827 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.427.309h-1.83V26.41h1.581q.444 0 .732-.153.29-.156.433-.43.145-.276.145-.635q0-.363-.145-.632a.97.97 0 0 0-.433-.423q-.291-.153-.74-.153H15.62V30zm6.322-1.278V27.51l3.037-4.784h1.043v1.676h-.617l-1.915 3.03v.056h4.315v1.233zM23.894 30v-1.648l.028-.536v-5.089h1.442V30z"
      />
    </svg>
  );
};

export default Mp4Icon;
