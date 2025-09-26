import React from "react";

const PptIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="26" height="16" x="1" y="18" fill="#E62E05" rx="2" />
      <path
        fill="#fff"
        d="M4.818 30v-7.273h2.869q.828 0 1.41.316.582.314.888.87.309.555.309 1.279T9.98 26.47t-.906.863q-.589.309-1.427.309H5.819V26.41H7.4q.444 0 .732-.153.29-.156.433-.43.146-.276.146-.635 0-.363-.146-.632a.97.97 0 0 0-.433-.423q-.29-.153-.739-.153H6.355V30zm6.474 0v-7.273h2.87q.826 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.428.309h-1.828V26.41h1.58q.444 0 .731-.153.292-.156.434-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.434-.423q-.291-.153-.738-.153H12.83V30zm6.198-6.005v-1.268h5.973v1.268h-2.227V30h-1.52v-6.005z"
      />
    </svg>
  );
};

export default PptIcon;
