class TournamentService {
  // Mock tournament data
  getTournamentPhases() {
    return [
      {
        id: 1,
        name: 'Fase de Grupos',
        startDate: '2025-06-01',
        endDate: '2025-06-15',
        status: 'completed',
        progress: 100,
        groups: ['A', 'B', 'C', 'D'],
      },
      {
        id: 2,
        name: 'Octavos de Final',
        startDate: '2025-06-20',
        endDate: '2025-06-25',
        status: 'completed',
        progress: 100,
      },
      {
        id: 3,
        name: 'Cuartos de Final',
        startDate: '2025-07-01',
        endDate: '2025-07-05',
        status: 'in-progress',
        progress: 50,
      },
      {
        id: 4,
        name: 'Semifinales',
        startDate: '2025-07-08',
        endDate: '2025-07-10',
        status: 'upcoming',
        progress: 0,
      },
      {
        id: 5,
        name: 'Final',
        startDate: '2025-07-13',
        endDate: '2025-07-13',
        status: 'upcoming',
        progress: 0,
      },
    ];
  }

  getPhaseDetail(phaseId) {
    const phases = {
      1: {
        id: 1,
        name: 'Fase de Grupos',
        startDate: '2025-06-01',
        endDate: '2025-06-15',
        status: 'completed',
        description: 'Los 32 equipos se dividen en 8 grupos de 4 equipos cada uno.',
        groups: [
          {
            name: 'Grupo A',
            teams: [
              { id: 1, name: 'Argentina', wins: 3, draws: 0, losses: 0, points: 9, goalsFor: 9, goalsAgainst: 0 },
              { id: 2, name: 'Australia', wins: 1, draws: 1, losses: 1, points: 4, goalsFor: 3, goalsAgainst: 4 },
              { id: 3, name: 'Polonia', wins: 1, draws: 0, losses: 2, points: 3, goalsFor: 2, goalsAgainst: 5 },
              { id: 4, name: 'Arabia Saudita', wins: 1, draws: 0, losses: 2, points: 3, goalsFor: 3, goalsAgainst: 8 },
            ],
          },
          {
            name: 'Grupo B',
            teams: [
              { id: 5, name: 'Francia', wins: 2, draws: 1, losses: 0, points: 7, goalsFor: 8, goalsAgainst: 1 },
              { id: 6, name: 'Dinamarca', wins: 1, draws: 2, losses: 0, points: 5, goalsFor: 2, goalsAgainst: 1 },
              { id: 7, name: 'Perú', wins: 1, draws: 0, losses: 2, points: 3, goalsFor: 3, goalsAgainst: 5 },
              { id: 8, name: 'Túnez', wins: 0, draws: 1, losses: 2, points: 1, goalsFor: 0, goalsAgainst: 6 },
            ],
          },
        ],
      },
      2: {
        id: 2,
        name: 'Octavos de Final',
        startDate: '2025-06-20',
        endDate: '2025-06-25',
        status: 'completed',
        description: 'Los 16 mejores equipos compiten en eliminación directa.',
        matches: [
          { id: 1, team1: 'Argentina', team2: 'Australia', score1: 2, score2: 1, date: '2025-06-20', stage: 'Octavos' },
          { id: 2, team1: 'Francia', team2: 'Polonia', score1: 3, score2: 1, date: '2025-06-21', stage: 'Octavos' },
          { id: 3, team1: 'Brasil', team2: 'México', score1: 4, score2: 0, date: '2025-06-22', stage: 'Octavos' },
          { id: 4, team1: 'Países Bajos', team2: 'USA', score1: 3, score2: 1, date: '2025-06-23', stage: 'Octavos' },
          { id: 5, team1: 'Alemania', team2: 'Japón', score1: 4, score2: 2, date: '2025-06-24', stage: 'Octavos' },
          { id: 6, team1: 'España', team2: 'Marruecos', score1: 3, score2: 0, date: '2025-06-24', stage: 'Octavos' },
          { id: 7, team1: 'Portugal', team2: 'Suiza', score1: 6, score2: 1, date: '2025-06-25', stage: 'Octavos' },
          { id: 8, team1: 'Uruguay', team2: 'Corea del Sur', score1: 1, score2: 0, date: '2025-06-25', stage: 'Octavos' },
        ],
      },
      3: {
        id: 3,
        name: 'Cuartos de Final',
        startDate: '2025-07-01',
        endDate: '2025-07-05',
        status: 'in-progress',
        description: 'Los 8 mejores equipos avanzan a cuartos.',
        matches: [
          { id: 9, team1: 'Argentina', team2: 'Brasil', score1: null, score2: null, date: '2025-07-01', stage: 'Cuartos' },
          { id: 10, team1: 'Francia', team2: 'Países Bajos', score1: 2, score2: 2, date: '2025-07-02', stage: 'Cuartos' },
          { id: 11, team1: 'Alemania', team2: 'España', score1: null, score2: null, date: '2025-07-04', stage: 'Cuartos' },
          { id: 12, team1: 'Portugal', team2: 'Uruguay', score1: null, score2: null, date: '2025-07-05', stage: 'Cuartos' },
        ],
      },
      4: {
        id: 4,
        name: 'Semifinales',
        startDate: '2025-07-08',
        endDate: '2025-07-10',
        status: 'upcoming',
        description: 'Los 4 mejores equipos compiten por las dos plazas en la final.',
        matches: [
          { id: 13, team1: 'TBD', team2: 'TBD', score1: null, score2: null, date: '2025-07-08', stage: 'Semifinal' },
          { id: 14, team1: 'TBD', team2: 'TBD', score1: null, score2: null, date: '2025-07-10', stage: 'Semifinal' },
        ],
      },
      5: {
        id: 5,
        name: 'Final',
        startDate: '2025-07-13',
        endDate: '2025-07-13',
        status: 'upcoming',
        description: 'El partido decisivo del torneo.',
        matches: [
          { id: 15, team1: 'TBD', team2: 'TBD', score1: null, score2: null, date: '2025-07-13', stage: 'Final' },
        ],
      },
    };
    return phases[phaseId] || null;
  }

