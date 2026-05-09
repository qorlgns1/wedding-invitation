export type GalleryPhoto = {
  src: string;
  key: string;
};

export function encodePathSegment(name: string): string {
  return name
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function normalizeGalleryBasePath(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
