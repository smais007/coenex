import React from "react";

const JavaIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="33" height="16" x="1" y="18" fill="#444CE7" rx="2" />
      <path
        fill="#fff"
        d="M7.91 22.727h1.52v5.071q0 .703-.317 1.222a2.1 2.1 0 0 1-.87.799q-.558.28-1.296.28-.657 0-1.193-.23a1.9 1.9 0 0 1-.845-.71q-.313-.48-.31-1.204H6.13q.007.287.117.493a.8.8 0 0 0 .31.313 1 1 0 0 0 .468.106q.285 0 .48-.12a.8.8 0 0 0 .301-.363q.103-.238.103-.586zM11.953 30h-1.648l2.51-7.273H14.8L17.306 30h-1.648l-1.822-5.61h-.057zm-.103-2.859h3.892v1.2H11.85zm6.736-4.414 1.758 5.526h.067l1.761-5.526h1.705L21.37 30h-1.982l-2.51-7.273zM25.04 30h-1.648l2.51-7.273h1.982L30.392 30h-1.648l-1.822-5.61h-.057zm-.103-2.859h3.892v1.2h-3.892z"
      />
    </svg>
  );
};

export default JavaIcon;
