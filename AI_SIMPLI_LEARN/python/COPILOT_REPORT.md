# Building a Python Adventure Game with GitHub Copilot

**Project:** Text-based adventure game (`adventure_game.py`)
**Tool:** VS Code with the GitHub Copilot extension
**Dataset:** None

---

## 1. Overview

The deliverable is a command-line adventure game in which the player takes on the
role of an explorer searching for a legendary treasure. The player is asked for a
name, chooses between a dark forest and a mysterious cave, and then makes one
further decision inside that location. Each decision leads to either finding the
treasure or failing the quest, after which the player may restart.

The project exercises Python fundamentals: variables, lists, loops, conditionals,
and functions. It uses only the standard library, so it runs with `python3
adventure_game.py` on any machine with Python 3 installed.

---

## 2. Program Structure

| Function | Responsibility |
|---|---|
| `ask_choice(prompt, options)` | Prompts for input and re-prompts until a valid option is entered |
| `start_game()` | Prints the introduction, collects the player name, offers the forest/cave choice |
| `forest_path(player_name)` | Forest scenario: follow the river or climb the tree |
| `cave_path(player_name)` | Cave scenario: light the torch or proceed in the dark |
| `play_again()` | Asks whether the player wants another attempt |
| `main()` | Drives the game in a `while True` loop and handles the restart |

Two module-level constants, `WIN` and `LOSE`, represent the outcome of a path.
Each path function returns one of these markers instead of printing the final
verdict itself, which keeps the ending logic in one place inside `main()`.

### Outcome map

| Path | Choice | Result |
|---|---|---|
| Forest | Follow the river | **Win** — a hidden waterfall conceals the treasure chamber |
| Forest | Climb the tree | **Lose** — stranded in the canopy when a branch snaps |
| Cave | Light the torch | **Win** — the flame reveals a sealed door and the treasure |
| Cave | Proceed in the dark | **Lose** — falls into an unseen pit |

---

## 3. How GitHub Copilot Assisted

**Function scaffolding.** Writing the docstring `"""The dark forest scenario.
Returns WIN or LOSE."""` was enough for Copilot to suggest the surrounding
`print()` narration and the `if/else` skeleton. The same pattern worked for
`cave_path()`, which Copilot largely mirrored from the already-written forest
function.

**Repetitive branching boilerplate.** The two path functions share an identical
shape — describe the scene, ask a question, branch, return an outcome. After the
first function was written, Copilot predicted nearly the whole second one from
the function signature alone, which removed most of the typing.

**Narrative text.** Copilot generated plausible scene descriptions ("The air is
cold and damp", "ancient carvings pointing to a sealed door"), which was useful
for filling in flavour text without breaking concentration on the control flow.

**Naming and docstrings.** Consistent verb-first function names and one-line
docstrings were suggested automatically, keeping the file uniform.

**Where Copilot was not followed.** Copilot's first suggestion for handling a
losing branch was to call `start_game()` again from inside `forest_path()`.
That was rejected — see the challenges section below.

---

## 4. Key Challenges

**Recursive restarts.** The most significant issue was Copilot's default
suggestion to restart the game by calling `start_game()` from inside a path
function. This works for a few rounds but grows the call stack on every replay
and scatters the "game over" logic across several functions. The fix was to have
each path function *return* `WIN` or `LOSE` and let a single `while True` loop in
`main()` own the restart decision. The call stack now stays flat no matter how
many times the player replays.

**Invalid input.** Naive suggestions compared raw `input()` against a literal
string, so `"Forest"`, `" forest "`, or a typo silently fell through to the
`else` branch and sent the player down the wrong path. This was solved with the
`ask_choice()` helper, which strips whitespace, lower-cases the answer, validates
it against a list of allowed options, and re-prompts with a helpful message when
the answer does not match.

**Balanced branches.** Early drafts had one path with a much richer description
than the other. The scenes were rewritten so that both the forest and the cave
present a comparable amount of narration and exactly one meaningful decision.

**Abrupt exits.** Pressing `Ctrl+C`, or piping input that runs out, produced a
raw `KeyboardInterrupt` / `EOFError` traceback. Wrapping the `main()` call in a
`try/except` turns this into a clean farewell message.

---

## 5. Enhancements Made to the Original Structure

1. **`ask_choice()` validation helper** — centralises input handling so no path
   function needs its own validation loop, and invalid input never advances the
   story incorrectly.
2. **`WIN` / `LOSE` outcome constants** — replaces recursion with a return value,
   keeping the ending and restart logic in a single loop.
3. **Case- and whitespace-insensitive input** — `FOREST`, `Forest`, and
   `" forest "` are all accepted.
4. **Blank-name fallback** — pressing Enter without typing a name defaults to
   `"Explorer"` instead of printing an empty greeting.
5. **Graceful interruption** — `KeyboardInterrupt` and `EOFError` are caught and
   produce a friendly message rather than a traceback.
6. **`if __name__ == "__main__"` guard** — the module can be imported for
   inspection or testing without immediately starting a game.
7. **Visual separators** — a `SEPARATOR` constant divides scenes so the terminal
   output stays readable.

---

## 6. Verification

The game was exercised by piping scripted input into the script, covering every
branch:

```bash
printf 'Dev\nforest\nriver\nno\n' | python3 adventure_game.py   # forest win
printf 'A\nforest\nclimb\nno\n'   | python3 adventure_game.py   # forest loss
printf 'B\ncave\ntorch\nno\n'     | python3 adventure_game.py   # cave win
printf 'C\ncave\ndark\nno\n'      | python3 adventure_game.py   # cave loss
```

Additional cases confirmed:

- Blank name falls back to `Explorer`.
- Invalid entries (`swamp`, `fly`, `maybe`) are rejected and re-prompted.
- Uppercase input (`FOREST`) is accepted.
- A losing round followed by `yes` restarts cleanly and a second playthrough can win.
- Running out of input exits with `Adventure interrupted. Goodbye!` and status 0.

All runs completed with exit code 0 and no tracebacks.

---

## 7. Result

`adventure_game.py` is a complete, runnable text-based adventure game that meets
all five assignment tasks: project setup with a descriptive inline comment, a
`start_game()` introduction that captures the player's name, a `forest_path()`
using an `if/else` structure, a `cave_path()` using conditionals, and a main loop
that runs until the player chooses to stop and offers a restart after each
attempt.

GitHub Copilot measurably accelerated the work on the repetitive parts — the
second path function, the narration, and the docstrings — while the structural
decisions (returning outcome markers instead of recursing, and centralising input
validation) came from reviewing and rejecting its first suggestions. The most
useful lesson from the project is that Copilot is strongest at completing an
established pattern, and weakest at choosing which pattern should be established
in the first place.

---

## Running the Game

```bash
cd AI_SIMPLI_LEARN/python
python3 adventure_game.py
```
