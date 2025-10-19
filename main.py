import time
from scorecard_api import check_needs_refresh, query_scorecard_overlay_info
from parse_data import parse_overlay_info, time_to_str
from user_input import get_match_parameters
from match_info import MatchInfo

INTERVAL_SECONDS = 1

def main():
    # Grab the match parameters from the user-provided URL
    # Currently we only need the match ID, but we might need others later who knows
    event_id, tournament_id, match_id = get_match_parameters()

    # Track the current match state
    match_info: MatchInfo = None
    last_exchange_id = 0 # Setting this to an invalid value will always make it refresh the first time

    # Infinite loop to track the match progress
    while True:
        needs_refresh, current_match_time = check_needs_refresh(match_id, last_exchange_id)

        if needs_refresh:
            # Need to fully re-query the data, update the match info
            raw_data = query_scorecard_overlay_info(match_id, last_exchange_id)
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

        if match_info is not None:
            # TODO: Update display
            pass

        # Loop every second (same as HEMA Scorecard's match view)
        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    main()