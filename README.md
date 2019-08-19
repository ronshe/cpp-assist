# cpp-helper

Tool to help you in your C++ development

Tools:
* [Insert an include guard to current H file](#insert-an-include-guard-to-current-h-file)
* [Convert file path to `#include` instruction](#convert-file-path-to-include-instruction)
* [Future planned features](#future-planned-features)

---

## Insert an include guard to current H file
ctrl-shift-p and run command: `includeGuard`
You can use keyboard shortcut: alt-ctrl-g

If the relative path file is `src/moon/dark/side.h`, than the include guard will be:
```cpp
#ifndef MOON_DARK_SIDE_
#define MOON_DARK_SIDE_

#endif  // MOON_DARK_SIDE_
```
The prefix (default: "") and suffix (default: "_") can be changed in the `settings`->`C++ Helper` together with what to ignore before the path beginning (default: "/src/"). Set as blank if you want the file name only.

## Convert file path to `#include` instruction
ctrl-shift-p and run command: `includeFile`
You can use keyboard shortcut: alt-ctrl-i
What to ignore before the path beginning (default: "/src/") can be changed in the `settings`->`C++ Helper`. Set as blank if you want the file name only.

Before (absolute path):
```cpp
#include "algebra/matrix/matrix.h"
/home/ronny/workspaces/project/src/maker/sphere.h
#include "graphics/gri/gl.h"
```
Or (relative path):
```cpp
#include "algebra/matrix/matrix.h"
src/maker/sphere.h
#include "graphics/gri/gl.h"
```
After:
```cpp
#include "algebra/matrix/matrix.h"
#include "maker/sphere.h"
#include "graphics/gri/gl.h"
```

## Future planned features
1. Insert include instruction of a keyword by marking the keyword.
2. "New C++ Class" - will add C++ and H files in a selected folder with starting class skeleton.