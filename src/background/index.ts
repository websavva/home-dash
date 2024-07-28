import { NativeBookmarkManager } from '#page/services/bookmark-manager';

(async function () {
  const CONTEXT_MENU_ROOT_ID = '__HOME_DASH_CONTEXT_MENU__';
  const bookmarkManager = await NativeBookmarkManager.create();

  function onContextMenuItemClick(
    { menuItemId }: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab,
  ) {
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
    chrome.contextMenus.onClicked.removeListener(onContextMenuItemClick);

    await new Promise<void>((resolve) =>
      chrome.contextMenus.removeAll(resolve),
    );

    await chrome.contextMenus.create({
      id: CONTEXT_MENU_ROOT_ID,
      title: 'Add to HomeDash',
      contexts: ['page', 'link'],
    });

    for (const { id: folderId, title: folderTitle } of bookmarkManager.tree
      .children!) {
      await chrome.contextMenus.create({
        id: folderId,
        parentId: CONTEXT_MENU_ROOT_ID,
        title: folderTitle,
        contexts: ['page', 'link'],
      });
    }

    chrome.contextMenus.onClicked.addListener(onContextMenuItemClick);
  }

  bookmarkManager.onChange(buildContextMenu);

  buildContextMenu();
})();
