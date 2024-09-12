import type { ArchiveItem } from '../schemas/archive-item.js';
import type { Archive } from '../schemas/archive.js';

export default function getArchiveItemMicrodata(
  archiveItem: ArchiveItem,
  archive: Archive,
) {
  return {
    '@type': 'ArchiveComponent',
    archivedAt: archiveItem.archivedAt,
    dateCreated: archiveItem.dateCreated,
    dateModified: archiveItem.dateModified,
    genre: archiveItem.genre,
    holdingArchive: {
      '@type': 'ArchiveOrganization',
      ...archive,
    },
    identifier: archiveItem.identifier,
    inLanguage: archiveItem.inLanguage,
    name: archiveItem.title,
  };
}
