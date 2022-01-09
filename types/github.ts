export type FeedItem = {
  repo: {
    name: string
    description: string
    language: string
    stargazers_count: number
    watchers_count: number
    full_name: string
    html_url: string
    id: string
    owner: {
      avatar_url: string
      login: string
    }
  }
  starred_at: string
}

export type FeedList = ReadonlyArray<FeedItem>
