export interface Bookmark {
  iconUrl?: string;
  name: string;
  href: string;
}

export type BookmarkGroup = Array<Bookmark>;
