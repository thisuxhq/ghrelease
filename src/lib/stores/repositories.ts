import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Repository {
	owner: string;
	repo: string;
	latestRelease: string;
}

const storedRepositories: Repository[] = browser
	? JSON.parse(localStorage.getItem('repositories') || '[]')
	: [];

export const repositories: Writable<Repository[]> = writable(storedRepositories);

repositories.subscribe((value) => {
	if (browser) {
		localStorage.setItem('repositories', JSON.stringify(value));
		console.log('Stored repositories:', value);
	}
});

export function addRepository(owner: string, repo: string): void {
	repositories.update((repos) => [...repos, { owner, repo, latestRelease: '' }]);
}

export function removeRepository(owner: string, repo: string): void {
	repositories.update((repos) => repos.filter((r) => !(r.owner === owner && r.repo === repo)));
}

export function updateLatestRelease(owner: string, repo: string, latestRelease: string): void {
	repositories.update((repos) =>
		repos.map((r) => (r.owner === owner && r.repo === repo ? { ...r, latestRelease } : r))
	);
}
