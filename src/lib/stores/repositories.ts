import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getRepositoryDetails, getLatestRelease } from '$lib/utils/github';

export interface Repository {
	owner: string;
	repo: string;
	latestRelease: string;
	avatarUrl: string;
	stars: number;
	forks: number;
	recentCommits: number;
}

const storedRepositories: Repository[] = browser
	? JSON.parse(localStorage.getItem('repositories') || '[]')
	: [];

export const repositories: Writable<Repository[]> = writable(storedRepositories);

repositories.subscribe((value) => {
	if (browser) {
		localStorage.setItem('repositories', JSON.stringify(value));
	}
});

export async function addRepository(owner: string, repo: string): Promise<void> {
	const [details, latestRelease] = await Promise.all([
		getRepositoryDetails(owner, repo),
		getLatestRelease(owner, repo)
	]);

	repositories.update((repos) => [
		...repos,
		{
			owner,
			repo,
			latestRelease,
			...details
		}
	]);
}

export function removeRepository(owner: string, repo: string): void {
	repositories.update((repos) => repos.filter((r) => !(r.owner === owner && r.repo === repo)));
}

export async function updateRepositoryDetails(owner: string, repo: string): Promise<void> {
	const [details, latestRelease] = await Promise.all([
		getRepositoryDetails(owner, repo),
		getLatestRelease(owner, repo)
	]);

	repositories.update((repos) =>
		repos.map((r) =>
			r.owner === owner && r.repo === repo ? { ...r, ...details, latestRelease } : r
		)
	);
}
