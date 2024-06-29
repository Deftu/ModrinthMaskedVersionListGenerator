import axios from "axios";
import semver from "semver";

export type ModLoader = "fabric" | "forge" | "neoforge";

export type ModrinthVersion = {
    version_number: string;
    game_versions: string[];
    loaders: ModLoader[];
    id: string;
    project_id: string;
};

export async function getModrinthVersions(
    projectId: string
): Promise<ModrinthVersion[]> {
    const response = await axios.get(
        `https://api.modrinth.com/v2/project/${projectId}/version`
    );
    return response.data as ModrinthVersion[];
}

/**
 * Only returns the versions with the newest version number.
 */
export function filterLatestReleases(
    versions: ModrinthVersion[]
): ModrinthVersion[] {
    let result: ModrinthVersion[] = [];

    let highestVersion: string | null = null;
    for (const version of versions) {
        let versionNumber = version.version_number;
        if (versionNumber.startsWith("v")) {
            versionNumber = versionNumber.slice(1);
        }

        if (highestVersion === null) {
            highestVersion = versionNumber;
            result = [];
        }

        const parsedHighestVersion = semver.parse(highestVersion);
        const parsedVersion = semver.parse(versionNumber);
        if (parsedHighestVersion === null || parsedVersion === null) {
            continue;
        }

        if (semver.gt(parsedVersion, parsedHighestVersion)) {
            highestVersion = versionNumber;
            result = [];
        } else if (semver.eq(parsedVersion, parsedHighestVersion)) {
            result.push(version);
        }
    }

    return result;
}

export function getModrinthUrl(version: ModrinthVersion): string {
    return `https://modrinth.com/mod/${version.project_id}/version/${version.id}`;
}

export function getFriendlyLoaderName(loader: ModLoader): string {
    switch (loader) {
        case "fabric":
            return "Fabric";
        case "forge":
            return "Forge";
        case "neoforge":
            return "NeoForge";
    }
}
