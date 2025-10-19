import requests

VIDEO_STREAM_MATCH = 1

# Not using this one right now. It queries the actual match page which returns
# an HTML page. If needed we can web scrape through this, but I found a better
# solution below
def query_scorecard_match_info(event_id: str, tournament_id: str, match_id: str):
    print("Querying Scorecard for match info...")
    query_url = f"https://hemascorecard.com/scoreMatch.php?e={event_id}&t={tournament_id}&m={match_id}"
    result = requests.get(query_url)

    if result.status_code != 200:
        print("Warning: API Call to scoreMatch failed")
        return None

# Makes a query to newExchange, which is a lightweight check that returns the
# current match time, and whether an exchange has been updated (which causes a
# full refresh instead)
def check_needs_refresh(match_id, last_exchange_id) -> tuple[bool, int]:
    query_url = f"https://hemascorecard.com/includes/functions/AJAX.php?mode=newExchange&matchID={match_id}&exchangeID={last_exchange_id}"
    result = requests.post(query_url, headers={"Content-Type":"application/x-www-form-urlencoded"})

    if result.status_code != 200:
        print("Warning: API Call to newExchange failed")
        return False, -1

    body = result.json()
    needs_refresh = bool(body['refresh'])
    match_time = int(body['matchTime']) if body['matchTime'] else -1
    return needs_refresh, match_time

# Makes a query to getStreamOverlayInfo which grabs a bunch of useful data
# Currently we are pretending to be VIDEO_STREAM_MATCH via the streamMode option
def query_scorecard_overlay_info(match_id: str, last_exchange_id: str):
    query_url = f"https://hemascorecard.com/includes/functions/AJAX.php?mode=getStreamOverlayInfo&streamMode={VIDEO_STREAM_MATCH}&lastExchange={last_exchange_id}&identifier={match_id}&synchTime=0&synchTime2=0&videoTime=0"
    result = requests.post(query_url, headers={"Content-Type":"application/x-www-form-urlencoded"})

    if result.status_code != 200:
        print("Warning: API Call to getStreamOverlayInfo failed")
        return None

    return result.json()
