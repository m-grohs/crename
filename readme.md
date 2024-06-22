### Custom Rename CLI aka "crename"

CLI Tool for renaming Folders (default scheme) or Files (custom scheme) in a specific manner.

---

#### How to Install

Required: `Git` and `Node@v18.0.0`

```
git clone https://github.com/m-grohs/crename.git

cd crename

npm i -g .
```

---

#### How to use

```
cd path\to\files
crename
```

-   **Default Rename Option:**
    The Default Rename Option doesn't take any input from the user but scans the CWD for any files, takes the number if available, and renames the item to "Chapter Number". (**ATTENTION!** there is no protection in place atm, so any file/folder in the directory will be renamed in this scheme)

-   **Custom Rename Option:**
    The Custom Rename Option asks the user for a filename scheme and a starting number to count up from i.e. FILENAME and 5 for the CWD. (This Option ignores Folders but will rename everything else in the CWD)

To abort the process press CTRL+C

---

#### [License](./LICENSE)
