import axios from "axios";

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
 * Only returns the latest version_number from the versions array
 * Multiple versions can be for the same loader, but not the same game version
 */
export function filterLatestReleases(
    versions: ModrinthVersion[]
): ModrinthVersion[] {
    const result: ModrinthVersion[] = [];
    const seen: { [key: string]: boolean } = {};
    for (const version of versions) {
        const key = `${version.loaders[0]}-${version.game_versions[0]}`;
        if (!seen[key]) {
            result.push(version);
            seen[key] = true;
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
