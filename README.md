# Modrinth <-> Markdown masked message list generator

This script generates a blob of masked links for your Modrinth project's version catalog, which you can paste into a Discord message or GitHub README to share beautified links to the latest versions of your project.

This was very quickly thrown together and has not been polished nor extensively tested. Please excuse the mess in this code. If you encounter any issues, feel free to open an issue or pull request.

---

## Usage

1. Clone this repository
2. Install the required dependencies with your desired flavor of package manager:
   - `npm install`
   - `yarn install`
   - `pnpm install`
3. Run the script using your desired flavor of package manager:
   - `npm start`
   - `yarn start`
   - `pnpm start`
4. Input your Modrinth project's ID (or slug) when prompted
5. Wait for the script to finish generating your desired output

## Limitations

At the moment, this script only supports Fabric, Forge and NeoForge mods. If you would like to see support for other mod loaders, feel free to open an issue or pull request.

Additionally, it only supports sem-ver versioning.

---

**This project is licensed under [LGPL-3.0][lgpl]**\
**&copy; 2024 Deftu**

[lgpl]: https://www.gnu.org/licenses/lgpl-3.0.en.html
