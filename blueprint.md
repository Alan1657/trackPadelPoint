# Padel Counter App

## Overview

A responsive and modern online padel counter application built with the latest features of Angular. It allows users to easily keep track of scores, including options for "golden points" and other game variations.

## Phase 1: Basic Counter

### Features Implemented

- **Team Scores**: Two sections, one for each team (Team A and Team B).
- **Score Display**: Shows the current score for each team.
- **Score Buttons**: Increment (+) and decrement (-) buttons to adjust the score for each team.
- **Basic Styling**: A clean and modern user interface.
- **State Management**: Uses Angular Signals for reactive state management of the scores.

## Phase 2: Golden Point and Game Logic

### Features Implemented

- **Padel Game Logic**: Implemented the complete game logic for padel, including points, games, and sets.
- **Deuce and Advantage**: Correctly handles "deuce" and "advantage" scenarios.
- **Golden Point**: Added a "Golden Point" option that allows the next point to win the game at deuce.
- **Set Tracking**: The application now tracks and displays the number of sets won by each team.
- **Reset Functionality**: A "Reset Game" button has been added to start a new match from scratch.
- **UI Enhancements**: The user interface has been updated to display points, games, and sets separately for clarity.

## Phase 3: Tie-break and Match Win Condition

### Features Implemented

- **Tie-break Logic**: Implemented the tie-break scoring system when games reach 6-6.
- **Match Winner**: The application now correctly determines the winner of the match (best of 3 sets).
- **Winner Display**: A prominent message is displayed to announce the winning team.
- **Conditional UI**: The main scoreboard is hidden, and a "Play Again" button is shown when a winner is declared.

## Project Complete

The core functionality of the Padel Counter application is now complete. The application successfully tracks points, games, and sets, handles special rules like "golden point" and tie-breaks, and declares a winner.