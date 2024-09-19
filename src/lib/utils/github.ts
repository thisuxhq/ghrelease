import { Octokit } from '@octokit/rest';

let octokit: Octokit;

export function initializeGitHubClient(token: string) {
	octokit = new Octokit({ auth: token });
}

export async function getLatestRelease(owner: string, repo: string): Promise<string> {
	if (!octokit) throw new Error('GitHub client not initialized');
	try {
		const { data } = await octokit.repos.getLatestRelease({ owner, repo });
		return data.tag_name;
	} catch (error) {
		console.error('Error fetching latest release:', error);
		return '';
	}
}

export async function getReleaseNotes(
	owner: string,
	repo: string,
	releaseTag: string
): Promise<{ notes: string; date: string }> {
	const cacheKey = `${owner}/${repo}/${releaseTag}`;

	// Check if release notes are already cached
	if (localStorage.getItem(cacheKey)) {
		return JSON.parse(localStorage.getItem(cacheKey)!);
	}

	if (!octokit) throw new Error('GitHub client not initialized');
	try {
		const { data } = await octokit.repos.getReleaseByTag({ owner, repo, tag: releaseTag });
		const releaseNotes = {
			notes: data.body || 'No release notes available.',
			owner: owner,
			repo: repo,
			date: data.published_at
		};

		// Store fetched release notes in local storage
		localStorage.setItem(cacheKey, JSON.stringify(releaseNotes));
		return releaseNotes;
	} catch (error) {
		console.error('Error fetching release notes:', error);
		return {
			notes: 'Failed to fetch release notes.',
			date: ''
		};
	}
}

export async function getRepositoryDetails(
	owner: string,
	repo: string
): Promise<{
	avatarUrl: string;
	stars: number;
	forks: number;
	recentCommits: number;
}> {
	if (!octokit) throw new Error('GitHub client not initialized');
	try {
		const [repoData, commitData] = await Promise.all([
			octokit.repos.get({ owner, repo }),
			octokit.repos.listCommits({ owner, repo, per_page: 30 })
		]);

		return {
			avatarUrl: repoData.data.owner.avatar_url,
			stars: repoData.data.stargazers_count,
			forks: repoData.data.forks_count,
			recentCommits: commitData.data.length
		};
	} catch (error) {
		console.error('Error fetching repository details:', error);
		return {
			avatarUrl: '',
			stars: 0,
			forks: 0,
			recentCommits: 0
		};
	}
}
