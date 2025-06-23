export enum ApplicationServiceURL {
  Users = 'http://localhost:3333/api/auth',
  Blog = 'http://localhost:3334/api/posts',
  Subscriptions = 'http://localhost:3334/api/subscriptions',
  Likes = 'http://localhost:3334/api/likes',
  Comments = 'http://localhost:3334/api/comments',
  Tags = 'http://localhost:3334/api/tags',
  Files = 'http://localhost:3333/api/files',
  Notify = 'http://localhost:3333/api/notify'
}

export const HTTP_CLIENT_MAX_REDIRECTS = 5;
export const HTTP_CLIENT_TIMEOUT = 3000;
