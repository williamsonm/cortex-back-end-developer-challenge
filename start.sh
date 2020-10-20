#!/bin/bash

del_stopped() {
	local name=$1
	local state
	state=$(docker inspect --format "{{.State.Running}}" "$name" 2>/dev/null)

	if [[ "$state" == "false" ]]; then
		docker rm "$name"
	fi
}

start() {
  del_stopped cortex
  docker run -d \
    --name cortex \
    -p 8080:8080  \
    cortex
}

start