"use client";

import { Header, HeaderName, SkipToContent, Theme } from "@carbon/react";

/** Carbon UI shell header; always rendered on g100 per Carbon shell guidance. */
export default function AppHeader() {
  return (
    <Theme theme="g100">
      <Header aria-label="California Funding">
        <SkipToContent />
        <HeaderName href="/" prefix="CA">
          Funding Map
        </HeaderName>
      </Header>
    </Theme>
  );
}
