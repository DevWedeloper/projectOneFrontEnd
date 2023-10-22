export interface GuildSortParams {
  sortBy:
    | 'name'
    | 'leader'
    | 'totalMembers'
  sortOrder: 'asc' | 'desc';
}
