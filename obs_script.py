import obspython as obs # This only works when run inside OBS
from match_info import MatchInfo
from parse_data import parse_overlay_info, time_to_str
from scorecard_api import check_needs_refresh, query_scorecard_overlay_info
from user_input import extract_match_info_from_url

# Docs: https://docs.obsproject.com/scripting
# TODO: Remove unnecessary print statements once done since that can lag the console

UPDATE_INTERVAL_MS = 1 * 1000 # Poll every 1 second

current_match_id: str = None

# Track the current match state
match_info: MatchInfo = None
last_exchange_id = 0 # Setting this to an invalid value will always make it refresh the first time

# Do the same logic as in the CLI to fetch updates and keep the global
# variables updated
def fetch_updates_from_scorecard():
    global current_match_id
    global match_info
    global last_exchange_id

    # Skip polling if there is no match ID
    if current_match_id is None:
        return

    # Check whether we need to re-query the data
    needs_refresh, current_match_time = check_needs_refresh(current_match_id, last_exchange_id)

    if needs_refresh:
        # Need to fully re-query the data, update the match info
        raw_data = query_scorecard_overlay_info(current_match_id, last_exchange_id)
        # Parse it into a more readable format
        result = parse_overlay_info(raw_data)
        if result is not None:
            # Update match info
            match_info = result
            last_exchange_id = match_info.last_exchange_id
            print(match_info)
    elif current_match_time >= 0 and match_info is not None:
        # Only update the current time, nothing else changed
        match_info.update_match_time(time_to_str(current_match_time))
        print(f"Match Time: {match_info.match_time}")

# Update OBS display
def update_display():
    global match_info

    if match_info is not None:
        # TODO: Update display
        pass
    else:
        # TODO: Clear display
        pass

def polling_update():
    fetch_updates_from_scorecard()
    update_display()

def update_match_id(settings):
    global current_match_id
    match_url = obs.obs_data_get_string(settings, "match_url")
    # Nothing entered yet
    if not match_url:
        current_match_id = None
        return
    event_id, tournament_id, match_id = extract_match_info_from_url(match_url)
    current_match_id = match_id
    reset_match_state()

def reset_match_state():
    global match_info
    global last_exchange_id
    match_info = None
    last_exchange_id = 0

#### OBS GLOBALS ####
# These functions interface with the OBS API and have special behavior

# Defines the text in the settings window in OBS
def script_description():
    return """<center><h2>HEMA Scorecard Overlay</h2></center>
            <p>An OBS script providing an overlay from HEMA Scorecard.</p>
            <p>Created by Wesley Ho</p>
            <h3>How to Use</h3>
            <p>Paste the URL from the HEMA Scorecard match into the box below.
            <p>URL should look something like this: <code>https://hemascorecard.com/scoreMatch.php?e=553&t=2587&m=281070</code></p>"""

# Run when the script is loaded
def script_load(settings):
    reset_match_state()
    update_match_id(settings)
    obs.timer_add(polling_update, UPDATE_INTERVAL_MS)
    polling_update()
    print("HEMA Scorecard overlay loaded!")

# Run when the script is unloaded or refreshed
def script_unload():
    obs.timer_remove(polling_update)
    reset_match_state()

# Run when script settings are changed
def script_update(settings):
    update_match_id(settings)

# Creates script settings
def script_properties():
    props = obs.obs_properties_create()
    # We only need one line, but I don't like how tiny the box is
    obs.obs_properties_add_text(props, "match_url", "HEMA Scorecard Match URL", obs.OBS_TEXT_MULTILINE)
    return props