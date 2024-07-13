import type { BookmarkGroup } from '@/types'

export abstract class BookmarkManager {
    private groups: Array<BookmarkGroup>;
}