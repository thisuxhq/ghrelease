import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

export async function getLatestRelease(owner: string, repo: string): Promise<string> {
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
): Promise<string> {
	try {
		const { data } = await octokit.repos.getReleaseByTag({ owner, repo, tag: releaseTag });
		return data.body || 'No release notes available.';
	} catch (error) {
		console.error('Error fetching release notes:', error);
		return 'Failed to fetch release notes.';
	}
}
