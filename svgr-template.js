/**
 * Custom SVGR template for TSX React components
 */
function template({ template }, opts, { componentName, jsx }) {
  const typeScriptTpl = template.smart({ plugins: ["typescript", "jsx"] });

  return typeScriptTpl.ast`
    import * as React from 'react';

    export interface IconProps extends React.SVGProps<SVGSVGElement> {
      className?: string;
    }

    const ${componentName} = ({ className, ...props }: IconProps) => {
      const defaultClass = "w-8 h-8";
      const mergedClass = className ? \`\${defaultClass} \${className}\` : defaultClass;
      return ${jsx};
    };

    export default ${componentName};
  `;
}

module.exports = template;
