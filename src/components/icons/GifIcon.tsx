import React from "react";

const GifIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="23" height="16" x="1" y="18" fill="#7F56D9" rx="2" />
      <path
        fill="#fff"
        d="M9.825 25.078a1.6 1.6 0 0 0-.21-.458q-.135-.203-.33-.34a1.4 1.4 0 0 0-.44-.218 1.9 1.9 0 0 0-.544-.074q-.557 0-.98.277-.42.277-.653.806-.235.526-.235 1.285 0 .76.231 1.293t.654.813q.422.277.997.277.523 0 .892-.184.372-.188.568-.53.2-.34.199-.805l.312.046H8.411v-1.158h3.044v.916q0 .96-.405 1.648a2.76 2.76 0 0 1-1.115 1.058q-.71.37-1.627.37-1.022 0-1.797-.452a3.13 3.13 0 0 1-1.207-1.289q-.43-.837-.43-1.988q0-.884.256-1.577.26-.696.724-1.179a3.1 3.1 0 0 1 1.084-.735 3.5 3.5 0 0 1 1.338-.252q.619 0 1.15.18.533.179.945.505.416.327.679.778.262.447.337.987zm4.322-2.35V30H12.61v-7.273zM15.412 30v-7.273h4.816v1.268H16.95v1.733h2.958v1.268H16.95V30z"
      />
    </svg>
  );
};

export default GifIcon;
