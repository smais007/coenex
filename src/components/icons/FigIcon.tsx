import React from "react";

const FigIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M5.002 30v-7.273h4.816v1.268H6.54v1.733h2.958v1.268H6.54V30zm7.388-7.273V30h-1.538v-7.273zm6.087 2.351a1.6 1.6 0 0 0-.21-.458q-.135-.203-.33-.34a1.4 1.4 0 0 0-.44-.218 1.9 1.9 0 0 0-.543-.074q-.558 0-.98.277-.42.277-.654.806-.234.526-.234 1.285 0 .76.23 1.293.231.533.654.813.422.277.998.277.522 0 .891-.184.373-.188.568-.53.2-.34.2-.805l.312.046h-1.875v-1.158h3.043v.916q0 .96-.405 1.648-.404.686-1.115 1.058-.71.37-1.626.37-1.023 0-1.797-.452a3.13 3.13 0 0 1-1.208-1.289q-.43-.837-.43-1.988q0-.884.256-1.577.26-.696.725-1.179t1.083-.735a3.5 3.5 0 0 1 1.339-.252q.618 0 1.15.18.533.179.945.505.416.327.678.778.263.447.337.987z"
      />
    </svg>
  );
};

export default FigIcon;
