### Custom Rename CLI aka "crename"

CLI Tool for renaming Folders (default scheme) or Files (custom scheme) in a specific manner.

---

#### How to Install

Required: `Git` and `Node@v18.0.0`

```
git clone https://github.com/m-grohs/crename.git

cd crename

npm i && npm i -g .
```

---

#### How to use

```
cd path\to\files
crename
```

> [!NOTE]
> The Renaming takes place in the current working Directory.

> [!WARNING]
> There is no Protection in place at the moment, so any Folder in the Directory will be renamed in this Scheme

-   **Default Rename Option:**
    The Default Rename Option can take 1 Argument that it uses for the Base Name Scheme. 
    Then it takes the first Number it finds and combines these 2 to the final Name.
    If no Argument is provided it Default to "Chapter " as a Base Name.

    For more Information use the help page for the command: crename --help default


-   **Custom Rename Option:**
    The Custom Rename Option takes in 2 Arguments and used them to construct the Naming Scheme with numbering.
    If no Arguments are provided it will prompt the User to input them.

    For more Information use the help page for the command: crename --help custom

-   **Help Page:**
    The main Help Page can be found with the flag --help or -h
    The Help Pages for the commands can be found with --help command

To abort the process press CTRL+C

---

#### [License](./LICENSE)
