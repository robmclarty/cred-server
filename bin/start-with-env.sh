#!/bin/bash
# POSIX

# Handling flags/options
# http://mywiki.wooledge.org/BashFAQ/035

# Vars:
# -f --file - config file (`./config/app.dev.env` by default)

die() {
  printf '%s\n' "$1" >&2
  exit 1
}

# Initialize variables
file="./config/app.dev.env"

while :; do
  case $1 in
    -h|-\?|--help)
      show_help # Display a usage synopsis.
      exit
      ;;
    -f|--file) # Takes an option argument; ensure it has been specified.
      if [ "$2" ]; then
        file=$2
        shift
      else
        die 'ERROR: "--file" requires a non-empty option argument.'
      fi
      ;;
    --) # End of all options.
      shift
      break
      ;;
    -?*)
      printf 'WARN: Unknown option (ignored): %s\n' "$1" >&2
      ;;
    *) # Default case: No more options, so break out of the loop.
      break
  esac

  shift
done

# Launch node server by first initializing all env vars with definitions found
# in ./config/config.env file in order to separate them from codebase.
# Ref: https://stackoverflow.com/questions/19331497/set-environment-variables-from-file
export $(cat $file | xargs) && ./server/start.js
