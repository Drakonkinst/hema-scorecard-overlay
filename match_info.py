# Just some data classes to satify my OOP brain

class MatchInfo:
    # Could add later: Match winner, last exchange info?
    def __init__(self, tournament_name, fighter_1, fighter_2, doubles, last_exchange_id, match_time):
        self.tournament_name = tournament_name
        self.fighter_1 = fighter_1
        self.fighter_2 = fighter_2
        self.doubles = doubles
        self.last_exchange_id = last_exchange_id
        self.match_time = match_time

    def update_match_time(self, match_time):
        self.match_time = match_time

    def __str__(self):
        return (
            f"Tournament: {self.tournament_name}\n\n"
            f"Fighter 1: {self.fighter_1.name} ({self.fighter_1.school})\n"
            f"Fighter 2: {self.fighter_2.name} ({self.fighter_2.school})\n\n"
            f"Match Time: {self.match_time}\n"
            f"Score: {self.fighter_1.score} - {self.fighter_2.score}\n"
            f"Doubles: {self.doubles}\n"
        )

class FighterInfo:
    def __init__(self, name, school, score):
        self.name = name
        self.school = school
        self.score = score

    def __str__(self):
        pass