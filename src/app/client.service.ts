import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Client, Post } from './models';

interface SessionCache {
  clients: Record<number, Client>;
  posts: Record<number, Post[]>;
  nextPostId: number;
}

const STORAGE_KEY = 'client-manager-session';

function loadSession(): SessionCache {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { clients: {}, posts: {}, nextPostId: -1 };
    }
    return JSON.parse(raw) as SessionCache;
  } catch {
    return { clients: {}, posts: {}, nextPostId: -1 };
  }
}

function saveSession(value: SessionCache) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage failures for private browsing or limits
  }
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://jsonplaceholder.typicode.com';
  private readonly clients = signal<Client[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly cache = signal<SessionCache>(loadSession());

  get clientList() {
    return this.clients;
  }

  get isLoading() {
    return this.loading;
  }

  get loadError() {
    return this.error;
  }

  async loadClients(): Promise<void> {
    if (this.clients().length) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const users = await firstValueFrom(this.http.get<Client[]>(`${this.base}/users`));
      this.clients.set(users.map((user) => ({ ...user })));
    } catch {
      this.error.set('Unable to load clients. Please check your connection.');
    } finally {
      this.loading.set(false);
    }
  }

  async getClient(id: number): Promise<Client | undefined> {
    await this.loadClients();
    const client = this.clients().find((item) => item.id === id);
    if (!client) {
      return undefined;
    }
    return this.mergeClient(client);
  }

  async getPosts(userId: number): Promise<Post[]> {
    try {
      const remotePosts = await firstValueFrom(
        this.http.get<Post[]>(`${this.base}/posts?userId=${userId}`)
      );
      const cachedPosts = this.cache().posts[userId] ?? [];
      const merged = [...cachedPosts];
      for (const remote of remotePosts) {
        if (!cachedPosts.some((post) => post.id === remote.id)) {
          merged.push(remote);
        }
      }
      return merged;
    } catch {
      const fallback = this.cache().posts[userId] ?? [];
      if (fallback.length) {
        return fallback;
      }
      throw new Error('Unable to load posts. Please check your connection.');
    }
  }

  createPost(userId: number, title: string, body: string): Post {
    const cacheValue = this.cache();
    const nextId = cacheValue.nextPostId;
    const newPost: Post = { userId, id: nextId, title, body };
    const updatedPosts = [...(cacheValue.posts[userId] ?? []), newPost];

    this.cache.set({
      ...cacheValue,
      posts: {
        ...cacheValue.posts,
        [userId]: updatedPosts,
      },
      nextPostId: nextId - 1,
    });
    saveSession(this.cache());
    return newPost;
  }

  updatePost(userId: number, postId: number, title: string, body: string): Post {
    const cacheValue = this.cache();
    const existingPosts = [...(cacheValue.posts[userId] ?? [])];
    const index = existingPosts.findIndex((item) => item.id === postId);
    const updatedPost: Post = { userId, id: postId, title, body };

    if (index >= 0) {
      existingPosts[index] = updatedPost;
    } else {
      existingPosts.push(updatedPost);
    }

    this.cache.set({
      ...cacheValue,
      posts: {
        ...cacheValue.posts,
        [userId]: existingPosts,
      },
    });
    saveSession(this.cache());
    return updatedPost;
  }

  updateClient(client: Client): void {
    const cacheValue = this.cache();
    this.cache.set({
      ...cacheValue,
      clients: {
        ...cacheValue.clients,
        [client.id]: client,
      },
    });
    saveSession(this.cache());
    this.clients.update((list) => list.map((item) => (item.id === client.id ? client : item)));
  }

  private mergeClient(client: Client): Client {
    return this.cache().clients[client.id] ? { ...client, ...this.cache().clients[client.id] } : client;
  }
}
