import { SkipNavLinkProps } from "./types";

const DEFAULT_CONTENT_ID = "primitiv-skip-nav";

function SkipNavLink({
  children,
  contentId = DEFAULT_CONTENT_ID,
  ...rest
}: SkipNavLinkProps) {
  return (
    <a href={`#${contentId}`} {...rest}>
      {children}
    </a>
  );
}

SkipNavLink.displayName = "SkipNavLink";

const SkipNav = {
  Link: SkipNavLink,
};

export { SkipNav };
