# adventure_game.py
# A text-based CLI adventure game where the player explores an ancient land
# in search of a legendary treasure. Built to practise Python fundamentals:
# variables, lists, loops, conditionals, and functions.

WIN = "win"
LOSE = "lose"

SEPARATOR = "-" * 60


def ask_choice(prompt, options):
    """Ask the player to pick one of the given options.

    Re-prompts until the answer matches an option (case-insensitive).
    Returns the matched option in lower case.
    """
    choice_text = " / ".join(options)
    while True:
        answer = input(f"{prompt} ({choice_text}): ").strip().lower()
        if answer in options:
            return answer
        print(f"'{answer}' is not a valid choice. Please type one of: {choice_text}")


def forest_path(player_name):
    """The dark forest scenario. Returns WIN or LOSE."""
    print(SEPARATOR)
    print(f"{player_name}, you step into the dark forest.")
    print("Sunlight barely reaches the ground. You hear running water nearby,")
    print("and a tall old tree stands to your left.")

    choice = ask_choice("Do you follow the river or climb the tree?", ["river", "climb"])

    if choice == "river":
        print("\nYou follow the river downstream.")
        print("It leads you to a hidden waterfall, and behind it a stone chamber.")
        print("Inside the chamber sits the legendary treasure chest!")
        return WIN
    else:
        print("\nYou climb the tall tree to scout the land.")
        print("The branches are brittle. One snaps, and you are stranded in the canopy.")
        print("Night falls, and your quest ends here.")
        return LOSE


def cave_path(player_name):
    """The mysterious cave scenario. Returns WIN or LOSE."""
    print(SEPARATOR)
    print(f"{player_name}, you enter the mysterious cave.")
    print("The air is cold and damp. An unlit torch rests against the wall,")
    print("and the tunnel ahead disappears into total darkness.")

    choice = ask_choice("Do you light the torch or proceed in the dark?", ["torch", "dark"])

    if choice == "torch":
        print("\nYou light the torch and the tunnel glows to life.")
        print("The flame reveals ancient carvings pointing to a sealed door.")
        print("You push it open and find the legendary treasure!")
        return WIN
    else:
        print("\nYou feel your way forward in the pitch dark.")
        print("The floor disappears beneath you and you tumble into a deep pit.")
        print("Your adventure ends in the shadows.")
        return LOSE


def start_game():
    """Introduce the quest, get the player's name, and run the chosen path."""
    print(SEPARATOR)
    print("THE QUEST FOR THE LEGENDARY TREASURE")
    print(SEPARATOR)
    print("You are an explorer searching for a treasure hidden in an ancient land.")
    print("Every choice you make brings you closer to glory, or to failure.")

    player_name = input("\nWhat is your name, explorer? ").strip()
    if not player_name:
        player_name = "Explorer"

    print(f"\nWelcome, {player_name}. Two paths lie before you:")
    print("  - a dark forest, thick with old trees")
    print("  - a mysterious cave, carved into the hillside")

    choice = ask_choice("Which path do you take?", ["forest", "cave"])

    if choice == "forest":
        return forest_path(player_name)
    else:
        return cave_path(player_name)


def play_again():
    """Ask whether the player wants to restart. Returns True to replay."""
    answer = ask_choice("\nWould you like to play again?", ["yes", "no"])
    return answer == "yes"


def main():
    """Run the adventure in a loop until the player decides to stop."""
    while True:
        outcome = start_game()

        print(SEPARATOR)
        if outcome == WIN:
            print("VICTORY! You found the legendary treasure.")
        else:
            print("GAME OVER. The treasure remains hidden.")
        print(SEPARATOR)

        if not play_again():
            print("\nThanks for playing. Farewell, explorer!")
            break


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\n\nAdventure interrupted. Goodbye!")