  getAllTeams() {
    return [
      { id: 1, name: 'Argentina', group: 'A', flag: '🇦🇷' },
      { id: 2, name: 'Australia', group: 'A', flag: '🇦🇺' },
      { id: 3, name: 'Polonia', group: 'A', flag: '🇵🇱' },
      { id: 4, name: 'Arabia Saudita', group: 'A', flag: '🇸🇦' },
      { id: 5, name: 'Francia', group: 'B', flag: '🇫🇷' },
      { id: 6, name: 'Dinamarca', group: 'B', flag: '🇩🇰' },
      { id: 7, name: 'Perú', group: 'B', flag: '🇵🇪' },
      { id: 8, name: 'Túnez', group: 'B', flag: '🇹🇳' },
      { id: 9, name: 'Brasil', group: 'C', flag: '🇧🇷' },
      { id: 10, name: 'Serbia', group: 'C', flag: '🇷🇸' },
      { id: 11, name: 'Suiza', group: 'C', flag: '🇨🇭' },
      { id: 12, name: 'Camerún', group: 'C', flag: '🇨🇲' },
      { id: 13, name: 'Países Bajos', group: 'D', flag: '🇳🇱' },
      { id: 14, name: 'Senegal', group: 'D', flag: '🇸🇳' },
      { id: 15, name: 'Ecuador', group: 'D', flag: '🇪🇨' },
      { id: 16, name: 'Qatar', group: 'D', flag: '🇶🇦' },
    ];
  }

  getTeamsByPhase(phaseId) {
    const phaseDetail = this.getPhaseDetail(phaseId);
    if (!phaseDetail) return [];

    if (phaseDetail.groups) {
      const teams = [];
      phaseDetail.groups.forEach((group) => {
        teams.push(...group.teams);
      });
      return teams;
    } else if (phaseDetail.matches) {
      const teamNames = new Set();
      phaseDetail.matches.forEach((match) => {
        if (match.team1 !== 'TBD') teamNames.add(match.team1);
        if (match.team2 !== 'TBD') teamNames.add(match.team2);
      });
      return Array.from(teamNames).map((name) => ({ name, flag: this.getFlagForTeam(name) }));
    }
    return [];
  }

  getFlagForTeam(teamName) {
    const flags = {
      Argentina: '🇦🇷',
      Australia: '🇦🇺',
      Polonia: '🇵🇱',
      'Arabia Saudita': '🇸🇦',
      Francia: '🇫🇷',
      Dinamarca: '🇩🇰',
      Perú: '🇵🇪',
      Túnez: '🇹🇳',
      Brasil: '🇧🇷',
      Serbia: '🇷🇸',
      Suiza: '🇨🇭',
      Camerún: '🇨🇲',
      'Países Bajos': '🇳🇱',
      Senegal: '🇸🇳',
      Ecuador: '🇪🇨',
      Qatar: '🇶🇦',
      Alemania: '🇩🇪',
      España: '🇪🇸',
      Japón: '🇯🇵',
      México: '🇲🇽',
      USA: '🇺🇸',
      Marruecos: '🇲🇦',
      Portugal: '🇵🇹',
      'Corea del Sur': '🇰🇷',
      Uruguay: '🇺🇾',
    };
    return flags[teamName] || '⚽';
  }
}

export default new TournamentService();
