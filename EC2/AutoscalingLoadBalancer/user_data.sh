#!/bin/bash
echo "Installing updates..."
sudo yum update -y

echo "Installing apache dependencies..."
sudo amazon-linux-extras install -y php7.2
sudo yum install -y httpd

echo "Starting Apache..."
sudo systemctl start httpd

echo "done!"