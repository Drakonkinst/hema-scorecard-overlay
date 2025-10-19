import sys
from urllib.parse import urlparse, parse_qs

SAMPLE_SCORECARD_URL = "https://hemascorecard.com/scoreMatch.php?e=553&t=2587&m=281070"

def get_match_parameters() -> tuple[str, str, str]:
    print("Enter a HEMA Scorecard match URL: ", end='')
    url = input()
    # For debug purposes, use the sample URL if nothing is entered
    if not url:
        url = SAMPLE_SCORECARD_URL
    return extract_match_info_from_url(url)

def extract_match_info_from_url(url: str) -> tuple[str, str, str]:
    parsed_url = urlparse(url)
    parameters = parse_qs(parsed_url.query)
    missing = []

    for var_name in [ 'e', 't', 'm' ]:
        if var_name not in parameters:
            missing.append(var_name)

    if missing:
        sys.exit(f"Error: Provided URL needs to specify the following parameters: {', '.join(missing)}.\n  Example: {SAMPLE_SCORECARD_URL}")

    event_id = parameters['e'][0]
    tournament_id = parameters['t'][0]
    match_id = parameters['m'][0]
    return event_id, tournament_id, match_id