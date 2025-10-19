from match_info import MatchInfo, FighterInfo

# Convert the result from a getStreamOverlayInfo call to a MatchInfo object
def parse_overlay_info(data) -> MatchInfo:
    tournament_name = data["tournamentName"]

    fighter_1_name = data["fighter1Name"]
    fighter_1_score = int(data["fighter1Score"])
    fighter_1_school = data["fighter1School"]
    fighter_1 = FighterInfo(
        name=fighter_1_name,
        school=fighter_1_school,
        score=fighter_1_score
    )

    fighter_2_name = data["fighter2Name"]
    fighter_2_score = int(data["fighter2Score"])
    fighter_2_school = data["fighter2School"]
    fighter_2 = FighterInfo(
        name=fighter_2_name,
        school=fighter_2_school,
        score=fighter_2_score
    )

    doubles = doubles_to_str(int(data["doubles"]))
    last_exchange_id = str(data["lastExchange"])
    match_time = time_to_str(int(data["matchTime"]))

    result = MatchInfo(
        tournament_name=tournament_name,
        fighter_1=fighter_1,
        fighter_2=fighter_2,
        doubles=doubles,
        last_exchange_id=last_exchange_id,
        match_time=match_time
    )
    return result

# Convert seconds to m:ss format
def time_to_str(time):
    minutes = time // 60
    seconds = time % 60
    return f"{minutes:0d}:{seconds:02d}"

# number_only = True if you don't like fun
def doubles_to_str(doubles: int, number_only: bool = False):
    double_str = str(doubles)
    if number_only:
        return double_str
    if doubles <= 0:
        double_str += " :)"
    elif doubles == 2:
        double_str += " :("
    else:
        for _ in range(2, min(doubles, 9)):
            double_str += "!"
    return double_str
