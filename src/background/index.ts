import { NativeBookmarkManager } from '#page/services/bookmark-manager';

(function () {
  const CONTEXT_MENU_ROOT_ID = '__HOME_DASH_CONTEXT_MENU__';
  let _bookmarkManager: NativeBookmarkManager;

  async function getBookmarkManager() {
    if (!_bookmarkManager) {
      _bookmarkManager = await NativeBookmarkManager.create();
    }

    return _bookmarkManager;
  }

  async function onContextMenuItemClick(
    { menuItemId }: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab,
  ) {
    const bookmarkManager = await getBookmarkManager();

    const isTabValid = Boolean(tab && tab.url && tab.title);

    const wasFolderItemClicked = bookmarkManager.tree.children!.some(
      ({ id }) => {
        return id === String(menuItemId);
      },
    );

    if (!isTabValid || !wasFolderItemClicked) return;

    bookmarkManager.addBookmark({
      parentId: String(menuItemId),
      title: tab!.title!,
      url: tab!.url!,
    });
  }

  async function buildContextMenu() {
    const bookmarkManager = await getBookmarkManager();

    await new Promise<void>((resolve) =>
      chrome.contextMenus.removeAll(resolve),
    );

    await chrome.contextMenus.create({
      id: CONTEXT_MENU_ROOT_ID,
      title: 'Add to HomeDash',
      contexts: ['page', 'link'],
    });

    for (const { id: folderId, title: folderTitle } of bookmarkManager!.tree
      .children!) {
      await chrome.contextMenus.create({
        id: folderId,
        parentId: CONTEXT_MENU_ROOT_ID,
        title: folderTitle,
        contexts: ['page', 'link'],
      });
    }
  }

  // all listeners should be registered synchronously
  chrome.contextMenus.onClicked.addListener(onContextMenuItemClick);

  NativeBookmarkManager.eventNames.forEach((eventName) => {
    chrome.bookmarks[eventName].addListener(async () => {
      const bookmarkManager = await getBookmarkManager();

      await bookmarkManager.onTreeChange();

      await buildContextMenu();
    });
  });

  buildContextMenu();
})();
