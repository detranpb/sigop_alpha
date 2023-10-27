#!/bin/bash
project_root=$(pwd)
dist_path=${project_root}/dist/
remote_username=bitnami
remote_server_ip=184.72.238.232
remote_project_path=/var/www/html/
ssh_private_key_path=${project_root}/keys/LightsailDefaultKey-us-east-1.pem

echo "Dist Path = " $dist_path
ECHO "Remote dir = " $remote_project_path

scp -i "$ssh_private_key_path" -r "$dist_path" "$remote_username@$remote_server_ip:$remote_project_path"