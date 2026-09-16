import Image from "next/image";

export interface LogoProps {
  variant?: "full" | "symbol";
  theme?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

const fullSizeMap = {
  sm: { width: 80, height: 24 },
  md: { width: 106, height: 32 },
  lg: { width: 133, height: 40 },
  xl: { width: 160, height: 48 },
};

const symbolSizeMap = {
  sm: { width: 15, height: 24 },
  md: { width: 21, height: 32 },
  lg: { width: 26, height: 40 },
  xl: { width: 31, height: 48 },
};

export function Logo({
  variant = "full",
  theme = "auto",
  size = "md",
  width,
  height,
  className = "",
  priority = false,
  alt = "AvaliaTech",
}: LogoProps) {
  const isFull = variant === "full";
  const sizeConfig = isFull
    ? size === "custom"
      ? { width: width ?? 106, height: height ?? 32 }
      : fullSizeMap[size]
    : size === "custom"
      ? { width: width ?? 21, height: height ?? 32 }
      : symbolSizeMap[size];

  const darkSrc = isFull ? "/images/logo.png" : "/images/logo-symbol.png";
  const lightSrc = isFull ? "/images/logo-light.png" : "/images/logo-symbol-light.png";

  if (theme === "dark") {
    return (
      <Image
        src={darkSrc}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        priority={priority}
        className={`select-none object-contain ${className}`}
        style={{ height: sizeConfig.height, width: "auto" }}
      />
    );
  }

  if (theme === "light") {
    return (
      <Image
        src={lightSrc}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        priority={priority}
        className={`select-none object-contain ${className}`}
        style={{ height: sizeConfig.height, width: "auto" }}
      />
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`} style={{ height: sizeConfig.height }}>
      <Image
        src={darkSrc}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        priority={priority}
        className="hidden dark:block select-none object-contain"
        style={{ height: sizeConfig.height, width: "auto" }}
      />
      <Image
        src={lightSrc}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        priority={priority}
        className="block dark:hidden select-none object-contain"
        style={{ height: sizeConfig.height, width: "auto" }}
      />
    </span>
  );
}
