import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveSeoFromPath } from '@constants/seo';
import { applyDocumentSeo } from '@utils/applyDocumentSeo';

export function DocumentSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyDocumentSeo(resolveSeoFromPath(pathname));
  }, [pathname]);

  return null;
}
