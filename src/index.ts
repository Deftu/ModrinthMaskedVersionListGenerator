import prompt from "prompt-sync";
const input = prompt();

import {
    type ModrinthVersion,
    type ModLoader,
    getModrinthVersions,
    filterLatestReleases,
    getModrinthUrl,
    getFriendlyLoaderName
} from "./modrinth";

async function main() {
    // Get the user's Modrinth project ID
    const projectId = input("Enter the project ID: ");
    if (!projectId) {
        console.log("Project ID is required");
        return;
    }

    // Get the versions of the Modrinth project
    const versions = await getModrinthVersions(projectId);
    if (versions.length === 0) {
        console.log("No versions found");
        return;
    }

    console.log(`Found ${versions.length} versions for that project`);

    // Get all of the versions for the latest release of the project
    const latestVersions = filterLatestReleases(versions);
    console.log(`${latestVersions.length} of the versions are the "latest" release for that project`);

    // Sort our versions so they appear in the message as they should
    const sortedVersions = sortVersions(latestVersions);
    // Create our message and log it out
    const message = constructMessage(sortedVersions);
    console.log(message);
}

/**
 * Sorts the version by loader, then game version (descending)
 */
function sortVersions(versions: ModrinthVersion[]) {
    return versions.sort((a, b) => {
        if (a.loaders[0] === b.loaders[0]) {
            return compareGameVersions(a.game_versions[0], b.game_versions[0]);
        }

        return a.loaders[0] > b.loaders[0] ? 1 : -1;
    });
}

/**
 * Compares two game versions, ensuring that versions 1.9.4 and below come UNDERNEATH 1.10
*/
function compareGameVersions(a: string, b: string) {
    const aParts = a.split(".");
    const bParts = b.split(".");
    const aPadded = aParts.map((part) => part.padStart(2, "0")).join(".");
    const bPadded = bParts.map((part) => part.padStart(2, "0")).join(".");
    return aPadded > bPadded ? -1 : 1;
}

/**
 * Constructs a message of the versions within a masked link for a Discord message
 */
function constructMessage(versions: ModrinthVersion[]): string {
    let message = "";

    const versionsByLoader: Map<ModLoader, ModrinthVersion[]> = versions.reduce((acc, version) => {
        if (!acc.has(version.loaders[0])) {
            acc.set(version.loaders[0], []);
        }

        acc.get(version.loaders[0]).push(version);
        return acc;
    }, new Map());

    for (const [loader, versions] of versionsByLoader) {
        message += `### ${getFriendlyLoaderName(loader)}\n`;
        for (const version of versions) {
            message += `${constructMaskedLink(version)} | `;
        }

        message = message.slice(0, -3); // Remove the trailing pipe and space
        message += "\n";
    }

    return message;
}

function constructMaskedLink(version: ModrinthVersion): string {
    return `[${getFriendlyLoaderName(version.loaders[0])} ${version.game_versions[0]}](<${getModrinthUrl(version)}>)`;
}

main();
