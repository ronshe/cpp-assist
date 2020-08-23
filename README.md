# cpp-assist

Tool to help you in your C++ development

Tools:
- [cpp-assist](#cpp-assist)
  - [Insert an include guard to current H file](#insert-an-include-guard-to-current-h-file)
  - [Insert an `#include` instruction](#insert-an-include-instruction)
  - [Future planned features](#future-planned-features)

---

## Insert an include guard to current H file
ctrl-shift-p and run command: `c++ assist: include guard`
You can use keyboard shortcut: alt-ctrl-g

If the relative path file is `src/moon/dark/side.h`, than the include guard will be:
```c
#ifndef __MOON_DARK_SIDE__
#define __MOON_DARK_SIDE__

#endif  /* __MOON_DARK_SIDE__ */
```
The 'prefix' option and 'suffix' option (both  default: "\_\_") together with what to ignore before the path 'Remove Path Until' option. Empty makes the path from the workspace root.

## Insert an `#include` instruction
ctrl-shift-p and run command: `c++ assist: include file`
You can use keyboard shortcut: alt-ctrl-i
What to ignore before the 'Remove Path Until' option. Set as blank if you want it relative to the workspace root. If option 'Is relative' is set (default: yes), than the path will be relative to current file.

Before (absolute path):
```cpp
#include "algebra/matrix/matrix.h"
/home/ronny/workspaces/project/src/maker/sphere.h
#include "graphics/gri/gl.h"
```
After:
```cpp
#include "algebra/matrix/matrix.h"
#include "maker/sphere.h"
#include "graphics/gri/gl.h"
```
Or (relative path):
```cpp
#include "algebra/matrix/matrix.h"
#include "../maker/sphere.h"
#include "graphics/gri/gl.h"
```

## Future planned features
1. Insert include instruction of a keyword by marking the keyword.
2. "New C++ Class" - will add C++ and H files in a selected folder with starting class skeleton.
3. "New C Module" - will add C and H files in a selected folder with starting module skeleton.
4. Jump to matching file (from cpp/c to h and back).
