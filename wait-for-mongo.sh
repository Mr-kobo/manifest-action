#!/bin/sh

host="$1"
port="$2"
shift
shift
cmd="$@"

echo "Waiting for MongoDB at $host:$port..."

until nc -z "$host" "$port"; do
  >&2 echo "MongoDB is unavailable - sleeping"
  sleep 2
done

>&2 echo "MongoDB is up - executing command"
exec $cmd
