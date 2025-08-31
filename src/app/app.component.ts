import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

const POINTS = ['0', '15', '30', '40', 'AD'];

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  history = signal<any[]>([]);

  teamASets = signal(0);
  teamBSets = signal(0);
  teamAGames = signal(0);
  teamBGames = signal(0);
  teamAPoints = signal(0);
  teamBPoints = signal(0);

  goldenPoint = signal(false);
  bestOfThree = signal(true);
  tieBreak = signal(false);
  winner = signal<string | null>(null);
  scoringTeam = signal<'A' | 'B' | null>(null);
  gameWinningTeam = signal<'A' | 'B' | null>(null);
  settingsVisible = signal(false);

  teamAScore = computed(() => {
    if (this.tieBreak()) {
      return this.teamAPoints().toString();
    }
    return POINTS[this.teamAPoints()] ?? '';
  });

  teamBScore = computed(() => {
    if (this.tieBreak()) {
      return this.teamBPoints().toString();
    }
    return POINTS[this.teamBPoints()] ?? '';
  });

  canUndo = computed(() => this.history().length > 0);

  constructor() {
    effect(() => {
      const aSets = this.teamASets();
      const bSets = this.teamBSets();
      const maxSets = this.bestOfThree() ? 2 : 1;

      if (aSets >= maxSets) {
        this.winner.set('A');
      }
      if (bSets >= maxSets) {
        this.winner.set('B');
      }
    });
  }

  pointTo(team: 'A' | 'B') {
    if (this.winner()) return; // Do not allow points if there is a winner
    this.scoringTeam.set(team);
    setTimeout(() => this.scoringTeam.set(null), 400);
    this.saveState();

    if (this.tieBreak()) {
      this.handleTieBreakPoint(team);
      return;
    }

    const points = team === 'A' ? this.teamAPoints : this.teamBPoints;
    const otherPoints = team === 'A' ? this.teamBPoints : this.teamAPoints;
    const currentPoints = points();
    const currentOtherPoints = otherPoints();

    if (currentPoints < 3) { // Player has 0, 15, or 30
      points.update(p => p + 1);
    } else { // Player has 40 or AD
      if (currentPoints === 3) { // Player is at 40
        if (currentOtherPoints < 3) { // Opponent is at 0, 15, or 30
          this.handleGameWin(team);
        } else if (currentOtherPoints === 3) { // Opponent is also at 40 (Deuce)
          if (this.goldenPoint()) {
            this.handleGameWin(team);
          } else {
            points.set(4); // Go to Advantage
          }
        } else { // Opponent has Advantage (currentOtherPoints === 4)
          otherPoints.set(3); // Back to Deuce
        }
      } else { // Player has Advantage (currentPoints === 4)
        this.handleGameWin(team);
      }
    }
  }

  toggleGoldenPoint() {
    this.goldenPoint.update(v => !v);
  }

  toggleBestOfThree() {
    this.bestOfThree.update(v => !v);
  }

  toggleSettings() {
    this.settingsVisible.update(v => !v);
  }

  undo() {
    const lastState = this.history().pop();
    if (lastState) {
      this.teamASets.set(lastState.teamASets);
      this.teamBSets.set(lastState.teamBSets);
      this.teamAGames.set(lastState.teamAGames);
      this.teamBGames.set(lastState.teamBGames);
      this.teamAPoints.set(lastState.teamAPoints);
      this.teamBPoints.set(lastState.teamBPoints);
      this.tieBreak.set(lastState.tieBreak);
      this.winner.set(lastState.winner);

      this.history.set([...this.history()]);
    }
  }

  resetGame() {
    this.saveState();
    this.teamASets.set(0);
    this.teamBSets.set(0);
    this.teamAGames.set(0);
    this.teamBGames.set(0);
    this.teamAPoints.set(0);
    this.teamBPoints.set(0);
    this.tieBreak.set(false);
    this.winner.set(null);
    this.history.set([]);
  }

  private handleGameWin(team: 'A' | 'B') {
    this.gameWinningTeam.set(team); // Activate animation signal
    setTimeout(() => this.gameWinningTeam.set(null), 1000); // Reset after 1s

    const games = team === 'A' ? this.teamAGames : this.teamBGames;
    const otherGames = team === 'A' ? this.teamBGames : this.teamAGames;
    const sets = team === 'A' ? this.teamASets : this.teamBSets;

    games.update(g => g + 1);
    this.teamAPoints.set(0);
    this.teamBPoints.set(0);

    if (games() >= 6 && games() - otherGames() >= 2) {
      sets.update(s => s + 1);
      this.teamAGames.set(0);
      this.teamBGames.set(0);
      this.tieBreak.set(false);
    } else if (games() === 6 && otherGames() === 6) {
      this.tieBreak.set(true);
    }
  }

  private handleTieBreakPoint(team: 'A' | 'B') {
    const points = team === 'A' ? this.teamAPoints : this.teamBPoints;
    const otherPoints = team === 'A' ? this.teamBPoints : this.teamAPoints;

    points.update(p => p + 1);

    if (points() >= 7 && points() - otherPoints() >= 2) {
      const sets = team === 'A' ? this.teamASets : this.teamBSets;
      sets.update(s => s + 1);
      this.teamAGames.set(0);
      this.teamBGames.set(0);
      this.teamAPoints.set(0);
      this.teamBPoints.set(0);
      this.tieBreak.set(false);
    }
  }

  private saveState() {
    const currentState = {
      teamASets: this.teamASets(),
      teamBSets: this.teamBSets(),
      teamAGames: this.teamAGames(),
      teamBGames: this.teamBGames(),
      teamAPoints: this.teamAPoints(),
      teamBPoints: this.teamBPoints(),
      tieBreak: this.tieBreak(),
      winner: this.winner(),
    };
    this.history.update(h => [...h, currentState]);
  }
}
