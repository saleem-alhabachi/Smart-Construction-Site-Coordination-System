#!/bin/bash
# Generate self-signed SSL certificate for the VPS IP
set -e

CERT_DIR="$(dirname "$0")/certs"
mkdir -p "$CERT_DIR"

IP="${1:-127.0.0.1}"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/selfsigned.key" \
    -out "$CERT_DIR/selfsigned.crt" \
    -subj "/C=DE/ST=Berlin/L=Berlin/O=SCSCS/CN=$IP" \
    -addext "subjectAltName=IP:$IP"

echo "Certificates generated in $CERT_DIR for IP: $IP"
