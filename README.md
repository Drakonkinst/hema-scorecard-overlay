# HEMA Scorecard Overlay

An OBS script providing an overlay from HEMA Scorecard.

Currently just the data retrieval process is done, the OBS script part
is pending.

## Setup

Requires Python 3 to run.

```bash
pip install -r requirements.txt
```

## Run

```bash
python3 main.py
```

An interactive prompt will appear to enter the URL of a match on HEMA Scorecard,
such as `https://hemascorecard.com/scoreMatch.php?e=553&t=2587&m=281070`.

The display will automatically update with the correct information.

* Every second a match is active, the time will update
* Every time a new exchange occurs, the match data will update

## Sample Output

```text
Enter a HEMA Scorecard match URL: https://hemascorecard.com/scoreMatch.php?e=553&t=2587&m=281070
Tournament: Longsword - Tier A Open

Fighter 1: Miro Lahtela (EHMS)
Fighter 2: Antoni Olbrychski (Akademia Szermierzy)

Match Time: 2:09
Score: 6 - 9
Doubles: 3!
```
